# 🎥 Video Downloader API

Backend API for downloading videos from 20+ platforms using yt-dlp.

## 🚀 Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

### One-Click Setup:
1. Click the button above
2. Connect this repository
3. Click "Create Web Service"
4. Done! Copy your API URL

### Manual Setup:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Environment**: Python 3

## 📦 Local Development

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## 🌐 API Endpoints

### POST /download
Download video information
```json
{
  "url": "https://www.youtube.com/watch?v=example"
}
```

### GET /
Health check

## 🎯 Supported Platforms

YouTube, Instagram, Facebook, TikTok, Twitter, Snapchat, Vimeo, Dailymotion, Reddit, LinkedIn, and more!

## 📝 Tech Stack

- Flask
- yt-dlp
- Flask-CORS
- Gunicorn

## 🔗 Frontend

Connect this API with the frontend: [Video Downloader Frontend](#)

---

Made with ❤️ using Python & Flask
