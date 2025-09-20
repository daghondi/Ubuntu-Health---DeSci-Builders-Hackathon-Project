import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        walletAddress: string;
        userType: string;
        isVerified: boolean;
      };
    }
  }
}

// JWT payload interface
interface JwtPayload {
  walletAddress: string;
  userType: string;
  isVerified: boolean;
  iat: number;
  exp: number;
}

// Solana signature verification request
interface SignatureVerificationRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

/**
 * Verify Solana wallet signature
 */
export const verifySolanaSignature = (
  message: string,
  signature: string,
  walletAddress: string
): boolean => {
  try {
    // Convert wallet address to PublicKey
    const publicKey = new PublicKey(walletAddress);
    
    // Decode the signature from base58
    const signatureBytes = bs58.decode(signature);
    
    // Convert message to bytes
    const messageBytes = new TextEncoder().encode(message);
    
    // Verify the signature
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey.toBytes());
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

/**
 * Generate JWT token for authenticated user
 */
export const generateJwtToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  const jwtSecret = process.env['JWT_SECRET'];
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  const expiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
  
  return jwt.sign(payload, jwtSecret, { 
    expiresIn,
    algorithm: 'HS256' 
  });
};

/**
 * Verify JWT token
 */
export const verifyJwtToken = (token: string): JwtPayload | null => {
  try {
    const jwtSecret = process.env['JWT_SECRET'];
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ 
      error: 'Access token required',
      code: 'MISSING_TOKEN' 
    });
    return;
  }

  const payload = verifyJwtToken(token);
  if (!payload) {
    res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN' 
    });
    return;
  }

  // Attach user data to request
  req.user = {
    walletAddress: payload.walletAddress,
    userType: payload.userType,
    isVerified: payload.isVerified
  };

  next();
};

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED' 
      });
      return;
    }

    if (!allowedRoles.includes(req.user.userType)) {
      res.status(403).json({ 
        error: 'Insufficient privileges',
        code: 'INSUFFICIENT_ROLE',
        required: allowedRoles,
        current: req.user.userType
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is verified
 */
export const requireVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ 
      error: 'Authentication required',
      code: 'NOT_AUTHENTICATED' 
    });
    return;
  }

  if (!req.user.isVerified) {
    res.status(403).json({ 
      error: 'Account verification required',
      code: 'NOT_VERIFIED' 
    });
    return;
  }

  next();
};

/**
 * Generate authentication challenge message
 */
export const generateAuthChallenge = (walletAddress: string): string => {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 15);
  
  return `Ubuntu Health Authentication\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}\n\nPlease sign this message to authenticate with Ubuntu Health platform.`;
};

/**
 * Validate authentication challenge
 */
export const validateAuthChallenge = (message: string): boolean => {
  try {
    const lines = message.split('\n');
    const timestampLine = lines.find(line => line.startsWith('Timestamp: '));
    
    if (!timestampLine) return false;
    
    const timestamp = parseInt(timestampLine.replace('Timestamp: ', ''));
    const now = Date.now();
    
    // Challenge expires after 5 minutes
    const maxAge = 5 * 60 * 1000;
    
    return (now - timestamp) <= maxAge;
  } catch (error) {
    console.error('Challenge validation failed:', error);
    return false;
  }
};

/**
 * OAuth-style authentication flow for Solana wallets
 */
export const solanaAuthFlow = {
  // Step 1: Request challenge
  requestChallenge: (req: Request, res: Response): void => {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      res.status(400).json({ 
        error: 'Wallet address required',
        code: 'MISSING_WALLET' 
      });
      return;
    }

    try {
      // Validate wallet address format
      new PublicKey(walletAddress);
      
      const challenge = generateAuthChallenge(walletAddress);
      
      res.json({
        challenge,
        expiresIn: 300, // 5 minutes
        walletAddress
      });
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid wallet address',
        code: 'INVALID_WALLET' 
      });
    }
  },

  // Step 2: Verify signature and issue token
  verifyAndAuthenticate: async (req: Request, res: Response): Promise<void> => {
    const { walletAddress, signature, message } = req.body as SignatureVerificationRequest;
    
    if (!walletAddress || !signature || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: walletAddress, signature, message',
        code: 'MISSING_FIELDS' 
      });
      return;
    }

    // Validate challenge message
    if (!validateAuthChallenge(message)) {
      res.status(400).json({ 
        error: 'Invalid or expired challenge',
        code: 'INVALID_CHALLENGE' 
      });
      return;
    }

    // Verify signature
    if (!verifySolanaSignature(message, signature, walletAddress)) {
      res.status(401).json({ 
        error: 'Invalid signature',
        code: 'INVALID_SIGNATURE' 
      });
      return;
    }

    try {
      // TODO: Check if user exists in database and get user type
      // For now, default to 'PATIENT'
      const userType = 'PATIENT';
      const isVerified = false;

      // Generate JWT token
      const token = generateJwtToken({
        walletAddress,
        userType,
        isVerified
      });

      res.json({
        token,
        user: {
          walletAddress,
          userType,
          isVerified
        },
        expiresIn: process.env['JWT_EXPIRES_IN'] || '7d'
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ 
        error: 'Authentication failed',
        code: 'AUTH_ERROR' 
      });
    }
  }
};

export default {
  authenticateToken,
  requireRole,
  requireVerification,
  solanaAuthFlow,
  verifySolanaSignature,
  generateJwtToken,
  verifyJwtToken
};