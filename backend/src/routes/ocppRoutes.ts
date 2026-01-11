import { Router } from 'express';
import ocppController from '../controllers/ocppController';

const router = Router();

/**
 * OCPP Routes
 * Base: /api/v1/ocpp
 */

// Get OCPP info
router.get('/info', (req, res, next) => {
  ocppController.getInfo(req, res).catch(next);
});

// Get all connected charge points
router.get('/chargepoints', (req, res, next) => {
  ocppController.getChargePoints(req, res).catch(next);
});

// Get charge point status
router.get('/chargepoints/:id/status', (req, res, next) => {
  ocppController.getChargePointStatus(req, res).catch(next);
});

// Start remote charging
router.post('/chargepoints/:id/start', (req, res, next) => {
  ocppController.remoteStartTransaction(req, res).catch(next);
});

// Stop remote charging
router.post('/chargepoints/:id/stop', (req, res, next) => {
  ocppController.remoteStopTransaction(req, res).catch(next);
});

export default router;
