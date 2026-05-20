/**
 * Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.
 * No part of this project may be used, copied, modified, or distributed
 * without explicit permission from the author.
 */

import React, { useState, useEffect } from 'react';
import { Download, Video, Loader2, CheckCircle, XCircle, ExternalLink, Clock, User, Mic, MicOff, Languages, Volume2, VolumeX, FileText, Layout, Type, Camera, Image as ImageIcon, Calculator } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }, [key, value]);
  return [value, setValue];
};

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'downloader');
  const [url, setUrl] = useLocalStorage('url', '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [targetLang, setTargetLang] = useLocalStorage('targetLang', 'en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatorText, setTranslatorText] = useLocalStorage('translatorText', '');
  const [translatedResult, setTranslatedResult] = useLocalStorage('translatedResult', '');
  const [sourceLang, setSourceLang] = useLocalStorage('sourceLang', 'auto');
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useLocalStorage('autoSpeak', true);

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

  const handleTranslateText = async (showToast = true) => {
    if (!translatorText.trim()) {
      if (showToast) toast.error("Please enter some text or use the mic!");
      return;
    }
    setLoading(true);
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
        if (showToast) toast.success("Translated Successfully!");
      } else {
        if (showToast) toast.error(data.error || "Translation failed");
      }
    } catch (err) {
      console.error("Translation error:", err);
      if (showToast) toast.error(`Translation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (translatorText.trim()) {
        handleTranslateText(false);
      } else {
        setTranslatedResult('');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [translatorText, sourceLang, targetLang]);

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

  const playHighQualityVoice = async (text, lang) => {
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.src = "";
    }
    window.speechSynthesis.cancel(); // Clear any native speech
    
    try {
      const response = await fetch(`${BACKEND_URL}/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang })
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.currentAudio = new Audio(url);
        window.currentAudio.play().catch(e => console.log("Autoplay blocked by browser until interacted"));
      }
    } catch (err) {
      console.error("Audio error", err);
    }
  };

  const toggleAutoSpeak = () => {
    if (autoSpeak) {
      if (window.currentAudio) window.currentAudio.pause();
      window.speechSynthesis.cancel();
      setAutoSpeak(false);
      toast("Auto-voice Disabled", { icon: '🔇' });
    } else {
      setAutoSpeak(true);
      toast("Auto-voice Enabled", { icon: '🔊' });
      if (translatedResult) {
        playHighQualityVoice(translatedResult, targetLang);
      }
    }
  };

  useEffect(() => {
    if (autoSpeak && translatedResult) {
      playHighQualityVoice(translatedResult, targetLang);
    }
  }, [translatedResult, autoSpeak, targetLang]);

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const [visionImage, setVisionImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [visionExtractedText, setVisionExtractedText] = useState('');
  const [visionTranslatedText, setVisionTranslatedText] = useState('');
  
  const [mathImage, setMathImage] = useState(null);
  const [isMathCameraActive, setIsMathCameraActive] = useState(false);
  const [mathExtractedText, setMathExtractedText] = useState('');
  const [mathSolution, setMathSolution] = useState('');
  const [mathInputText, setMathInputText] = useState('');
  const mathVideoRef = React.useRef(null);
  const mathCanvasRef = React.useRef(null);
  const mathFileInputRef = React.useRef(null);

  const startMathCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (mathVideoRef.current) {
        mathVideoRef.current.srcObject = stream;
        setIsMathCameraActive(true);
      }
    } catch (err) {
      toast.error("Camera access denied.");
    }
  };

  const stopMathCamera = () => {
    if (mathVideoRef.current && mathVideoRef.current.srcObject) {
      mathVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsMathCameraActive(false);
    }
  };

  const captureMathImage = () => {
    if (mathVideoRef.current && mathCanvasRef.current) {
      const context = mathCanvasRef.current.getContext('2d');
      mathCanvasRef.current.width = mathVideoRef.current.videoWidth;
      mathCanvasRef.current.height = mathVideoRef.current.videoHeight;
      context.drawImage(mathVideoRef.current, 0, 0);
      const dataUrl = mathCanvasRef.current.toDataURL('image/jpeg', 0.8);
      setMathImage(dataUrl);
      stopMathCamera();
      solveMathImage(dataUrl);
    }
  };

  const handleMathGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMathImage(ev.target.result);
        solveMathImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const solveMathText = async () => {
    if (!mathInputText) return;
    setLoading(true);
    setMathExtractedText('');
    setMathSolution('');
    setMathImage(null);
    try {
      const response = await fetch(`${BACKEND_URL}/solve-math`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: mathInputText })
      });
      const data = await response.json();
      if (data.success) {
        setMathExtractedText(data.extracted_text);
        setMathSolution(data.solution);
        toast.success("Math solved!");
      } else {
        toast.error(data.error || "Failed to solve math.");
      }
    } catch (err) {
      toast.error("Error solving math.");
    } finally {
      setLoading(false);
    }
  };

  const solveMathImage = async (base64Image) => {
    setLoading(true);
    setMathExtractedText('');
    setMathSolution('');
    try {
      const response = await fetch(`${BACKEND_URL}/solve-math`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await response.json();
      if (data.success) {
        setMathExtractedText(data.extracted_text);
        setMathSolution(data.solution);
        toast.success("Math solved!");
      } else {
        toast.error(data.error || "Failed to solve math.");
      }
    } catch (err) {
      toast.error("Error processing image.");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      toast.error("Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
      setVisionImage(dataUrl);
      stopCamera();
      translateVisionImage(dataUrl);
    }
  };

  const handleGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setVisionImage(ev.target.result);
        translateVisionImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const translateVisionImage = async (base64Image) => {
    setLoading(true);
    setVisionExtractedText('');
    setVisionTranslatedText('');
    try {
      const response = await fetch(`${BACKEND_URL}/translate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64Image,
          source: sourceLang,
          target: targetLang
        })
      });
      const data = await response.json();
      if (data.success) {
        setVisionExtractedText(data.extracted_text);
        setVisionTranslatedText(data.translated_text);
        toast.success("Image translated!");
        if (autoSpeak) {
           playHighQualityVoice(data.translated_text, targetLang);
        }
      } else {
        toast.error(data.error || "Failed to extract text from image.");
      }
    } catch (err) {
      toast.error("Error processing image.");
    } finally {
      setLoading(false);
    }
  };

  const [creatorText, setCreatorText] = useLocalStorage('creatorText', '');
  const [creatorLang, setCreatorLang] = useLocalStorage('creatorLang', 'original');

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
            <button 
              onClick={() => setActiveTab('vision')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'vision' ? 'tab-active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Camera size={18} />
              <span className="hidden md:inline">Vision</span>
            </button>
            <button 
              onClick={() => setActiveTab('math')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'math' ? 'tab-active text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Calculator size={18} />
              <span className="hidden md:inline">Math</span>
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
                          onClick={toggleAutoSpeak} 
                          className={`p-5 rounded-3xl transition-all shadow-xl backdrop-blur-md border border-white/10 ${autoSpeak ? 'bg-indigo-600/80 hover:bg-indigo-500 shadow-indigo-500/40' : 'bg-slate-600/80 hover:bg-slate-500'}`}
                          title={autoSpeak ? "Disable Auto-voice" : "Enable Auto-voice"}
                        >
                          {autoSpeak ? <Volume2 size={28} className="text-white" /> : <VolumeX size={28} className="text-slate-300" />}
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
        ) : activeTab === 'vision' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
                Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Intelligence</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                Live translate anything using your camera or upload an image from your gallery.
              </p>
            </div>

            <div className="glass-card rounded-[3rem] p-8 sm:p-12 shadow-2xl relative">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-1 bg-slate-900/50 p-6 rounded-[2rem]">
                  <label className="text-xs font-black text-pink-400 uppercase tracking-[0.2em] mb-4 block">Source Image Language</label>
                  <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-full bg-slate-800 border-none rounded-xl text-sm font-bold px-4 py-3 outline-none text-white focus:ring-2 ring-pink-500/20">
                    {indianLanguages.map(l => <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>)}
                  </select>
                </div>
                <div className="flex-1 bg-slate-900/50 p-6 rounded-[2rem]">
                  <label className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-4 block">Target Translation</label>
                  <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full bg-slate-800 border-none rounded-xl text-sm font-bold px-4 py-3 outline-none text-white focus:ring-2 ring-purple-500/20">
                    {languages.map(l => <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative flex items-center justify-center border border-white/10">
                    {!visionImage && !isCameraActive && (
                       <div className="text-center text-slate-500">
                         <Camera size={48} className="mx-auto mb-4 opacity-50" />
                         <p className="font-bold">Camera is off</p>
                       </div>
                    )}
                    <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`} />
                    {visionImage && !isCameraActive && <img src={visionImage} alt="Captured" className="w-full h-full object-cover" />}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {!isCameraActive ? (
                      <button onClick={startCamera} className="bg-pink-600 hover:bg-pink-500 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                        <Camera size={20} /> Open Cam
                      </button>
                    ) : (
                      <button onClick={captureImage} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                        <CheckCircle size={20} /> Capture
                      </button>
                    )}
                    
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleGalleryUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-500 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                      <ImageIcon size={20} /> Gallery
                    </button>
                    
                    {isCameraActive && (
                      <button onClick={stopCamera} className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                        <XCircle size={20} /> Close
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-500/5 p-8 rounded-[2.5rem] flex flex-col relative border border-white/5">
                  <label className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Extracted & Translated Result</label>
                  
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-emerald-400 gap-4">
                      <Loader2 className="animate-spin" size={48} />
                      <p className="font-bold animate-pulse">Analyzing & Translating Image...</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-6">
                      {visionExtractedText && (
                        <div>
                          <p className="text-[10px] uppercase font-black text-slate-500 mb-2">Original Text</p>
                          <p className="text-slate-300 font-medium">{visionExtractedText}</p>
                        </div>
                      )}
                      {visionTranslatedText && (
                        <div>
                          <p className="text-[10px] uppercase font-black text-emerald-500 mb-2">Translated Text</p>
                          <p className="text-2xl text-emerald-50 font-medium leading-relaxed">{visionTranslatedText}</p>
                        </div>
                      )}
                      {!visionExtractedText && !visionTranslatedText && (
                         <div className="text-slate-600 italic h-full flex items-center justify-center text-center">Capture or upload an image to see results here.</div>
                      )}
                    </div>
                  )}

                  {visionTranslatedText && !loading && (
                    <div className="absolute bottom-6 right-6">
                      <button 
                        onClick={() => playHighQualityVoice(visionTranslatedText, targetLang)} 
                        className="p-5 bg-emerald-600/80 hover:bg-emerald-500 rounded-3xl transition-all shadow-xl backdrop-blur-md border border-white/10 text-white"
                        title="Listen"
                      >
                        <Volume2 size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'math' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 text-center">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
                Math <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Solver</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                Snap a photo or upload an image of a math problem to instantly solve it.
              </p>
            </div>

            <div className="glass-card rounded-[3rem] p-8 sm:p-12 shadow-2xl relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative flex items-center justify-center border border-white/10">
                    {!mathImage && !isMathCameraActive && (
                       <div className="text-center text-slate-500">
                         <Calculator size={48} className="mx-auto mb-4 opacity-50" />
                         <p className="font-bold">Camera is off</p>
                       </div>
                    )}
                    <video ref={mathVideoRef} autoPlay playsInline className={`w-full h-full object-cover ${isMathCameraActive ? 'block' : 'hidden'}`} />
                    {mathImage && !isMathCameraActive && <img src={mathImage} alt="Captured Math" className="w-full h-full object-cover" />}
                    <canvas ref={mathCanvasRef} className="hidden" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {!isMathCameraActive ? (
                      <button onClick={startMathCamera} className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                        <Camera size={20} /> Open Cam
                      </button>
                    ) : (
                      <button onClick={captureMathImage} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                        <CheckCircle size={20} /> Capture
                      </button>
                    )}
                    
                    <input type="file" accept="image/*" ref={mathFileInputRef} className="hidden" onChange={handleMathGalleryUpload} />
                    <button onClick={() => mathFileInputRef.current?.click()} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                      <ImageIcon size={20} /> Gallery
                    </button>
                    
                    {isMathCameraActive && (
                      <button onClick={stopMathCamera} className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl p-4 font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                        <XCircle size={20} /> Close
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4 flex gap-4">
                    <input 
                      type="text" 
                      value={mathInputText}
                      onChange={(e) => setMathInputText(e.target.value)}
                      placeholder="Or type math (e.g. 5+3*2 or 2*x=10)"
                      className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-all font-mono text-lg text-white placeholder:text-slate-500"
                      onKeyDown={(e) => { if(e.key === 'Enter') solveMathText(); }}
                    />
                    <button 
                      onClick={solveMathText}
                      disabled={loading || !mathInputText}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl px-8 transition-all shadow-lg"
                    >
                      Solve
                    </button>
                  </div>
                </div>

                <div className="bg-cyan-500/5 p-8 rounded-[2.5rem] flex flex-col relative border border-white/5">
                  <label className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-4">Equation & Solution</label>
                  
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-cyan-400 gap-4">
                      <Loader2 className="animate-spin" size={48} />
                      <p className="font-bold animate-pulse">Solving Math Problem...</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-6">
                      {mathExtractedText && (
                        <div>
                          <p className="text-[10px] uppercase font-black text-slate-500 mb-2">Detected Equation</p>
                          <p className="text-slate-300 font-medium font-mono bg-black/30 p-4 rounded-xl">{mathExtractedText}</p>
                        </div>
                      )}
                      {mathSolution && (
                        <div>
                          <p className="text-[10px] uppercase font-black text-cyan-500 mb-2">Answer</p>
                          <p className="text-3xl text-cyan-50 font-black leading-relaxed font-mono">{mathSolution}</p>
                        </div>
                      )}
                      {!mathExtractedText && !mathSolution && (
                         <div className="text-slate-600 italic h-full flex items-center justify-center text-center">Capture or upload a math problem.</div>
                      )}
                    </div>
                  )}
                </div>
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
