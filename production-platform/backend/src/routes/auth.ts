import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth';

const router = Router();

// Types for authentication
interface AuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
  userType?: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}

/**
 * POST /auth/login
 * Authenticate user with Solana wallet signature
 */
router.post('/login', async (req: Request, res: Response<LoginResponse>) => {
  try {
    const { walletAddress, signature, message, userType }: AuthRequest = req.body;

    // Validate required fields
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: walletAddress, signature, message'
      });
    }

    // Verify the wallet signature
    const isValidSignature = authMiddleware.verifySolanaSignature(message, signature, walletAddress);
    if (!isValidSignature) {
      return res.status(401).json({
        success: false,
        message: 'Invalid wallet signature'
      });
    }

    // Mock user creation for now (will connect to database later)
    const user = {
      id: `user_${Date.now()}`,
      walletAddress,
      userType: userType || 'PATIENT',
      isVerified: false,
      lastLogin: new Date()
    };

    // Generate JWT tokens
    const jwtSecret = process.env['JWT_SECRET'] || 'your-super-secret-jwt-key';
    const refreshSecret = process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret';

    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: user.walletAddress,
        userType: user.userType
      },
      jwtSecret,
      { expiresIn: process.env['JWT_EXPIRES_IN'] || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      refreshSecret,
      { expiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '30d' }
    );

    res.json({
      success: true,
      token,
      refreshToken,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
});

/**
 * POST /auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', (_req: Request, res: Response) => {
  // With JWT, logout is typically handled client-side by removing the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * GET /auth/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', authMiddleware.authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    return res.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        userType: user.userType,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;