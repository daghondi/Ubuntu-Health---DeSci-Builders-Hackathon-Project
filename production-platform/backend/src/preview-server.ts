import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

// Load environment variables
config();

class UbuntuHealthPreviewServer {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
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
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', (_req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0-preview',
        environment: 'development-preview',
        message: 'Ubuntu Health Backend API - Preview Mode',
      });
    });

    // API documentation endpoint
    this.app.get('/api-docs', (_req, res) => {
      res.json({
        message: 'Ubuntu Health API Documentation - Preview',
        version: 'v1-preview',
        status: 'Development Preview - Limited Functionality',
        endpoints: {
          health: '/health',
          'api-docs': '/api-docs',
          patients: '/api/v1/patients/* (placeholder)',
          sponsors: '/api/v1/sponsors/* (placeholder)',
          treatments: '/api/v1/treatments/* (placeholder)',
          sponsorships: '/api/v1/sponsorships/* (placeholder)',
          research: '/api/v1/research/* (placeholder)',
          governance: '/api/v1/governance/* (placeholder)',
        },
        note: 'This is a preview version. Full functionality requires database setup and smart contract deployment.',
      });
    });
  }

  private initializeRoutes(): void {
    const apiVersion = process.env['API_VERSION'] || 'v1';
    const baseRoute = `/api/${apiVersion}`;

    // Mock authentication routes
    this.app.post(`${baseRoute}/auth/login`, (req, res) => {
      res.json({
        message: 'Mock wallet authentication endpoint',
        walletAddress: req.body.walletAddress || 'mock-wallet-address',
        token: 'mock-jwt-token',
        userType: 'patient',
        note: 'This is a preview - no actual authentication performed',
      });
    });

    // Mock patient routes
    this.app.get(`${baseRoute}/patients`, (_req, res) => {
      res.json({
        message: 'Mock patients endpoint',
        data: [
          {
            id: '1',
            name: 'Sarah Chen (Preview)',
            treatmentType: 'CAR-T Therapy',
            estimatedCost: 400000,
            urgency: 'High',
            location: 'Houston, TX',
            status: 'Seeking Sponsors',
          },
        ],
        note: 'This is mock data for preview purposes',
      });
    });

    // Mock sponsor routes
    this.app.get(`${baseRoute}/sponsors`, (_req, res) => {
      res.json({
        message: 'Mock sponsors endpoint',
        data: [
          {
            id: '1',
            name: 'Healthcare DAO',
            totalContributed: 150000,
            treatmentTypes: ['CAR-T Therapy', 'Gene Therapy'],
            status: 'Active',
          },
        ],
        note: 'This is mock data for preview purposes',
      });
    });

    // Mock treatment routes
    this.app.get(`${baseRoute}/treatments`, (_req, res) => {
      res.json({
        message: 'Mock treatments endpoint',
        data: [
          {
            id: '1',
            patientId: '1',
            type: 'CAR-T Therapy',
            cost: 400000,
            currentFunding: 75000,
            progress: '18.75%',
            milestones: [
              { title: 'Initial Consultation', status: 'completed' },
              { title: 'Pre-treatment Testing', status: 'in-progress' },
              { title: 'Cell Collection', status: 'pending' },
              { title: 'Treatment Administration', status: 'pending' },
            ],
          },
        ],
        note: 'This is mock data for preview purposes',
      });
    });

    // Mock blockchain endpoints
    this.app.get(`${baseRoute}/blockchain/balance/:wallet`, (req, res) => {
      res.json({
        walletAddress: req.params.wallet,
        solBalance: 2.5,
        livesTokenBalance: 1000,
        usdcBalance: 500,
        note: 'Mock blockchain data for preview',
      });
    });

    // 404 handler for API routes
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found (Preview Mode)',
        message: `The requested endpoint ${req.originalUrl} does not exist in preview mode`,
        availableEndpoints: [
          '/health',
          '/api-docs',
          `${baseRoute}/auth/login`,
          `${baseRoute}/patients`,
          `${baseRoute}/sponsors`,
          `${baseRoute}/treatments`,
          `${baseRoute}/blockchain/balance/:wallet`,
        ],
      });
    });

    // Root endpoint
    this.app.get('/', (_req, res) => {
      res.json({
        message: '🚀 Ubuntu Health Backend API - Preview Mode',
        version: '1.0.0-preview',
        status: 'Development Preview',
        documentation: '/api-docs',
        health: '/health',
        frontend: 'http://localhost:3000',
        note: 'This is a preview version for demonstration purposes. Full functionality requires database and smart contract setup.',
      });
    });
  }

  public start(): void {
    const port = parseInt(process.env['PORT'] || '3001', 10);
    
    this.app.listen(port, '0.0.0.0', () => {
      console.log(`
🚀 Ubuntu Health Backend API - Preview Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: development-preview
Port: ${port}
Health Check: http://localhost:${port}/health
API Documentation: http://localhost:${port}/api-docs
Frontend: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PREVIEW MODE: Limited functionality - no database or blockchain
      `);
    });
  }
}

// Start server
const server = new UbuntuHealthPreviewServer();
server.start();