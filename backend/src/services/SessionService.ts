import { ChargingSession } from '../models/ChargingSession';
import { Connector } from '../models/Connector';
import { ChargingStation } from '../models/ChargingStation';
import { User } from '../models/User';
import { WalletService } from './WalletService';
import { AppError } from '../middleware/errorHandler';
import { calculateChargingCost } from '../utils/helpers';
import { logger } from '../config/logger';
import { cacheGet, cacheSet, cacheDelete, CACHE_KEYS, CACHE_TTL } from '../config/redis';

export interface SessionUpdate {
  energyDeliveredKwh?: number;
  maxPowerKw?: number;
  status?: string;
  currentCost?: number;
}

export class SessionService {
  /**
   * Start a charging session
   */
  async startCharging(
    userId: string,
    connectorId: string,
    maxAmount?: number
  ): Promise<ChargingSession> {
    try {
      // Check if user already has an active session
      const existingSession = await this.getActiveSession(userId);
      if (existingSession) {
        throw new AppError('You already have an active charging session', 400);
      }

      // Get connector and check availability
      const connector = await Connector.findByPk(connectorId, {
        include: [{ model: ChargingStation, as: 'station' }],
      });

      if (!connector) {
        throw new AppError('Connector not found', 404);
      }

      if (connector.status !== 'available') {
        throw new AppError('Connector is not available', 400);
      }

      // Get user and check balance
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const minimumBalance = connector.startFee || 500; // Minimum 500 AMD
      if (user.walletBalance < minimumBalance) {
        throw new AppError('Insufficient balance. Please top up your wallet.', 400);
      }

      // Create session
      const session = await ChargingSession.create({
        userId,
        connectorId,
        stationId: connector.stationId,
        sessionStatus: 'pending',
        maxAmountAmd: maxAmount,
        energyDeliveredKwh: 0,
        totalCostAmd: 0,
      });

      // Update connector status
      await connector.update({
        status: 'occupied',
        currentTransactionId: session.id,
      });

      logger.info(`Charging session started: ${session.id} for user ${userId}`);

      // Here you would call the CPO adapter to start the actual charging
      // await cpoAdapter.remoteStartTransaction(connectorId, userId);

      // Cache active session
      await cacheSet(
        CACHE_KEYS.activeSession(userId),
        session.toJSON(),
        CACHE_TTL.activeSession
      );

      return session;
    } catch (error) {
      logger.error('Error starting charging session:', error);
      throw error;
    }
  }

  /**
   * Stop a charging session
   */
  async stopCharging(sessionId: string, userId: string): Promise<ChargingSession> {
    try {
      const session = await ChargingSession.findByPk(sessionId, {
        include: [
          { model: Connector, as: 'connector' },
          { model: User, as: 'user' },
        ],
      });

      if (!session) {
        throw new AppError('Session not found', 404);
      }

      if (session.userId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      if (session.sessionStatus === 'completed') {
        throw new AppError('Session already completed', 400);
      }

      // Here you would call the CPO adapter to stop the actual charging
      // const sessionData = await cpoAdapter.remoteStopTransaction(session.transactionId);

      // Simulate session end
      const endTime = new Date();
      const startTime = session.startTime || session.createdAt;
      const durationMinutes = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 60000
      );

      // Calculate final cost
      const cost = calculateChargingCost(
        session.energyDeliveredKwh,
        durationMinutes,
        session.connector!.pricePerKwh,
        session.connector!.pricePerMinute || 0,
        session.connector!.startFee || 0
      );

      // Update session
      await session.update({
        sessionStatus: 'completed',
        endTime,
        totalCostAmd: cost.totalCost,
        energyCostAmd: cost.energyCost,
        timeCostAmd: cost.timeCost,
        startFeeCostAmd: cost.startFeeCost,
      });

      // Deduct from wallet
      const walletService = new WalletService();
      await walletService.deduct(userId, cost.totalCost, session.id);

      // Update connector status
      await session.connector!.update({
        status: 'available',
        currentTransactionId: null,
      });

      // Clear cache
      await cacheDelete(CACHE_KEYS.activeSession(userId));

      logger.info(`Charging session stopped: ${sessionId}`);

      return session;
    } catch (error) {
      logger.error('Error stopping charging session:', error);
      throw error;
    }
  }

  /**
   * Get active session for user
   */
  async getActiveSession(userId: string): Promise<ChargingSession | null> {
    // Check cache first
    const cached = await cacheGet<ChargingSession>(CACHE_KEYS.activeSession(userId));
    if (cached) {
      return cached as any;
    }

    const session = await ChargingSession.findOne({
      where: {
        userId,
        sessionStatus: ['pending', 'active'],
      },
      include: [
        { model: Connector, as: 'connector' },
        { model: ChargingStation, as: 'station' },
      ],
    });

    if (session) {
      await cacheSet(
        CACHE_KEYS.activeSession(userId),
        session.toJSON(),
        CACHE_TTL.activeSession
      );
    }

    return session;
  }

  /**
   * Get session history for user
   */
  async getSessionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ sessions: ChargingSession[]; total: number }> {
    const { rows: sessions, count: total } = await ChargingSession.findAndCountAll({
      where: {
        userId,
        sessionStatus: 'completed',
      },
      include: [
        { model: ChargingStation, as: 'station' },
        { model: Connector, as: 'connector' },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return { sessions, total };
  }

  /**
   * Get session by ID
   */
  async getSessionById(sessionId: string, userId: string): Promise<ChargingSession | null> {
    const session = await ChargingSession.findOne({
      where: { id: sessionId, userId },
      include: [
        { model: ChargingStation, as: 'station' },
        { model: Connector, as: 'connector' },
      ],
    });

    return session;
  }

  /**
   * Update session status (called by CPO webhook or polling)
   */
  async updateSessionStatus(sessionId: string, update: SessionUpdate): Promise<void> {
    const session = await ChargingSession.findByPk(sessionId);

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    const updates: any = {};

    if (update.energyDeliveredKwh !== undefined) {
      updates.energyDeliveredKwh = update.energyDeliveredKwh;
    }

    if (update.maxPowerKw !== undefined) {
      updates.maxPowerKw = update.maxPowerKw;
    }

    if (update.status) {
      updates.sessionStatus = update.status;
    }

    await session.update(updates);

    // Update cache
    if (session.sessionStatus === 'active' || session.sessionStatus === 'pending') {
      await cacheSet(
        CACHE_KEYS.activeSession(session.userId),
        session.toJSON(),
        CACHE_TTL.activeSession
      );
    }

    logger.info(`Session ${sessionId} updated:`, updates);
  }

  /**
   * Calculate current cost of active session
   */
  async calculateCurrentCost(sessionId: string): Promise<number> {
    const session = await ChargingSession.findByPk(sessionId, {
      include: [{ model: Connector, as: 'connector' }],
    });

    if (!session || !session.connector) {
      return 0;
    }

    const now = new Date();
    const startTime = session.startTime || session.createdAt;
    const durationMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000);

    const cost = calculateChargingCost(
      session.energyDeliveredKwh,
      durationMinutes,
      session.connector.pricePerKwh,
      session.connector.pricePerMinute || 0,
      session.connector.startFee || 0
    );

    return cost.totalCost;
  }
}

export default new SessionService();
