# OCPP Simulator Service for Railway

Simulates multiple OCPP 1.6J charge points that connect to your backend.

## Deploy to Railway (Recommended)

### Step 1: Push to GitHub

This folder is already in your repository at `/ocpp-simulator-service/`.

### Step 2: Create New Service in Railway

1. Go to your Railway dashboard
2. Click **"New"** → **"Service"** (or **"+"** in your project)
3. Select **"GitHub Repo"**
4. Choose your `ev-charger` repository
5. Click **"Add Service"**

### Step 3: Configure the Service

In Railway service settings:

**Root Directory:**
```
ocpp-simulator-service
```

**Environment Variables:**
- Click **"Variables"** tab
- Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `OCPP_BACKEND_URL` | `wss://ev-charging-api-production.up.railway.app/ocpp` | Your backend OCPP WebSocket URL |
| `NUM_CHARGERS` | `3` | Number of charge points to simulate (1-10) |
| `CHARGER_PREFIX` | `DEMO-CP` | Prefix for charge point IDs |

**Build & Start Commands:**
- Build Command: (leave empty - auto-detected)
- Start Command: (leave empty - auto-detected)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. Check the **"Deployments"** tab logs

You should see:
```
✅ DEMO-CP-001 Connected!
✅ DEMO-CP-002 Connected!
✅ DEMO-CP-003 Connected!
```

### Step 5: Verify

1. Open your frontend: https://ev-charger-production.up.railway.app
2. Look at the **OCPP Charge Points** panel on the right
3. You should see **3 charge points** listed:
   - DEMO-CP-001
   - DEMO-CP-002
   - DEMO-CP-003

### Step 6: Test Remote Control

1. Click **"Start Charging"** on any charge point
2. Check the simulator logs in Railway
3. You'll see: `🔌 Starting charging on connector 1`
4. The charge point will respond and start a transaction!

---

## Configuration Options

### Simulate More Charge Points

Change the `NUM_CHARGERS` variable to any number (recommended: 1-10):

```
NUM_CHARGERS=5
```

This will create:
- DEMO-CP-001
- DEMO-CP-002
- DEMO-CP-003
- DEMO-CP-004
- DEMO-CP-005

### Custom Charge Point Names

Change the `CHARGER_PREFIX` variable:

```
CHARGER_PREFIX=YEREVAN-STATION
```

This will create:
- YEREVAN-STATION-001
- YEREVAN-STATION-002
- etc.

### Connect to Different Backend

If you have multiple backends:

```
OCPP_BACKEND_URL=wss://your-other-backend.railway.app/ocpp
```

---

## Features

✅ **Automatic Reconnection** - If connection drops, automatically reconnects after 5 seconds
✅ **BootNotification** - Registers with backend on connection
✅ **Heartbeat** - Sends heartbeat every 30 seconds to stay connected
✅ **StatusNotification** - Reports connector status as "Available"
✅ **Remote Start** - Responds to remote start commands from frontend
✅ **Remote Stop** - Responds to remote stop commands
✅ **Transaction Simulation** - Simulates realistic charging sessions

---

## Monitoring

### View Logs in Railway

1. Go to Railway dashboard
2. Click on the **OCPP Simulator** service
3. Click **"Deployments"** → Select latest deployment
4. Click **"View Logs"**

You'll see real-time activity:
```
📊 Status: 3/3 charge points connected
[DEMO-CP-001] 📤 Heartbeat
[DEMO-CP-002] 📥 RemoteStartTransaction
[DEMO-CP-002] 🔌 Starting charging on connector 1
```

### Check Connection Status

The simulator logs status every minute:
```
📊 Status: 3/3 charge points connected
```

If you see `0/3`, check:
- Backend is running
- `OCPP_BACKEND_URL` is correct
- No firewall blocking WebSocket connections

---

## Troubleshooting

### Charge Points Not Appearing in Frontend

**Check Backend Logs:**
1. Go to Railway → **ev-charging-api** service
2. View logs for WebSocket connections
3. Look for: `OCPP client connected: DEMO-CP-001`

**Check Simulator Logs:**
1. Railway → **OCPP Simulator** service
2. Look for: `✅ Connected!` messages
3. If you see connection errors, verify the `OCPP_BACKEND_URL`

### Simulator Keeps Reconnecting

This means the WebSocket connection is unstable:
- Check backend is running and healthy
- Verify the backend URL is correct
- Check Railway network status

### Remote Commands Not Working

1. Ensure charge point status shows "Connected" in frontend
2. Check simulator logs for incoming messages
3. Verify backend API is processing OCPP messages correctly

---

## Cost

This simulator is very lightweight:
- **Memory:** ~50 MB
- **CPU:** Minimal (mostly idle)
- **Network:** Small WebSocket messages every 30 seconds

Railway free tier should handle this easily!

---

## Advanced Usage

### Simulate a Specific Location

You can modify the BootNotification to include GPS coordinates:

Edit `index.js` line 40 to add:
```javascript
chargePointVendor: 'Simulator Inc.',
chargePointModel: 'Demo-Model-1',
chargePointSerialNumber: `SN-${this.id}`,
firmwareVersion: '1.0.0',
chargeBoxSerialNumber: this.id,
iccid: '1234567890',
imsi: '1234567890',
meterType: 'Demo Meter',
meterSerialNumber: `METER-${this.id}`,
```

### Simulate Different Connector Types

The simulator currently uses connector IDs 0 and 1. You can modify to support multiple connectors.

### Load Testing

To test how many charge points your backend can handle:

```
NUM_CHARGERS=50
```

Monitor backend CPU and memory usage in Railway metrics.

---

## Next Steps

After deploying the simulator:

1. ✅ **Test the Frontend** - Verify charge points appear
2. ✅ **Test Remote Control** - Start/stop charging from UI
3. ✅ **Check Logs** - Monitor real-time OCPP messages
4. ✅ **Experiment** - Try different configurations
5. ✅ **Build More Features** - Add transaction history, energy meters, etc.

---

## What Gets Simulated

| OCPP Message | Direction | When |
|--------------|-----------|------|
| BootNotification | CP → Server | On connection |
| Heartbeat | CP → Server | Every 30 seconds |
| StatusNotification | CP → Server | On connection & status changes |
| StartTransaction | CP → Server | After RemoteStartTransaction |
| StopTransaction | CP → Server | After RemoteStopTransaction |
| RemoteStartTransaction | Server → CP | From frontend UI |
| RemoteStopTransaction | Server → CP | From frontend UI |
| Reset | Server → CP | From frontend UI |

---

## Support

This simulator implements **OCPP 1.6J Core Profile**.

For production use, you would add:
- Smart Charging Profile
- Firmware Management
- Local Auth List Management
- Reservation
