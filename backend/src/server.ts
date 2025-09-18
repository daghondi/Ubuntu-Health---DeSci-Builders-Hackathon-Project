import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { errorHandler } from './middleware/error.middleware';
import { logger } from './middleware/logging.middleware';
import { ubuntuConsensusMiddleware } from './middleware/ubuntu-consensus.middleware';

// Import route handlers
import patientRoutes from './routes/patient.routes';
import sponsorRoutes from './routes/sponsor.routes';
import communityRoutes from './routes/community.routes';
import recoveryLogRoutes from './routes/recovery-logs.routes';
import governanceRoutes from './routes/governance.routes';
import ubuntuValidationRoutes from './routes/ubuntu-validation.routes';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:", "ipfs.io", "gateway.pinata.cloud", "arweave.net"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
}));

// Rate limiting with Ubuntu community consideration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, Ubuntu philosophy encourages patience and mindful interaction.',
    ubuntu_wisdom: 'In Ubuntu, we believe in measured actions that benefit the community.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(cors());
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ubuntu Philosophy Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    ubuntu_message: 'I am because we are - Ubuntu Health is thriving',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    ubuntu_principles: {
      community_consensus: true,
      elder_wisdom_integration: true,
      cultural_preservation: true,
      collective_healing: true
    }
  });
});

// Ubuntu Community Greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Ubuntu Health API',
    ubuntu_greeting: 'Sawubona - I see you, and in seeing you, I am',
    philosophy: 'Ubuntu: I am because we are',
    mission: 'Community-driven decentralized healthcare rooted in Ubuntu philosophy',
    endpoints: {
      patients: '/api/patients',
      sponsors: '/api/sponsors',
      community: '/api/community',
      recovery_logs: '/api/recovery-logs',
      governance: '/api/governance',
      ubuntu_validation: '/api/ubuntu-validation'
    }
  });
});

// Apply Ubuntu consensus middleware to sensitive operations
app.use('/api/governance', ubuntuConsensusMiddleware);
app.use('/api/ubuntu-validation', ubuntuConsensusMiddleware);

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/recovery-logs', recoveryLogRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/ubuntu-validation', ubuntuValidationRoutes);

// Socket.IO for real-time Ubuntu community interactions
io.on('connection', (socket) => {
  logger.info(`Ubuntu community member connected: ${socket.id}`);

  // Join Ubuntu community rooms
  socket.on('join-ubuntu-community', ({ communityId, memberType }) => {
    socket.join(`ubuntu-community-${communityId}`);
    socket.join(`member-type-${memberType}`);
    
    // Broadcast Ubuntu welcome to community
    socket.to(`ubuntu-community-${communityId}`).emit('ubuntu-member-joined', {
      message: 'A new member has joined our Ubuntu circle',
      memberType,
      timestamp: new Date().toISOString()
    });
  });

  // Handle Ubuntu consensus voting
  socket.on('ubuntu-consensus-vote', ({ proposalId, vote, communityId }) => {
    io.to(`ubuntu-community-${communityId}`).emit('consensus-vote-cast', {
      proposalId,
      vote,
      timestamp: new Date().toISOString(),
      ubuntu_message: 'Community voice heard - Ubuntu consensus in progress'
    });
  });

  // Handle elder council notifications
  socket.on('elder-council-decision', ({ decision, communityId }) => {
    io.to(`ubuntu-community-${communityId}`).emit('elder-wisdom-shared', {
      decision,
      timestamp: new Date().toISOString(),
      ubuntu_message: 'Elder wisdom guides our community path'
    });
  });

  // Handle healing journey updates
  socket.on('healing-progress-update', ({ patientId, progress, communityId }) => {
    io.to(`ubuntu-community-${communityId}`).emit('healing-journey-progress', {
      patientId,
      progress,
      timestamp: new Date().toISOString(),
      ubuntu_message: 'When one heals, we all heal - Ubuntu collective healing'
    });
  });

  socket.on('disconnect', () => {
    logger.info(`Ubuntu community member disconnected: ${socket.id}`);
  });
});

// Global error handler
app.use(errorHandler);

// Handle unhandled routes with Ubuntu wisdom
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    ubuntu_wisdom: 'In Ubuntu, we help guide each other to the right path',
    message: 'The path you seek does not exist, but the community is here to help',
    available_paths: {
      health_check: '/health',
      api_documentation: '/api-docs',
      ubuntu_philosophy: '/ubuntu-philosophy'
    }
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Ubuntu Health API server running on port ${PORT}`);
  logger.info('Ubuntu Philosophy: I am because we are');
  logger.info('Community-driven healthcare for all');
});

// Graceful shutdown with Ubuntu blessing
process.on('SIGTERM', () => {
  logger.info('Ubuntu Health server shutting down gracefully...');
  logger.info('May the Ubuntu spirit continue to guide community healing');
  httpServer.close(() => {
    logger.info('Ubuntu Health server closed');
    process.exit(0);
  });
});

export { app, io };
