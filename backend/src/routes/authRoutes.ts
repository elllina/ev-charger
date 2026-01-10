import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Register
router.post(
  '/register',
  validate([
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('preferredLanguage')
      .optional()
      .isIn(['hy', 'ru', 'en'])
      .withMessage('Invalid language'),
  ]),
  authController.register.bind(authController)
);

// Login
router.post(
  '/login',
  validate([
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  authController.login.bind(authController)
);

// Verify OTP
router.post(
  '/verify-otp',
  validate([
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('code').notEmpty().withMessage('Verification code is required'),
  ]),
  authController.verifyOTP.bind(authController)
);

// Refresh token
router.post(
  '/refresh-token',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ]),
  authController.refreshToken.bind(authController)
);

// Get profile (protected)
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

// Update profile (protected)
router.patch('/profile', authenticateToken, authController.updateProfile.bind(authController));

export default router;
