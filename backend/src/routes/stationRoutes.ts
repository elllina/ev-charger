import { Router } from 'express';
import { query, param, body } from 'express-validator';
import stationController from '../controllers/stationController';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get nearby stations
router.get(
  '/',
  validate([
    query('lat').notEmpty().isFloat().withMessage('Valid latitude is required'),
    query('lng').notEmpty().isFloat().withMessage('Valid longitude is required'),
    query('radius').optional().isFloat({ min: 0.1, max: 100 }).withMessage('Radius must be between 0.1 and 100 km'),
  ]),
  stationController.getNearbyStations.bind(stationController)
);

// Get station by ID
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid station ID'),
  ]),
  stationController.getStation.bind(stationController)
);

// Get station connectors
router.get(
  '/:id/connectors',
  validate([
    param('id').isUUID().withMessage('Invalid station ID'),
  ]),
  stationController.getStationConnectors.bind(stationController)
);

export default router;
