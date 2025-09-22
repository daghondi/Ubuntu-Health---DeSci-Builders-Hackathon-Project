const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://frontend-dv6ndpb3m-ghondi-claudes-projects.vercel.app',
    'https://*.vercel.app',
    'https://ubuntuhealth.io',
    'https://www.ubuntuhealth.io'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Ubuntu Health Backend API'
  });
});

// API Documentation endpoint
app.get('/api/api-docs', (req, res) => {
  res.json({
    title: 'Ubuntu Health Production API',
    version: '1.0.0',
    description: 'Decentralized healthcare platform API',
    endpoints: {
      auth: '/api/v1/auth/*',
      patients: '/api/v1/patients/*',
      sponsors: '/api/v1/sponsors/*',
      treatments: '/api/v1/treatments/*',
      research: '/api/v1/research/*',
      governance: '/api/v1/governance/*'
    }
  });
});

// Mock auth endpoints
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password, walletAddress } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.json({
      success: true,
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      user: {
        id: '1',
        email,
        walletAddress: walletAddress || '0x1234567890abcdef',
        role: 'patient',
        verified: true
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password required'
    });
  }
});

app.get('/api/v1/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.json({
      success: true,
      user: {
        id: '1',
        email: 'user@ubuntuhealth.io',
        walletAddress: '0x1234567890abcdef',
        role: 'patient',
        verified: true,
        livesBalance: 1250
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
});

app.post('/api/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    res.json({
      success: true,
      token: 'new_mock_jwt_token_' + Date.now(),
      refreshToken: 'new_mock_refresh_token_' + Date.now()
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Refresh token required'
    });
  }
});

// Mock patients endpoints
app.get('/api/v1/patients', (req, res) => {
  res.json({
    success: true,
    patients: [
      {
        id: '1',
        name: 'Sarah Chen',
        condition: 'Rare Genetic Disorder',
        location: 'Kenya',
        targetAmount: 45000,
        raisedAmount: 32000,
        verified: true
      },
      {
        id: '2', 
        name: 'Marcus Rodriguez',
        condition: 'Advanced Cancer Treatment',
        location: 'Brazil',
        targetAmount: 78000,
        raisedAmount: 78000,
        verified: true
      }
    ]
  });
});

app.post('/api/v1/patients', (req, res) => {
  res.json({
    success: true,
    message: 'Patient profile created successfully',
    patientId: 'patient_' + Date.now()
  });
});

app.get('/api/v1/patients/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    patient: {
      id,
      name: 'Sarah Chen',
      age: 28,
      condition: 'Rare Genetic Disorder',
      location: 'Nairobi, Kenya',
      story: 'Sarah needs specialized gene therapy treatment...',
      targetAmount: 45000,
      raisedAmount: 32000,
      verified: true,
      medicalRecords: {
        diagnosis: 'Rare genetic condition affecting cellular metabolism',
        symptoms: ['Chronic fatigue', 'Muscle weakness', 'Cognitive difficulties'],
        treatment: 'Gene therapy with ongoing monitoring',
        prognosis: 'Excellent with proper treatment'
      }
    }
  });
});

// Mock sponsors endpoints
app.get('/api/v1/sponsors', (req, res) => {
  res.json({
    success: true,
    sponsors: [
      {
        id: '1',
        name: 'Global Health Foundation',
        totalContributed: 150000,
        patientsSupported: 23,
        verified: true
      }
    ]
  });
});

// Mock treatments endpoints
app.get('/api/v1/treatments', (req, res) => {
  res.json({
    success: true,
    treatments: [
      {
        id: '1',
        name: 'Gene Therapy Protocol A',
        cost: 45000,
        availability: 'Available worldwide',
        successRate: '92%'
      }
    ]
  });
});

// Mock sponsorships endpoints
app.get('/api/v1/sponsorships', (req, res) => {
  res.json({
    success: true,
    sponsorships: [
      {
        id: '1',
        patientId: '1',
        sponsorId: '1',
        amount: 5000,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

app.post('/api/v1/sponsorships', (req, res) => {
  const { patientId, amount, message } = req.body;
  
  res.json({
    success: true,
    sponsorship: {
      id: 'sponsorship_' + Date.now(),
      patientId,
      amount,
      message,
      status: 'pending',
      transactionHash: 'mock_tx_' + Date.now()
    }
  });
});

// Mock research endpoints
app.get('/api/v1/research', (req, res) => {
  res.json({
    success: true,
    studies: [
      {
        id: '1',
        title: 'Global Longevity Interventions Study',
        institution: 'Stanford Medicine',
        participantCount: 847,
        rewardPerContribution: 1200,
        status: 'active'
      }
    ]
  });
});

// Mock governance endpoints
app.get('/api/v1/governance', (req, res) => {
  res.json({
    success: true,
    proposals: [
      {
        id: '1',
        title: 'Approve new treatment protocol',
        description: 'Community vote on new gene therapy approval',
        status: 'active',
        votesFor: 1250,
        votesAgainst: 340
      }
    ]
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Ubuntu Health API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ubuntu Health API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/api-docs`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

export default app;