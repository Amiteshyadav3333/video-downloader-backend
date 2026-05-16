# 🚀 Deployment Guide

## 📦 Backend Deployment (Render.com)

### Step 1: Prepare Backend
```bash
cd video-downloader-full/backend
```

### Step 2: Deploy to Render
1. Go to [Render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (or upload files)
4. Configure:
   - **Name**: `video-downloader-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **Copy your backend URL**: `https://video-downloader-api-xxxx.onrender.com`

### Alternative: Manual Upload
If not using Git:
1. Zip the `backend` folder
2. On Render, choose "Deploy from Git" → "Public Git repository"
3. Or use Render's manual upload option

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update Backend URL
Open `frontend/src/App.jsx` and update line 11:
```javascript
const BACKEND_URL = 'https://your-backend-url.onrender.com'; // Replace with your Render URL
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
cd video-downloader-full/frontend
npm install -g vercel
vercel login
vercel
```
Follow the prompts and your site will be live!

#### Option B: Using Vercel Dashboard
1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New"** → **"Project"**
3. Import your Git repository or drag & drop the `frontend` folder
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**
6. Your site will be live in 2-3 minutes!

#### Option C: Manual Build & Deploy
```bash
cd video-downloader-full/frontend
npm run build
```
Then drag & drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

---

## ✅ Deployment Checklist

### Backend (Render)
- [ ] Create account on Render.com
- [ ] Deploy backend service
- [ ] Copy backend URL
- [ ] Test API: `https://your-backend-url.onrender.com/`

### Frontend (Vercel)
- [ ] Update `BACKEND_URL` in `App.jsx` with Render URL
- [ ] Deploy to Vercel
- [ ] Test the live site
- [ ] Try downloading a video

---

## 🔧 Environment Variables (Optional)

### Backend (Render)
No environment variables needed for basic setup.

### Frontend (Vercel)
If you want to use environment variables:
1. Create `.env` file:
```
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```
2. Update `App.jsx`:
```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
```

---

## 🐛 Troubleshooting

### Backend Issues
- **Build fails**: Check `requirements.txt` versions
- **App crashes**: Check Render logs
- **CORS errors**: Ensure `flask-cors` is installed

### Frontend Issues
- **API not connecting**: Verify `BACKEND_URL` is correct
- **Build fails**: Run `npm install` and `npm run build` locally first
- **Blank page**: Check browser console for errors

---

## 📱 Test Your Deployment

1. Open your Vercel URL
2. Paste a YouTube video URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. Click "Get Video"
4. Download should work!

---

## 🎉 You're Done!

Your video downloader is now live and accessible worldwide!

**Backend**: `https://your-app.onrender.com`  
**Frontend**: `https://your-app.vercel.app`

Share it with friends! 🚀
