# Railway Deployment Configuration

## Correct Railway Settings

**Root Directory:** `backend`
**Build Command:** (empty - auto-detected from nixpacks.toml)
**Start Command:** (empty - auto-detected from nixpacks.toml)

## Environment Variables Required

Make sure these are set in Railway:

- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Railway)
- `REDIS_URL` - Redis connection string (use Railway internal URL)
- `NODE_ENV=production`
- `JWT_SECRET` - Your JWT secret
- `CORS_ORIGIN` - Frontend URL (e.g., your Railway frontend URL)
- `FORCE_SYNC=true` (for first deployment only)

## Latest Updates

✅ Trust proxy enabled for Railway deployment
✅ OCPP 1.6J WebSocket server
✅ Open Charge Map integration
✅ Frontend with interactive map
