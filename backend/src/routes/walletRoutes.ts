import { Router } from 'express';
import { body, param } from 'express-validator';
import walletController from '../controllers/walletController';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All wallet routes require authentication
router.use(authenticateToken);

// Get wallet balance
router.get('/', walletController.getWallet.bind(walletController));

// Top up wallet
router.post(
  '/topup',
  validate([
    body('amount').isFloat({ min: 100 }).withMessage('Minimum top-up amount is 100 AMD'),
    body('paymentMethod')
      .isIn(['card', 'idram', 'telcell'])
      .withMessage('Invalid payment method'),
  ]),
  walletController.topUp.bind(walletController)
);

// Get transaction history
router.get('/transactions', walletController.getTransactions.bind(walletController));

// Get transaction by ID
router.get(
  '/transactions/:id',
  validate([
    param('id').isUUID().withMessage('Invalid transaction ID'),
  ]),
  walletController.getTransaction.bind(walletController)
);

export default router;
