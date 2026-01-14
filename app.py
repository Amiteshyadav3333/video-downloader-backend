from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import os
import logging
import requests

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
        url = data.get('url')
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400

        logger.info(f"Processing URL: {url}")

        # Check if YouTube URL
        is_youtube = 'youtube.com' in url or 'youtu.be' in url
        
        if is_youtube:
            # Use alternative method for YouTube
            try:
                video_id = None
                if 'youtu.be/' in url:
                    video_id = url.split('youtu.be/')[1].split('?')[0]
                elif 'watch?v=' in url:
                    video_id = url.split('watch?v=')[1].split('&')[0]
                
                if video_id:
                    # Return embed info for YouTube
                    result = {
                        'success': True,
                        'title': f'YouTube Video - {video_id}',
                        'thumbnail': f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
                        'duration': 0,
                        'uploader': 'YouTube',
                        'description': 'Click download to open video in new tab',
                        'download_url': f'https://www.youtube.com/watch?v={video_id}',
                        'formats': [
                            {'quality': 'HD', 'url': f'https://www.youtube.com/watch?v={video_id}', 'filesize': 0},
                            {'quality': 'SD', 'url': f'https://www.youtube.com/watch?v={video_id}', 'filesize': 0}
                        ]
                    }
                    return jsonify(result)
            except:
                pass

        # For non-YouTube or if YouTube parsing fails, use yt-dlp
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
                        quality = f.get('format_note', f.get('height', 'Unknown'))
                        if quality not in seen_qualities:
                            formats.append({
                                'quality': str(quality),
                                'url': f.get('url'),
                                'filesize': f.get('filesize', 0)
                            })
                            seen_qualities.add(quality)
            
            result = {
                'success': True,
                'title': info.get('title', 'Unknown'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': info.get('duration', 0),
                'uploader': info.get('uploader', 'Unknown'),
                'description': info.get('description', '')[:200] if info.get('description') else '',
                'download_url': info.get('url', ''),
                'formats': formats[:5]
            }
            
            logger.info(f"Successfully processed: {result['title']}")
            return jsonify(result)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Unable to process this video. Try Instagram, TikTok, or Facebook videos instead.'}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Video Downloader API is running!', 'status': 'ok'})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
