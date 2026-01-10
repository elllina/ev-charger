# ⚡ Quick Start - EV Charging Armenia

Choose your preferred method:

---

## 🎯 Method 1: Super Simple (No Docker, No PostgreSQL!)

**Best for: Quick local development without installing anything**

```bash
./dev-server.sh
```

That's it! Server runs at http://localhost:3000

Uses SQLite automatically - no database setup needed!

---

## 🐳 Method 2: Full Setup with Docker

**Best for: Full features (PostgreSQL + Redis)**

```bash
# Start everything
docker-compose up -d

# Setup backend
cd backend
npm install
npm run seed
npm run dev
```

Server at http://localhost:3000

---

## ☁️ Method 3: Deploy to Cloud (See Changes on Push!)

### Railway (Recommended):

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add PostgreSQL + Redis services
5. Done! Auto-deploys on every push to main

### Render:

1. Go to [render.com](https://render.com)
2. New → Blueprint
3. Connect repo (uses render.yaml)
4. Apply
5. Done! Auto-deploys on push

**Full guide:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🧪 Test It Works

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Get networks
curl http://localhost:3000/api/v1/networks

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+37494123456", "password": "test123456"}'
```

---

## 📱 Test Accounts

| Phone | Password |
|-------|----------|
| +37494123456 | test123456 |
| +37494234567 | test123456 |
| +37494345678 | test123456 |

---

## 🛑 Stop Everything

**Simple dev server:** Press Ctrl+C

**Docker:** `docker-compose down`

---

## 📚 More Info

- **Full setup guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Deployment guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **API docs:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Main README:** [README.md](README.md)

---

**Pick a method above and start coding! 🚀**
