import { Server as WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';
import { ChargingStation } from '../models/ChargingStation';
import { Connector } from '../models/Connector';
import {
  OCPPMessage,
  OCPPMessageType,
  OCPPAction,
  OCPPCall,
  OCPPCallResult,
  OCPPCallError,
  OCPPErrorCode,
  BootNotificationRequest,
  BootNotificationResponse,
  HeartbeatResponse,
  AuthorizeRequest,
  AuthorizeResponse,
  StartTransactionRequest,
  StartTransactionResponse,
  StopTransactionRequest,
  StopTransactionResponse,
  StatusNotificationRequest,
  MeterValuesRequest,
  RemoteStartTransactionRequest,
  RemoteStopTransactionRequest,
  RegistrationStatus,
  AuthorizationStatus,
  ChargePointStatus,
} from './types';

/**
 * OCPP Central System (Server)
 * Handles WebSocket connections from charge points
 */
interface ChargePointInfo {
  vendor?: string;
  model?: string;
  firmwareVersion?: string;
  serialNumber?: string;
  lastSeen: Date;
  connectorStatus?: Map<number, string>;
}

export class OCPPServer {
  private wss: WebSocketServer;
  private chargePoints: Map<string, WebSocket> = new Map();
  private chargePointInfo: Map<string, ChargePointInfo> = new Map();
  private pendingRequests: Map<string, (result: any) => void> = new Map();

  constructor(server: HTTPServer) {
    // Create WebSocket server with noServer to handle custom paths
    this.wss = new WebSocketServer({ noServer: true });

    // NOTE: Upgrade handler is registered in index.ts to control routing priority

    this.wss.on('connection', this.handleConnection.bind(this));

    logger.info('✅ OCPP WebSocket server initialized on /ocpp/*');
  }

  /**
   * Handle WebSocket upgrade for OCPP paths
   */
  public handleUpgrade(request: any, socket: any, head: any): void {
    const pathname = request.url || '';
    console.log(`[OCPP] Handling WebSocket upgrade for path: ${pathname}`);

    this.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      this.wss.emit('connection', ws, request);
    });
  }

  /**
   * Handle new charge point connection
   */
  private handleConnection(ws: WebSocket, req: any): void {
    const chargePointId = this.extractChargePointId(req);

    logger.info(`📡 Charge point connected: ${chargePointId}`);

    // Store charge point connection
    this.chargePoints.set(chargePointId, ws);

    // Update station's OCPP connection status
    this.updateStationConnectionStatus(chargePointId, true);

    ws.on('message', (data: Buffer) => {
      this.handleMessage(chargePointId, data.toString());
    });

    ws.on('close', () => {
      logger.info(`📴 Charge point disconnected: ${chargePointId}`);
      this.chargePoints.delete(chargePointId);
      // Update station's OCPP connection status
      this.updateStationConnectionStatus(chargePointId, false);
    });

    ws.on('error', (error: Error) => {
      logger.error(`❌ WebSocket error for ${chargePointId}:`, error);
    });
  }

  /**
   * Update station's OCPP connection status in database
   */
  private async updateStationConnectionStatus(chargePointId: string, connected: boolean): Promise<void> {
    try {
      const station = await ChargingStation.findOne({
        where: { ocppChargePointId: chargePointId }
      });

      if (station) {
        await station.update({
          ocppConnected: connected,
          ocppLastSeen: new Date()
        });
        logger.info(`📊 Updated station ${station.name} OCPP status: ${connected ? 'connected' : 'disconnected'}`);
      }
    } catch (error) {
      logger.error(`Failed to update station connection status for ${chargePointId}:`, error);
    }
  }

  /**
   * Extract charge point ID from request
   */
  private extractChargePointId(req: any): string {
    // Try to get from URL path: /ocpp/CP001
    const urlParts = req.url.split('/');
    if (urlParts.length > 2) {
      return urlParts[2];
    }

    // Try to get from subprotocol header
    const subprotocol = req.headers['sec-websocket-protocol'];
    if (subprotocol) {
      const protocols = subprotocol.split(',');
      for (const protocol of protocols) {
        if (protocol.trim().startsWith('ocpp')) {
          return protocol.trim();
        }
      }
    }

    // Fallback to IP address
    return req.socket.remoteAddress || 'unknown';
  }

  /**
   * Handle incoming OCPP message
   */
  private async handleMessage(chargePointId: string, data: string): Promise<void> {
    try {
      const message: OCPPMessage = JSON.parse(data);

      logger.debug(`📨 Received from ${chargePointId}:`, message);

      const [messageType, messageId] = message;

      if (messageType === OCPPMessageType.CALL) {
        await this.handleCall(chargePointId, message as OCPPCall);
      } else if (messageType === OCPPMessageType.CALLRESULT) {
        this.handleCallResult(messageId, message as OCPPCallResult);
      } else if (messageType === OCPPMessageType.CALLERROR) {
        this.handleCallError(messageId, message as OCPPCallError);
      } else {
        logger.error(`❌ Unknown message type: ${messageType}`);
      }
    } catch (error) {
      logger.error(`❌ Error parsing message from ${chargePointId}:`, error);
      this.sendError(chargePointId, '', OCPPErrorCode.ProtocolError, 'Invalid JSON');
    }
  }

  /**
   * Handle CALL message (request from charge point)
   */
  private async handleCall(chargePointId: string, call: OCPPCall): Promise<void> {
    const [, messageId, action, payload] = call;

    try {
      let response: any;

      switch (action) {
        case OCPPAction.BootNotification:
          response = await this.handleBootNotification(chargePointId, payload);
          break;

        case OCPPAction.Heartbeat:
          response = await this.handleHeartbeat(chargePointId);
          break;

        case OCPPAction.Authorize:
          response = await this.handleAuthorize(chargePointId, payload);
          break;

        case OCPPAction.StartTransaction:
          response = await this.handleStartTransaction(chargePointId, payload);
          break;

        case OCPPAction.StopTransaction:
          response = await this.handleStopTransaction(chargePointId, payload);
          break;

        case OCPPAction.StatusNotification:
          response = await this.handleStatusNotification(chargePointId, payload);
          break;

        case OCPPAction.MeterValues:
          response = await this.handleMeterValues(chargePointId, payload);
          break;

        default:
          throw new Error(`Action not supported: ${action}`);
      }

      this.sendCallResult(chargePointId, messageId, response);
    } catch (error: any) {
      logger.error(`❌ Error handling ${action}:`, error);
      this.sendError(
        chargePointId,
        messageId,
        OCPPErrorCode.InternalError,
        error.message
      );
    }
  }

  /**
   * Handle BootNotification
   */
  private async handleBootNotification(
    chargePointId: string,
    request: BootNotificationRequest
  ): Promise<BootNotificationResponse> {
    logger.info(`🔌 Boot notification from ${chargePointId}:`, request);

    // Update station with charge point info
    try {
      const station = await ChargingStation.findOne({
        where: { ocppChargePointId: chargePointId }
      });

      if (station) {
        await station.update({
          ocppVendor: request.chargePointVendor,
          ocppModel: request.chargePointModel,
          ocppFirmwareVersion: request.firmwareVersion,
          ocppConnected: true,
          ocppLastSeen: new Date()
        });
        logger.info(`📊 Updated station ${station.name} with OCPP info: ${request.chargePointVendor} ${request.chargePointModel}`);
      } else {
        // Store in charge point info map for unlinked charge points
        this.chargePointInfo.set(chargePointId, {
          vendor: request.chargePointVendor,
          model: request.chargePointModel,
          firmwareVersion: request.firmwareVersion,
          serialNumber: request.chargePointSerialNumber,
          lastSeen: new Date()
        });
        logger.info(`📦 Stored info for unlinked charge point ${chargePointId}`);
      }
    } catch (error) {
      logger.error(`Failed to update station with boot info:`, error);
    }

    return {
      status: RegistrationStatus.Accepted,
      currentTime: new Date().toISOString(),
      interval: 300, // Heartbeat every 5 minutes
    };
  }

  /**
   * Handle Heartbeat
   */
  private async handleHeartbeat(chargePointId: string): Promise<HeartbeatResponse> {
    logger.debug(`💓 Heartbeat from ${chargePointId}`);

    return {
      currentTime: new Date().toISOString(),
    };
  }

  /**
   * Handle Authorize
   */
  private async handleAuthorize(
    chargePointId: string,
    request: AuthorizeRequest
  ): Promise<AuthorizeResponse> {
    logger.info(`🔑 Authorization request from ${chargePointId}:`, request.idTag);

    // TODO: Validate idTag against database (user RFID card or app token)

    return {
      idTagInfo: {
        status: AuthorizationStatus.Accepted,
      },
    };
  }

  /**
   * Handle StartTransaction
   */
  private async handleStartTransaction(
    chargePointId: string,
    request: StartTransactionRequest
  ): Promise<StartTransactionResponse> {
    logger.info(`▶️  Start transaction from ${chargePointId}:`, request);

    // TODO: Create charging session in database
    // TODO: Validate user has sufficient balance

    const transactionId = Math.floor(Math.random() * 1000000);

    return {
      idTagInfo: {
        status: AuthorizationStatus.Accepted,
      },
      transactionId,
    };
  }

  /**
   * Handle StopTransaction
   */
  private async handleStopTransaction(
    chargePointId: string,
    request: StopTransactionRequest
  ): Promise<StopTransactionResponse> {
    logger.info(`⏹️  Stop transaction from ${chargePointId}:`, request);

    // TODO: Update charging session in database
    // TODO: Calculate cost and deduct from user balance

    return {
      idTagInfo: {
        status: AuthorizationStatus.Accepted,
      },
    };
  }

  /**
   * Handle StatusNotification
   */
  private async handleStatusNotification(
    chargePointId: string,
    request: StatusNotificationRequest
  ): Promise<{}> {
    logger.info(`📊 Status notification from ${chargePointId}:`, request);

    // Update connector status in database
    try {
      const station = await ChargingStation.findOne({
        where: { ocppChargePointId: chargePointId },
        include: [{ model: Connector }]
      });

      if (station && station.connectors) {
        // Find connector by number
        const connector = station.connectors.find(
          c => c.connectorNumber === request.connectorId
        );

        if (connector) {
          // Map OCPP status to our connector status
          const statusMap: Record<string, string> = {
            'Available': 'available',
            'Preparing': 'available',
            'Charging': 'occupied',
            'SuspendedEV': 'occupied',
            'SuspendedEVSE': 'occupied',
            'Finishing': 'occupied',
            'Reserved': 'reserved',
            'Unavailable': 'offline',
            'Faulted': 'faulted'
          };

          const newStatus = statusMap[request.status] || 'offline';
          await connector.update({
            status: newStatus,
            lastStatusUpdate: new Date()
          });

          logger.info(`📊 Updated connector ${connector.id} status to ${newStatus}`);
        }
      }

      // Also store in memory for unlinked charge points
      const info = this.chargePointInfo.get(chargePointId) || { lastSeen: new Date() };
      if (!info.connectorStatus) {
        info.connectorStatus = new Map();
      }
      info.connectorStatus.set(request.connectorId, request.status);
      info.lastSeen = new Date();
      this.chargePointInfo.set(chargePointId, info);
    } catch (error) {
      logger.error(`Failed to update connector status:`, error);
    }

    return {};
  }

  /**
   * Handle MeterValues
   */
  private async handleMeterValues(
    chargePointId: string,
    request: MeterValuesRequest
  ): Promise<{}> {
    logger.debug(`⚡ Meter values from ${chargePointId}:`, request);

    // TODO: Store meter values in database
    // TODO: Broadcast to client via Socket.io for real-time updates

    return {};
  }

  /**
   * Handle CALLRESULT message
   */
  private handleCallResult(messageId: string, result: OCPPCallResult): void {
    const [, , payload] = result;

    const resolver = this.pendingRequests.get(messageId);
    if (resolver) {
      resolver(payload);
      this.pendingRequests.delete(messageId);
    }
  }

  /**
   * Handle CALLERROR message
   */
  private handleCallError(messageId: string, error: OCPPCallError): void {
    const [, , errorCode, errorDescription] = error;

    logger.error(`❌ OCPP Error [${messageId}]: ${errorCode} - ${errorDescription}`);

    const resolver = this.pendingRequests.get(messageId);
    if (resolver) {
      resolver({ error: errorCode, description: errorDescription });
      this.pendingRequests.delete(messageId);
    }
  }

  /**
   * Send CALLRESULT to charge point
   */
  private sendCallResult(chargePointId: string, messageId: string, payload: any): void {
    const message: OCPPCallResult = [OCPPMessageType.CALLRESULT, messageId, payload];

    this.sendMessage(chargePointId, message);
  }

  /**
   * Send CALLERROR to charge point
   */
  private sendError(
    chargePointId: string,
    messageId: string,
    errorCode: OCPPErrorCode,
    errorDescription: string
  ): void {
    const message: OCPPCallError = [
      OCPPMessageType.CALLERROR,
      messageId,
      errorCode,
      errorDescription,
      {},
    ];

    this.sendMessage(chargePointId, message);
  }

  /**
   * Send CALL to charge point (remote command)
   */
  public async sendCall<T>(
    chargePointId: string,
    action: OCPPAction,
    payload: any
  ): Promise<T> {
    const messageId = uuidv4();

    const message: OCPPCall = [OCPPMessageType.CALL, messageId, action, payload];

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(messageId, resolve);

      this.sendMessage(chargePointId, message);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(messageId)) {
          this.pendingRequests.delete(messageId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Send message to charge point
   */
  private sendMessage(chargePointId: string, message: OCPPMessage): void {
    const ws = this.chargePoints.get(chargePointId);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      logger.error(`❌ Charge point ${chargePointId} not connected`);
      return;
    }

    const data = JSON.stringify(message);
    logger.debug(`📤 Sending to ${chargePointId}:`, message);

    ws.send(data);
  }

  /**
   * Send RemoteStartTransaction
   */
  public async remoteStartTransaction(
    chargePointId: string,
    connectorId: number,
    idTag: string
  ): Promise<any> {
    const request: RemoteStartTransactionRequest = {
      connectorId,
      idTag,
    };

    return this.sendCall(chargePointId, OCPPAction.RemoteStartTransaction, request);
  }

  /**
   * Send RemoteStopTransaction
   */
  public async remoteStopTransaction(
    chargePointId: string,
    transactionId: number
  ): Promise<any> {
    const request: RemoteStopTransactionRequest = {
      transactionId,
    };

    return this.sendCall(chargePointId, OCPPAction.RemoteStopTransaction, request);
  }

  /**
   * Get list of connected charge points
   */
  public getConnectedChargePoints(): string[] {
    return Array.from(this.chargePoints.keys());
  }

  /**
   * Get detailed info for all connected charge points
   */
  public getConnectedChargePointsWithInfo(): Array<{
    chargePointId: string;
    connected: boolean;
    vendor?: string;
    model?: string;
    firmwareVersion?: string;
    lastSeen?: Date;
    connectorStatus?: Record<number, string>;
  }> {
    const result = [];
    for (const [chargePointId, ws] of this.chargePoints) {
      const info = this.chargePointInfo.get(chargePointId);
      const connectorStatusObj: Record<number, string> = {};
      if (info?.connectorStatus) {
        for (const [k, v] of info.connectorStatus) {
          connectorStatusObj[k] = v;
        }
      }
      result.push({
        chargePointId,
        connected: ws.readyState === WebSocket.OPEN,
        vendor: info?.vendor,
        model: info?.model,
        firmwareVersion: info?.firmwareVersion,
        lastSeen: info?.lastSeen,
        connectorStatus: connectorStatusObj
      });
    }
    return result;
  }

  /**
   * Get info for a specific charge point
   */
  public getChargePointInfo(chargePointId: string): ChargePointInfo | undefined {
    return this.chargePointInfo.get(chargePointId);
  }

  /**
   * Check if charge point is connected
   */
  public isChargePointConnected(chargePointId: string): boolean {
    const ws = this.chargePoints.get(chargePointId);
    return ws !== undefined && ws.readyState === WebSocket.OPEN;
  }
}

let ocppServer: OCPPServer | null = null;

export function initializeOCPPServer(httpServer: HTTPServer): OCPPServer {
  if (!ocppServer) {
    ocppServer = new OCPPServer(httpServer);
  }
  return ocppServer;
}

export function getOCPPServer(): OCPPServer | null {
  return ocppServer;
}
