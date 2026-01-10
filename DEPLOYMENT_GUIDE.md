# 🚀 Deployment Guide - EV Charging Armenia

This guide covers multiple deployment options from easiest to most advanced.

---

## 📱 Local Development (Simplest - No Docker!)

### Option 1: Quick Local Dev (SQLite - No Database Install Needed!)

The easiest way to develop locally without installing PostgreSQL or Redis:

```bash
# Make script executable
chmod +x dev-server.sh

# Run it!
./dev-server.sh
```

This will:
- ✅ Use SQLite (no PostgreSQL needed)
- ✅ Use in-memory cache (no Redis needed)
- ✅ Auto-install dependencies
- ✅ Start dev server with hot-reload

**Server runs at http://localhost:3000** 🎉

### Option 2: Local with Docker (Full Features)

For full PostgreSQL + PostGIS + Redis support:

```bash
# Start everything
docker-compose up -d

# Install and run backend
cd backend
npm install
npm run dev
```

---

## ☁️ Cloud Deployment (Auto-Deploy on Push)

### 🚄 Railway (RECOMMENDED - Best for this project)

Railway is perfect for Node.js apps with PostgreSQL + Redis.

#### Setup Steps:

1. **Go to [Railway.app](https://railway.app)** and sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your `ev-charger` repository

3. **Add Services:**

   **a) PostgreSQL:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway auto-configures `DATABASE_URL`

   **b) Redis:**
   - Click "New" → "Database" → "Add Redis"
   - Railway auto-configures `REDIS_URL`

   **c) Backend API:**
   - Click "New" → "GitHub Repo"
   - Set Root Directory: `/backend`
   - Set Start Command: `npm start`
   - Set Build Command: `npm install && npm run build`

4. **Set Environment Variables:**

   In the Backend service settings → Variables:
   ```env
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-super-secret-key-change-this
   LOG_LEVEL=info
   CORS_ORIGIN=*
   ```

5. **Deploy:**
   - Click "Deploy"
   - Railway will auto-deploy on every push to main branch!

6. **Get Your URL:**
   - Go to Settings → Generate Domain
   - Your API will be at: `https://your-app.railway.app`

#### Auto-Deploy on Push:
✅ Already configured! Every push to main branch auto-deploys.

**Cost:** ~$5-10/month (includes PostgreSQL, Redis, Backend)

---

### 🎨 Render (Alternative Option)

Render is another great option with free tier.

#### Setup Steps:

1. **Go to [Render.com](https://render.com)** and sign up with GitHub

2. **Create Blueprint** (uses render.yaml):
   - Click "New" → "Blueprint"
   - Connect your `ev-charger` repo
   - Render reads `render.yaml` automatically
   - Click "Apply"

3. **Manual Setup Alternative:**

   **a) PostgreSQL:**
   - New → PostgreSQL
   - Name: `ev-charging-db`
   - Region: Frankfurt (closest to Armenia)
   - Plan: Free or Starter

   **b) Redis:**
   - New → Redis
   - Name: `ev-charging-redis`
   - Plan: Free or Starter

   **c) Web Service:**
   - New → Web Service
   - Connect repo
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=[Auto-filled by Render]
   REDIS_URL=[Auto-filled by Render]
   JWT_SECRET=your-secret-key
   ```

5. **Auto-Deploy:**
   - Go to Settings → Auto-Deploy
   - Enable "Auto-Deploy: Yes"

**Cost:** Free tier available (limited), or $7-15/month for starter plans

---

### ⚡ Vercel (Frontend/Serverless - Limited Backend Support)

**⚠️ IMPORTANT:** Vercel is optimized for frontend/serverless. This backend has:
- WebSocket (not supported on Vercel)
- Long-running connections (limited on Vercel)
- PostgreSQL + Redis (need external hosting)

**Only use Vercel if:**
- You host PostgreSQL elsewhere (e.g., Neon, Supabase)
- You host Redis elsewhere (e.g., Upstash)
- You remove WebSocket features

#### Setup (if you still want to try):

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add REDIS_URL
   vercel env add JWT_SECRET
   ```

4. **Auto-Deploy:**
   - Link to GitHub in Vercel dashboard
   - Auto-deploys on push to main

**Better Alternative:** Use Vercel for the **mobile/admin frontend** (when built) and Railway/Render for the backend.

---

### 🐳 DigitalOcean App Platform

Similar to Railway/Render with good pricing.

#### Setup:

1. **Go to [DigitalOcean](https://www.digitalocean.com)** → App Platform

2. **Create App from GitHub**

3. **Add Components:**
   - Database: PostgreSQL
   - Database: Redis
   - Service: Backend API (Node.js)

4. **Configure:**
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Run: `npm start`

5. **Auto-Deploy:** Enabled by default

**Cost:** ~$5-12/month

---

## 🔥 Quick Comparison

| Platform | Best For | Auto-Deploy | PostgreSQL | Redis | WebSocket | Cost |
|----------|----------|-------------|------------|-------|-----------|------|
| **Railway** | Full-stack apps | ✅ | ✅ | ✅ | ✅ | $5-10/mo |
| **Render** | Full-stack apps | ✅ | ✅ | ✅ | ✅ | Free-$15/mo |
| **Vercel** | Frontend/Serverless | ✅ | ❌* | ❌* | ❌ | Free-$20/mo |
| **DigitalOcean** | Full-stack apps | ✅ | ✅ | ✅ | ✅ | $5-12/mo |
| **Heroku** | Traditional apps | ✅ | ✅ | ✅ | ✅ | $7-25/mo |

*External hosting needed

---

## 🎯 Recommended Setup

**For Backend API:**
1. **Railway** or **Render** (both excellent)
2. Use included PostgreSQL + Redis
3. Enable auto-deploy from GitHub
4. Set environment variables
5. Done! Push to deploy.

**For Mobile App (React Native):**
- Will be a separate deployment (Expo/App Store/Play Store)

**For Admin Panel (React):**
- Deploy to **Vercel** or **Netlify** (perfect for React)
- Connect to Railway/Render backend API

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS_ORIGIN (don't use `*` in production)
- [ ] Set up proper logging (Sentry recommended)
- [ ] Run database migrations
- [ ] Seed initial data (networks)
- [ ] Test all API endpoints
- [ ] Set up monitoring
- [ ] Configure backups (databases)

---

## 🔄 Auto-Deploy Workflow

### With Railway/Render:

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# 🎉 Auto-deploys in 2-3 minutes!
```

### Setup GitHub Actions (Optional - for tests before deploy):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd backend && npm install
      - run: cd backend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Railway Deploy
        run: echo "Railway auto-deploys on push"
```

---

## 🧪 Test Your Deployment

After deploying:

```bash
# Replace with your deployment URL
export API_URL=https://your-app.railway.app

# Health check
curl $API_URL/api/v1/health

# Get networks
curl $API_URL/api/v1/networks

# Get stations (Yerevan)
curl "$API_URL/api/v1/stations?lat=40.1872&lng=44.5152&radius=10"
```

---

## 🐛 Troubleshooting Deployment

### Railway Issues:

**Build fails:**
- Check build logs in Railway dashboard
- Ensure `package.json` has all dependencies
- Verify Node.js version compatibility

**Database connection fails:**
- Check that `DATABASE_URL` is set
- Verify PostgreSQL service is running
- Check connection string format

**App crashes:**
- View logs in Railway dashboard
- Check environment variables
- Ensure PORT is set correctly

### Render Issues:

**Similar to Railway:**
- Check build/deploy logs
- Verify environment variables
- Check service health

---

## 📊 Monitoring Your Deployment

### Built-in Monitoring:

**Railway:**
- Dashboard → Metrics (CPU, Memory, Network)
- Logs tab for real-time logs

**Render:**
- Dashboard → Metrics
- Logs for debugging

### External Monitoring (Recommended):

**Sentry (Errors):**
```bash
npm install @sentry/node

# Add to backend/src/index.ts
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com) (free)
- Ping your `/api/v1/health` endpoint every 5 minutes

---

## 💡 Pro Tips

1. **Use Railway for MVP** - Fastest setup, great DX
2. **Free Tier Testing:** Try Render's free tier first
3. **Environment Variables:** Never commit secrets!
4. **Database Backups:** Enable automatic backups
5. **Monitoring:** Set up Sentry from day one
6. **Staging Environment:** Create a staging branch → auto-deploy to staging

---

## 🎓 Learning Resources

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL on Railway](https://docs.railway.app/databases/postgresql)

---

## 🆘 Need Help?

- Check deployment logs first
- Verify all environment variables
- Test endpoints locally first
- Check database connection
- Review CORS settings

---

**Ready to deploy? Start with Railway - it's the easiest!** 🚀
