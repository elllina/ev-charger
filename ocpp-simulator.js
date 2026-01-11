#!/usr/bin/env node

/**
 * Simple OCPP 1.6J Charge Point Simulator
 * Connects to the backend OCPP server for testing
 */

const WebSocket = require('ws');

// Configuration
const BACKEND_URL = 'wss://ev-charging-api-production.up.railway.app/ocpp/TEST-CHARGER-001';
const CHARGE_POINT_ID = 'TEST-CHARGER-001';

console.log('🔌 Starting OCPP Charge Point Simulator...');
console.log(`📡 Connecting to: ${BACKEND_URL}`);

// Create WebSocket connection
const ws = new WebSocket(BACKEND_URL, ['ocpp1.6']);

let messageId = 1;

// Helper to send OCPP messages
function sendCall(action, payload) {
  const message = [2, String(messageId++), action, payload];
  console.log(`📤 Sending ${action}:`, JSON.stringify(message, null, 2));
  ws.send(JSON.stringify(message));
}

function sendCallResult(messageId, payload) {
  const message = [3, messageId, payload];
  console.log(`📤 Sending CallResult:`, JSON.stringify(message, null, 2));
  ws.send(JSON.stringify(message));
}

// Connection opened
ws.on('open', () => {
  console.log('✅ Connected to OCPP Server!');
  console.log(`🔋 Charge Point ID: ${CHARGE_POINT_ID}`);

  // Send BootNotification
  sendCall('BootNotification', {
    chargePointVendor: 'TestVendor',
    chargePointModel: 'Simulator-v1',
    chargePointSerialNumber: 'SN-12345',
    firmwareVersion: '1.0.0',
  });

  // Send Heartbeat every 30 seconds
  setInterval(() => {
    sendCall('Heartbeat', {});
  }, 30000);

  // Send initial StatusNotification
  setTimeout(() => {
    sendCall('StatusNotification', {
      connectorId: 0,
      errorCode: 'NoError',
      status: 'Available',
    });

    sendCall('StatusNotification', {
      connectorId: 1,
      errorCode: 'NoError',
      status: 'Available',
    });
  }, 1000);
});

// Handle incoming messages
ws.on('message', (data) => {
  console.log(`📥 Received:`, data.toString());

  try {
    const message = JSON.parse(data.toString());
    const [messageType, messageId, action, payload] = message;

    if (messageType === 2) {
      // Call - Handle incoming requests
      console.log(`📨 Incoming request: ${action}`);

      switch (action) {
        case 'RemoteStartTransaction':
          console.log(`🔌 Remote Start on connector ${payload.connectorId}`);
          sendCallResult(messageId, { status: 'Accepted' });

          // Simulate transaction started
          setTimeout(() => {
            sendCall('StartTransaction', {
              connectorId: payload.connectorId,
              idTag: payload.idTag,
              meterStart: 0,
              timestamp: new Date().toISOString(),
            });
          }, 1000);
          break;

        case 'RemoteStopTransaction':
          console.log(`🛑 Remote Stop transaction ${payload.transactionId}`);
          sendCallResult(messageId, { status: 'Accepted' });

          // Simulate transaction stopped
          setTimeout(() => {
            sendCall('StopTransaction', {
              transactionId: payload.transactionId,
              meterStop: 1500,
              timestamp: new Date().toISOString(),
            });
          }, 1000);
          break;

        case 'Reset':
          console.log(`🔄 Reset requested: ${payload.type}`);
          sendCallResult(messageId, { status: 'Accepted' });
          break;

        default:
          console.log(`⚠️  Unknown action: ${action}`);
          sendCallResult(messageId, {});
      }
    } else if (messageType === 3) {
      // CallResult
      console.log(`✅ Response received for message ${messageId}`);
    }
  } catch (err) {
    console.error('❌ Error parsing message:', err);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('🔌 Disconnected from OCPP Server');
  process.exit(0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down simulator...');
  ws.close();
});

console.log('\n💡 Press Ctrl+C to stop the simulator');
