import { Router } from 'express';
import { body, param } from 'express-validator';
import stationController from '../controllers/stationController';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All favorite routes require authentication
router.use(authenticateToken);

// Get user's favorites
router.get('/', stationController.getFavorites.bind(stationController));

// Add to favorites
router.post(
  '/',
  validate([
    body('stationId').isUUID().withMessage('Valid station ID is required'),
  ]),
  stationController.addFavorite.bind(stationController)
);

// Remove from favorites
router.delete(
  '/:stationId',
  validate([
    param('stationId').isUUID().withMessage('Invalid station ID'),
  ]),
  stationController.removeFavorite.bind(stationController)
);

export default router;
