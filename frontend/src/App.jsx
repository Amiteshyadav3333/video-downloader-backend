/**
 * Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Download, Loader2, CheckCircle, XCircle, ExternalLink,
  Mic, MicOff, Languages, Volume2, VolumeX, FileText,
  Camera, Image as ImageIcon, Calculator, Globe, ArrowLeftRight,
  Copy, Trash2, Menu, X as CloseIcon, Headphones, MessageSquare,
  Type, ChevronDown, Play, Square, RotateCcw, Check
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

/* ── localStorage hook ── */
const useLS = (key, init) => {
  const [val, set] = useState(() => {
    try { const i = localStorage.getItem(key); return i !== null ? JSON.parse(i) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, set];
};

/* ── Language data ── */
const LANGS = [
  { code: 'auto', name: 'Detect Language', flag: '🔍' },
  { code: 'hi',   name: 'Hindi',      flag: '🇮🇳', n: 'हिन्दी' },
  { code: 'en',   name: 'English',    flag: '🇺🇸', n: 'English' },
  { code: 'bn',   name: 'Bengali',    flag: '🇮🇳', n: 'বাংলা' },
  { code: 'te',   name: 'Telugu',     flag: '🇮🇳', n: 'తెలుగు' },
  { code: 'mr',   name: 'Marathi',    flag: '🇮🇳', n: 'मराठी' },
  { code: 'ta',   name: 'Tamil',      flag: '🇮🇳', n: 'தமிழ்' },
  { code: 'gu',   name: 'Gujarati',   flag: '🇮🇳', n: 'ગુજરાતી' },
  { code: 'kn',   name: 'Kannada',    flag: '🇮🇳', n: 'ಕನ್ನಡ' },
  { code: 'ml',   name: 'Malayalam',  flag: '🇮🇳', n: 'മലയാളം' },
  { code: 'pa',   name: 'Punjabi',    flag: '🇮🇳', n: 'ਪੰਜਾਬੀ' },
  { code: 'ur',   name: 'Urdu',       flag: '🇵🇰', n: 'اردو' },
  { code: 'es',   name: 'Spanish',    flag: '🇪🇸', n: 'Español' },
  { code: 'fr',   name: 'French',     flag: '🇫🇷', n: 'Français' },
  { code: 'de',   name: 'German',     flag: '🇩🇪', n: 'Deutsch' },
  { code: 'zh',   name: 'Chinese',    flag: '🇨🇳', n: '中文' },
  { code: 'ja',   name: 'Japanese',   flag: '🇯🇵', n: '日本語' },
  { code: 'ar',   name: 'Arabic',     flag: '🇸🇦', n: 'العربية' },
  { code: 'ru',   name: 'Russian',    flag: '🇷🇺', n: 'Русский' },
  { code: 'pt',   name: 'Portuguese', flag: '🇧🇷', n: 'Português' },
  { code: 'it',   name: 'Italian',    flag: '🇮🇹', n: 'Italiano' },
  { code: 'ko',   name: 'Korean',     flag: '🇰🇷', n: '한국어' },
  { code: 'tr',   name: 'Turkish',    flag: '🇹🇷', n: 'Türkçe' },
  { code: 'nl',   name: 'Dutch',      flag: '🇳🇱', n: 'Nederlands' },
  { code: 'pl',   name: 'Polish',     flag: '🇵🇱', n: 'Polski' },
  { code: 'th',   name: 'Thai',       flag: '🇹🇭', n: 'ไทย' },
  { code: 'vi',   name: 'Vietnamese', flag: '🇻🇳', n: 'Tiếng Việt' },
  { code: 'id',   name: 'Indonesian', flag: '🇮🇩', n: 'Bahasa Indonesia' },
  { code: 'ne',   name: 'Nepali',     flag: '🇳🇵', n: 'नेपाली' },
  { code: 'sw',   name: 'Swahili',    flag: '🇰🇪', n: 'Kiswahili' },
  { code: 'fa',   name: 'Persian',    flag: '🇮🇷', n: 'فارسی' },
];

// Speech recognition BCP-47 codes
const SR_LANG = {
  'en':'en-US','hi':'hi-IN','bn':'bn-IN','te':'te-IN','mr':'mr-IN',
  'ta':'ta-IN','gu':'gu-IN','kn':'kn-IN','ml':'ml-IN','pa':'pa-IN',
  'ur':'ur-PK','es':'es-ES','fr':'fr-FR','de':'de-DE','zh':'zh-CN',
  'ja':'ja-JP','ar':'ar-SA','ru':'ru-RU','pt':'pt-BR','it':'it-IT',
  'ko':'ko-KR','tr':'tr-TR','nl':'nl-NL','pl':'pl-PL','th':'th-TH',
  'vi':'vi-VN','id':'id-ID','ne':'ne-NP','fa':'fa-IR','sw':'sw',
};

const getLang = (code) => LANGS.find(l => l.code === code) || { code, name: code?.toUpperCase(), flag: '🌐' };

/* ── Backend TTS — always use server, never browser voices ── */
async function fetchTTSBlob(BACKEND_URL, text, lang) {
  const clean = lang.split('-')[0];
  const res = await fetch(`${BACKEND_URL}/text-to-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.slice(0, 2000), lang: clean }),
  });
  if (!res.ok) throw new Error('TTS failed');
  return res.blob();
}

/* ── Language Selector Dropdown ── */
function LangSelect({ value, onChange, sourceMode = false, label }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const options = sourceMode ? LANGS : LANGS.filter(l => l.code !== 'auto');
  const filtered = options.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.n && l.n.includes(search))
  );
  const cur = getLang(value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-transparent hover:bg-white/10 transition-all text-white font-semibold text-sm group"
      >
        <span className="text-base">{cur.flag}</span>
        <span className="max-w-[100px] sm:max-w-none truncate">{cur.name}</span>
        {cur.n && cur.n !== cur.name && <span className="text-slate-400 hidden sm:inline">· {cur.n}</span>}
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-[100] mt-1 w-64 bg-[#1e2535] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full bg-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.map(l => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code); setOpen(false); setSearch(''); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left
                  ${value === l.code ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-white/10'}`}
              >
                <span>{l.flag}</span>
                <span className="font-medium">{l.name}</span>
                {l.n && l.n !== l.name && <span className="text-slate-400 text-xs ml-auto">{l.n}</span>}
                {value === l.code && <Check size={14} className="ml-auto flex-shrink-0" />}
              </button>
            ))}
            {filtered.length === 0 && <p className="text-slate-500 text-sm px-3 py-2">No results</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRANSLATOR SECTION — Complete Google Translate Clone
══════════════════════════════════════════════════════ */
function TranslatorSection({ BACKEND_URL }) {
  /* ── Mode: 'text' | 'conversation' ── */
  const [mode, setMode] = useState('text');

  /* ── Text mode state ── */
  const [srcLang, setSrcLang] = useLS('t_src', 'auto');
  const [tgtLang, setTgtLang] = useLS('t_tgt', 'hi');
  // voiceLang is SEPARATE from srcLang - this is what mic listens to
  // This fixes the bug: auto-detect text ≠ speech recognition language
  const [voiceLang, setVoiceLang] = useLS('t_voice', 'en');
  const [inputText, setInputText] = useLS('t_in', '');
  const [outputText, setOutputText] = useLS('t_out', '');
  const [detectedLang, setDetectedLang] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeakingOut, setIsSpeakingOut] = useState(false);
  const [isSpeakingIn, setIsSpeakingIn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [copiedIn, setCopiedIn] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);

  /* ── Conversation mode state ── */
  const [convLangIn, setConvLangIn] = useLS('c_in', 'en');
  const [convLangOut, setConvLangOut] = useLS('c_out', 'hi');
  const [convHistory, setConvHistory] = useState([]);
  const [convStatus, setConvStatus] = useState('idle'); // idle | listening | translating | speaking
  const [convInterim, setConvInterim] = useState('');
  const [headphoneMode, setHeadphoneMode] = useLS('headphone', false);
  const [isConvActive, setIsConvActive] = useState(false);
  const isConvActiveRef = useRef(false);

  /* ── Refs ── */
  const recognitionRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const currentAudioRef = useRef(null);
  const convRecognitionRef = useRef(null);
  const convSilenceRef = useRef(null);
  const convAccRef = useRef('');
  const outputAudioRef = useRef(null);

  /* ────────────────── CORE TRANSLATE ────────────────── */
  const doTranslate = useCallback(async (text, src, tgt, silent = false) => {
    if (!text?.trim()) { setOutputText(''); setDetectedLang(''); return; }
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setIsTranslating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/translate-only`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source: src, target: tgt }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      if (data.success) {
        setOutputText(data.translated_text || '');
        if (src === 'auto' && data.detected_language) setDetectedLang(data.detected_language);
        if (!silent) toast.success('Translated!', { duration: 1200, icon: '✅' });
      } else {
        if (!silent) toast.error(data.error || 'Translation failed');
      }
    } catch (err) {
      if (err.name !== 'AbortError' && !silent) toast.error('Error: ' + err.message);
    } finally {
      setIsTranslating(false);
    }
  }, [BACKEND_URL]);

  /* ── Auto-translate debounce ── */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!inputText.trim()) { setOutputText(''); setDetectedLang(''); return; }
    const delay = inputText.length > 500 ? 1000 : inputText.length > 100 ? 700 : 450;
    debounceRef.current = setTimeout(() => doTranslate(inputText, srcLang, tgtLang, true), delay);
    return () => clearTimeout(debounceRef.current);
  }, [inputText, srcLang, tgtLang]);

  /* ── Swap languages ── */
  const swapLangs = () => {
    if (srcLang === 'auto') return;
    const prevOut = outputText;
    setSrcLang(tgtLang); setTgtLang(srcLang);
    setInputText(prevOut); setOutputText(''); setDetectedLang('');
  };

  /* ─────────────── BACKEND TTS PLAYER ─────────────── */
  // Always use backend gTTS - NEVER browser speechSynthesis
  const playTTS = async (text, lang, onStart, onEnd) => {
    try {
      if (onStart) onStart();
      // Stop any playing audio first
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
        currentAudioRef.current = null;
      }
      const blob = await fetchTTSBlob(BACKEND_URL, text, lang);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); currentAudioRef.current = null; if (onEnd) onEnd(); };
      audio.onerror = () => { URL.revokeObjectURL(url); currentAudioRef.current = null; if (onEnd) onEnd(); };
      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      if (onEnd) onEnd();
    }
  };

  /* ── Speak input text ── */
  const speakInput = () => {
    const lang = srcLang === 'auto' ? (detectedLang || voiceLang) : srcLang;
    playTTS(inputText, lang, () => setIsSpeakingIn(true), () => setIsSpeakingIn(false));
  };

  /* ── Speak output text ── */
  const speakOutput = () => {
    if (isSpeakingOut) {
      if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
      setIsSpeakingOut(false);
      return;
    }
    playTTS(outputText, tgtLang, () => setIsSpeakingOut(true), () => setIsSpeakingOut(false));
  };

  /* ── Copy ── */
  const copyIn = async () => {
    await navigator.clipboard.writeText(inputText);
    setCopiedIn(true); setTimeout(() => setCopiedIn(false), 2000);
  };
  const copyOut = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopiedOut(true); setTimeout(() => setCopiedOut(false), 2000);
  };

  /* ── Download audio ── */
  const downloadAudio = async () => {
    if (!outputText) return;
    const blob = await fetchTTSBlob(BACKEND_URL, outputText, tgtLang);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `translation_${tgtLang}.mp3`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Audio downloaded!');
  };

  /* ─────────────── VOICE INPUT (Single sentence mic) ─────────────── */
  // KEY FIX: voiceLang is used for speech recognition, NOT srcLang
  // This means "auto detect text" + "English voice" works correctly
  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported in this browser'); return; }
    if (recognitionRef.current) recognitionRef.current.abort();

    const r = new SR();
    recognitionRef.current = r;
    // CRITICAL: Always use voiceLang for mic, NOT srcLang
    // srcLang='auto' + voiceLang='en' → recognizes English correctly
    r.lang = SR_LANG[voiceLang] || 'en-US';
    r.continuous = false;
    r.interimResults = true;

    r.onstart = () => { setIsListening(true); setInterimText(''); };
    r.onend = () => { setIsListening(false); recognitionRef.current = null; setInterimText(''); };
    r.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          setInputText(prev => prev ? prev + ' ' + e.results[i][0].transcript : e.results[i][0].transcript);
          setInterimText('');
        } else { interim += e.results[i][0].transcript; }
      }
      setInterimText(interim);
    };
    r.onerror = (e) => {
      setIsListening(false);
      if (e.error !== 'aborted') toast.error('Mic: ' + e.error);
    };
    r.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  /* ════════════════════════════════════════════════════
     CONVERSATION MODE — Real-time pipeline
     Pipeline: Listen → Boundary → Translate → Queue TTS
     While TTS plays → still listening for next sentence
  ════════════════════════════════════════════════════ */

  /* ── TTS Queue for conversation ── */
  const convQueueTTS = useCallback(async (text, lang, id) => {
    audioQueueRef.current.push({ text, lang, id });
    if (!isPlayingRef.current) playConvQueue();
  }, []);

  const playConvQueue = async () => {
    if (audioQueueRef.current.length === 0) { isPlayingRef.current = false; setConvStatus('listening'); return; }
    isPlayingRef.current = true;
    setConvStatus('speaking');
    const { text, lang, id } = audioQueueRef.current.shift();
    try {
      const blob = await fetchTTSBlob(BACKEND_URL, text, lang);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      outputAudioRef.current = audio;
      // Mark as playing in history
      setConvHistory(prev => prev.map(h => h.id === id ? { ...h, status: 'speaking' } : h));
      audio.onended = () => {
        URL.revokeObjectURL(url);
        outputAudioRef.current = null;
        setConvHistory(prev => prev.map(h => h.id === id ? { ...h, status: 'done' } : h));
        playConvQueue();
      };
      audio.onerror = () => { URL.revokeObjectURL(url); playConvQueue(); };
      audio.play();
    } catch (err) {
      console.error('Conv TTS error:', err);
      playConvQueue();
    }
  };

  /* ── Process one sentence in conversation ── */
  const convProcessSentence = useCallback(async (text) => {
    if (!text.trim()) return;
    const id = Date.now();
    // Add to history as pending
    setConvHistory(prev => [...prev, { id, original: text, translated: '', status: 'translating' }]);
    setConvStatus('translating');
    try {
      const res = await fetch(`${BACKEND_URL}/translate-only`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source: convLangIn, target: convLangOut }),
      });
      const data = await res.json();
      if (data.success) {
        const translated = data.translated_text;
        setConvHistory(prev => prev.map(h => h.id === id ? { ...h, translated, status: 'translated' } : h));
        convQueueTTS(translated, convLangOut, id);
        // Resume listening immediately (if still active)
        if (isConvActiveRef.current) setConvStatus('listening');
      }
    } catch (err) { console.error('Conv translate error:', err); }
  }, [BACKEND_URL, convLangIn, convLangOut, convQueueTTS]);

  /* ── Start conversation mode ── */
  const startConversation = () => {
    if (!headphoneMode) {
      toast.error('⚠️ Please enable Headphone Mode first to avoid echo!', { duration: 4000 });
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported'); return; }

    isConvActiveRef.current = true;
    setIsConvActive(true);
    setConvStatus('listening');
    audioQueueRef.current = [];
    convAccRef.current = '';

    const r = new SR();
    convRecognitionRef.current = r;
    r.lang = SR_LANG[convLangIn] || 'en-US';
    r.continuous = true;
    r.interimResults = true;

    r.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          convAccRef.current += ' ' + e.results[i][0].transcript;
          // Sentence boundary: process after 1.2s silence
          clearTimeout(convSilenceRef.current);
          convSilenceRef.current = setTimeout(() => {
            const sentence = convAccRef.current.trim();
            if (sentence) {
              convProcessSentence(sentence);
              convAccRef.current = '';
              setConvInterim('');
            }
          }, 1200);
        } else {
          interim = e.results[i][0].transcript;
        }
      }
      setConvInterim((convAccRef.current + ' ' + interim).trim());
    };

    r.onerror = (e) => {
      if (e.error === 'no-speech') return; // ignore no-speech, restart
      if (e.error !== 'aborted') toast.error('Mic: ' + e.error);
    };

    r.onend = () => {
      // Auto-restart if still active
      if (isConvActiveRef.current) {
        setTimeout(() => {
          if (isConvActiveRef.current && convRecognitionRef.current) {
            try { convRecognitionRef.current.start(); } catch (e) {}
          }
        }, 300);
      }
    };

    r.start();
  };

  /* ── Stop conversation mode ── */
  const stopConversation = () => {
    isConvActiveRef.current = false;
    setIsConvActive(false);
    setConvStatus('idle');
    setConvInterim('');
    clearTimeout(convSilenceRef.current);
    if (convRecognitionRef.current) { try { convRecognitionRef.current.abort(); } catch {} convRecognitionRef.current = null; }
    if (outputAudioRef.current) { outputAudioRef.current.pause(); outputAudioRef.current = null; }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  /* Cleanup on unmount */
  useEffect(() => () => {
    stopConversation();
    if (recognitionRef.current) recognitionRef.current.abort();
    if (currentAudioRef.current) currentAudioRef.current.pause();
  }, []);

  /* ── Conv status colors/labels ── */
  const convStatusConfig = {
    idle:        { color: 'text-slate-500', pulse: false, label: 'Ready' },
    listening:   { color: 'text-blue-400',  pulse: true,  label: 'Listening...' },
    translating: { color: 'text-amber-400', pulse: true,  label: 'Translating...' },
    speaking:    { color: 'text-emerald-400',pulse: true, label: 'Speaking...' },
  };
  const csc = convStatusConfig[convStatus];

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* ── Mode Toggle ── */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => { setMode('text'); stopConversation(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
            ${mode === 'text' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-[#1e2535] text-slate-400 hover:text-white'}`}
        >
          <Type size={15} /> Text
        </button>
        <button
          onClick={() => setMode('conversation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
            ${mode === 'conversation' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-[#1e2535] text-slate-400 hover:text-white'}`}
        >
          <Headphones size={15} /> Conversation
        </button>
      </div>

      {/* ════════════ TEXT MODE ════════════ */}
      {mode === 'text' && (
        <div className="rounded-2xl overflow-visible border border-white/10 bg-[#1a2236] shadow-2xl">

          {/* ── Language Bar ── */}
          <div className="flex items-center bg-[#141c2e] border-b border-white/5 px-2 py-1">
            <div className="flex-1 min-w-0">
              <LangSelect value={srcLang} onChange={(v) => { setSrcLang(v); setDetectedLang(''); }} sourceMode label="From" />
            </div>
            {/* Detected badge */}
            {srcLang === 'auto' && detectedLang && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20 flex-shrink-0 mx-1">
                <Globe size={11} /> {getLang(detectedLang).flag} {getLang(detectedLang).name}
              </span>
            )}
            <button
              onClick={swapLangs}
              disabled={srcLang === 'auto'}
              title="Swap languages"
              className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-300 hover:text-white flex-shrink-0 mx-1 active:scale-90"
            >
              <ArrowLeftRight size={18} />
            </button>
            <div className="flex-1 min-w-0 flex justify-end">
              <LangSelect value={tgtLang} onChange={setTgtLang} label="To" />
            </div>
          </div>

          {/* ── Input Panel ── */}
          <div className="relative border-b border-white/5">
            {/* Mobile: detected lang badge */}
            {srcLang === 'auto' && detectedLang && (
              <div className="flex sm:hidden items-center gap-1 text-xs text-blue-400 px-4 pt-3">
                <Globe size={11} /> Detected: {getLang(detectedLang).flag} {getLang(detectedLang).name}
              </div>
            )}
            <textarea
              value={inputText}
              onChange={e => { if (e.target.value.length <= 10000) setInputText(e.target.value); }}
              placeholder={`Type in any language... (${getLang(srcLang).name})`}
              className="w-full bg-transparent px-4 pt-4 pb-2 outline-none resize-none text-xl text-white placeholder:text-slate-600 leading-relaxed min-h-[160px]"
              style={{ fontFamily: 'inherit' }}
            />
            {/* Interim voice text */}
            {interimText && (
              <div className="px-4 py-1 text-slate-500 italic text-base">{interimText}...</div>
            )}
            {/* Input toolbar */}
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-1">
                {/* Mic button — uses voiceLang, NOT srcLang */}
                <button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  title={`Voice: ${getLang(voiceLang).name} (tap to change)`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all
                    ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'}`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  {!isListening && (
                    <span className="text-xs">{getLang(voiceLang).flag}</span>
                  )}
                </button>
                {/* Voice language selector (separate from srcLang!) */}
                <div className="relative">
                  <select
                    value={voiceLang}
                    onChange={e => setVoiceLang(e.target.value)}
                    title="Language you'll speak into mic"
                    className="bg-transparent text-xs text-slate-500 hover:text-slate-300 outline-none cursor-pointer py-1 pr-1 appearance-none"
                    style={{ maxWidth: 90 }}
                  >
                    {LANGS.filter(l => l.code !== 'auto').map(l => (
                      <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>
                    ))}
                  </select>
                </div>
                {/* Speak input */}
                {inputText && (
                  <button onClick={speakInput} title="Listen to input"
                    className={`p-2 rounded-xl transition-all ${isSpeakingIn ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                    <Volume2 size={18} />
                  </button>
                )}
                {/* Copy input */}
                {inputText && (
                  <button onClick={copyIn} title="Copy" className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                    {copiedIn ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {inputText && (
                  <button onClick={() => { setInputText(''); setOutputText(''); setDetectedLang(''); }}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-all">
                    <Trash2 size={16} />
                  </button>
                )}
                <span className={`text-xs font-mono ${inputText.length > 9000 ? 'text-orange-400' : 'text-slate-700'}`}>
                  {inputText.length}/10k
                </span>
              </div>
            </div>
          </div>

          {/* ── Output Panel ── */}
          <div className="relative bg-[#141c2e]/50">
            {/* Output label */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                {getLang(tgtLang).flag} {getLang(tgtLang).name}
              </span>
              {isTranslating && (
                <span className="flex items-center gap-1 text-xs text-blue-400">
                  <Loader2 size={11} className="animate-spin" /> translating...
                </span>
              )}
            </div>
            {/* Output text */}
            <div className="px-4 py-2 min-h-[120px]">
              {isTranslating && !outputText ? (
                <div className="flex items-center gap-2 py-6 justify-center">
                  <Loader2 size={28} className="animate-spin text-blue-500/40" />
                  <span className="text-slate-600 text-sm">
                    {inputText.length > 500 ? 'Translating long text...' : 'Translating...'}
                  </span>
                </div>
              ) : outputText ? (
                <p className="text-lg text-emerald-50 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'inherit' }}>
                  {outputText}
                </p>
              ) : (
                <p className="text-slate-700 italic">Translation yahan aayega...</p>
              )}
            </div>
            {/* Output toolbar */}
            {outputText && (
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  {/* Speak output — ALWAYS backend TTS */}
                  <button
                    onClick={speakOutput}
                    title={isSpeakingOut ? 'Stop' : 'Listen (Google TTS)'}
                    className={`p-2 rounded-xl transition-all ${isSpeakingOut ? 'text-emerald-400 bg-emerald-500/10 animate-pulse' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                  >
                    {isSpeakingOut ? <Square size={18} /> : <Volume2 size={18} />}
                  </button>
                  {/* Copy output */}
                  <button onClick={copyOut} title="Copy" className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                    {copiedOut ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  </button>
                  {/* Download audio */}
                  <button onClick={downloadAudio} title="Download as MP3"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                    <Download size={18} />
                  </button>
                </div>
                <span className="text-xs text-slate-700">{outputText.length} chars</span>
              </div>
            )}
          </div>

          {/* ── Translate Button ── */}
          <div className="p-3 bg-[#141c2e]/30 border-t border-white/5">
            <button
              onClick={() => doTranslate(inputText, srcLang, tgtLang, false)}
              disabled={isTranslating || !inputText.trim()}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {isTranslating ? <><Loader2 size={18} className="animate-spin" /> Translating...</> : <><Languages size={18} /> Translate</>}
            </button>
          </div>

          {/* ── Voice Language Notice ── */}
          <div className="px-4 py-2.5 bg-[#0d1420] border-t border-white/5 rounded-b-2xl">
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Mic size={11} />
              <span>
                Mic listens in <strong className="text-slate-400">{getLang(voiceLang).name}</strong>
                {srcLang === 'auto' && ' (text auto-detected separately)'}
                {' '}— <button onClick={() => {}} className="text-blue-500 hover:text-blue-400">change mic language above ↑</button>
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ════════════ CONVERSATION MODE ════════════ */}
      {mode === 'conversation' && (
        <div className="rounded-2xl border border-white/10 bg-[#1a2236] shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#141c2e] px-4 py-3 border-b border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Headphones size={18} className="text-blue-400" />
                <span className="font-bold text-white">Conversation Mode</span>
              </div>
              {/* Headphone toggle */}
              <button
                onClick={() => setHeadphoneMode(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                  ${headphoneMode
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}`}
              >
                <Headphones size={13} />
                {headphoneMode ? '🎧 Headphones ON' : '⚠️ Enable Headphones'}
              </button>
            </div>

            {!headphoneMode && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 mb-3">
                <p className="text-xs text-amber-400 font-medium">
                  ⚠️ <strong>Headphones required!</strong> Without them, the speaker output will be picked up by the mic, causing echo/feedback loop. Please connect headphones and enable above.
                </p>
              </div>
            )}

            {/* Lang selectors */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">You speak</p>
                <LangSelect value={convLangIn} onChange={setConvLangIn} label="Speak" />
              </div>
              <div className="flex items-center justify-center">
                <ArrowLeftRight size={16} className="text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Translates to</p>
                <LangSelect value={convLangOut} onChange={setConvLangOut} label="Output" />
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#141c2e]/50 border-b border-white/5">
            <div className="flex items-center gap-2">
              {isConvActive && <div className={`w-2 h-2 rounded-full ${csc.pulse ? 'animate-pulse' : ''} bg-current ${csc.color}`} />}
              <span className={`text-sm font-bold ${csc.color}`}>{csc.label}</span>
            </div>
            {convInterim && (
              <span className="text-xs text-slate-500 italic max-w-[50%] truncate">{convInterim}</span>
            )}
          </div>

          {/* Conversation history */}
          <div className="min-h-[300px] max-h-[400px] overflow-y-auto p-4 space-y-3" id="conv-history">
            {convHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-slate-600 gap-3">
                <MessageSquare size={40} className="opacity-30" />
                <p className="text-sm text-center">
                  Start speaking and I'll translate in real-time.<br />
                  <span className="text-xs opacity-70">Each sentence is translated &amp; spoken automatically.</span>
                </p>
              </div>
            ) : (
              convHistory.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  {/* Original (what you said) */}
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-blue-400 mt-1 flex-shrink-0">{getLang(convLangIn).flag}</span>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 rounded-xl px-3 py-2 flex-1">
                      {item.original}
                    </p>
                  </div>
                  {/* Translation */}
                  {item.translated && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-emerald-400 mt-1 flex-shrink-0">{getLang(convLangOut).flag}</span>
                      <div className={`flex-1 flex items-start gap-2 rounded-xl px-3 py-2 transition-all
                        ${item.status === 'speaking' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-[#141c2e]'}`}>
                        <p className="text-sm text-emerald-100 leading-relaxed flex-1">{item.translated}</p>
                        {item.status === 'speaking' && <Volume2 size={14} className="text-emerald-400 animate-pulse flex-shrink-0 mt-0.5" />}
                        {item.status === 'done' && (
                          <button onClick={() => convQueueTTS(item.translated, convLangOut, item.id)}
                            className="text-slate-600 hover:text-emerald-400 transition-colors flex-shrink-0">
                            <Play size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {item.status === 'translating' && (
                    <div className="flex items-center gap-2 ml-6 text-xs text-amber-400">
                      <Loader2 size={11} className="animate-spin" /> Translating...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-white/5 bg-[#141c2e]/50 space-y-3">
            <div className="flex gap-3">
              {!isConvActive ? (
                <button
                  onClick={startConversation}
                  disabled={!headphoneMode}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Mic size={22} /> Start Conversation
                </button>
              ) : (
                <button
                  onClick={stopConversation}
                  className="flex-1 h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 animate-pulse"
                >
                  <Square size={22} /> Stop
                </button>
              )}
              {convHistory.length > 0 && !isConvActive && (
                <button
                  onClick={() => { setConvHistory([]); setConvInterim(''); }}
                  className="px-4 h-14 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-600 text-center">
              🎧 Works best with headphones · Speak clearly, pause between sentences
            </p>
          </div>
        </div>
      )}

      {/* Feature pills */}
      <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
        {['✅ Auto Language Detection','🎤 Voice Input','🔊 Google TTS Quality','🔄 Swap Languages','📋 Copy','💬 Conversation Mode','📖 Long Text Support'].map(f => (
          <span key={f} className="px-2.5 py-1 bg-[#1a2236] rounded-full text-xs text-slate-500 border border-white/5">{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useLS('activeTab', 'translator');
  const [url, setUrl] = useLS('url', '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [targetLang, setTargetLang] = useLS('targetLang', 'hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Vision
  const videoRef = useRef(null); const canvasRef = useRef(null); const fileInputRef = useRef(null);
  const [visionImage, setVisionImage] = useState(null); const [isCameraActive, setIsCameraActive] = useState(false);
  const [visionExtractedText, setVisionExtractedText] = useState(''); const [visionTranslatedText, setVisionTranslatedText] = useState('');
  const [visionSrc, setVisionSrc] = useLS('visionSrc', 'auto'); const [visionTgt, setVisionTgt] = useLS('visionTgt', 'hi');

  // Math
  const mathVideoRef = useRef(null); const mathCanvasRef = useRef(null); const mathFileInputRef = useRef(null);
  const [mathImage, setMathImage] = useState(null); const [isMathCameraActive, setIsMathCameraActive] = useState(false);
  const [mathExtractedText, setMathExtractedText] = useState(''); const [mathSolution, setMathSolution] = useState('');
  const [mathInputText, setMathInputText] = useState('');

  // Creator
  const [creatorText, setCreatorText] = useLS('creatorText', '');
  const [creatorLang, setCreatorLang] = useLS('creatorLang', 'original');

  const BACKEND_URL = window.location.port === '3000' || window.location.hostname === 'localhost'
    ? `http://${window.location.hostname}:5001`
    : 'https://video-downloader-backend-c90x.onrender.com';

  const detectPlatform = (u) => {
    if (!u) return '🌐';
    const l = u.toLowerCase();
    if (l.includes('youtube.com') || l.includes('youtu.be')) return '🎥 YouTube';
    if (l.includes('instagram.com')) return '📷 Instagram';
    if (l.includes('facebook.com') || l.includes('fb.watch')) return '📘 Facebook';
    if (l.includes('twitter.com') || l.includes('x.com')) return '🐦 Twitter/X';
    if (l.includes('tiktok.com')) return '🎵 TikTok';
    if (l.includes('snapchat.com')) return '👻 Snapchat';
    return '🌐 Platform';
  };

  const handleDownload = async () => {
    const u = url.trim(); if (!u) { setError('Please enter a URL'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${BACKEND_URL}/download`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: u }) });
      const data = await res.json();
      if (res.ok && data.success) { setResult(data); setResultUrl(u); } else { setError(data.error || 'Failed.'); }
    } catch { setError('Connection error.'); } finally { setLoading(false); }
  };

  const handleConvertToPdf = async () => {
    const u = url.trim(); if (!u) { setError('Please enter a URL'); return; }
    setLoading(true); setIsTranslating(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/generate-pdf`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: u, target_lang: targetLang }) });
      if (res.ok) {
        const blob = await res.blob(); const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = dlUrl; a.download = `IndiaSearch_Notes_${targetLang}.pdf`; a.click(); URL.revokeObjectURL(dlUrl);
      } else { const d = await res.json(); setError(d.error || 'Failed.'); }
    } catch { setError('Server error.'); } finally { setLoading(false); setIsTranslating(false); }
  };

  // Vision helpers
  const startCamera = async () => { try { const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); if (videoRef.current) { videoRef.current.srcObject = s; setIsCameraActive(true); } } catch { toast.error('Camera denied.'); } };
  const stopCamera = () => { if (videoRef.current?.srcObject) { videoRef.current.srcObject.getTracks().forEach(t => t.stop()); setIsCameraActive(false); } };
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth; canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const d = canvasRef.current.toDataURL('image/jpeg', 0.8); setVisionImage(d); stopCamera(); translateVisionImage(d);
    }
  };
  const handleGalleryUpload = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => { setVisionImage(ev.target.result); translateVisionImage(ev.target.result); }; r.readAsDataURL(f); } };
  const translateVisionImage = async (b64) => {
    setLoading(true); setVisionExtractedText(''); setVisionTranslatedText('');
    try {
      const res = await fetch(`${BACKEND_URL}/translate-image`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b64, source: visionSrc, target: visionTgt }) });
      const d = await res.json();
      if (d.success) { setVisionExtractedText(d.extracted_text); setVisionTranslatedText(d.translated_text); toast.success('Image translated!'); }
      else { toast.error(d.error || 'Failed.'); }
    } catch { toast.error('Error.'); } finally { setLoading(false); }
  };

  // Math helpers
  const startMathCamera = async () => { try { const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); if (mathVideoRef.current) { mathVideoRef.current.srcObject = s; setIsMathCameraActive(true); } } catch { toast.error('Camera denied.'); } };
  const stopMathCamera = () => { if (mathVideoRef.current?.srcObject) { mathVideoRef.current.srcObject.getTracks().forEach(t => t.stop()); setIsMathCameraActive(false); } };
  const captureMathImage = () => {
    if (mathVideoRef.current && mathCanvasRef.current) {
      const ctx = mathCanvasRef.current.getContext('2d');
      mathCanvasRef.current.width = mathVideoRef.current.videoWidth; mathCanvasRef.current.height = mathVideoRef.current.videoHeight;
      ctx.drawImage(mathVideoRef.current, 0, 0);
      const d = mathCanvasRef.current.toDataURL('image/jpeg', 0.8); setMathImage(d); stopMathCamera(); solveMathImg(d);
    }
  };
  const handleMathGallery = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => { setMathImage(ev.target.result); solveMathImg(ev.target.result); }; r.readAsDataURL(f); } };
  const solveMathImg = async (b64) => {
    setLoading(true); setMathExtractedText(''); setMathSolution('');
    try { const res = await fetch(`${BACKEND_URL}/solve-math`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b64 }) }); const d = await res.json(); if (d.success) { setMathExtractedText(d.extracted_text); setMathSolution(d.solution); toast.success('Solved!'); } else { toast.error(d.error || 'Failed.'); } } catch { toast.error('Error.'); } finally { setLoading(false); }
  };
  const solveMathText = async () => {
    if (!mathInputText) return; setLoading(true); setMathExtractedText(''); setMathSolution(''); setMathImage(null);
    try { const res = await fetch(`${BACKEND_URL}/solve-math`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: mathInputText }) }); const d = await res.json(); if (d.success) { setMathExtractedText(d.extracted_text); setMathSolution(d.solution); toast.success('Solved!'); } else { toast.error(d.error || 'Failed.'); } } catch { toast.error('Error.'); } finally { setLoading(false); }
  };

  const handleCreatePdf = async () => {
    if (!creatorText) { toast.error('Paste some content!'); return; } setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/generate-pdf-from-text`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: creatorText, target_lang: creatorLang }) });
      if (res.ok) { const blob = await res.blob(); const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = 'IndiaSearch_Document.pdf'; a.click(); URL.revokeObjectURL(u); toast.success('PDF created!'); }
      else { toast.error('Failed.'); }
    } catch { toast.error('Error.'); } finally { setLoading(false); }
  };

  const TABS = [
    { id: 'translator', label: 'Translate', icon: <Languages size={20} /> },
    { id: 'downloader', label: 'Download',  icon: <Download size={20} /> },
    { id: 'vision',     label: 'Vision',    icon: <Camera size={20} /> },
    { id: 'math',       label: 'Math',      icon: <Calculator size={20} /> },
    { id: 'creator',    label: 'Doc',       icon: <FileText size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-sans text-slate-200">
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: '#1e2535', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14 } }}
      />

      {/* ── Desktop Navbar ── */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5 items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Globe className="text-white" size={20} />
          </div>
          <span className="text-lg font-black tracking-tight text-white">IndiaSearch</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1a2236] p-1 rounded-2xl border border-white/5">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all
                ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Mobile Header ── */}
      <header className="md:hidden sticky top-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
            <Globe className="text-white" size={17} />
          </div>
          <span className="text-base font-black text-white">IndiaSearch</span>
        </div>
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
          {TABS.find(t => t.id === activeTab)?.label}
        </span>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-2xl mx-auto px-3 sm:px-4 pt-6 pb-28 md:pb-12">
        {activeTab === 'translator' && (
          <div className="fade-in"><TranslatorSection BACKEND_URL={BACKEND_URL} /></div>
        )}

        {activeTab === 'downloader' && (
          <div className="fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-1">Media <span className="text-blue-400">Downloader</span></h2>
              <p className="text-slate-500 text-sm">YouTube · Instagram · TikTok · Twitter · Facebook</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 sm:p-6 mb-4 border border-white/5">
              <div className="relative mb-3">
                <input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDownload()}
                  placeholder="Paste video link here..." className="w-full px-4 py-3.5 bg-[#0d1420] border border-white/10 rounded-xl text-white placeholder:text-slate-600 outline-none focus:border-blue-500 text-base transition-all" />
                {url && <button onClick={() => setUrl('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><XCircle size={18} /></button>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleDownload} disabled={loading} className="h-12 bg-white text-slate-950 rounded-xl font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                  {loading && !isTranslating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} Fetch Media
                </button>
                <button onClick={handleConvertToPdf} disabled={loading} className="h-12 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                  {isTranslating ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />} Export PDF
                </button>
              </div>
              {error && <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm"><XCircle size={16} />{error}</div>}
            </div>
            {result && (
              <div className="bg-[#1a2236] rounded-2xl p-4 sm:p-6 border border-white/5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {result.thumbnail && <img src={result.thumbnail} alt="thumb" className="w-full sm:w-40 rounded-xl object-cover aspect-video border border-white/10" />}
                  <div className="flex-1">
                    <span className="inline-block text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 mb-2">{detectPlatform(resultUrl)}</span>
                    <h3 className="text-base font-black text-white mb-3 leading-tight">{result.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {result.formats?.slice(0, 4).map((f, i) => (
                        <a key={i} href={f.url} target="_blank" rel="noopener" className="p-2.5 bg-[#0d1420] border border-white/5 rounded-xl hover:border-blue-500 transition-all group flex items-center justify-between">
                          <div><p className="font-black text-white text-sm">{f.quality}</p><p className="text-xs text-slate-500">{f.filesize ? (f.filesize/1024/1024).toFixed(1)+'MB' : 'HD'}</p></div>
                          <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-1">Visual <span className="text-purple-400">Intelligence</span></h2>
              <p className="text-slate-500 text-sm">Photo ya camera se text extract karke translate karo</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 sm:p-6 border border-white/5">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Source Lang</p>
                  <select value={visionSrc} onChange={e => setVisionSrc(e.target.value)} className="w-full bg-[#0d1420] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none">
                    {[{ code:'auto',name:'Auto',flag:'🔍'}, ...LANGS.filter(l=>l.code!=='auto')].map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Target Lang</p>
                  <select value={visionTgt} onChange={e => setVisionTgt(e.target.value)} className="w-full bg-[#0d1420] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none">
                    {LANGS.filter(l=>l.code!=='auto').map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-white/10 mb-3">
                {!visionImage && !isCameraActive && <div className="text-center text-slate-600"><Camera size={36} className="mx-auto mb-1.5 opacity-30"/><p className="text-xs">Camera off</p></div>}
                <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isCameraActive?'block':'hidden'}`} />
                {visionImage && !isCameraActive && <img src={visionImage} alt="Captured" className="w-full h-full object-cover" />}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {!isCameraActive ? <button onClick={startCamera} className="bg-pink-600 hover:bg-pink-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><Camera size={15}/>Camera</button>
                  : <button onClick={captureImage} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><CheckCircle size={15}/>Capture</button>}
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleGalleryUpload} />
                <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><ImageIcon size={15}/>Gallery</button>
                {isCameraActive && <button onClick={stopCamera} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><XCircle size={15}/>Close</button>}
              </div>
              <div className="bg-[#0d1420] rounded-xl p-4 min-h-[120px] border border-white/5">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Result</p>
                {loading ? <div className="flex items-center gap-2 py-4 justify-center"><Loader2 className="animate-spin text-blue-400" size={24}/><span className="text-sm text-slate-500">Analyzing...</span></div>
                  : visionExtractedText ? (
                    <div className="space-y-3">
                      <div><p className="text-xs text-slate-600 uppercase mb-1">Original</p><p className="text-slate-300 text-sm">{visionExtractedText}</p></div>
                      {visionTranslatedText && <div><p className="text-xs text-emerald-600 uppercase mb-1">Translated</p><p className="text-emerald-100 text-base font-medium">{visionTranslatedText}</p></div>}
                    </div>
                  ) : <p className="text-slate-600 text-sm italic">Capture or upload image to see results</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'math' && (
          <div className="fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-1">Math <span className="text-cyan-400">Solver</span></h2>
              <p className="text-slate-500 text-sm">Photo khicho ya type karo — math solve hoga</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 sm:p-6 border border-white/5">
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-white/10 mb-3">
                {!mathImage && !isMathCameraActive && <div className="text-center text-slate-600"><Calculator size={36} className="mx-auto mb-1.5 opacity-30"/><p className="text-xs">Camera off</p></div>}
                <video ref={mathVideoRef} autoPlay playsInline className={`w-full h-full object-cover ${isMathCameraActive?'block':'hidden'}`} />
                {mathImage && !isMathCameraActive && <img src={mathImage} alt="Math" className="w-full h-full object-cover" />}
                <canvas ref={mathCanvasRef} className="hidden" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {!isMathCameraActive ? <button onClick={startMathCamera} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><Camera size={15}/>Camera</button>
                  : <button onClick={captureMathImage} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><CheckCircle size={15}/>Capture</button>}
                <input type="file" accept="image/*" ref={mathFileInputRef} className="hidden" onChange={handleMathGallery} />
                <button onClick={() => mathFileInputRef.current?.click()} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><ImageIcon size={15}/>Gallery</button>
                {isMathCameraActive && <button onClick={stopMathCamera} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5 transition-all"><XCircle size={15}/>Close</button>}
              </div>
              <div className="flex gap-2 mb-4">
                <input type="text" value={mathInputText} onChange={e => setMathInputText(e.target.value)} onKeyDown={e => e.key==='Enter'&&solveMathText()}
                  placeholder="Ya type karo: 2x+5=15..." className="flex-1 bg-[#0d1420] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-cyan-500 placeholder:text-slate-600 transition-all" />
                <button onClick={solveMathText} disabled={loading||!mathInputText} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-xl px-5 text-sm transition-all">Solve</button>
              </div>
              <div className="bg-[#0d1420] rounded-xl p-4 min-h-[100px] border border-white/5">
                <p className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2">Solution</p>
                {loading ? <div className="flex items-center gap-2 py-4 justify-center"><Loader2 className="animate-spin text-cyan-400" size={24}/><span className="text-sm text-slate-500">Solving...</span></div>
                  : mathSolution ? (
                    <div className="space-y-3">
                      {mathExtractedText && <div><p className="text-xs text-slate-600 uppercase mb-1">Equation</p><p className="text-slate-300 font-mono text-sm bg-black/30 p-2 rounded-lg">{mathExtractedText}</p></div>}
                      <div><p className="text-xs text-cyan-500 uppercase mb-1">Answer</p><p className="text-2xl text-cyan-100 font-black font-mono">{mathSolution}</p></div>
                    </div>
                  ) : <p className="text-slate-600 text-sm italic">Math problem lao ya type karo</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creator' && (
          <div className="fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-1">Doc <span className="text-amber-400">Creator</span></h2>
              <p className="text-slate-500 text-sm">Chat history ya notes paste karo — PDF banao</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 sm:p-6 border border-white/5 space-y-4">
              <div>
                <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">Content</p>
                <textarea value={creatorText} onChange={e => setCreatorText(e.target.value)}
                  placeholder="Paste your chat, article, or notes here..." rows={10}
                  className="w-full bg-[#0d1420] border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 text-sm outline-none focus:border-amber-500 resize-none transition-all" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1.5">PDF Language</p>
                  <select value={creatorLang} onChange={e => setCreatorLang(e.target.value)}
                    className="w-full bg-[#0d1420] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-amber-500">
                    <option value="original">Keep Original</option>
                    {LANGS.filter(l=>l.code!=='auto').map(l=><option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}
                  </select>
                </div>
                <button onClick={handleCreatePdf} disabled={loading||!creatorText}
                  className="sm:flex-[1.2] h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl font-black text-base hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                  {loading ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle size={20}/>} Create PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-xl border-t border-white/8 flex safe-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all
              ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}>
            {React.cloneElement(tab.icon, { size: 22 })}
            <span style={{ fontSize: 10, fontWeight: 700 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
