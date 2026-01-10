import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import { sequelize } from '../config/database';

export class WalletService {
  /**
   * Get user's wallet balance
   */
  async getBalance(userId: string): Promise<number> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.walletBalance;
  }

  /**
   * Top up wallet
   */
  async topUp(
    userId: string,
    amount: number,
    paymentMethod: 'card' | 'idram' | 'telcell',
    paymentReference?: string
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new AppError('Amount must be positive', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const balanceBefore = user.walletBalance;
      const balanceAfter = balanceBefore + amount;

      // Update user balance
      await user.update(
        { walletBalance: balanceAfter },
        { transaction }
      );

      // Create transaction record
      const txn = await Transaction.create(
        {
          userId,
          type: 'topup',
          amount,
          balanceBefore,
          balanceAfter,
          paymentMethod,
          paymentReference,
          status: 'completed',
          description: `Wallet top-up via ${paymentMethod}`,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Wallet topped up: ${userId} - ${amount} AMD`);

      return txn;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error topping up wallet:', error);
      throw error;
    }
  }

  /**
   * Deduct from wallet (for charging sessions)
   */
  async deduct(
    userId: string,
    amount: number,
    sessionId: string
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new AppError('Amount must be positive', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const balanceBefore = user.walletBalance;

      if (balanceBefore < amount) {
        throw new AppError('Insufficient balance', 400);
      }

      const balanceAfter = balanceBefore - amount;

      // Update user balance
      await user.update(
        { walletBalance: balanceAfter },
        { transaction }
      );

      // Create transaction record
      const txn = await Transaction.create(
        {
          userId,
          sessionId,
          type: 'charge',
          amount,
          balanceBefore,
          balanceAfter,
          paymentMethod: 'wallet',
          status: 'completed',
          description: 'Charging session payment',
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Wallet deducted: ${userId} - ${amount} AMD for session ${sessionId}`);

      return txn;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deducting from wallet:', error);
      throw error;
    }
  }

  /**
   * Refund to wallet
   */
  async refund(
    userId: string,
    amount: number,
    reason: string,
    sessionId?: string
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new AppError('Amount must be positive', 400);
    }

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const balanceBefore = user.walletBalance;
      const balanceAfter = balanceBefore + amount;

      // Update user balance
      await user.update(
        { walletBalance: balanceAfter },
        { transaction }
      );

      // Create transaction record
      const txn = await Transaction.create(
        {
          userId,
          sessionId,
          type: 'refund',
          amount,
          balanceBefore,
          balanceAfter,
          status: 'completed',
          description: reason,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Wallet refunded: ${userId} - ${amount} AMD - ${reason}`);

      return txn;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error refunding wallet:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const { rows: transactions, count: total } = await Transaction.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return { transactions, total };
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string, userId: string): Promise<Transaction | null> {
    return Transaction.findOne({
      where: { id: transactionId, userId },
    });
  }
}

export default new WalletService();
