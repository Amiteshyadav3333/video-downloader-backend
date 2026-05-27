/**
 * Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Download, Loader2, CheckCircle, XCircle, ExternalLink,
  Mic, MicOff, Languages, Volume2, FileText,
  Camera, Image as ImageIcon, Calculator, Globe, ArrowLeftRight,
  Copy, Trash2, Headphones, MessageSquare,
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

/* ══════════════════════════════════════════════════════
   LANGUAGE DATA
══════════════════════════════════════════════════════ */
const INDIA_LANGS = [
  { code: 'hi',  name: 'Hindi',        flag: '🇮🇳', n: 'हिन्दी',       group: 'india' },
  { code: 'bn',  name: 'Bengali',      flag: '🇮🇳', n: 'বাংলা',        group: 'india' },
  { code: 'te',  name: 'Telugu',       flag: '🇮🇳', n: 'తెలుగు',       group: 'india' },
  { code: 'mr',  name: 'Marathi',      flag: '🇮🇳', n: 'मराठी',        group: 'india' },
  { code: 'ta',  name: 'Tamil',        flag: '🇮🇳', n: 'தமிழ்',        group: 'india' },
  { code: 'gu',  name: 'Gujarati',     flag: '🇮🇳', n: 'ગુજરાતી',      group: 'india' },
  { code: 'kn',  name: 'Kannada',      flag: '🇮🇳', n: 'ಕನ್ನಡ',        group: 'india' },
  { code: 'ml',  name: 'Malayalam',    flag: '🇮🇳', n: 'മലയാളം',       group: 'india' },
  { code: 'pa',  name: 'Punjabi',      flag: '🇮🇳', n: 'ਪੰਜਾਬੀ',       group: 'india' },
  { code: 'or',  name: 'Odia',         flag: '🇮🇳', n: 'ଓଡ଼ିଆ',        group: 'india' },
  { code: 'as',  name: 'Assamese',     flag: '🇮🇳', n: 'অসমীয়া',      group: 'india' },
  { code: 'ur',  name: 'Urdu',         flag: '🇮🇳', n: 'اردو',         group: 'india' },
  { code: 'ne',  name: 'Nepali',       flag: '🇮🇳', n: 'नेपाली',       group: 'india' },
  { code: 'sa',  name: 'Sanskrit',     flag: '🇮🇳', n: 'संस्कृतम्',    group: 'india' },
  { code: 'mai', name: 'Maithili',     flag: '🇮🇳', n: 'मैथिली',       group: 'india' },
  { code: 'kok', name: 'Konkani',      flag: '🇮🇳', n: 'कोंकणी',       group: 'india' },
  { code: 'doi', name: 'Dogri',        flag: '🇮🇳', n: 'डोगरी',        group: 'india' },
  { code: 'sd',  name: 'Sindhi',       flag: '🇮🇳', n: 'سنڌي',         group: 'india' },
  { code: 'ks',  name: 'Kashmiri',     flag: '🇮🇳', n: 'कॉशुर',        group: 'india' },
  { code: 'mni', name: 'Manipuri',     flag: '🇮🇳', n: 'মৈতৈলোন্',    group: 'india' },
  { code: 'sat', name: 'Santali',      flag: '🇮🇳', n: 'ᱥᱟᱱᱛᱟᱲᱤ',    group: 'india' },
  { code: 'bho', name: 'Bhojpuri',     flag: '🇮🇳', n: 'भोजपुरी',      group: 'india' },
  { code: 'raj', name: 'Rajasthani',   flag: '🇮🇳', n: 'राजस्थानी',    group: 'india' },
];

const WORLD_LANGS = [
  { code: 'en',  name: 'English',      flag: '🇺🇸', n: 'English',           group: 'world' },
  { code: 'es',  name: 'Spanish',      flag: '🇪🇸', n: 'Español',           group: 'world' },
  { code: 'fr',  name: 'French',       flag: '🇫🇷', n: 'Français',          group: 'world' },
  { code: 'de',  name: 'German',       flag: '🇩🇪', n: 'Deutsch',           group: 'world' },
  { code: 'zh',  name: 'Chinese',      flag: '🇨🇳', n: '中文',               group: 'world' },
  { code: 'ja',  name: 'Japanese',     flag: '🇯🇵', n: '日本語',             group: 'world' },
  { code: 'ar',  name: 'Arabic',       flag: '🇸🇦', n: 'العربية',           group: 'world' },
  { code: 'ru',  name: 'Russian',      flag: '🇷🇺', n: 'Русский',           group: 'world' },
  { code: 'pt',  name: 'Portuguese',   flag: '🇧🇷', n: 'Português',         group: 'world' },
  { code: 'it',  name: 'Italian',      flag: '🇮🇹', n: 'Italiano',          group: 'world' },
  { code: 'ko',  name: 'Korean',       flag: '🇰🇷', n: '한국어',             group: 'world' },
  { code: 'tr',  name: 'Turkish',      flag: '🇹🇷', n: 'Türkçe',            group: 'world' },
  { code: 'nl',  name: 'Dutch',        flag: '🇳🇱', n: 'Nederlands',        group: 'world' },
  { code: 'pl',  name: 'Polish',       flag: '🇵🇱', n: 'Polski',            group: 'world' },
  { code: 'th',  name: 'Thai',         flag: '🇹🇭', n: 'ไทย',               group: 'world' },
  { code: 'vi',  name: 'Vietnamese',   flag: '🇻🇳', n: 'Tiếng Việt',       group: 'world' },
  { code: 'id',  name: 'Indonesian',   flag: '🇮🇩', n: 'Bahasa Indonesia',  group: 'world' },
  { code: 'fa',  name: 'Persian',      flag: '🇮🇷', n: 'فارسی',             group: 'world' },
  { code: 'sw',  name: 'Swahili',      flag: '🇰🇪', n: 'Kiswahili',         group: 'world' },
  { code: 'uk',  name: 'Ukrainian',    flag: '🇺🇦', n: 'Українська',        group: 'world' },
  { code: 'ro',  name: 'Romanian',     flag: '🇷🇴', n: 'Română',            group: 'world' },
  { code: 'cs',  name: 'Czech',        flag: '🇨🇿', n: 'Čeština',           group: 'world' },
  { code: 'sv',  name: 'Swedish',      flag: '🇸🇪', n: 'Svenska',           group: 'world' },
  { code: 'hu',  name: 'Hungarian',    flag: '🇭🇺', n: 'Magyar',            group: 'world' },
  { code: 'el',  name: 'Greek',        flag: '🇬🇷', n: 'Ελληνικά',          group: 'world' },
  { code: 'da',  name: 'Danish',       flag: '🇩🇰', n: 'Dansk',             group: 'world' },
  { code: 'fi',  name: 'Finnish',      flag: '🇫🇮', n: 'Suomi',             group: 'world' },
  { code: 'no',  name: 'Norwegian',    flag: '🇳🇴', n: 'Norsk',             group: 'world' },
  { code: 'he',  name: 'Hebrew',       flag: '🇮🇱', n: 'עברית',             group: 'world' },
  { code: 'ms',  name: 'Malay',        flag: '🇲🇾', n: 'Bahasa Melayu',     group: 'world' },
  { code: 'fil', name: 'Filipino',     flag: '🇵🇭', n: 'Filipino',          group: 'world' },
  { code: 'sk',  name: 'Slovak',       flag: '🇸🇰', n: 'Slovenčina',        group: 'world' },
  { code: 'bg',  name: 'Bulgarian',    flag: '🇧🇬', n: 'Български',         group: 'world' },
  { code: 'hr',  name: 'Croatian',     flag: '🇭🇷', n: 'Hrvatski',          group: 'world' },
  { code: 'sr',  name: 'Serbian',      flag: '🇷🇸', n: 'Srpski',            group: 'world' },
  { code: 'ka',  name: 'Georgian',     flag: '🇬🇪', n: 'ქართული',           group: 'world' },
  { code: 'hy',  name: 'Armenian',     flag: '🇦🇲', n: 'Հայերեն',           group: 'world' },
  { code: 'az',  name: 'Azerbaijani',  flag: '🇦🇿', n: 'Azərbaycan',        group: 'world' },
  { code: 'kk',  name: 'Kazakh',       flag: '🇰🇿', n: 'Қазақша',           group: 'world' },
  { code: 'my',  name: 'Burmese',      flag: '🇲🇲', n: 'မြန်မာဘာသာ',       group: 'world' },
  { code: 'km',  name: 'Khmer',        flag: '🇰🇭', n: 'ភាសាខ្មែរ',         group: 'world' },
  { code: 'si',  name: 'Sinhala',      flag: '🇱🇰', n: 'සිංහල',             group: 'world' },
  { code: 'af',  name: 'Afrikaans',    flag: '🇿🇦', n: 'Afrikaans',         group: 'world' },
  { code: 'mn',  name: 'Mongolian',    flag: '🇲🇳', n: 'Монгол',            group: 'world' },
  { code: 'am',  name: 'Amharic',      flag: '🇪🇹', n: 'አማርኛ',              group: 'world' },
  { code: 'cy',  name: 'Welsh',        flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', n: 'Cymraeg',     group: 'world' },
  { code: 'ca',  name: 'Catalan',      flag: '🇪🇸', n: 'Català',            group: 'world' },
  { code: 'eu',  name: 'Basque',       flag: '🏴', n: 'Euskara',            group: 'world' },
  { code: 'lt',  name: 'Lithuanian',   flag: '🇱🇹', n: 'Lietuvių',          group: 'world' },
  { code: 'lv',  name: 'Latvian',      flag: '🇱🇻', n: 'Latviešu',          group: 'world' },
  { code: 'et',  name: 'Estonian',     flag: '🇪🇪', n: 'Eesti',             group: 'world' },
];

const AUTO_LANG = { code: 'auto', name: 'Auto Detect', flag: '🔍', n: 'Auto', group: 'auto' };
const ALL_LANGS_WITH_AUTO = [AUTO_LANG, ...INDIA_LANGS, ...WORLD_LANGS];
const ALL_LANGS_NO_AUTO = [...INDIA_LANGS, ...WORLD_LANGS];

// Speech Recognition language codes (BCP-47)
const SR_LANG = {
  'en':'en-US','hi':'hi-IN','bn':'bn-IN','te':'te-IN','mr':'mr-IN',
  'ta':'ta-IN','gu':'gu-IN','kn':'kn-IN','ml':'ml-IN','pa':'pa-IN',
  'ur':'ur-PK','or':'or-IN','as':'as-IN','ne':'ne-NP','sa':'sa-IN',
  'mai':'hi-IN','kok':'mr-IN','doi':'hi-IN','mni':'bn-IN',
  'bho':'hi-IN','raj':'hi-IN','sat':'hi-IN','sd':'ur-PK','ks':'ur-PK',
  'es':'es-ES','fr':'fr-FR','de':'de-DE','zh':'zh-CN',
  'ja':'ja-JP','ar':'ar-SA','ru':'ru-RU','pt':'pt-BR','it':'it-IT',
  'ko':'ko-KR','tr':'tr-TR','nl':'nl-NL','pl':'pl-PL','th':'th-TH',
  'vi':'vi-VN','id':'id-ID','fa':'fa-IR','sw':'sw-KE','uk':'uk-UA',
  'ro':'ro-RO','cs':'cs-CZ','sv':'sv-SE','hu':'hu-HU','el':'el-GR',
  'da':'da-DK','fi':'fi-FI','he':'iw-IL','ms':'ms-MY','fil':'fil-PH',
  'sk':'sk-SK','bg':'bg-BG','hr':'hr-HR','sr':'sr-RS',
  'ka':'ka-GE','hy':'hy-AM','az':'az-AZ','kk':'kk-KZ',
  'my':'my-MM','km':'km-KH','si':'si-LK','af':'af-ZA',
  'ca':'ca-ES','eu':'eu-ES','cy':'cy-GB','lt':'lt-LT','lv':'lv-LV','et':'et-EE',
};

// Language code normalization for Google Translate
const TRANSLATE_MAP = {
  'zh':'zh-CN','bho':'hi','raj':'hi','awa':'hi','hne':'hi',
  'kok':'mr','mai':'hi','doi':'hi','mni':'bn','sat':'hi',
  'bo':'hi','ks':'ur','sd':'ur','fil':'tl','iw':'he',
  'or':'or',
};

// Browser TTS voice language mapping
const TTS_LANG_MAP = {
  'hi':'hi-IN','bn':'bn-IN','te':'te-IN','mr':'mr-IN','ta':'ta-IN',
  'gu':'gu-IN','kn':'kn-IN','ml':'ml-IN','pa':'pa-IN','ur':'ur-PK',
  'ne':'ne-NP','si':'si-LK','en':'en-US','es':'es-ES','fr':'fr-FR',
  'de':'de-DE','zh':'zh-CN','ja':'ja-JP','ar':'ar-SA','ru':'ru-RU',
  'pt':'pt-BR','it':'it-IT','ko':'ko-KR','tr':'tr-TR','nl':'nl-NL',
  'pl':'pl-PL','th':'th-TH','vi':'vi-VN','id':'id-ID','fa':'fa-IR',
  'uk':'uk-UA','ro':'ro-RO','cs':'cs-CZ','sv':'sv-SE','hu':'hu-HU',
  'el':'el-GR','da':'da-DK','fi':'fi-FI','he':'iw-IL','ms':'ms-MY',
  'sk':'sk-SK','bg':'bg-BG','hr':'hr-HR','sr':'sr-RS','ca':'ca-ES',
  'eu':'eu-ES','cy':'cy-GB','lt':'lt-LT','lv':'lv-LV','et':'et-EE',
  'ka':'ka-GE','hy':'hy-AM','az':'az-AZ','af':'af-ZA',
  // Fallbacks for unsupported
  'or':'hi-IN','as':'bn-IN','mai':'hi-IN','kok':'mr-IN','doi':'hi-IN',
  'mni':'bn-IN','sat':'hi-IN','bho':'hi-IN','raj':'hi-IN','sd':'ur-PK',
  'ks':'ur-PK','sa':'hi-IN',
};

const getLang = (code) => {
  if (code === 'auto') return AUTO_LANG;
  return ALL_LANGS_NO_AUTO.find(l => l.code === code) || { code, name: code?.toUpperCase(), flag: '🌐', group: 'world' };
};

/* ══════════════════════════════════════════════════════
   TTS ENGINE — Backend first, Browser fallback
══════════════════════════════════════════════════════ */
async function speakWithTTS(text, langCode, BACKEND_URL, speed = 1.0) {
  const ttsLang = TTS_LANG_MAP[langCode] || langCode;
  
  // 1. Try Backend TTS first
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout
    const res = await fetch(`${BACKEND_URL}/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 2000), lang: langCode }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = speed;
      return new Promise((resolve, reject) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(audio); };
        audio.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Audio play failed')); };
        audio.play().catch(reject);
      }).then(() => audio).catch(async () => {
        // If playback fails, fall through to browser TTS
        return browserTTS(text, ttsLang, speed);
      });
    }
  } catch (e) {
    console.warn('Backend TTS failed, using browser TTS:', e.message);
  }
  
  // 2. Fallback: Browser SpeechSynthesis
  return browserTTS(text, ttsLang, speed);
}

function browserTTS(text, bcp47Lang, speed = 1.0) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) { reject(new Error('TTS not available')); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = bcp47Lang || 'hi-IN';
    utter.rate = speed;
    utter.pitch = 1;
    
    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang === bcp47Lang) ||
                  voices.find(v => v.lang.startsWith(bcp47Lang?.split('-')[0]));
    if (match) utter.voice = match;
    
    utter.onend = () => resolve(null);
    utter.onerror = (e) => reject(new Error(e.error || 'Speech failed'));
    window.speechSynthesis.speak(utter);
    resolve(null); // Browser TTS doesn't need to return audio object
  });
}

/* ══════════════════════════════════════════════════════
   TRANSLATION ENGINE — Backend + MyMemory fallback
══════════════════════════════════════════════════════ */
async function translateText(text, source, target, BACKEND_URL) {
  // Normalize language codes
  const normalSrc = source === 'auto' ? 'auto' : (TRANSLATE_MAP[source] || source);
  const normalTgt = TRANSLATE_MAP[target] || target;
  
  // 1. Try Backend (Google Translate via deep-translator)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${BACKEND_URL}/translate-only`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source: normalSrc, target: normalTgt }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (data.success && data.translated_text) {
      return { text: data.translated_text, detected: data.detected_language || null, source: 'backend' };
    }
  } catch (e) {
    console.warn('Backend translate failed:', e.message);
  }
  
  // 2. Fallback: MyMemory API (free, no key needed)
  try {
    const langPair = `${normalSrc === 'auto' ? 'en' : normalSrc}|${normalTgt}`;
    const encoded = encodeURIComponent(text.slice(0, 500));
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encoded}&langpair=${langPair}`);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return { text: data.responseData.translatedText, detected: null, source: 'mymemory' };
    }
  } catch (e) {
    console.warn('MyMemory fallback failed:', e.message);
  }
  
  throw new Error('Translation failed. Kripaya internet check karein.');
}

/* ══════════════════════════════════════════════════════
   LANGUAGE SELECTOR DROPDOWN
══════════════════════════════════════════════════════ */
function LangSelect({ value, onChange, sourceMode = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('india');
  const ref = useRef(null);

  const baseOptions = sourceMode ? ALL_LANGS_WITH_AUTO : ALL_LANGS_NO_AUTO;

  const filtered = search.trim()
    ? baseOptions.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        (l.n && l.n.toLowerCase().includes(search.toLowerCase())) ||
        l.code.toLowerCase().includes(search.toLowerCase())
      )
    : baseOptions.filter(l => {
        if (tab === 'india') return l.group === 'india' || l.group === 'auto';
        if (tab === 'world') return l.group === 'world' || l.group === 'auto';
        return true;
      });

  const cur = getLang(value);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-transparent hover:bg-white/10 transition-all text-white font-semibold text-sm"
      >
        <span className="text-base">{cur.flag}</span>
        <span className="max-w-[90px] truncate">{cur.name}</span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-[200] mt-1 w-72 bg-[#141c2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-2">
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search language..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
            />
          </div>
          {!search.trim() && (
            <div className="flex border-b border-white/5 px-2 gap-1">
              {[['india','🇮🇳 भारत','orange'],['world','🌍 World','blue'],['all','All','emerald']].map(([t,label,col]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg mb-1 transition-all
                    ${tab === t ? `text-${col}-400 bg-${col}-500/10` : 'text-slate-500 hover:text-slate-300'}`}>
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.map(l => (
              <button key={l.code}
                onClick={() => { onChange(l.code); setOpen(false); setSearch(''); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left
                  ${value === l.code ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-white/10'}`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="font-medium flex-1">{l.name}</span>
                <span className="text-xs text-slate-500">{l.n !== l.name && l.n}</span>
                {value === l.code && <Check size={13} className="flex-shrink-0 text-white" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">"{search}" nahi mila 😔</p>
            )}
          </div>
          <div className="px-3 py-2 border-t border-white/5 text-center">
            <span className="text-xs text-slate-600">🇮🇳 {INDIA_LANGS.length} Indian · 🌍 {WORLD_LANGS.length} World</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DICTATION SECTION — Bolke Sunao
══════════════════════════════════════════════════════ */
function DictationSection({ BACKEND_URL }) {
  const [dictLang, setDictLang] = useLS('dict_lang', 'hi');
  const [outLang, setOutLang] = useLS('dict_out', 'en');
  const [finalText, setFinalText] = useState('');
  const [interim, setInterim] = useState('');
  const [translated, setTranslated] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingOrig, setIsSpeakingOrig] = useState(false);
  const [isSpeakingTrans, setIsSpeakingTrans] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [micSupported, setMicSupported] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const recognitionRef = useRef(null);
  const currentSpeechRef = useRef(null);

  // Check mic support on mount
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setMicSupported(false);
    // Pre-load voices
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', () => window.speechSynthesis.getVoices());
    }
  }, []);

  const stopCurrentSpeech = () => {
    window.speechSynthesis?.cancel();
    if (currentSpeechRef.current) {
      currentSpeechRef.current.pause?.();
      currentSpeechRef.current = null;
    }
    setIsSpeakingOrig(false);
    setIsSpeakingTrans(false);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error('❌ Yeh browser voice nahi support karta.\nChrome use karein!', { duration: 4000 });
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const lang = SR_LANG[dictLang] || 'hi-IN';
    const r = new SR();
    recognitionRef.current = r;
    r.lang = lang;
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onstart = () => {
      setIsListening(true);
      setInterim('');
      toast.success(`🎤 Boliye... (${getLang(dictLang).name})`, { duration: 2000, id: 'mic-on' });
    };

    r.onresult = (e) => {
      let int = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          setFinalText(prev => (prev ? prev + ' ' : '') + t);
          setInterim('');
          setTranslated(''); // clear old translation
        } else {
          int += t;
        }
      }
      setInterim(int);
    };

    r.onerror = (e) => {
      setIsListening(false);
      setInterim('');
      recognitionRef.current = null;
      if (e.error === 'not-allowed') {
        toast.error('🚫 Mic permission denied!\nBrowser settings mein allow karein.', { duration: 5000 });
      } else if (e.error === 'no-speech') {
        toast('🔇 Awaaz nahi aayi, dobara try karein', { icon: '⚠️' });
      } else if (e.error !== 'aborted') {
        toast.error(`Mic error: ${e.error}`);
      }
    };

    r.onend = () => {
      setIsListening(false);
      setInterim('');
      recognitionRef.current = null;
    };

    try {
      r.start();
    } catch (err) {
      setIsListening(false);
      toast.error('Mic start nahi hua: ' + err.message);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterim('');
  };

  const speakOriginal = async () => {
    const text = finalText.trim();
    if (!text) { toast.error('Pehle kuch bolen ya likhein!'); return; }
    if (isSpeakingOrig) { stopCurrentSpeech(); return; }
    stopCurrentSpeech();
    setIsSpeakingOrig(true);
    try {
      await speakWithTTS(text, dictLang, BACKEND_URL, speed);
    } catch (e) {
      toast.error('Awaz nahi baji: ' + e.message);
    } finally {
      setIsSpeakingOrig(false);
    }
  };

  const doTranslateAndSpeak = async () => {
    const text = finalText.trim();
    if (!text) { toast.error('Pehle kuch bolen ya likhein!'); return; }
    stopCurrentSpeech();
    setIsTranslating(true);
    try {
      const result = await translateText(text, dictLang, outLang, BACKEND_URL);
      setTranslated(result.text);
      toast.success('✅ Translate ho gaya!', { duration: 1500 });
      // Auto speak
      setIsSpeakingTrans(true);
      try {
        await speakWithTTS(result.text, outLang, BACKEND_URL, speed);
      } catch (e) {
        toast.error('Awaaz nahi baji lekin translation ho gayi');
      } finally {
        setIsSpeakingTrans(false);
      }
    } catch (e) {
      toast.error(e.message || 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  const speakTranslated = async () => {
    if (!translated) return;
    if (isSpeakingTrans) { stopCurrentSpeech(); return; }
    stopCurrentSpeech();
    setIsSpeakingTrans(true);
    try {
      await speakWithTTS(translated, outLang, BACKEND_URL, speed);
    } catch (e) {
      toast.error('Awaz nahi baji: ' + e.message);
    } finally {
      setIsSpeakingTrans(false);
    }
  };

  /* ── DOWNLOAD DICTATION AUDIO ── */
  const downloadDictationAudio = async (text, lang, label) => {
    if (!text?.trim()) { toast.error('Koi text nahi hai download karne ke liye!'); return; }
    if (isDownloading) return;
    setIsDownloading(true);
    const langInfo = getLang(lang);
    const toastId = toast.loading(`⬇️ ${langInfo.flag} Audio download ho raha hai...`);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${BACKEND_URL}/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 2000), lang }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `IndiaSearch_${label}_${langInfo.name.replace(/\s+/g, '_')}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`✅ ${langInfo.flag} Audio download shuru ho gaya!`, { id: toastId, duration: 3000 });
      } else {
        throw new Error('Server se audio nahi mili');
      }
    } catch (e) {
      // Browser TTS fallback via SpeechSynthesis
      try {
        toast.loading('🎙️ Browser se audio bana rahe hain...', { id: toastId });
        const ttsLang = TTS_LANG_MAP[lang] || lang;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = ttsLang;
        utter.rate = speed;
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.lang === ttsLang) || voices.find(v => v.lang.startsWith(ttsLang.split('-')[0]));
        if (match) utter.voice = match;
        window.speechSynthesis.speak(utter);
        // Fallback: just download the text
        utter.onend = () => {
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `IndiaSearch_${label}_${langInfo.name}.txt`;
          document.body.appendChild(a); a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('📄 Text file download ho gayi!', { id: toastId, duration: 3000 });
          setIsDownloading(false);
        };
        return;
      } catch {
        toast.error('Download failed: ' + e.message, { id: toastId });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const clearAll = () => {
    stopListening();
    stopCurrentSpeech();
    setFinalText('');
    setInterim('');
    setTranslated('');
  };

  useEffect(() => () => {
    if (recognitionRef.current) try { recognitionRef.current.abort(); } catch {}
    stopCurrentSpeech();
  }, []);

  const displayText = finalText + (interim ? (finalText ? ' ' : '') + interim : '');

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
          🎙️ Bolke <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Sunao</span>
        </h2>
        <p className="text-slate-500 text-sm">Boliye → Text dikhega → Translate + Awaz mein suniye</p>
      </div>

      {/* Mic not supported warning */}
      {!micSupported && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-red-400 text-sm font-bold">⚠️ Aapka browser voice nahi support karta</p>
          <p className="text-slate-500 text-xs mt-1">Please Chrome ya Edge use karein</p>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-[#1a2236] rounded-2xl border border-white/10 overflow-visible">

        {/* Language Bar */}
        <div className="flex items-center bg-[#141c2e] border-b border-white/5 px-2 py-1 rounded-t-2xl gap-2">
          <div className="flex-1">
            <p className="text-xs text-slate-600 px-2">Aap bolenge</p>
            <LangSelect value={dictLang} onChange={v => { setDictLang(v); setFinalText(''); setTranslated(''); setInterim(''); }} sourceMode />
          </div>
          <button
            onClick={() => { const t = dictLang; setDictLang(outLang); setOutLang(t); setFinalText(''); setTranslated(''); setInterim(''); }}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90 flex-shrink-0"
            title="Languages swap karein"
          >
            <ArrowLeftRight size={17} />
          </button>
          <div className="flex-1 flex justify-end">
            <div>
              <p className="text-xs text-slate-600 px-2 text-right">Sunai dega</p>
              <LangSelect value={outLang} onChange={v => { setOutLang(v); setTranslated(''); }} />
            </div>
          </div>
        </div>

        {/* Text Display Area */}
        <div className="p-4">
          <div className="relative min-h-[150px] bg-[#0d1420] rounded-xl border border-white/5 p-4 mb-3">
            {displayText ? (
              <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
                {finalText}
                {interim && <span className="text-slate-500 italic"> {interim}...</span>}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500/20 animate-pulse' : 'bg-white/5'}`}>
                  <Mic size={24} className={isListening ? 'text-red-400' : 'text-slate-600'} />
                </div>
                <p className="text-slate-600 text-sm">
                  {isListening ? `Bol rahe hain... (${getLang(dictLang).name})` : 'Niche ka button dabao aur bolna shuru karo'}
                </p>
                <p className="text-slate-700 text-xs">Ya seedha text likhein</p>
              </div>
            )}
            {isListening && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500/20 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-400 font-bold">LIVE</span>
              </div>
            )}
          </div>

          {/* Manual text input */}
          <textarea
            value={finalText}
            onChange={e => { setFinalText(e.target.value); setTranslated(''); }}
            placeholder="Ya yahan seedha type karein..."
            rows={2}
            className="w-full bg-[#0d1420] border border-white/5 rounded-xl px-4 py-2.5 text-slate-300 placeholder:text-slate-700 text-sm outline-none focus:border-blue-500/50 resize-none transition-all mb-3"
          />

          {/* BIG MIC BUTTON */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!micSupported}
            className={`w-full h-14 rounded-xl font-black text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg mb-3
              ${isListening
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30'
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-orange-500/20 disabled:opacity-50'}`}
          >
            {isListening
              ? <><div className="flex gap-0.5">{[...Array(4)].map((_,i) => <div key={i} className="w-1 bg-white rounded-full animate-pulse" style={{height: `${12+i*4}px`, animationDelay: `${i*0.1}s`}} />)}</div> Rokein (Stop)</>
              : <><Mic size={22} /> 🎤 Bolna Shuru Karein</>
            }
          </button>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={speakOriginal}
              disabled={!finalText.trim()}
              className={`h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]
                ${isSpeakingOrig ? 'bg-orange-600 text-white' : 'bg-[#0d1420] border border-white/10 text-slate-300 hover:border-orange-500/50 hover:text-white'}`}
            >
              {isSpeakingOrig ? <><Square size={16} /> Rok</> : <><Volume2 size={16} /> {getLang(dictLang).flag} Sunao</>}
            </button>
            <button
              onClick={doTranslateAndSpeak}
              disabled={!finalText.trim() || isTranslating}
              className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              {isTranslating
                ? <><Loader2 size={16} className="animate-spin" /> Translating...</>
                : <><Languages size={16} /> {getLang(outLang).flag} Translate + Sunao</>}
            </button>
          </div>

          {/* Clear */}
          {(finalText || translated) && (
            <button onClick={clearAll} className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors py-1">
              <Trash2 size={12} /> Saaf Karein
            </button>
          )}
        </div>

        {/* Translation Output */}
        {translated && (
          <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-emerald-500/20">
            <div className="flex items-center justify-between bg-emerald-500/5 px-4 py-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                {getLang(outLang).flag} {getLang(outLang).name} Translation
              </span>
              <div className="flex gap-1.5">
                <button onClick={speakTranslated}
                  className={`p-1.5 rounded-lg transition-all ${isSpeakingTrans ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-500 hover:text-emerald-400'}`}>
                  {isSpeakingTrans ? <Square size={14} /> : <Volume2 size={14} />}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(translated); toast.success('Copied!'); }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-all">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="px-4 py-3 bg-[#0d1420]">
              <p className="text-emerald-100 text-base leading-relaxed">{translated}</p>
            </div>
            {/* Download Button */}
            <button
              onClick={() => downloadDictationAudio(translated, outLang, 'translation')}
              disabled={isDownloading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 font-bold text-sm transition-all active:scale-[0.99]
                ${isDownloading
                  ? 'bg-emerald-700/30 text-emerald-500 cursor-wait'
                  : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300'}`}
            >
              {isDownloading
                ? <><Loader2 size={14} className="animate-spin" /> Audio ban raha hai...</>
                : <><Download size={14} /> {getLang(outLang).flag} {getLang(outLang).name} Audio Download (MP3)</>}
            </button>
          </div>
        )}

        {/* Speed + Info */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${speed === s ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}>
                {s}x
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-700">{finalText.length} chars</span>
        </div>
      </div>

      {/* Info pills */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {['🎤 Voice Dictation', `🇮🇳 ${INDIA_LANGS.length} Indian`, `🌍 ${WORLD_LANGS.length} World`, '🔊 Auto TTS', '⚡ Real-time'].map(f => (
          <span key={f} className="px-2.5 py-1 bg-[#1a2236] rounded-full text-xs text-slate-500 border border-white/5">{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRANSLATOR SECTION
══════════════════════════════════════════════════════ */
function TranslatorSection({ BACKEND_URL }) {
  const [mode, setMode] = useState('text');
  const [srcLang, setSrcLang] = useLS('t_src', 'auto');
  const [tgtLang, setTgtLang] = useLS('t_tgt', 'hi');
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
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useLS('t_autospeak', true);
  const [pipelineStatus, setPipelineStatus] = useState(''); // 'detecting'|'translating'|'speaking'|''
  const [isDownloading, setIsDownloading] = useState(false);

  // Conversation mode
  const [convLangIn, setConvLangIn] = useLS('c_in', 'en');
  const [convLangOut, setConvLangOut] = useLS('c_out', 'hi');
  const [convHistory, setConvHistory] = useState([]);
  const [convStatus, setConvStatus] = useState('idle');
  const [convInterim, setConvInterim] = useState('');
  const [headphoneMode, setHeadphoneMode] = useLS('headphone', false);
  const [isConvActive, setIsConvActive] = useState(false);
  const isConvActiveRef = useRef(false);

  const recognitionRef = useRef(null);
  const debounceRef = useRef(null);
  const convRecognitionRef = useRef(null);
  const convSilenceRef = useRef(null);
  const convAccRef = useRef('');

  /* ── TRANSLATE ── */
  const doTranslate = useCallback(async (text, src, tgt, silent = false) => {
    if (!text?.trim()) { setOutputText(''); setDetectedLang(''); return; }
    setIsTranslating(true);
    try {
      const result = await translateText(text, src, tgt, BACKEND_URL);
      setOutputText(result.text);
      if (result.detected) setDetectedLang(result.detected);
      if (!silent) toast.success('Translated!', { duration: 1000, icon: '✅' });
    } catch (err) {
      if (!silent) toast.error(err.message || 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!inputText.trim()) { setOutputText(''); setDetectedLang(''); return; }
    if (pipelineStatus) return; // Don't auto-translate while voice pipeline is running
    const delay = inputText.length > 200 ? 800 : 450;
    debounceRef.current = setTimeout(() => doTranslate(inputText, srcLang, tgtLang, true), delay);
    return () => clearTimeout(debounceRef.current);
  }, [inputText, srcLang, tgtLang, pipelineStatus]);

  const swapLangs = () => {
    if (srcLang === 'auto') return;
    const prev = outputText;
    setSrcLang(tgtLang); setTgtLang(srcLang);
    setInputText(prev); setOutputText(''); setDetectedLang('');
  };

  /* ── TTS SPEAK ── */
  const speakInput = async () => {
    if (isSpeakingIn) { window.speechSynthesis?.cancel(); setIsSpeakingIn(false); return; }
    const lang = srcLang === 'auto' ? (detectedLang || voiceLang) : srcLang;
    setIsSpeakingIn(true);
    try { await speakWithTTS(inputText, lang, BACKEND_URL); } catch {} finally { setIsSpeakingIn(false); }
  };

  const speakOutput = async () => {
    if (isSpeakingOut) { window.speechSynthesis?.cancel(); setIsSpeakingOut(false); return; }
    setIsSpeakingOut(true);
    try { await speakWithTTS(outputText, tgtLang, BACKEND_URL); } catch {} finally { setIsSpeakingOut(false); }
  };

  const copyIn = async () => { await navigator.clipboard.writeText(inputText); setCopiedIn(true); setTimeout(() => setCopiedIn(false), 2000); };
  const copyOut = async () => { await navigator.clipboard.writeText(outputText); setCopiedOut(true); setTimeout(() => setCopiedOut(false), 2000); };

  /* ── DOWNLOAD TRANSLATED AUDIO ── */
  const downloadTranslatedAudio = async () => {
    if (!outputText.trim()) { toast.error('Pehle koi text translate karein!'); return; }
    if (isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading(`⬇️ Audio download ho raha hai... (${getLang(tgtLang).name})`);
    try {
      // Try backend TTS first (best quality)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${BACKEND_URL}/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: outputText.slice(0, 2000), lang: tgtLang }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const langName = getLang(tgtLang).name.replace(/\s+/g, '_');
        a.href = url;
        a.download = `IndiaSearch_${langName}_translation.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`✅ Audio download shuru ho gaya! (${getLang(tgtLang).name})`, { id: toastId, duration: 3000 });
      } else {
        throw new Error('Backend TTS failed');
      }
    } catch (e) {
      // Fallback: Use browser SpeechSynthesis + MediaRecorder to record audio
      try {
        toast.loading('🎙️ Browser se audio bana rahe hain...', { id: toastId });
        const ttsLang = TTS_LANG_MAP[tgtLang] || tgtLang;
        const utter = new SpeechSynthesisUtterance(outputText);
        utter.lang = ttsLang;
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.lang === ttsLang) || voices.find(v => v.lang.startsWith(ttsLang.split('-')[0]));
        if (match) utter.voice = match;

        // MediaRecorder approach — record output
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const dest = ctx.createMediaStreamDestination();
        const recorder = new MediaRecorder(dest.stream);
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `IndiaSearch_${getLang(tgtLang).name}_translation.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('✅ Audio download shuru ho gaya!', { id: toastId, duration: 3000 });
          setIsDownloading(false);
        };
        recorder.start();
        utter.onend = () => { recorder.stop(); ctx.close(); };
        window.speechSynthesis.speak(utter);
        return; // early return, onstop handles setIsDownloading
      } catch (recordErr) {
        // Final fallback: download text file
        const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `IndiaSearch_${getLang(tgtLang).name}_translation.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('📄 Text file download ho gayi!', { id: toastId, duration: 3000 });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  /* ── VOICE INPUT — Auto-Detect → Translate → Speak Pipeline ── */
  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Chrome browser use karein voice ke liye!'); return; }
    if (recognitionRef.current) recognitionRef.current.abort();

    // When srcLang is 'auto', we use broad language recognition
    // The Web Speech API will try to detect and transcribe in the most likely language
    const recogLang = srcLang === 'auto'
      ? 'hi-IN'   // Chrome auto-detects best from a starting point; hi-IN covers India broadly
      : (SR_LANG[srcLang] || 'en-US');

    const r = new SR();
    recognitionRef.current = r;
    r.lang = recogLang;
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;

    let collectedFinal = '';

    r.onstart = () => {
      setIsListening(true);
      setInterimText('');
      setPipelineStatus('');
      toast.success(
        srcLang === 'auto'
          ? '🎤 Boliye... (Koi bhi language mein)'
          : `🎤 Boliye... (${getLang(srcLang).name})`,
        { duration: 2000, id: 'mic-toast' }
      );
    };

    r.onresult = (e) => {
      let int = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          collectedFinal += (collectedFinal ? ' ' : '') + t;
          setInputText(collectedFinal);
          setInterimText('');
        } else {
          int += t;
        }
      }
      setInterimText(int);
    };

    r.onerror = (e) => {
      setIsListening(false);
      setInterimText('');
      setPipelineStatus('');
      recognitionRef.current = null;
      if (e.error === 'not-allowed') toast.error('🚫 Mic permission denied! Browser settings mein allow karein.');
      else if (e.error === 'no-speech') toast('🔇 Koi awaaz nahi aayi, dobara try karein', { icon: '⚠️' });
      else if (e.error !== 'aborted') toast.error('Mic error: ' + e.error);
    };

    r.onend = async () => {
      setIsListening(false);
      setInterimText('');
      recognitionRef.current = null;

      const spoken = collectedFinal.trim();
      if (!spoken) return;

      // Auto-pipeline: Translate → Speak
      if (autoSpeakEnabled) {
        setPipelineStatus('translating');
        try {
          const result = await translateText(spoken, srcLang, tgtLang, BACKEND_URL);
          setOutputText(result.text);
          if (result.detected) setDetectedLang(result.detected);

          setPipelineStatus('speaking');
          window.speechSynthesis?.cancel();
          setIsSpeakingOut(true);
          try {
            await speakWithTTS(result.text, tgtLang, BACKEND_URL);
          } catch {}
          setIsSpeakingOut(false);
        } catch (err) {
          toast.error('Translation failed: ' + (err.message || 'Try again'));
        } finally {
          setPipelineStatus('');
        }
      }
    };

    r.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // triggers onend which runs the pipeline
    }
    setIsListening(false);
  };

  /* ── CONVERSATION ── */
  const convProcessSentence = useCallback(async (text) => {
    if (!text.trim()) return;
    const id = Date.now();
    setConvHistory(prev => [...prev, { id, original: text, translated: '', status: 'translating' }]);
    setConvStatus('translating');
    try {
      const result = await translateText(text, convLangIn, convLangOut, BACKEND_URL);
      setConvHistory(prev => prev.map(h => h.id === id ? { ...h, translated: result.text, status: 'speaking' } : h));
      setConvStatus('speaking');
      await speakWithTTS(result.text, convLangOut, BACKEND_URL);
      setConvHistory(prev => prev.map(h => h.id === id ? { ...h, status: 'done' } : h));
      if (isConvActiveRef.current) setConvStatus('listening');
    } catch (err) {
      setConvHistory(prev => prev.map(h => h.id === id ? { ...h, status: 'error' } : h));
      console.error('Conv error:', err);
    }
  }, [BACKEND_URL, convLangIn, convLangOut]);

  const startConversation = () => {
    if (!headphoneMode) { toast.error('⚠️ Pehle Headphone Mode enable karein!', { duration: 4000 }); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Chrome use karein!'); return; }
    isConvActiveRef.current = true;
    setIsConvActive(true);
    setConvStatus('listening');
    convAccRef.current = '';
    const r = new SR();
    convRecognitionRef.current = r;
    r.lang = SR_LANG[convLangIn] || 'en-US';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let int = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          convAccRef.current += ' ' + e.results[i][0].transcript;
          clearTimeout(convSilenceRef.current);
          convSilenceRef.current = setTimeout(() => {
            const s = convAccRef.current.trim();
            if (s) { convProcessSentence(s); convAccRef.current = ''; setConvInterim(''); }
          }, 1200);
        } else int = e.results[i][0].transcript;
      }
      setConvInterim((convAccRef.current + ' ' + int).trim());
    };
    r.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') toast.error('Mic: ' + e.error); };
    r.onend = () => { if (isConvActiveRef.current) setTimeout(() => { if (isConvActiveRef.current && convRecognitionRef.current) try { convRecognitionRef.current.start(); } catch {} }, 300); };
    r.start();
  };

  const stopConversation = () => {
    isConvActiveRef.current = false;
    setIsConvActive(false);
    setConvStatus('idle');
    setConvInterim('');
    clearTimeout(convSilenceRef.current);
    if (convRecognitionRef.current) { try { convRecognitionRef.current.abort(); } catch {} convRecognitionRef.current = null; }
    window.speechSynthesis?.cancel();
  };

  useEffect(() => () => {
    stopConversation();
    if (recognitionRef.current) recognitionRef.current.abort();
    window.speechSynthesis?.cancel();
  }, []);

  const cscMap = {
    idle:        { color: 'text-slate-500', pulse: false, label: 'Ready' },
    listening:   { color: 'text-blue-400',  pulse: true,  label: '🎤 Sun raha hoon...' },
    translating: { color: 'text-amber-400', pulse: true,  label: '⚡ Translate ho raha hai...' },
    speaking:    { color: 'text-emerald-400',pulse: true, label: '🔊 Bol raha hoon...' },
    error:       { color: 'text-red-400',   pulse: false, label: 'Error' },
  };
  const csc = cscMap[convStatus] || cscMap.idle;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4 justify-center">
        {[['text', <Type size={15}/>, 'Text'], ['conversation', <Headphones size={15}/>, 'Conversation']].map(([m, icon, label]) => (
          <button key={m} onClick={() => { setMode(m); if (m === 'text') stopConversation(); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
              ${mode === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-[#1e2535] text-slate-400 hover:text-white'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── TEXT MODE ── */}
      {mode === 'text' && (
        <div className="rounded-2xl overflow-visible border border-white/10 bg-[#1a2236] shadow-2xl">
          {/* Lang Bar */}
          <div className="flex items-center bg-[#141c2e] border-b border-white/5 px-2 py-1">
            <div className="flex-1 min-w-0">
              <LangSelect value={srcLang} onChange={v => { setSrcLang(v); setDetectedLang(''); }} sourceMode />
            </div>
            {srcLang === 'auto' && detectedLang && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20 mx-1 flex-shrink-0">
                <Globe size={10} /> {getLang(detectedLang).flag} {getLang(detectedLang).name}
              </span>
            )}
            <button onClick={swapLangs} disabled={srcLang === 'auto'} title="Swap"
              className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white flex-shrink-0 mx-1 active:scale-90 transition-all">
              <ArrowLeftRight size={18} />
            </button>
            <div className="flex-1 min-w-0 flex justify-end">
              <LangSelect value={tgtLang} onChange={setTgtLang} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-b border-white/5">
            <textarea
              value={inputText}
              onChange={e => { if (e.target.value.length <= 10000) { setInputText(e.target.value); setPipelineStatus(''); } }}
              placeholder={srcLang === 'auto' ? 'Koi bhi language mein type karein ya mic se bolein...' : `Yahan type karein... (${getLang(srcLang).name})`}
              className="w-full bg-transparent px-4 pt-4 pb-2 outline-none resize-none text-xl text-white placeholder:text-slate-600 leading-relaxed min-h-[120px]"
            />
            {interimText && (
              <div className="px-4 pb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                <span className="text-slate-500 italic text-base">{interimText}...</span>
              </div>
            )}
            {/* Toolbar Row */}
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-1">
                {inputText && <button onClick={speakInput} className={`p-1.5 rounded-lg transition-all ${isSpeakingIn ? 'text-blue-400 animate-pulse' : 'text-slate-500 hover:text-slate-300'}`}><Volume2 size={17} /></button>}
                {inputText && <button onClick={copyIn} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-all">{copiedIn ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}</button>}
              </div>
              <div className="flex items-center gap-2">
                {inputText && <button onClick={() => { setInputText(''); setOutputText(''); setDetectedLang(''); setPipelineStatus(''); }} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 transition-all"><Trash2 size={15} /></button>}
                <span className={`text-xs font-mono ${inputText.length > 9000 ? 'text-orange-400' : 'text-slate-700'}`}>{inputText.length}/10k</span>
              </div>
            </div>
          </div>

          {/* BIG MIC BUTTON + Pipeline Status */}
          <div className="px-4 pt-4 pb-2 space-y-3">

            {/* Auto-speak toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">🎤 Boliye → {getLang(tgtLang).flag} Auto-translate + Sunai dega</span>
              <button
                onClick={() => setAutoSpeakEnabled(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border
                  ${autoSpeakEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
              >
                <Volume2 size={11} /> {autoSpeakEnabled ? 'Auto-Speak ON' : 'Auto-Speak OFF'}
              </button>
            </div>

            {/* THE BIG MIC BUTTON */}
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={!!pipelineStatus}
              className={`w-full h-16 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl disabled:opacity-70
                ${isListening
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30'
                  : pipelineStatus === 'translating'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/30 cursor-wait'
                    : pipelineStatus === 'speaking'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/30 cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'}`}
            >
              {isListening ? (
                <>
                  <div className="flex items-end gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 bg-white rounded-full animate-pulse"
                        style={{ height: `${10 + i * 5}px`, animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
                  <span>Rok do → Translate Hoga</span>
                </>
              ) : pipelineStatus === 'translating' ? (
                <><Loader2 size={22} className="animate-spin" /> ⚡ Translate ho raha hai...</>
              ) : pipelineStatus === 'speaking' ? (
                <><Volume2 size={22} className="animate-pulse" /> {getLang(tgtLang).flag} Bol raha hai...</>
              ) : (
                <><Mic size={22} /> 🎤 Boliye — Auto-Translate + Sunai Dega</>
              )}
            </button>

            {/* Source language hint when auto */}
            {srcLang === 'auto' && (
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs text-slate-600">Koi bhi language mein boliye →</span>
                <span className="text-xs font-bold text-blue-400">{getLang(tgtLang).flag} {getLang(tgtLang).name} mein translate hoga + sunai dega</span>
              </div>
            )}
            {srcLang !== 'auto' && (
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs text-slate-600">{getLang(srcLang).flag} {getLang(srcLang).name} mein boliye →</span>
                <span className="text-xs font-bold text-blue-400">{getLang(tgtLang).flag} {getLang(tgtLang).name} mein sunai dega</span>
              </div>
            )}
          </div>

          {/* Output */}
          <div className="bg-[#141c2e]/50 border-t border-white/5">
            <div className="flex items-center gap-2 px-4 pt-3 pb-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{getLang(tgtLang).flag} {getLang(tgtLang).name}</span>
              {isTranslating && <span className="flex items-center gap-1 text-xs text-blue-400"><Loader2 size={11} className="animate-spin" /> translating...</span>}
              {pipelineStatus === 'speaking' && <span className="flex items-center gap-1 text-xs text-emerald-400"><Volume2 size={11} className="animate-pulse" /> speaking...</span>}
              {detectedLang && srcLang === 'auto' && (
                <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 ml-auto">
                  <Globe size={9} /> Detected: {getLang(detectedLang).flag} {getLang(detectedLang).name}
                </span>
              )}
            </div>
            <div className="px-4 py-3 min-h-[100px]">
              {(pipelineStatus === 'translating' && !outputText) ? (
                <div className="flex items-center gap-2 py-6 justify-center">
                  <Loader2 size={24} className="animate-spin text-blue-500/40" />
                  <span className="text-slate-600 text-sm">⚡ Translate ho raha hai...</span>
                </div>
              ) : outputText ? (
                <p className={`text-xl text-emerald-50 leading-relaxed whitespace-pre-wrap transition-all ${pipelineStatus === 'speaking' ? 'text-emerald-200' : ''}`}>
                  {outputText}
                </p>
              ) : (
                <p className="text-slate-700 italic text-sm">Boliye ya type karein — yahan translation aayega</p>
              )}
            </div>
            {outputText && (
              <div className="flex items-center px-3 pb-3">
                <div className="flex gap-1">
                  <button onClick={speakOutput} title="Sunao"
                    className={`p-2 rounded-xl transition-all ${isSpeakingOut ? 'text-emerald-400 animate-pulse bg-emerald-500/10' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}>
                    {isSpeakingOut ? <Square size={17} /> : <Volume2 size={17} />}
                  </button>
                  <button onClick={copyOut} title="Copy"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                    {copiedOut ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}
                  </button>
                </div>

                {/* DOWNLOAD BUTTON — prominent */}
                <button
                  onClick={downloadTranslatedAudio}
                  disabled={isDownloading}
                  className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg
                    ${isDownloading
                      ? 'bg-blue-600/50 text-blue-300 cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'}`}
                >
                  {isDownloading
                    ? <><Loader2 size={15} className="animate-spin" /> Downloading...</>
                    : <><Download size={15} /> {getLang(tgtLang).flag} Audio Download</>}
                </button>
              </div>
            )}
          </div>

          {/* Manual Translate + Download Row */}
          <div className="p-3 border-t border-white/5 space-y-2">
            <button onClick={() => doTranslate(inputText, srcLang, tgtLang, false)} disabled={isTranslating || !inputText.trim() || !!pipelineStatus}
              className="w-full h-11 bg-[#0d1420] border border-white/10 hover:border-blue-500/40 rounded-xl font-bold text-slate-400 hover:text-white transition-all disabled:opacity-40 active:scale-[0.98] flex items-center justify-center gap-2 text-sm">
              {isTranslating ? <><Loader2 size={15} className="animate-spin" /> Translating...</> : <><Languages size={15} /> Manually Translate (Type kiya hua text)</>}
            </button>

            {/* Full-width Download Button (always visible when outputText exists) */}
            {outputText && (
              <button
                onClick={downloadTranslatedAudio}
                disabled={isDownloading}
                className={`w-full h-12 rounded-xl font-black text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg
                  ${isDownloading
                    ? 'bg-emerald-700/50 text-emerald-300 cursor-wait'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25'}`}
              >
                {isDownloading
                  ? <><Loader2 size={20} className="animate-spin" /> Audio ban raha hai...</>
                  : <><Download size={20} /> {getLang(tgtLang).flag} {getLang(tgtLang).name} Audio Download (MP3)</>}
              </button>
            )}
          </div>
          <div className="px-4 py-2 bg-[#0d1420]/60 rounded-b-2xl text-center">
            <span className="text-xs text-slate-700">🇮🇳 {INDIA_LANGS.length} Indian · 🌍 {WORLD_LANGS.length} World · 🔊 Auto-Speak · ⬇️ Download</span>
          </div>
        </div>
      )}

      {/* ── CONVERSATION MODE ── */}
      {mode === 'conversation' && (
        <div className="rounded-2xl border border-white/10 bg-[#1a2236] shadow-2xl overflow-hidden">
          <div className="bg-[#141c2e] px-4 py-3 border-b border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Headphones size={17} className="text-blue-400" /><span className="font-bold text-white text-sm">Conversation Mode</span></div>
              <button onClick={() => setHeadphoneMode(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                  ${headphoneMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                <Headphones size={12} /> {headphoneMode ? '🎧 ON' : '⚠️ Enable'}
              </button>
            </div>
            {!headphoneMode && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 mb-3">
                <p className="text-xs text-amber-400">⚠️ <strong>Headphones lagaiye!</strong> Bina headphone feedback loop hoga.</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex-1"><p className="text-xs text-slate-500 mb-1">Aap bolenge</p><LangSelect value={convLangIn} onChange={setConvLangIn} /></div>
              <ArrowLeftRight size={15} className="text-slate-600" />
              <div className="flex-1"><p className="text-xs text-slate-500 mb-1">Translate hoga</p><LangSelect value={convLangOut} onChange={setConvLangOut} /></div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 bg-[#141c2e]/50 border-b border-white/5">
            <div className="flex items-center gap-2">
              {isConvActive && <div className={`w-2 h-2 rounded-full bg-current ${csc.color} ${csc.pulse ? 'animate-pulse' : ''}`} />}
              <span className={`text-sm font-bold ${csc.color}`}>{csc.label}</span>
            </div>
            {convInterim && <span className="text-xs text-slate-500 italic max-w-[50%] truncate">{convInterim}</span>}
          </div>
          <div className="min-h-[280px] max-h-[380px] overflow-y-auto p-4 space-y-3">
            {convHistory.length === 0
              ? <div className="flex flex-col items-center justify-center h-56 text-slate-600 gap-3">
                  <MessageSquare size={36} className="opacity-20" />
                  <p className="text-sm text-center">Bolna shuru karein, main translate kar dunga.</p>
                </div>
              : convHistory.map(item => (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-blue-400 mt-1 flex-shrink-0">{getLang(convLangIn).flag}</span>
                      <p className="text-sm text-slate-300 bg-slate-800/50 rounded-xl px-3 py-2 flex-1">{item.original}</p>
                    </div>
                    {item.translated && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-emerald-400 mt-1 flex-shrink-0">{getLang(convLangOut).flag}</span>
                        <div className={`flex-1 flex items-start gap-2 rounded-xl px-3 py-2 transition-all ${item.status === 'speaking' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-[#141c2e]'}`}>
                          <p className="text-sm text-emerald-100 flex-1">{item.translated}</p>
                          {item.status === 'speaking' && <Volume2 size={13} className="text-emerald-400 animate-pulse flex-shrink-0 mt-0.5" />}
                          {item.status === 'done' && <button onClick={() => speakWithTTS(item.translated, convLangOut, BACKEND_URL)} className="text-slate-600 hover:text-emerald-400 transition-colors flex-shrink-0"><Play size={12} /></button>}
                        </div>
                      </div>
                    )}
                    {item.status === 'translating' && <div className="flex items-center gap-2 ml-6 text-xs text-amber-400"><Loader2 size={11} className="animate-spin" /> Translating...</div>}
                  </div>
                ))
            }
          </div>
          <div className="p-4 border-t border-white/5 space-y-3">
            <div className="flex gap-3">
              {!isConvActive
                ? <button onClick={startConversation} disabled={!headphoneMode}
                    className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20">
                    <Mic size={20} /> Conversation Shuru
                  </button>
                : <button onClick={stopConversation}
                    className="flex-1 h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all animate-pulse">
                    <Square size={20} /> Rokein
                  </button>}
              {convHistory.length > 0 && !isConvActive && (
                <button onClick={() => { setConvHistory([]); setConvInterim(''); }}
                  className="px-4 h-14 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-600 text-center">🎧 Headphones best results · Clearly bolein, pause karein</p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
        {[`🇮🇳 ${INDIA_LANGS.length} Indian`, `🌍 ${WORLD_LANGS.length} World`, '🎤 Voice', '🔊 TTS', '🔄 Swap', '💬 Conversation'].map(f => (
          <span key={f} className="px-2.5 py-1 bg-[#1a2236] rounded-full text-xs text-slate-500 border border-white/5">{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useLS('activeTab', 'dictation');
  const [url, setUrl] = useLS('url', '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [targetLang, setTargetLang] = useLS('targetLang', 'hi');
  const [isTranslating, setIsTranslating] = useState(false);

  const videoRef = useRef(null); const canvasRef = useRef(null); const fileInputRef = useRef(null);
  const [visionImage, setVisionImage] = useState(null); const [isCameraActive, setIsCameraActive] = useState(false);
  const [visionExtractedText, setVisionExtractedText] = useState(''); const [visionTranslatedText, setVisionTranslatedText] = useState('');
  const [visionSrc, setVisionSrc] = useLS('visionSrc', 'auto'); const [visionTgt, setVisionTgt] = useLS('visionTgt', 'hi');

  const mathVideoRef = useRef(null); const mathCanvasRef = useRef(null); const mathFileInputRef = useRef(null);
  const [mathImage, setMathImage] = useState(null); const [isMathCameraActive, setIsMathCameraActive] = useState(false);
  const [mathExtractedText, setMathExtractedText] = useState(''); const [mathSolution, setMathSolution] = useState('');
  const [mathInputText, setMathInputText] = useState('');

  const [creatorText, setCreatorText] = useLS('creatorText', '');
  const [creatorLang, setCreatorLang] = useLS('creatorLang', 'original');

  // Determine backend URL
  const BACKEND_URL = (() => {
    const { hostname, port } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:5001`;
    }
    return 'https://video-downloader-backend-c90x.onrender.com';
  })();

  const detectPlatform = (u) => {
    if (!u) return '🌐';
    const l = u.toLowerCase();
    if (l.includes('youtube.com') || l.includes('youtu.be')) return '🎥 YouTube';
    if (l.includes('instagram.com')) return '📷 Instagram';
    if (l.includes('facebook.com') || l.includes('fb.watch')) return '📘 Facebook';
    if (l.includes('twitter.com') || l.includes('x.com')) return '🐦 Twitter/X';
    if (l.includes('tiktok.com')) return '🎵 TikTok';
    return '🌐 Platform';
  };

  const handleDownload = async () => {
    const u = url.trim(); if (!u) { setError('URL daalen'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${BACKEND_URL}/download`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: u }) });
      const data = await res.json();
      if (res.ok && data.success) { setResult(data); setResultUrl(u); } else { setError(data.error || 'Failed.'); }
    } catch { setError('Connection error. Backend check karein.'); } finally { setLoading(false); }
  };

  const handleConvertToPdf = async () => {
    const u = url.trim(); if (!u) { setError('URL daalen'); return; }
    setLoading(true); setIsTranslating(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/generate-pdf`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: u, target_lang: targetLang }) });
      if (res.ok) {
        const blob = await res.blob(); const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = dlUrl; a.download = `IndiaSearch_${targetLang}.pdf`; a.click(); URL.revokeObjectURL(dlUrl);
      } else { const d = await res.json(); setError(d.error || 'Failed.'); }
    } catch { setError('Server error.'); } finally { setLoading(false); setIsTranslating(false); }
  };

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
    } catch { toast.error('Vision error.'); } finally { setLoading(false); }
  };

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
    try { const res = await fetch(`${BACKEND_URL}/solve-math`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b64 }) }); const d = await res.json(); if (d.success) { setMathExtractedText(d.extracted_text); setMathSolution(d.solution); toast.success('Solved!'); } else { toast.error(d.error || 'Failed.'); } } catch { toast.error('Math error.'); } finally { setLoading(false); }
  };
  const solveMathText = async () => {
    if (!mathInputText) return; setLoading(true); setMathExtractedText(''); setMathSolution(''); setMathImage(null);
    try { const res = await fetch(`${BACKEND_URL}/solve-math`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: mathInputText }) }); const d = await res.json(); if (d.success) { setMathExtractedText(d.extracted_text); setMathSolution(d.solution); toast.success('Solved!'); } else { toast.error(d.error || 'Failed.'); } } catch { toast.error('Math error.'); } finally { setLoading(false); }
  };
  const handleCreatePdf = async () => {
    if (!creatorText) { toast.error('Content daalen!'); return; } setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/generate-pdf-from-text`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: creatorText, target_lang: creatorLang }) });
      if (res.ok) { const blob = await res.blob(); const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = 'IndiaSearch_Document.pdf'; a.click(); URL.revokeObjectURL(u); toast.success('PDF ready!'); }
      else { toast.error('PDF failed.'); }
    } catch { toast.error('Error.'); } finally { setLoading(false); }
  };

  const TABS = [
    { id: 'dictation',  label: 'Dictate',   icon: <Mic size={20} /> },
    { id: 'translator', label: 'Translate',  icon: <Languages size={20} /> },
    { id: 'downloader', label: 'Download',   icon: <Download size={20} /> },
    { id: 'vision',     label: 'Vision',     icon: <Camera size={20} /> },
    { id: 'math',       label: 'Math',       icon: <Calculator size={20} /> },
    { id: 'creator',    label: 'Doc',        icon: <FileText size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-sans text-slate-200">
      <Toaster position="top-center"
        toastOptions={{ style: { background: '#1e2535', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13 } }} />

      {/* Desktop Nav */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5 items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Globe className="text-white" size={20} />
          </div>
          <div>
            <span className="text-lg font-black text-white">IndiaSearch</span>
            <span className="ml-2 text-xs text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/20">
              🇮🇳 {INDIA_LANGS.length} + 🌍 {WORLD_LANGS.length} Languages
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#1a2236] p-1 rounded-2xl border border-white/5">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all
                ${activeTab === tab.id
                  ? tab.id === 'dictation' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Globe className="text-white" size={17} />
          </div>
          <span className="font-black text-white">IndiaSearch</span>
        </div>
        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
          {TABS.find(t => t.id === activeTab)?.label}
        </span>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-3 sm:px-4 pt-6 pb-28 md:pb-12">

        {activeTab === 'dictation' && <div className="fade-in"><DictationSection BACKEND_URL={BACKEND_URL} /></div>}
        {activeTab === 'translator' && <div className="fade-in"><TranslatorSection BACKEND_URL={BACKEND_URL} /></div>}

        {activeTab === 'downloader' && (
          <div className="fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-1">Media <span className="text-blue-400">Downloader</span></h2>
              <p className="text-slate-500 text-sm">YouTube · Instagram · TikTok · Twitter · Facebook</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 sm:p-6 mb-4 border border-white/5">
              <div className="relative mb-3">
                <input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDownload()}
                  placeholder="Video link paste karein..." className="w-full px-4 py-3.5 bg-[#0d1420] border border-white/10 rounded-xl text-white placeholder:text-slate-600 outline-none focus:border-blue-500 text-base transition-all" />
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
              <div className="bg-[#1a2236] rounded-2xl p-4 border border-white/5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {result.thumbnail && <img src={result.thumbnail} alt="thumb" className="w-full sm:w-36 rounded-xl object-cover aspect-video border border-white/10" />}
                  <div className="flex-1">
                    <span className="inline-block text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 mb-2">{detectPlatform(resultUrl)}</span>
                    <h3 className="text-sm font-black text-white mb-3 leading-tight">{result.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {result.formats?.slice(0, 4).map((f, i) => (
                        <a key={i} href={f.url} target="_blank" rel="noopener" className="p-2.5 bg-[#0d1420] border border-white/5 rounded-xl hover:border-blue-500 transition-all group flex items-center justify-between">
                          <div><p className="font-black text-white text-sm">{f.quality}</p><p className="text-xs text-slate-500">{f.filesize ? (f.filesize/1024/1024).toFixed(1)+'MB' : 'HD'}</p></div>
                          <ExternalLink size={13} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
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
              <p className="text-slate-500 text-sm">Photo se text extract karke translate karo</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 border border-white/5">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Source Lang</p>
                  <select value={visionSrc} onChange={e => setVisionSrc(e.target.value)} className="w-full bg-[#0d1420] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none">
                    <option value="auto">🔍 Auto Detect</option>
                    <optgroup label="🇮🇳 Indian">{INDIA_LANGS.map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}</optgroup>
                    <optgroup label="🌍 World">{WORLD_LANGS.map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}</optgroup>
                  </select>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Target Lang</p>
                  <select value={visionTgt} onChange={e => setVisionTgt(e.target.value)} className="w-full bg-[#0d1420] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none">
                    <optgroup label="🇮🇳 Indian">{INDIA_LANGS.map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}</optgroup>
                    <optgroup label="🌍 World">{WORLD_LANGS.map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}</optgroup>
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
                {!isCameraActive ? <button onClick={startCamera} className="bg-pink-600 hover:bg-pink-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><Camera size={15}/>Camera</button>
                  : <button onClick={captureImage} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><CheckCircle size={15}/>Capture</button>}
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleGalleryUpload} />
                <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><ImageIcon size={15}/>Gallery</button>
                {isCameraActive && <button onClick={stopCamera} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><XCircle size={15}/>Close</button>}
              </div>
              <div className="bg-[#0d1420] rounded-xl p-4 min-h-[100px] border border-white/5">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Result</p>
                {loading ? <div className="flex items-center gap-2 py-4 justify-center"><Loader2 className="animate-spin text-blue-400" size={24}/><span className="text-sm text-slate-500">Analyzing...</span></div>
                  : visionExtractedText ? (
                    <div className="space-y-3">
                      <div><p className="text-xs text-slate-600 uppercase mb-1">Original</p><p className="text-slate-300 text-sm">{visionExtractedText}</p></div>
                      {visionTranslatedText && <div><p className="text-xs text-emerald-600 uppercase mb-1">Translated</p><p className="text-emerald-100 font-medium">{visionTranslatedText}</p></div>}
                    </div>
                  ) : <p className="text-slate-600 text-sm italic">Image capture ya upload karein</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'math' && (
          <div className="fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-1">Math <span className="text-cyan-400">Solver</span></h2>
              <p className="text-slate-500 text-sm">Photo ya type karo — solve hoga</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 border border-white/5">
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-white/10 mb-3">
                {!mathImage && !isMathCameraActive && <div className="text-center text-slate-600"><Calculator size={36} className="mx-auto mb-1.5 opacity-30"/><p className="text-xs">Camera off</p></div>}
                <video ref={mathVideoRef} autoPlay playsInline className={`w-full h-full object-cover ${isMathCameraActive?'block':'hidden'}`} />
                {mathImage && !isMathCameraActive && <img src={mathImage} alt="Math" className="w-full h-full object-cover" />}
                <canvas ref={mathCanvasRef} className="hidden" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {!isMathCameraActive ? <button onClick={startMathCamera} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><Camera size={15}/>Camera</button>
                  : <button onClick={captureMathImage} className="bg-emerald-600 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><CheckCircle size={15}/>Capture</button>}
                <input type="file" accept="image/*" ref={mathFileInputRef} className="hidden" onChange={handleMathGallery} />
                <button onClick={() => mathFileInputRef.current?.click()} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><ImageIcon size={15}/>Gallery</button>
                {isMathCameraActive && <button onClick={stopMathCamera} className="bg-slate-700 text-white rounded-xl p-2.5 font-bold text-sm flex items-center justify-center gap-1.5"><XCircle size={15}/>Close</button>}
              </div>
              <div className="flex gap-2 mb-4">
                <input type="text" value={mathInputText} onChange={e => setMathInputText(e.target.value)} onKeyDown={e => e.key==='Enter'&&solveMathText()}
                  placeholder="2x+5=15 type karo..." className="flex-1 bg-[#0d1420] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-cyan-500 placeholder:text-slate-600" />
                <button onClick={solveMathText} disabled={loading||!mathInputText} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-xl px-5 text-sm">Solve</button>
              </div>
              <div className="bg-[#0d1420] rounded-xl p-4 min-h-[80px] border border-white/5">
                <p className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2">Solution</p>
                {loading ? <div className="flex items-center gap-2 py-4 justify-center"><Loader2 className="animate-spin text-cyan-400" size={24}/><span className="text-sm text-slate-500">Solving...</span></div>
                  : mathSolution ? (
                    <div className="space-y-2">
                      {mathExtractedText && <p className="text-slate-400 font-mono text-sm bg-black/30 p-2 rounded-lg">{mathExtractedText}</p>}
                      <p className="text-2xl text-cyan-100 font-black font-mono">{mathSolution}</p>
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
              <p className="text-slate-500 text-sm">Notes paste karo — PDF banao</p>
            </div>
            <div className="bg-[#1a2236] rounded-2xl p-4 border border-white/5 space-y-4">
              <textarea value={creatorText} onChange={e => setCreatorText(e.target.value)}
                placeholder="Apna content yahan paste karein..." rows={10}
                className="w-full bg-[#0d1420] border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 text-sm outline-none focus:border-amber-500 resize-none transition-all" />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1.5">PDF Language</p>
                  <select value={creatorLang} onChange={e => setCreatorLang(e.target.value)}
                    className="w-full bg-[#0d1420] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none">
                    <option value="original">Keep Original</option>
                    <optgroup label="🇮🇳 Indian">{INDIA_LANGS.map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}</optgroup>
                    <optgroup label="🌍 World">{WORLD_LANGS.map(l => <option key={l.code} value={l.code} className="bg-[#1a2236]">{l.flag} {l.name}</option>)}</optgroup>
                  </select>
                </div>
                <button onClick={handleCreatePdf} disabled={loading||!creatorText}
                  className="sm:flex-[1.2] h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl font-black hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                  {loading ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle size={20}/>} Create PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-xl border-t border-white/8 flex safe-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all
              ${activeTab === tab.id ? (tab.id === 'dictation' ? 'text-orange-400' : 'text-blue-400') : 'text-slate-600 hover:text-slate-400'}`}>
            {React.cloneElement(tab.icon, { size: 22 })}
            <span style={{ fontSize: 10, fontWeight: 700 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
