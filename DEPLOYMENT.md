# 🚀 IndiaSearch Deployment Guide

Due to the unified repository structure (Backend and Frontend in the same repo), you must configure your deployment services to look into the correct folders.

## 🐍 Backend Deployment (Render.com)

If you are using **Render**, the easiest way to fix the `requirements.txt` error is to set the **Root Directory** in your settings.

### Manual Settings (In Render Dashboard):
1. Go to your **Web Service Settings**.
2. Find the **Root Directory** field.
3. Enter: `backend`
4. Update your **Build Command** to: `pip install -r requirements.txt`
5. Update your **Start Command** to: `gunicorn app:app`
6. Save and **Manual Deploy**.

### Automatic Settings:
I have added a `render.yaml` file to the root of your project. Render should now automatically detect that the project is in the `backend/` folder.

---

## ⚛️ Frontend Deployment (Vercel / Netlify)

### Vercel:
1. When importing the project, select the **Root Directory** as `frontend`.
2. Vercel will automatically detect the **Vite** build settings.
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Netlify:
1. Set the **Base Directory** to `frontend`.
2. Build Command: `npm run build`
3. Publish Directory: `frontend/dist`
