import { Request, Response } from 'express';
import { getOCPPServer } from '../ocpp/OCPPServer';
import { AppError } from '../middleware/errorHandler';

/**
 * Controller for OCPP operations
 * Provides REST API to control OCPP charge points
 */
export class OCPPController {
  /**
   * Get list of connected charge points
   * GET /api/v1/ocpp/chargepoints
   */
  async getChargePoints(req: Request, res: Response): Promise<void> {
    try {
      const ocppServer = getOCPPServer();

      if (!ocppServer) {
        throw new AppError('OCPP server not initialized', 500);
      }

      const chargePoints = ocppServer.getConnectedChargePoints();

      res.json({
        success: true,
        count: chargePoints.length,
        chargePoints: chargePoints.map(id => ({
          chargePointId: id,
          connected: true,
        })),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if charge point is connected
   * GET /api/v1/ocpp/chargepoints/:id/status
   */
  async getChargePointStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ocppServer = getOCPPServer();

      if (!ocppServer) {
        throw new AppError('OCPP server not initialized', 500);
      }

      const connected = ocppServer.isChargePointConnected(id);

      res.json({
        success: true,
        chargePointId: id,
        connected,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Start remote charging session
   * POST /api/v1/ocpp/chargepoints/:id/start
   */
  async remoteStartTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { connectorId, idTag } = req.body;

      if (!connectorId || !idTag) {
        throw new AppError('connectorId and idTag are required', 400);
      }

      const ocppServer = getOCPPServer();

      if (!ocppServer) {
        throw new AppError('OCPP server not initialized', 500);
      }

      if (!ocppServer.isChargePointConnected(id)) {
        throw new AppError('Charge point not connected', 404);
      }

      const result = await ocppServer.remoteStartTransaction(
        id,
        parseInt(connectorId),
        idTag
      );

      res.json({
        success: true,
        chargePointId: id,
        connectorId,
        result,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Stop remote charging session
   * POST /api/v1/ocpp/chargepoints/:id/stop
   */
  async remoteStopTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { transactionId } = req.body;

      if (!transactionId) {
        throw new AppError('transactionId is required', 400);
      }

      const ocppServer = getOCPPServer();

      if (!ocppServer) {
        throw new AppError('OCPP server not initialized', 500);
      }

      if (!ocppServer.isChargePointConnected(id)) {
        throw new AppError('Charge point not connected', 404);
      }

      const result = await ocppServer.remoteStopTransaction(
        id,
        parseInt(transactionId)
      );

      res.json({
        success: true,
        chargePointId: id,
        transactionId,
        result,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get OCPP server info
   * GET /api/v1/ocpp/info
   */
  async getInfo(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      protocol: 'OCPP 1.6J',
      description: 'Open Charge Point Protocol WebSocket Server',
      websocketEndpoint: '/ocpp',
      specification: 'https://www.openchargealliance.org/protocols/ocpp-16/',
      supportedActions: [
        'BootNotification',
        'Heartbeat',
        'Authorize',
        'StartTransaction',
        'StopTransaction',
        'StatusNotification',
        'MeterValues',
        'RemoteStartTransaction',
        'RemoteStopTransaction',
      ],
      notes: {
        connection: 'Charge points connect via WebSocket to ws://yourserver/ocpp/{chargePointId}',
        authentication: 'Basic authentication recommended (to be implemented)',
        realtime: 'Status updates and meter values broadcasted via Socket.io',
      },
    });
  }
}

export default new OCPPController();
