/**
 * Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.
 * No part of this project may be used, copied, modified, or distributed
 * without explicit permission from the author.
 */

import React, { useState } from 'react';
import { Download, Video, Loader2, CheckCircle, XCircle, ExternalLink, Clock, User, Mic, MicOff, Languages, Volume2, FileText, Layout, Type } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('downloader');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatorText, setTranslatorText] = useState('');
  const [translatedResult, setTranslatedResult] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [isListening, setIsListening] = useState(false);

  const BACKEND_URL = window.location.port === '3000' || window.location.hostname === 'localhost' 
    ? `http://${window.location.hostname}:5001`
    : 'https://video-downloader-backend-c90x.onrender.com';

  const indianLanguages = [
    { code: 'auto', name: 'Auto Detect', flag: '🔍' },
    { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
    { code: 'bho', name: 'Bhojpuri (भोजपुरी)', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi (मराठी)', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu (اردو)', flag: '🇵🇰' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
    { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
    { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian (Русский)', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese (Português)', flag: '🇧🇷' },
    { code: 'it', name: 'Italian (Italiano)', flag: '🇮🇹' },
    { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi (मराठी)', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
  ];

  const detectPlatform = (url) => {
    if (!url) return '🌐 Platform';
    const lowUrl = url.toLowerCase();
    if (lowUrl.includes('aippt.com')) return '📊 AiPPT';
    if (lowUrl.includes('youtube.com') || lowUrl.includes('youtu.be')) return '🎥 YouTube';
    if (lowUrl.includes('instagram.com')) return '📷 Instagram';
    if (lowUrl.includes('snapchat.com')) return '👻 Snapchat';
    if (lowUrl.includes('facebook.com') || lowUrl.includes('fb.watch')) return '📘 Facebook';
    if (lowUrl.includes('twitter.com') || lowUrl.includes('x.com')) return '🐦 Twitter';
    if (lowUrl.includes('tiktok.com')) return '🎵 TikTok';
    return '🌐 Platform';
  };

  const handleTranslateText = async () => {
    if (!translatorText) {
      toast.error("Please enter some text or use the mic!");
      return;
    }
    setLoading(true);
    console.log(`Translating: "${translatorText}" from ${sourceLang} to ${targetLang}`);
    try {
      const response = await fetch(`${BACKEND_URL}/translate-only`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: translatorText, 
          source: sourceLang, 
          target: targetLang 
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }
      
      const data = await response.json();
      if (data.success) {
        setTranslatedResult(data.translated_text);
        toast.success("Translated Successfully!");
      } else {
        toast.error(data.error || "Translation failed");
      }
    } catch (err) {
      console.error("Translation error:", err);
      toast.error(`Translation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Voice recognition not supported."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang === 'auto' ? 'hi-IN' : sourceLang;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => setTranslatorText(event.results[0][0].transcript);
    recognition.start();
  };

  const handleDownloadAudio = async () => {
    if (!translatedResult) return;
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: translatedResult, 
          lang: targetLang 
        })
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `IndiaSearch_Voice_${targetLang}.mp3`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        toast.success("Voice recording downloaded!");
      } else {
        toast.error("Failed to generate audio.");
      }
    } catch (err) {
      toast.error("Audio download error.");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    window.speechSynthesis.speak(utterance);
  };

  const [creatorText, setCreatorText] = useState('');
  const [creatorLang, setCreatorLang] = useState('original');

  const handleCreatePdfFromText = async () => {
    if (!creatorText) { toast.error("Please paste some content!"); return; }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/generate-pdf-from-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: creatorText, 
          target_lang: creatorLang 
        })
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `IndiaSearch_Document.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        toast.success("Document created successfully!");
      } else {
        toast.error("Failed to generate PDF document.");
      }
    } catch (err) {
      toast.error("PDF generation error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) { setError('Please enter a valid URL'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await fetch(`${BACKEND_URL}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl })
      });
      const data = await response.json();
      if (response.ok && data.success) { setResult(data); setResultUrl(trimmedUrl); }
      else { setError(data.error || 'Failed to fetch media.'); }
    } catch (err) { setError('Connection error.'); }
    finally { setLoading(false); }
  };

  const handleConvertToPdf = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) { setError('Please enter a valid URL'); return; }
    setLoading(true); setIsTranslating(true); setError('');
    try {
      const response = await fetch(`${BACKEND_URL}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl, target_lang: targetLang })
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `IndiaSearch_Notes_${targetLang}.pdf`;
        if (contentDisposition && contentDisposition.includes('filename=')) {
          filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
        }
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to generate PDF.');
      }
    } catch (err) { setError('Server error.'); }
    finally { setLoading(false); setIsTranslating(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <Toaster position="bottom-right" />
      
      {/* Premium Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Languages className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              IndiaSearch
            </h1>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveTab('downloader')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'downloader' ? 'tab-active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Download size={18} />
              <span className="hidden md:inline">Downloader</span>
            </button>
            <button 
              onClick={() => setActiveTab('translator')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'translator' ? 'tab-active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Type size={18} />
              <span className="hidden md:inline">Translator</span>
            </button>
            <button 
              onClick={() => setActiveTab('creator')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'creator' ? 'tab-active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <FileText size={18} />
              <span className="hidden md:inline">Doc Creator</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {activeTab === 'downloader' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Existing Downloader Code ... */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
                Universal Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Archiver</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                Download HD videos, photos, and extract PDF notes from any global platform in seconds.
              </p>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Video size={200} className="text-indigo-500" />
              </div>

              <div className="relative z-10">
                <label className="block text-indigo-300 font-bold mb-4 uppercase tracking-widest text-xs">Content URL</label>
                <div className="flex flex-col gap-5">
                  <div className="relative group">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste link (YouTube, Instagram, ChatGPT...)"
                      className="w-full px-7 py-6 bg-slate-900/50 border-2 border-white/5 rounded-3xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-xl text-white placeholder:text-slate-600"
                    />
                    {url && <button onClick={() => setUrl('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"><XCircle size={24} /></button>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleDownload}
                      disabled={loading}
                      className="h-16 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                    >
                      {loading && !isTranslating ? <Loader2 className="animate-spin" /> : <Download size={22} />}
                      Fetch Media
                    </button>
                    <button
                      onClick={handleConvertToPdf}
                      disabled={loading}
                      className="h-16 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 shadow-indigo-500/20"
                    >
                      {isTranslating ? <Loader2 className="animate-spin" /> : <FileText size={22} />}
                      Export to PDF
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
                  <XCircle size={24} className="flex-shrink-0" />
                  <p className="font-bold">{error}</p>
                </div>
              )}
            </div>

            {result && (
              <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="lg:w-1/3">
                    {result.thumbnail && <img src={result.thumbnail} alt="thumb" className="w-full rounded-3xl shadow-2xl object-cover aspect-video border border-white/10" />}
                  </div>
                  <div className="lg:w-2/3 flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-3 border border-indigo-500/20">
                          {detectPlatform(resultUrl)}
                        </span>
                        <h3 className="text-2xl font-black text-white leading-tight">{result.title}</h3>
                      </div>
                      <CheckCircle className="text-emerald-500 flex-shrink-0" size={32} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                      {result.formats?.slice(0, 4).map((f, i) => (
                        <a key={i} href={f.url} target="_blank" rel="noopener" className="p-4 bg-slate-900 border border-white/5 rounded-2xl hover:border-indigo-500 transition-all group flex items-center justify-between">
                          <div>
                            <p className="font-black text-white">{f.quality}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">MP4 • {f.filesize ? (f.filesize/(1024*1024)).toFixed(1) + 'MB' : 'HD'}</p>
                          </div>
                          <ExternalLink size={20} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'translator' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
                AI Voice <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Interpreter</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                Professional voice and text translation across Indian and Global languages with high fidelity.
              </p>
            </div>

            <div className="glass-card rounded-[3rem] p-1 sm:p-2 shadow-2xl relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 relative z-10">
                {/* Input Panel */}
                <div className="bg-slate-900/50 p-8 sm:p-12 rounded-[2.5rem]">
                  <div className="flex items-center justify-between mb-8">
                    <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Source Input</label>
                    <select 
                      value={sourceLang} 
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="bg-slate-800 border-none rounded-xl text-sm font-bold px-4 py-2 outline-none text-white focus:ring-2 ring-indigo-500/20"
                    >
                      {indianLanguages.map(l => <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>)}
                    </select>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      value={translatorText} 
                      onChange={(e) => setTranslatorText(e.target.value)} 
                      placeholder="Start typing or click the mic to speak..." 
                      className="w-full h-64 bg-transparent border-none rounded-2xl p-0 outline-none transition-all resize-none text-2xl text-white font-medium placeholder:text-slate-700" 
                    />
                    <button 
                      onClick={startListening} 
                      className={`absolute bottom-0 right-0 p-6 rounded-3xl transition-all shadow-2xl ${isListening ? 'bg-red-500 animate-pulse scale-110' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/40'}`}
                    >
                      {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                    </button>
                  </div>
                </div>

                {/* Output Panel */}
                <div className="bg-emerald-500/5 p-8 sm:p-12 rounded-[2.5rem] flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <label className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Translated Output</label>
                    <select 
                      value={targetLang} 
                      onChange={(e) => setTargetLang(e.target.value)} 
                      className="bg-slate-800 border-none rounded-xl text-sm font-bold px-4 py-2 outline-none text-white focus:ring-2 ring-emerald-500/20"
                    >
                      {languages.map(l => <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>)}
                    </select>
                  </div>

                  <div className="relative flex-1">
                    <div className="w-full h-64 bg-transparent rounded-2xl p-0 text-2xl text-emerald-50 font-medium overflow-y-auto leading-relaxed">
                      {translatedResult || <span className="text-white/20 italic">Your translation will appear here...</span>}
                    </div>
                    {translatedResult && (
                      <div className="absolute bottom-0 right-0 flex gap-2 p-6">
                        <button 
                          onClick={() => speakText(translatedResult)} 
                          className="p-5 bg-indigo-600/80 hover:bg-indigo-500 rounded-3xl transition-all shadow-xl backdrop-blur-md border border-white/10"
                          title="Listen"
                        >
                          <Volume2 size={28} />
                        </button>
                        <button 
                          onClick={handleDownloadAudio} 
                          className="p-5 bg-emerald-600/80 hover:bg-emerald-500 rounded-3xl transition-all shadow-xl backdrop-blur-md border border-white/10"
                          title="Download Audio"
                        >
                          <Download size={28} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 sm:px-12 pb-12">
                <button 
                  onClick={handleTranslateText} 
                  disabled={loading || !translatorText} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 h-20 rounded-3xl font-black text-2xl hover:scale-[0.99] transition-all shadow-2xl disabled:opacity-50 shadow-indigo-500/10 active:scale-[0.97]"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={32} /> : "GENERATE TRANSLATION"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
                Smart Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Creator</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                Paste any chat, article, or notes to create professionally formatted PDFs in your chosen language.
              </p>
            </div>

            <div className="glass-card rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FileText size={200} className="text-amber-500" />
              </div>

              <div className="relative z-10 space-y-8">
                <div>
                  <label className="block text-amber-300 font-black mb-4 text-xs uppercase tracking-widest">Document Content</label>
                  <textarea
                    value={creatorText}
                    onChange={(e) => setCreatorText(e.target.value)}
                    placeholder="Paste your chat history or notes here..."
                    className="w-full h-80 bg-slate-900/50 border-2 border-white/5 rounded-[2rem] p-8 outline-none focus:border-amber-500 transition-all text-lg text-slate-200 placeholder:text-slate-700 font-medium"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                    <label className="block text-slate-400 font-bold mb-3 text-xs uppercase tracking-tighter">Target PDF Language</label>
                    <select 
                      value={creatorLang} 
                      onChange={(e) => setCreatorLang(e.target.value)}
                      className="w-full bg-slate-900 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-amber-500 appearance-none"
                    >
                      <option value="original">Keep Original Language</option>
                      {languages.map(l => <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>)}
                    </select>
                  </div>

                  <button
                    onClick={handleCreatePdfFromText}
                    disabled={loading || !creatorText}
                    className="flex-[1.5] w-full h-20 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-[1.5rem] font-black text-2xl hover:scale-[0.98] transition-all shadow-2xl disabled:opacity-50 active:scale-[0.95] flex items-center justify-center gap-4"
                  >
                    {loading ? <Loader2 className="animate-spin" size={32} /> : <CheckCircle size={32} />}
                    CREATE PDF DOCUMENT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-2">
          © 2026 IndiaSearch • Professional Content Intelligence
        </p>
        <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.4em]">
          v2.0 Professional Edition
        </p>
      </footer>
    </div>
  );
}
