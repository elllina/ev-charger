import { Router } from 'express';
import authRoutes from './authRoutes';
import stationRoutes from './stationRoutes';
import networkRoutes from './networkRoutes';
import sessionRoutes from './sessionRoutes';
import walletRoutes from './walletRoutes';
import favoriteRoutes from './favoriteRoutes';
import ocmRoutes from './ocmRoutes';

const router = Router();

// API v1 routes
router.use('/auth', authRoutes);
router.use('/stations', stationRoutes);
router.use('/networks', networkRoutes);
router.use('/sessions', sessionRoutes);
router.use('/user/wallet', walletRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/ocm', ocmRoutes); // Open Charge Map integration

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
