import { Response } from 'express';
import WalletService from '../services/WalletService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class WalletController {
  /**
   * Get wallet balance
   */
  async getWallet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const balance = await WalletService.getBalance(userId);

      res.json({
        balance,
        currency: 'AMD',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Top up wallet
   */
  async topUp(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { amount, paymentMethod, paymentReference } = req.body;

      if (!amount || amount <= 0) {
        throw new AppError('Invalid amount', 400);
      }

      if (!paymentMethod || !['card', 'idram', 'telcell'].includes(paymentMethod)) {
        throw new AppError('Invalid payment method', 400);
      }

      // TODO: Integrate with actual payment gateway (iDram, bank card, etc.)
      // For now, we just create the transaction

      const transaction = await WalletService.topUp(
        userId,
        amount,
        paymentMethod,
        paymentReference
      );

      res.json({
        message: 'Wallet topped up successfully',
        transaction,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const { transactions, total } = await WalletService.getTransactions(
        userId,
        limit,
        offset
      );

      res.json({
        total,
        count: transactions.length,
        transactions,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const transaction = await WalletService.getTransaction(id, userId);

      if (!transaction) {
        throw new AppError('Transaction not found', 404);
      }

      res.json(transaction);
    } catch (error) {
      throw error;
    }
  }
}

export default new WalletController();
