/**
 * OCPP 1.6J Charge Point Simulator Service
 * Deploys on Railway to simulate multiple charging stations
 */

const WebSocket = require('ws');

// Configuration from environment variables
const BACKEND_URL = process.env.OCPP_BACKEND_URL || 'wss://ev-charging-api-production-34a9.up.railway.app/ocpp';
const NUM_CHARGERS = parseInt(process.env.NUM_CHARGERS || '3');
const CHARGER_PREFIX = process.env.CHARGER_PREFIX || 'DEMO-CP';

console.log('🚀 OCPP Simulator Service Starting...');
console.log(`📡 Backend: ${BACKEND_URL}`);
console.log(`🔌 Simulating ${NUM_CHARGERS} charge points`);
console.log('─'.repeat(60));

class OCPPChargePoint {
  constructor(id) {
    this.id = id;
    this.ws = null;
    this.messageId = 1;
    this.connected = false;
    this.heartbeatInterval = null;
    this.reconnectTimeout = null;
  }

  connect() {
    const url = `${BACKEND_URL}/${this.id}`;
    console.log(`[${this.id}] 🔄 Connecting to ${url}`);

    this.ws = new WebSocket(url, ['ocpp1.6']);

    this.ws.on('open', () => {
      this.connected = true;
      console.log(`[${this.id}] ✅ Connected!`);

      // Send BootNotification
      this.sendCall('BootNotification', {
        chargePointVendor: 'Simulator Inc.',
        chargePointModel: 'Demo-Model-1',
        chargePointSerialNumber: `SN-${this.id}`,
        firmwareVersion: '1.0.0',
      });

      // Send initial status
      setTimeout(() => {
        this.sendCall('StatusNotification', {
          connectorId: 0,
          errorCode: 'NoError',
          status: 'Available',
        });

        this.sendCall('StatusNotification', {
          connectorId: 1,
          errorCode: 'NoError',
          status: 'Available',
        });
      }, 1000);

      // Start heartbeat
      this.startHeartbeat();
    });

    this.ws.on('message', (data) => {
      this.handleMessage(data);
    });

    this.ws.on('error', (error) => {
      console.error(`[${this.id}] ❌ Error:`, error.message);
    });

    this.ws.on('close', () => {
      this.connected = false;
      console.log(`[${this.id}] 🔌 Disconnected`);
      this.stopHeartbeat();

      // Attempt reconnection after 5 seconds
      this.reconnectTimeout = setTimeout(() => {
        console.log(`[${this.id}] 🔄 Reconnecting...`);
        this.connect();
      }, 5000);
    });
  }

  sendCall(action, payload) {
    const message = [2, String(this.messageId++), action, payload];
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
      console.log(`[${this.id}] 📤 ${action}`);
    }
  }

  sendCallResult(messageId, payload) {
    const message = [3, messageId, payload];
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
    }
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data.toString());
      const [messageType, messageId, action, payload] = message;

      if (messageType === 2) {
        // Incoming Call
        console.log(`[${this.id}] 📥 ${action}`);

        switch (action) {
          case 'RemoteStartTransaction':
            console.log(`[${this.id}] 🔌 Starting charging on connector ${payload.connectorId}`);
            this.sendCallResult(messageId, { status: 'Accepted' });

            // Simulate transaction start
            setTimeout(() => {
              this.sendCall('StartTransaction', {
                connectorId: payload.connectorId,
                idTag: payload.idTag,
                meterStart: 0,
                timestamp: new Date().toISOString(),
              });
            }, 1000);
            break;

          case 'RemoteStopTransaction':
            console.log(`[${this.id}] 🛑 Stopping transaction ${payload.transactionId}`);
            this.sendCallResult(messageId, { status: 'Accepted' });

            // Simulate transaction stop
            setTimeout(() => {
              this.sendCall('StopTransaction', {
                transactionId: payload.transactionId,
                meterStop: Math.floor(Math.random() * 5000) + 1000,
                timestamp: new Date().toISOString(),
                reason: 'Remote',
              });
            }, 1000);
            break;

          case 'Reset':
            console.log(`[${this.id}] 🔄 Reset ${payload.type}`);
            this.sendCallResult(messageId, { status: 'Accepted' });
            break;

          case 'GetConfiguration':
            this.sendCallResult(messageId, {
              configurationKey: [],
              unknownKey: []
            });
            break;

          default:
            console.log(`[${this.id}] ⚠️ Unknown action: ${action}`);
            this.sendCallResult(messageId, {});
        }
      } else if (messageType === 3) {
        // CallResult
        console.log(`[${this.id}] ✅ Response received`);
      }
    } catch (err) {
      console.error(`[${this.id}] ❌ Parse error:`, err.message);
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.sendCall('Heartbeat', {});
      }
    }, 30000); // Every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Create and connect charge points
const chargePoints = [];
for (let i = 1; i <= NUM_CHARGERS; i++) {
  const id = `${CHARGER_PREFIX}-${String(i).padStart(3, '0')}`;
  const cp = new OCPPChargePoint(id);
  chargePoints.push(cp);

  // Stagger connections to avoid overwhelming the server
  setTimeout(() => {
    cp.connect();
  }, i * 1000);
}

console.log('─'.repeat(60));
console.log('💡 Simulator is running!');
console.log('🌐 Check your frontend to see the charge points appear');
console.log('─'.repeat(60));

// Handle shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down simulator...');
  chargePoints.forEach(cp => cp.disconnect());
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down simulator...');
  chargePoints.forEach(cp => cp.disconnect());
  process.exit(0);
});

// Keep alive
setInterval(() => {
  const connectedCount = chargePoints.filter(cp => cp.connected).length;
  console.log(`📊 Status: ${connectedCount}/${NUM_CHARGERS} charge points connected`);
}, 60000); // Every minute
