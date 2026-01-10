import { Router } from 'express';
import { body, param } from 'express-validator';
import sessionController from '../controllers/sessionController';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All session routes require authentication
router.use(authenticateToken);

// Start charging session
router.post(
  '/start',
  validate([
    body('connectorId').isUUID().withMessage('Valid connector ID is required'),
    body('maxAmount').optional().isFloat({ min: 0 }).withMessage('Max amount must be positive'),
  ]),
  sessionController.startSession.bind(sessionController)
);

// Get active session
router.get('/active', sessionController.getActiveSession.bind(sessionController));

// Stop charging session
router.post(
  '/:id/stop',
  validate([
    param('id').isUUID().withMessage('Invalid session ID'),
  ]),
  sessionController.stopSession.bind(sessionController)
);

// Get session history
router.get('/history', sessionController.getSessionHistory.bind(sessionController));

// Get session by ID
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid session ID'),
  ]),
  sessionController.getSession.bind(sessionController)
);

export default router;
