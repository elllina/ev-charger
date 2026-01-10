import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { generateAccessToken, generateRefreshToken, AuthRequest } from '../middleware/auth';
import { formatArmenianPhone, isValidArmenianPhone, generateOTP } from '../utils/helpers';
import { logger } from '../config/logger';

export class AuthController {
  /**
   * Register new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { phone, password, firstName, lastName, preferredLanguage } = req.body;

      // Format and validate phone
      const formattedPhone = formatArmenianPhone(phone);
      if (!isValidArmenianPhone(formattedPhone)) {
        throw new AppError('Invalid Armenian phone number format', 400);
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { phone: formattedPhone } });
      if (existingUser) {
        throw new AppError('User with this phone number already exists', 409);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Generate OTP for verification
      const verificationCode = generateOTP(6);
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user
      const user = await User.create({
        phone: formattedPhone,
        passwordHash,
        firstName,
        lastName,
        preferredLanguage: preferredLanguage || 'hy',
        verificationCode,
        verificationCodeExpiry,
        isVerified: false,
        walletBalance: 0,
      });

      logger.info(`New user registered: ${user.id} - ${formattedPhone}`);

      // TODO: Send SMS with verification code
      logger.info(`Verification code for ${formattedPhone}: ${verificationCode}`);

      res.status(201).json({
        message: 'User registered successfully. Please verify your phone number.',
        userId: user.id,
        phone: user.phone,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { phone, password } = req.body;

      // Format phone
      const formattedPhone = formatArmenianPhone(phone);

      // Find user
      const user = await User.findOne({ where: { phone: formattedPhone } });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check if verified
      if (!user.isVerified) {
        throw new AppError('Please verify your phone number first', 403);
      }

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user.id, phone: user.phone });
      const refreshToken = generateRefreshToken({ userId: user.id, phone: user.phone });

      // Save refresh token
      await user.update({ refreshToken });

      logger.info(`User logged in: ${user.id}`);

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          walletBalance: user.walletBalance,
          preferredLanguage: user.preferredLanguage,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { phone, code } = req.body;

      const formattedPhone = formatArmenianPhone(phone);

      const user = await User.findOne({ where: { phone: formattedPhone } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.isVerified) {
        throw new AppError('Phone number already verified', 400);
      }

      if (!user.verificationCode || !user.verificationCodeExpiry) {
        throw new AppError('No verification code found', 400);
      }

      if (new Date() > user.verificationCodeExpiry) {
        throw new AppError('Verification code expired', 400);
      }

      if (user.verificationCode !== code) {
        throw new AppError('Invalid verification code', 400);
      }

      // Mark as verified
      await user.update({
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
      });

      logger.info(`User verified: ${user.id}`);

      res.json({
        message: 'Phone number verified successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token required', 400);
      }

      const user = await User.findOne({ where: { refreshToken } });
      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const accessToken = generateAccessToken({ userId: user.id, phone: user.phone });
      const newRefreshToken = generateRefreshToken({ userId: user.id, phone: user.phone });

      // Update refresh token
      await user.update({ refreshToken: newRefreshToken });

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;

      res.json({
        id: user.id,
        phone: user.phone,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        walletBalance: user.walletBalance,
        preferredLanguage: user.preferredLanguage,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { firstName, lastName, email, preferredLanguage } = req.body;

      const updates: any = {};
      if (firstName !== undefined) updates.firstName = firstName;
      if (lastName !== undefined) updates.lastName = lastName;
      if (email !== undefined) updates.email = email;
      if (preferredLanguage !== undefined) updates.preferredLanguage = preferredLanguage;

      await user.update(updates);

      logger.info(`User profile updated: ${user.id}`);

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          preferredLanguage: user.preferredLanguage,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthController();
