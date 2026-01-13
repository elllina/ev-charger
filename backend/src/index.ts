import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase, closeDatabaseConnection } from './config/database';
import { redis } from './config/redis';
import { logger, morganStream } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { initializeWebSocket } from './websocket';
import { initializeOCPPServer } from './ocpp/OCPPServer';
import routes from './routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Trust proxy for Railway deployment
app.set('trust proxy', true);

// Middleware
app.use(helmet()); // Security headers

// CORS configuration - allow Railway domains and localhost
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:8080',
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Allow all Railway domains
    if (origin.includes('.railway.app')) {
      return callback(null, true);
    }

    // Allow localhost in development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    // Check against allowed origins list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow the request anyway to avoid blocking
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(compression()); // Response compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: morganStream }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// API Routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'EV Charging Armenia API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/v1/health',
  });
});

// Socket.io HTTP handler placeholder (will be set in startServer)
let socketioHandler: any = null;

app.use((req, res, next) => {
  if (req.url.startsWith('/socket.io/') && socketioHandler) {
    console.log(`[Socket.io] HTTP request: ${req.method} ${req.url}`);
    socketioHandler(req, res);
  } else {
    next();
  }
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Initialize services
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Test Redis connection
    await redis.ping();
    logger.info('Redis connected successfully');

    // Initialize Socket.io in noServer mode
    const wsServer = initializeWebSocket();
    logger.info('Socket.io initialized (noServer mode)');

    // Set the Socket.io handler for HTTP requests
    socketioHandler = (req: any, res: any) => wsServer.handleRequest(req, res);

    // Initialize OCPP server in noServer mode
    const ocppServer = initializeOCPPServer(server);
    logger.info('✅ OCPP WebSocket server initialized');
    logger.info('📡 OCPP WebSocket URL: ws://[host]/ocpp/[chargePointId]');

    // Register WebSocket upgrade handler
    server.on('upgrade', (request, socket, head) => {
      const pathname = request.url || '';
      console.log(`[UPGRADE] Request for path: ${pathname}`);

      // Route OCPP WebSocket connections
      if (pathname.startsWith('/ocpp/')) {
        console.log(`[UPGRADE] → Routing to OCPP handler`);
        try {
          ocppServer.handleUpgrade(request, socket, head);
        } catch (error) {
          console.error(`[UPGRADE] OCPP upgrade error:`, error);
          socket.destroy();
        }
        return;
      }

      // Route Socket.io WebSocket upgrades
      if (pathname.startsWith('/socket.io/')) {
        console.log(`[UPGRADE] → Routing to Socket.io handler`);
        try {
          wsServer.handleUpgrade(request, socket, head);
        } catch (error) {
          console.error(`[UPGRADE] Socket.io upgrade error:`, error);
          socket.destroy();
        }
        return;
      }

      // Reject all other WebSocket upgrade requests
      console.log(`[UPGRADE] → Rejected (unknown path: ${pathname})`);
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
    });

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
      logger.info(`⚡ OCPP WebSocket: ws://localhost:${PORT}/ocpp/{chargePointId}`);
      logger.info(`📱 Socket.io: ws://localhost:${PORT}/socket.io/`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} received, shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await closeDatabaseConnection();
      logger.info('Database connection closed');

      await redis.quit();
      logger.info('Redis connection closed');

      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

export { app, server };
