import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';

// Import routes
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import sponsorRoutes from './routes/sponsors';
import treatmentRoutes from './routes/treatments';
import sponsorshipRoutes from './routes/sponsorships';
import researchRoutes from './routes/research';
import governanceRoutes from './routes/governance';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { rateLimiter } from './middleware/rateLimiter';
import { validateRequest } from './middleware/validation';

// Services
import { SolanaService } from './services/SolanaService';
import { NotificationService } from './services/NotificationService';

// Load environment variables
config();

class UbuntuHealthServer {
  private app: express.Application;
  private server: any;
  private prisma: PrismaClient;
  private solanaService: SolanaService;
  private notificationService: NotificationService;

  constructor() {
    this.app = express();
    this.prisma = new PrismaClient();
    this.solanaService = new SolanaService();
    this.notificationService = new NotificationService();
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    this.app.use(logger);

    // Rate limiting
    this.app.use(rateLimiter);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      });
    });

    // API documentation endpoint
    if (process.env.SWAGGER_ENABLED === 'true') {
      this.app.get('/api-docs', (req, res) => {
        res.json({
          message: 'Ubuntu Health API Documentation',
          version: 'v1',
          endpoints: {
            auth: '/api/v1/auth/*',
            patients: '/api/v1/patients/*',
            sponsors: '/api/v1/sponsors/*',
            treatments: '/api/v1/treatments/*',
            sponsorships: '/api/v1/sponsorships/*',
            research: '/api/v1/research/*',
            governance: '/api/v1/governance/*',
          },
        });
      });
    }
  }

  private initializeRoutes(): void {
    const apiVersion = process.env.API_VERSION || 'v1';
    const baseRoute = `/api/${apiVersion}`;

    // Authentication routes
    this.app.use(`${baseRoute}/auth`, authRoutes);
    
    // Core entity routes
    this.app.use(`${baseRoute}/patients`, patientRoutes);
    this.app.use(`${baseRoute}/sponsors`, sponsorRoutes);
    this.app.use(`${baseRoute}/treatments`, treatmentRoutes);
    this.app.use(`${baseRoute}/sponsorships`, sponsorshipRoutes);
    
    // Research and governance
    this.app.use(`${baseRoute}/research`, researchRoutes);
    this.app.use(`${baseRoute}/governance`, governanceRoutes);

    // 404 handler for API routes
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`,
        availableEndpoints: [
          `${baseRoute}/auth`,
          `${baseRoute}/patients`,
          `${baseRoute}/sponsors`,
          `${baseRoute}/treatments`,
          `${baseRoute}/sponsorships`,
          `${baseRoute}/research`,
          `${baseRoute}/governance`,
        ],
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use(errorHandler);

    // Unhandled promise rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown('UNHANDLED_REJECTION');
    });

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    console.log(`Received ${signal}. Starting graceful shutdown...`);

    // Stop accepting new connections
    if (this.server) {
      this.server.close(() => {
        console.log('HTTP server closed');
      });
    }

    try {
      // Close database connections
      await this.prisma.$disconnect();
      console.log('Database connections closed');

      // Close other services
      await this.solanaService.disconnect();
      await this.notificationService.disconnect();
      console.log('External services disconnected');

      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      // Initialize database connection
      await this.prisma.$connect();
      console.log('Database connected successfully');

      // Initialize Solana connection
      await this.solanaService.initialize();
      console.log('Solana service initialized');

      // Initialize notification service
      await this.notificationService.initialize();
      console.log('Notification service initialized');

      // Start server
      const port = parseInt(process.env.PORT || '3001', 10);
      this.server = createServer(this.app);
      
      this.server.listen(port, '0.0.0.0', () => {
        console.log(`
🚀 Ubuntu Health Backend API Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: ${process.env.NODE_ENV || 'development'}
Port: ${port}
API Version: ${process.env.API_VERSION || 'v1'}
Health Check: http://localhost:${port}/health
API Documentation: http://localhost:${port}/api-docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
      });

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new UbuntuHealthServer();
  server.start().catch((error) => {
    console.error('Failed to start Ubuntu Health server:', error);
    process.exit(1);
  });
}

export default UbuntuHealthServer;