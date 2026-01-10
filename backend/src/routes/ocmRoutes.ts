import { Router } from 'express';
import ocmController from '../controllers/ocmController';

const router = Router();

/**
 * Open Charge Map Routes
 * Base: /api/v1/ocm
 */

// Get nearby stations
router.get('/nearby', (req, res, next) => {
  ocmController.getNearbyStations(req, res).catch(next);
});

// Get station by ID
router.get('/station/:id', (req, res, next) => {
  ocmController.getStationById(req, res).catch(next);
});

// Get stations by country
router.get('/country/:code', (req, res, next) => {
  ocmController.getStationsByCountry(req, res).catch(next);
});

// Get OCM info
router.get('/info', (req, res, next) => {
  ocmController.getInfo(req, res).catch(next);
});

export default router;
