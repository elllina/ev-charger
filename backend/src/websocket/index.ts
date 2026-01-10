import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class WebSocketServer {
  private io: Server;

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    logger.info('WebSocket server initialized');
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware(): void {
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        socket.data.userId = decoded.userId;
        next();
      } catch (err) {
        next(new Error('Invalid token'));
      }
    });
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;
      logger.info(`WebSocket client connected: ${socket.id} (user: ${userId})`);

      // Subscribe to station updates
      socket.on('subscribe:station', (stationId: string) => {
        socket.join(`station:${stationId}`);
        logger.info(`User ${userId} subscribed to station ${stationId}`);
      });

      // Unsubscribe from station updates
      socket.on('unsubscribe:station', (stationId: string) => {
        socket.leave(`station:${stationId}`);
        logger.info(`User ${userId} unsubscribed from station ${stationId}`);
      });

      // Subscribe to session updates
      socket.on('subscribe:session', (sessionId: string) => {
        socket.join(`session:${sessionId}`);
        logger.info(`User ${userId} subscribed to session ${sessionId}`);
      });

      // Unsubscribe from session updates
      socket.on('unsubscribe:session', (sessionId: string) => {
        socket.leave(`session:${sessionId}`);
        logger.info(`User ${userId} unsubscribed from session ${sessionId}`);
      });

      // Join user's personal room
      socket.join(`user:${userId}`);

      // Handle disconnect
      socket.on('disconnect', () => {
        logger.info(`WebSocket client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Broadcast connector status update
   */
  public broadcastConnectorStatus(
    stationId: string,
    connectorId: string,
    status: string
  ): void {
    this.io.to(`station:${stationId}`).emit('connector:status', {
      connectorId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Broadcast session update
   */
  public broadcastSessionUpdate(sessionId: string, data: any): void {
    this.io.to(`session:${sessionId}`).emit('session:update', {
      sessionId,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send session completed notification
   */
  public notifySessionCompleted(sessionId: string, userId: string, data: any): void {
    // Send to session room
    this.io.to(`session:${sessionId}`).emit('session:completed', {
      sessionId,
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Send to user's personal room
    this.io.to(`user:${userId}`).emit('session:completed', {
      sessionId,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send notification to specific user
   */
  public notifyUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get IO instance for external use
   */
  public getIO(): Server {
    return this.io;
  }
}

let wsServer: WebSocketServer | null = null;

export function initializeWebSocket(httpServer: HTTPServer): WebSocketServer {
  wsServer = new WebSocketServer(httpServer);
  return wsServer;
}

export function getWebSocketServer(): WebSocketServer {
  if (!wsServer) {
    throw new Error('WebSocket server not initialized');
  }
  return wsServer;
}
