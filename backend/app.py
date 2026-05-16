# Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.
# No part of this project may be used, copied, modified, or distributed
# without explicit permission from the author.

from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import logging
import requests
import re
from bs4 import BeautifulSoup
from fpdf import FPDF
import io
from deep_translator import GoogleTranslator
from gtts import gTTS
import tempfile
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/download', methods=['POST', 'OPTIONS'])
def download_video():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Invalid JSON data'}), 400
            
        url = data.get('url')
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400
            
        # Check if it's an LLM share link (which yt-dlp doesn't support)
        if 'chatgpt.com/share' in url or 'claude.ai/share' in url:
            return jsonify({
                'success': False, 
                'error': 'This is an LLM Chat link. Please use the "Export as PDF" button below to convert this into notes.'
            }), 400

        # Clean URL (remove fragments and non-ascii)
        url = url.split('#')[0].strip()
        
        logger.info(f"Processing URL: {url}")

        # Check if direct image URL
        image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp')
        if any(url.lower().endswith(ext) or ext + '?' in url.lower() for ext in image_extensions):
            logger.info(f"Direct image detected: {url}")
            return jsonify({
                'success': True,
                'title': url.split('/')[-1].split('?')[0] or 'Downloaded Image',
                'thumbnail': url,
                'duration': 0,
                'uploader': 'Direct Link',
                'description': 'Direct image link detected. Click download to save.',
                'download_url': url,
                'formats': [{'quality': 'Original', 'url': url, 'filesize': 0}]
            })

        # Check if AiPPT URL
        if 'aippt.com' in url:
            try:
                # Extract work ID from URL
                work_id = url.split('/')[-1].split('#')[0].split('?')[0]
                logger.info(f"Processing AiPPT Work ID: {work_id}")
                
                # Try to get data from AiPPT API
                # Note: We use a browser-like User-Agent to avoid blocks
                api_url = f"https://www.aippt.com/api/v1/work/share/{work_id}"
                headers = {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": url
                }
                
                resp = requests.get(api_url, headers=headers, timeout=15)
                if resp.status_code == 200:
                    api_data = resp.json()
                    data_content = api_data.get('data', {})
                    work_info = data_content.get('work', {})
                    
                    # Extract slides
                    slides_data = data_content.get('slides', [])
                    formats = []
                    
                    for i, slide in enumerate(slides_data):
                        img_url = slide.get('imgUrl') or slide.get('previewUrl')
                        if img_url:
                            formats.append({
                                'quality': f'Slide {i+1}',
                                'url': img_url,
                                'filesize': 0
                            })
                    
                    result = {
                        'success': True,
                        'title': work_info.get('title', 'AiPPT Presentation'),
                        'thumbnail': work_info.get('coverUrl', formats[0]['url'] if formats else ''),
                        'duration': len(formats),
                        'uploader': 'AiPPT',
                        'description': f"Found {len(formats)} slides. You can download each slide as an image.",
                        'download_url': formats[0]['url'] if formats else '',
                        'formats': formats
                    }
                    return jsonify(result)
                else:
                    # Fallback for AiPPT: Try to scrape if API fails
                    logger.warning(f"AiPPT API returned {resp.status_code}. Attempting fallback...")
            except Exception as e:
                logger.error(f"AiPPT processing error: {str(e)}")

        # Check if YouTube URL
        is_youtube = 'youtube.com' in url or 'youtu.be' in url
        
        if is_youtube:
            try:
                ydl_opts = {
                    'format': 'best',
                    'quiet': True,
                    'no_warnings': True,
                    'nocheckcertificate': True,
                }
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=False)
                    
                    formats = []
                    if 'formats' in info:
                        for f in info['formats']:
                            # Include formats that have video AND (audio or direct url)
                            # YouTube itag 18, 22 are combined. Others are separate.
                            # For simplicity, we prioritize combined or best available.
                            if f.get('vcodec') != 'none' and f.get('url'):
                                quality_val = f.get('height') or 0
                                quality_note = f.get('format_note') or f.get('resolution') or f"{quality_val}p"
                                
                                # Skip if it's just audio or very low quality without note
                                if quality_val == 0 and not f.get('format_note'):
                                    continue
                                    
                                formats.append({
                                    'quality': str(quality_note),
                                    'quality_val': int(quality_val),
                                    'url': f.get('url'),
                                    'filesize': f.get('filesize', 0),
                                    'acodec': f.get('acodec')
                                })
                    
                    # Sort formats by quality_val (height)
                    formats.sort(key=lambda x: x['quality_val'], reverse=True)

                    # Remove internal key and limit
                    for f in formats:
                        f.pop('quality_val', None)

                    result = {
                        'success': True,
                        'title': info.get('title', 'YouTube Video'),
                        'thumbnail': info.get('thumbnail', ''),
                        'duration': info.get('duration', 0),
                        'uploader': info.get('uploader', 'YouTube'),
                        'description': info.get('description', '')[:200],
                        'download_url': info.get('url', ''),
                        'formats': formats[:10]
                    }
                    return jsonify(result)
            except Exception as yt_err:
                logger.error(f"YouTube yt-dlp error: {str(yt_err)}")

        # General downloader using yt-dlp
        ydl_opts = {
            'format': 'best[ext=mp4]/best',
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
            'geo_bypass': True,
            'socket_timeout': 30,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = []
            if 'formats' in info:
                seen_qualities = set()
                for f in info['formats']:
                    if f.get('vcodec') != 'none' and f.get('url'):
                        quality_val = f.get('height') or 0
                        quality_note = f.get('format_note') or f.get('resolution') or f"{quality_val}p"
                        
                        if quality_note not in seen_qualities:
                            formats.append({
                                'quality': str(quality_note),
                                'quality_val': int(quality_val),
                                'url': f.get('url'),
                                'filesize': f.get('filesize', 0),
                                'acodec': f.get('acodec')
                            })
                            seen_qualities.add(quality_note)
            
            # Sort formats by height
            formats.sort(key=lambda x: x['quality_val'], reverse=True)
            for f in formats:
                f.pop('quality_val', None)

            result = {
                'success': True,
                'title': info.get('title', 'Unknown'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': info.get('duration', 0),
                'uploader': info.get('uploader', 'Unknown'),
                'description': info.get('description', '')[:200] if info.get('description') else '',
                'download_url': info.get('url', ''),
                'formats': formats[:10]
            }
            
            logger.info(f"Successfully processed: {result['title']}")
            return jsonify(result)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        
        # Fallback: Try to extract og:image for social media links
        try:
            if 'instagram.com' in url or 'facebook.com' in url or 'twitter.com' in url:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
                page_resp = requests.get(url, headers=headers, timeout=10)
                if page_resp.status_code == 200:
                    import re
                    # Look for og:image
                    img_match = re.search(r'<meta property="og:image" content="(.*?)"', page_resp.text)
                    title_match = re.search(r'<meta property="og:title" content="(.*?)"', page_resp.text)
                    
                    if img_match:
                        img_url = img_match.group(1).replace('&amp;', '&')
                        title = title_match.group(1) if title_match else 'Social Media Post'
                        
                        return jsonify({
                            'success': True,
                            'title': title,
                            'thumbnail': img_url,
                            'duration': 0,
                            'uploader': 'Social Media',
                            'description': 'Image extracted from post. Click download to save.',
                            'download_url': img_url,
                            'formats': [{'quality': 'Photo', 'url': img_url, 'filesize': 0}]
                        })
        except Exception as fallback_err:
            logger.error(f"Fallback error: {str(fallback_err)}")
            
        return jsonify({'success': False, 'error': 'Unable to process this URL. Please try again or use a different link.'}), 500

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text')
        lang = data.get('lang', 'hi')
        
        if not text:
            return jsonify({'success': False, 'error': 'No text provided'}), 400
            
        # Clean lang code (e.g. 'zh-CN' to 'zh')
        clean_lang = lang.split('-')[0]
        if clean_lang == 'iw': clean_lang = 'he' # gTTS uses 'he'
        
        logger.info(f"Generating TTS for language: {clean_lang}")
        
        tts = gTTS(text=text, lang=clean_lang)
        
        # Create a temp file
        temp_dir = tempfile.gettempdir()
        temp_filename = f"speech_{int(time.time())}.mp3"
        temp_path = os.path.join(temp_dir, temp_filename)
        
        tts.save(temp_path)
        
        @after_this_request
        def remove_file(response):
            try:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
            except Exception as e:
                logger.error(f"Error removing temp file: {str(e)}")
            return response
            
        return send_file(temp_path, as_attachment=True, download_name="translation_voice.mp3", mimetype="audio/mpeg")
        
    except Exception as e:
        logger.error(f"TTS Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/translate-only', methods=['POST'])
def translate_only():
    try:
        data = request.get_json()
        text = data.get('text')
        source = data.get('source', 'auto')
        target = data.get('target', 'hi')
        
        if not text:
            return jsonify({'success': False, 'error': 'Text is required'}), 400
            
        # Clean language codes
        if source == 'auto-detect': source = 'auto'
        if target == 'zh': target = 'zh-CN'
        
        logger.info(f"Translating text: {text[:50]}... from {source} to {target}")
        
        try:
            translator = GoogleTranslator(source=source, target=target)
            translated = translator.translate(text)
            return jsonify({'success': True, 'translated_text': translated})
        except Exception as lang_err:
            logger.error(f"Deep Translator Error: {str(lang_err)}")
            # Fallback to English if target fails
            if target != 'en':
                translator = GoogleTranslator(source='auto', target='en')
                translated = translator.translate(text)
                return jsonify({'success': True, 'translated_text': translated, 'fallback': True})
            raise lang_err
            
    except Exception as e:
        logger.error(f"Translation Only Error: {str(e)}")
        return jsonify({'success': False, 'error': f"Language Not Supported: {str(e)}"}), 500

@app.route('/generate-pdf-from-text', methods=['POST'])
def generate_pdf_from_text():
    try:
        data = request.get_json()
        text = data.get('text')
        target_lang = data.get('target_lang', 'en')
        
        if not text:
            return jsonify({'success': False, 'error': 'No content provided'}), 400
            
        logger.info(f"Generating PDF from text (Target Language: {target_lang})")
        
        # Translate the content if needed
        translated_text = text
        if target_lang != 'original':
             try:
                 translator = GoogleTranslator(source='auto', target=target_lang)
                 lines = text.split('\n')
                 translated_lines = []
                 for line in lines:
                     if line.strip():
                         translated_lines.append(translator.translate(line))
                     else:
                         translated_lines.append("")
                 translated_text = "\n".join(translated_lines)
             except Exception as te:
                 logger.error(f"Translation failed: {str(te)}")
                 translated_text = text

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Clean text for FPDF (handles common special chars)
        clean_text = translated_text.encode('latin-1', 'replace').decode('latin-1')
        pdf.multi_cell(0, 10, txt=clean_text)
        
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"text_doc_{int(time.time())}.pdf")
        pdf.output(temp_path)
        
        @after_this_request
        def remove_file(response):
            try:
                if os.path.exists(temp_path): os.remove(temp_path)
            except: pass
            return response
            
        return send_file(temp_path, as_attachment=True, download_name=f"IndiaSearch_Document.pdf", mimetype="application/pdf")
        
    except Exception as e:
        logger.error(f"Text to PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

from deep_translator import GoogleTranslator

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Invalid JSON data'}), 400
            
        url = data.get('url')
        target_lang = data.get('target_lang', 'en') # Default to English
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400

        logger.info(f"Generating PDF for URL: {url} (Language: {target_lang})")
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
        }
        response = requests.get(url, headers=headers, timeout=25)
        if response.status_code != 200:
            return jsonify({'success': False, 'error': f'Failed to fetch page: {response.status_code}'}), 400

        full_html = response.text
        soup = BeautifulSoup(full_html, 'html.parser')
        title = soup.title.string if soup.title else "IndiaSearch LLM Export"
        
        import json
        import re
        
        formatted_content = []
        
        # SURGICAL EXTRACTION
        full_html = response.text
        
        # Search for the keyword "mapping" case-insensitively
        search_pos = 0
        while True:
            # Look for mapping with any quotes or no quotes
            match = re.search(r'["\']?mapping["\']?', full_html[search_pos:], re.IGNORECASE)
            if not match: break
            
            pos = search_pos + match.start()
            logger.info(f"Potential mapping found at position {pos}")
            
            # Find the next opening brace '{'
            obj_start = full_html.find('{', pos)
            if obj_start == -1: 
                search_pos = pos + 7
                continue
            
            # Brace balancing
            end_pos, brace_count = -1, 0
            for i in range(obj_start, len(full_html)):
                if full_html[i] == '{': brace_count += 1
                elif full_html[i] == '}': brace_count -= 1
                if brace_count == 0:
                    end_pos = i
                    break
            
            if end_pos == -1:
                search_pos = obj_start + 1
                continue
                
            try:
                j_str = full_html[obj_start:end_pos+1]
                # Clean any common JS garbage
                j_str = j_str.strip()
                if j_str.endswith(';'): j_str = j_str[:-1]
                
                data = json.loads(j_str)
                
                # Check if it's the correct mapping
                if isinstance(data, dict):
                    # Sometimes the mapping is inside the object we found, or the object IS the mapping
                    mapping = data.get('mapping') if 'mapping' in data else data
                    
                    if isinstance(mapping, dict) and len(mapping) > 0:
                        msg_list = []
                        for node_id, node in mapping.items():
                            if not isinstance(node, dict): continue
                            msg = node.get('message')
                            if msg and msg.get('author') and msg.get('content'):
                                role = msg['author'].get('role')
                                parts = msg['content'].get('parts', [])
                                text = " ".join([str(p) for p in parts if p])
                                time = msg.get('create_time', 0) or 0
                                if text and role in ['user', 'assistant']:
                                    msg_list.append({'role': role, 'text': text, 'time': time})
                        
                        if msg_list:
                            logger.info(f"Successfully extracted {len(msg_list)} messages from position {pos}.")
                            msg_list.sort(key=lambda x: x['time'])
                            for m in msg_list:
                                prefix = "USER: " if m['role'] == 'user' else "ASSISTANT: "
                                formatted_content.append({'role': m['role'], 'text': m['text'].strip()})
                            break
            except Exception as e:
                logger.debug(f"JSON attempt at {pos} failed: {str(e)}")
                pass
            search_pos = obj_start + 1
        
        # 2. SEMANTIC FALLBACK (Same as before)

        if not formatted_content:
             return jsonify({'success': False, 'error': 'Could not extract complete notes. Please ensure the link is a public "Share" link.'}), 400

        # TRANSLATION STEP (World Language Converter)
        if target_lang != 'en':
            logger.info(f"Translating content to {target_lang}...")
            translator = GoogleTranslator(source='auto', target=target_lang)
            for item in formatted_content:
                try:
                    # Translate in chunks if text is too long for the API
                    original_text = item['text']
                    if len(original_text) > 4000:
                        chunks = [original_text[i:i+4000] for i in range(0, len(original_text), 4000)]
                        item['text'] = " ".join([translator.translate(c) for c in chunks])
                    else:
                        item['text'] = translator.translate(original_text)
                except Exception as e:
                    logger.error(f"Translation error: {str(e)}")

        # PDF Generation
        class PDF(FPDF):
            def header(self):
                self.set_font('helvetica', 'B', 8); self.set_text_color(128, 128, 128)
                lang_label = f"Language: {target_lang.upper()}"
                self.cell(0, 10, f'IndiaSearch PRO - Global Notes Export ({lang_label})', 0, 1, 'R'); self.ln(5)
            def footer(self):
                self.set_y(-15); self.set_font('helvetica', 'I', 8)
                self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

        pdf = PDF()
        pdf.add_page(); pdf.set_auto_page_break(auto=True, margin=20)
        
        # Translate title too
        try:
            display_title = title
            if target_lang != 'en':
                display_title = GoogleTranslator(source='auto', target=target_lang).translate(title)
        except: display_title = title

        pdf.set_font("helvetica", "B", 18); pdf.set_text_color(30, 41, 59)
        pdf.multi_cell(180, 10, display_title.encode('latin-1', 'replace').decode('latin-1'))
        pdf.ln(5)
        
        for item in formatted_content:
            pdf.ln(5)
            if item['role'] == 'user':
                pdf.set_font("helvetica", "B", 11); pdf.set_text_color(79, 70, 229)
                label = "USER QUESTION:" if target_lang == 'en' else GoogleTranslator(source='auto', target=target_lang).translate("USER QUESTION:")
                pdf.cell(0, 8, label, 0, 1)
            else:
                pdf.set_font("helvetica", "B", 11); pdf.set_text_color(5, 150, 105)
                label = "AI RESPONSE:" if target_lang == 'en' else GoogleTranslator(source='auto', target=target_lang).translate("AI RESPONSE:")
                pdf.cell(0, 8, label, 0, 1)
            
            pdf.set_font("helvetica", "", 10); pdf.set_text_color(50, 50, 50)
            safe_text = item['text'].encode('latin-1', 'replace').decode('latin-1')
            pdf.multi_cell(185, 6, safe_text)
            pdf.ln(3); pdf.set_draw_color(230, 230, 230)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 185, pdf.get_y())

        pdf_bytes = pdf.output()
        pdf_output = io.BytesIO(pdf_bytes)
        pdf_output.seek(0)
        logger.error(f"PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': f'Generation failed: {str(e)}'}), 500

    except Exception as e:
        logger.error(f"PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': f'Generation failed: {str(e)}'}), 500

    except Exception as e:
        logger.error(f"PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': f'PDF Generation failed: {str(e)}'}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Video Downloader API is running!', 'status': 'ok'})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
