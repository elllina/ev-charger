import { Router } from 'express';
import { param } from 'express-validator';
import stationController from '../controllers/stationController';
import { validate } from '../middleware/validation';

const router = Router();

// Get all networks
router.get('/', stationController.getNetworks.bind(stationController));

// Get network by slug
router.get(
  '/:slug',
  validate([
    param('slug').notEmpty().withMessage('Network slug is required'),
  ]),
  stationController.getNetwork.bind(stationController)
);

export default router;
