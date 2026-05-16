# 🇮🇳 IndiaSearch: Professional AI Content Intelligence

IndiaSearch is a high-performance, multi-modular platform designed for global media archiving, real-time voice translation, and smart document creation. Built with a human-centric professional UI, it empowers users to bridge language gaps and manage digital content with ease.

## 🚀 Key Modules

### 1. 🎥 Universal Media Archiver
Download high-definition videos, photos, and media from 20+ global platforms including:
- **Social**: YouTube, Instagram, TikTok, Facebook, Snapchat, Twitter/X.
- **Academic**: ChatGPT, Claude, and LLM share links (Export as PDF).
- **Video**: Vimeo, Dailymotion, Reddit, and more.

### 2. 🎙️ AI Voice & Text Interpreter
A professional-grade translation engine supporting 100+ global languages and 12+ Indian regional languages (Bhojpuri, Hindi, Tamil, etc.).
- **Real-time Voice**: Speech-to-text recognition via Mic.
- **Audio Playback**: Natural text-to-speech output.
- **MP3 Export**: Download your translations as high-quality audio recordings.

### 3. 📄 Smart Document Creator
Transform raw text, chat transcripts, or articles into professionally formatted PDF documents.
- **Direct Paste**: Handle long academic notes or chat histories.
- **Auto-Translation**: Automatically translate content into another language before exporting to PDF.
- **Clean Layout**: Optimized for readability and professional standards.

## 📁 Project Structure

```
video-downloader-full/
├── backend/          # Flask Python API
│   ├── app.py        # Core logic & endpoints
│   ├── requirements.txt
│   └── runtime.txt
└── frontend/         # React + Vite + Tailwind
    ├── src/
    │   ├── App.jsx   # Tab-based professional UI
    │   └── index.css # Custom design tokens
    └── package.json
```

## 🛠️ Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion (for animations).
- **Backend**: Flask, yt-dlp, deep-translator, gTTS, fpdf2, BeautifulSoup4.
- **Hosting**: Render (Backend), Vercel/Netlify (Frontend).

## 🚀 Installation & Setup

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python app.py` (Runs on port 5001)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on port 3000)

## 🌐 Deployment Guidelines

### Backend (Render.com)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### Frontend
- **Build Command**: `npm run build`
- **Dist Folder**: `dist/`

## ⚠️ Important Usage Notes
- This tool is designed for educational and personal archiving purposes.
- Respect the Terms of Service and Copyright of the original content platforms.
- AI features (Voice/Translation) require an active internet connection.

## ⚖️ License & Copyright

**Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.**

This project is proprietary software. No part of this project may be used, copied, modified, or distributed without explicit written permission from the author. Unauthorized duplication or commercial use is strictly prohibited and subject to legal action.
