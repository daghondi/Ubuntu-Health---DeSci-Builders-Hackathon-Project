import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

// Load environment variables
config();

const app = express();
const PORT = parseInt(process.env['PORT'] || '3001', 10);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000', 'https://www.tale-verse.app'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] || '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
  });
});

// JWT middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const secret = process.env['JWT_SECRET'] || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Verify Solana signature
const verifySolanaSignature = (publicKey: string, signature: string, message: string): boolean => {
  try {
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);
    
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// Auth routes
app.post('/api/v1/auth/login', (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;

    if (!publicKey || !signature || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields: publicKey, signature, message' 
      });
    }

    // Verify Solana signature
    const isValidSignature = verifySolanaSignature(publicKey, signature, message);
    
    if (!isValidSignature) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Create JWT token
    const jwtSecret = process.env['JWT_SECRET'] || 'your-secret-key';
    const token = jwt.sign(
      { 
        walletAddress: publicKey,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      jwtSecret
    );

    const refreshToken = jwt.sign(
      { 
        walletAddress: publicKey,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      },
      jwtSecret
    );

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        walletAddress: publicKey,
        role: 'user'
      }
    });

    } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});app.post('/api/v1/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const jwtSecret = process.env['JWT_SECRET'] || 'your-secret-key';
    const decoded = jwt.verify(refreshToken, jwtSecret) as any;

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newToken = jwt.sign(
      { 
        walletAddress: decoded.walletAddress,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      },
      jwtSecret
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Protected routes
app.get('/api/v1/auth/me', authenticateToken, (req: any, res) => {
  res.json({
    success: true,
    user: {
      walletAddress: req.user.walletAddress,
      role: 'user'
    }
  });
});

// Basic API routes
app.get('/api/v1/patients', authenticateToken, (_req, res) => {
  res.json({ message: 'Patients endpoint', data: [] });
});

app.get('/api/v1/sponsors', authenticateToken, (_req, res) => {
  res.json({ message: 'Sponsors endpoint', data: [] });
});

app.get('/api/v1/treatments', authenticateToken, (_req, res) => {
  res.json({ message: 'Treatments endpoint', data: [] });
});

app.get('/api/v1/sponsorships', authenticateToken, (_req, res) => {
  res.json({ message: 'Sponsorships endpoint', data: [] });
});

app.get('/api/v1/research', authenticateToken, (_req, res) => {
  res.json({ message: 'Research endpoint', data: [] });
});

app.get('/api/v1/governance', authenticateToken, (_req, res) => {
  res.json({ message: 'Governance endpoint', data: [] });
});

// API documentation
app.get('/api-docs', (_req, res) => {
  res.json({
    title: 'Ubuntu Health API',
    version: '1.0.0',
    description: 'Decentralized healthcare platform API',
    endpoints: {
      'POST /api/v1/auth/login': 'Authenticate with Solana wallet',
      'POST /api/v1/auth/refresh': 'Refresh JWT token',
      'GET /api/v1/auth/me': 'Get current user info',
      'GET /api/v1/patients': 'Get patients data',
      'GET /api/v1/sponsors': 'Get sponsors data',
      'GET /api/v1/treatments': 'Get treatments data',
      'GET /api/v1/sponsorships': 'Get sponsorships data',
      'GET /api/v1/research': 'Get research data',
      'GET /api/v1/governance': 'Get governance data',
      'GET /health': 'Health check endpoint'
    }
  });
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env['NODE_ENV'] === 'development' && { error: err.message })
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Ubuntu Health API Server Started
📡 Port: ${PORT}
🌍 Environment: ${process.env['NODE_ENV'] || 'development'}
🌐 API Endpoint: http://localhost:${PORT}
📚 API Documentation: http://localhost:${PORT}/api-docs
💚 Health Check: http://localhost:${PORT}/health
  `);
});

export default app;