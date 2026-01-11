# OCPP Testing Guide

How to test the OCPP functionality without real charging stations.

## Quick Start

### Method 1: Use the Included Simulator (Recommended)

**Install dependencies:**
```bash
npm install ws
```

**Run the simulator:**
```bash
node ocpp-simulator.js
```

The simulator will:
1. ✅ Connect to your Railway backend via WebSocket
2. ✅ Send BootNotification to register the charge point
3. ✅ Send Heartbeat messages every 30 seconds
4. ✅ Report connector status as "Available"
5. ✅ Respond to Remote Start/Stop commands

**Expected output:**
```
🔌 Starting OCPP Charge Point Simulator...
📡 Connecting to: wss://ev-charging-api-production.up.railway.app/ocpp/TEST-CHARGER-001
✅ Connected to OCPP Server!
🔋 Charge Point ID: TEST-CHARGER-001
📤 Sending BootNotification...
```

**Then open your frontend:** `https://ev-charger-production.up.railway.app`

You should see **"TEST-CHARGER-001"** in the OCPP Charge Points panel!

---

## Method 2: Manual WebSocket Testing

**Install wscat:**
```bash
npm install -g wscat
```

**Connect to OCPP server:**
```bash
wscat -c "wss://ev-charging-api-production.up.railway.app/ocpp/MY-CHARGER" -s ocpp1.6
```

**Send BootNotification:**
```json
[2,"1","BootNotification",{"chargePointVendor":"TestVendor","chargePointModel":"Test-1"}]
```

**Send StatusNotification:**
```json
[2,"2","StatusNotification",{"connectorId":1,"errorCode":"NoError","status":"Available"}]
```

---

## Testing Remote Start/Stop

Once your charge point is connected:

### 1. View in Frontend
- Open: `https://ev-charger-production.up.railway.app`
- Your charge point should appear in the right panel
- Status shows "Connected"

### 2. Test Remote Start
- Click **"Start Charging"** button in the frontend
- The simulator will receive the command and respond
- Check simulator console for:
  ```
  🔌 Remote Start on connector 1
  ✅ Response: Accepted
  ```

### 3. Test Remote Stop
- Click **"Stop Charging"** button
- The simulator will stop the session
- Check simulator console for:
  ```
  🛑 Remote Stop transaction
  ✅ Response: Accepted
  ```

---

## Backend API Endpoints

Test OCPP server info:
```bash
curl https://ev-charging-api-production.up.railway.app/api/v1/ocpp/info
```

Get connected charge points:
```bash
curl https://ev-charging-api-production.up.railway.app/api/v1/ocpp/chargepoints
```

Remote start (replace with your charge point ID):
```bash
curl -X POST https://ev-charging-api-production.up.railway.app/api/v1/ocpp/chargepoints/TEST-CHARGER-001/start \
  -H "Content-Type: application/json" \
  -d '{"connectorId": 1, "idTag": "user123"}'
```

---

## Troubleshooting

### Charge Point Not Appearing
1. Check simulator is running and connected
2. Verify WebSocket URL is correct
3. Check Railway backend logs for connections
4. Refresh the frontend page

### Remote Commands Not Working
1. Ensure charge point status is "Connected"
2. Check simulator console for incoming messages
3. Verify the charge point ID matches
4. Check backend logs for errors

### Connection Issues
- Railway backend URL: `https://ev-charging-api-production.up.railway.app`
- OCPP WebSocket: `wss://ev-charging-api-production.up.railway.app/ocpp/[chargePointId]`
- Frontend: `https://ev-charger-production.up.railway.app`

---

## Advanced: Multiple Charge Points

Run multiple simulators with different IDs:

**Terminal 1:**
```bash
# Edit ocpp-simulator.js and change CHARGE_POINT_ID to 'STATION-A'
node ocpp-simulator.js
```

**Terminal 2:**
```bash
# Edit to use 'STATION-B'
node ocpp-simulator.js
```

Both will appear in the frontend!

---

## Real OCPP Charge Points

To connect real hardware:

1. **Configure charge point:**
   - OCPP Server URL: `wss://ev-charging-api-production.up.railway.app/ocpp/[YOUR-CP-ID]`
   - Protocol: OCPP 1.6J
   - Transport: WebSocket

2. **Authentication:**
   - Currently no authentication required
   - Add basic auth if needed for production

3. **Supported messages:**
   - ✅ BootNotification
   - ✅ Heartbeat
   - ✅ StatusNotification
   - ✅ StartTransaction
   - ✅ StopTransaction
   - ✅ MeterValues
   - ✅ RemoteStartTransaction
   - ✅ RemoteStopTransaction
   - ✅ Reset
   - ✅ ChangeConfiguration

---

## Next Steps

- [ ] Add charge point authentication
- [ ] Store transactions in database
- [ ] Add real-time notifications
- [ ] Implement Smart Charging profile
- [ ] Add firmware update support
