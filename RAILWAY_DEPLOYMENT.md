# Railway Deployment Guide

This guide explains how to configure your Railway deployments for both backend and frontend.

## Current Deployment URLs

- **Backend**: `https://ev-charging-api-production-34a9.up.railway.app`
- **Frontend**: `https://ev-charger-production.up.railway.app`

## Backend Configuration (ev-charging-api)

### Required Environment Variables

Set these in Railway Dashboard → Your Backend Service → Variables:

```bash
# CORS - CRITICAL for frontend to work
CORS_ORIGIN=https://ev-charger-production.up.railway.app

# Database (set by Railway if using Railway Postgres)
DATABASE_URL=<your-postgres-connection-string>

# Redis (set by Railway if using Railway Redis)
REDIS_URL=<your-redis-connection-string>

# JWT Secret
JWT_SECRET=<generate-a-long-secure-random-string>

# Node Environment
NODE_ENV=production

# Optional: Force database sync on first deploy
# FORCE_SYNC=true  # Remove after first successful deployment
```

### Steps to Deploy Backend

1. **Go to Railway Dashboard** → Your Backend Service
2. **Click on "Variables" tab**
3. **Add/Update the `CORS_ORIGIN` variable**:
   ```
   CORS_ORIGIN=https://ev-charger-production.up.railway.app
   ```
4. **Verify other required variables** are set (DATABASE_URL, REDIS_URL, JWT_SECRET)
5. **Click "Deploy"** or wait for auto-deployment after git push

## Frontend Configuration (ev-charger)

### Required Environment Variables

Set these in Railway Dashboard → Your Frontend Service → Variables:

```bash
# Backend API URL - MUST match your backend Railway domain
VITE_API_URL=https://ev-charging-api-production-34a9.up.railway.app/api/v1

# WebSocket URL
VITE_WS_URL=https://ev-charging-api-production-34a9.up.railway.app
```

### Steps to Deploy Frontend

1. **Go to Railway Dashboard** → Your Frontend Service
2. **Click on "Variables" tab**
3. **Add these variables**:
   - `VITE_API_URL` = `https://ev-charging-api-production-34a9.up.railway.app/api/v1`
   - `VITE_WS_URL` = `https://ev-charging-api-production-34a9.up.railway.app`
4. **Click "Deploy"** or trigger a redeploy

## Troubleshooting

### CORS Errors

If you see `Access-Control-Allow-Origin` errors in browser console:

1. Verify `CORS_ORIGIN` is set correctly in **backend** environment variables
2. Ensure the URL matches your **frontend** domain exactly (no trailing slash)
3. Redeploy the backend after changing CORS settings

### 404 Errors on API Endpoints

If you see 404 errors when calling `/api/v1/ocm/nearby` or `/api/v1/ocpp/chargepoints`:

1. Check that the backend is deployed and running (visit the backend URL in browser)
2. Verify the database and Redis are connected (check backend logs)
3. Ensure `VITE_API_URL` in frontend includes `/api/v1` path

### Backend Won't Start

If backend crashes on startup:

1. Check logs: Railway Dashboard → Backend Service → Deployments → View Logs
2. Common issues:
   - Missing DATABASE_URL or REDIS_URL
   - Database connection timeout (check database service is running)
   - Module import errors (ensure latest code is deployed)

## Deployment Checklist

- [ ] Backend has `CORS_ORIGIN` set to frontend domain
- [ ] Backend has DATABASE_URL configured
- [ ] Backend has REDIS_URL configured
- [ ] Backend has JWT_SECRET configured
- [ ] Frontend has `VITE_API_URL` pointing to backend with `/api/v1`
- [ ] Frontend has `VITE_WS_URL` pointing to backend
- [ ] Both services are deployed and running
- [ ] No CORS errors in browser console
- [ ] API endpoints return data (not 404)

## Testing the Deployment

After deploying both services:

1. Open frontend URL in browser: `https://ev-charger-production.up.railway.app`
2. Open browser DevTools (F12) → Console tab
3. Check for errors:
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ API calls succeed
4. Verify charging stations load on the map
5. Verify OCPP charge points section loads (may be empty if no charge points connected)

## Need Help?

If issues persist:
1. Check Railway service logs for both frontend and backend
2. Verify all environment variables are set correctly
3. Try manual redeploy of both services
4. Check that DATABASE_URL and REDIS_URL are accessible from the backend service
