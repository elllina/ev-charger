import { Response } from 'express';
import SessionService from '../services/SessionService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class SessionController {
  /**
   * Start charging session
   */
  async startSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { connectorId, maxAmount } = req.body;

      if (!connectorId) {
        throw new AppError('Connector ID is required', 400);
      }

      const session = await SessionService.startCharging(userId, connectorId, maxAmount);

      res.status(201).json({
        message: 'Charging session started',
        session,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Stop charging session
   */
  async stopSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const session = await SessionService.stopCharging(id, userId);

      res.json({
        message: 'Charging session stopped',
        session,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get active session
   */
  async getActiveSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const session = await SessionService.getActiveSession(userId);

      if (!session) {
        res.json({ session: null });
        return;
      }

      // Calculate current cost
      const currentCost = await SessionService.calculateCurrentCost(session.id);

      res.json({
        session: {
          ...session.toJSON(),
          currentCost,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get session history
   */
  async getSessionHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const { sessions, total } = await SessionService.getSessionHistory(userId, limit, offset);

      res.json({
        total,
        count: sessions.length,
        sessions,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get session by ID
   */
  async getSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const session = await SessionService.getSessionById(id, userId);

      if (!session) {
        throw new AppError('Session not found', 404);
      }

      res.json(session);
    } catch (error) {
      throw error;
    }
  }
}

export default new SessionController();
