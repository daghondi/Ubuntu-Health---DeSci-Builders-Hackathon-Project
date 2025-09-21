import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Authentication middleware function
function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { error: 'Access token required', status: 401 };
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as any;
    return { user: decoded, status: 200 };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 403 };
  }
}

export async function GET(request: NextRequest) {
  // Authenticate user
  const auth = authenticateToken(request);
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    );
  }

  try {
    // Mock sponsor data - in real app, this would come from database
    const sponsors = [
      {
        id: 'sponsor_001',
        name: 'Dr. Sarah Mitchell',
        type: 'individual',
        organization: 'Independent Physician',
        location: 'Toronto, Canada',
        joinDate: '2023-12-01',
        totalDonated: 2500,
        totalPatients: 8,
        activePatients: 3,
        walletAddress: '8xKXtg5CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHX6',
        verificationStatus: 'verified',
        specialization: 'tropical_medicine',
        donations: [
          {
            patientId: 'patient_001',
            amount: 350,
            date: '2024-01-15',
            status: 'completed'
          },
          {
            patientId: 'patient_003',
            amount: 150,
            date: '2024-01-18',
            status: 'completed'
          }
        ],
        preferences: {
          conditions: ['malaria', 'tuberculosis', 'hepatitis'],
          regions: ['africa', 'south_america'],
          maxDonationPerPatient: 500
        },
        impact: {
          patientsHelped: 12,
          treatmentsCompleted: 8,
          successRate: 87.5
        }
      },
      {
        id: 'sponsor_002',
        name: 'Global Health Foundation',
        type: 'organization',
        organization: 'Global Health Foundation',
        location: 'New York, USA',
        joinDate: '2023-11-15',
        totalDonated: 15000,
        totalPatients: 25,
        activePatients: 12,
        walletAddress: '6xKXtg6CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHY5',
        verificationStatus: 'verified',
        specialization: 'infectious_diseases',
        donations: [
          {
            patientId: 'patient_002',
            amount: 620,
            date: '2024-01-10',
            status: 'completed'
          }
        ],
        preferences: {
          conditions: ['tuberculosis', 'hiv', 'malaria'],
          regions: ['africa', 'asia', 'south_america'],
          maxDonationPerPatient: 1000
        },
        impact: {
          patientsHelped: 35,
          treatmentsCompleted: 28,
          successRate: 93.2
        }
      },
      {
        id: 'sponsor_003',
        name: 'PharmaCorp Research',
        type: 'corporate',
        organization: 'PharmaCorp Industries',
        location: 'Basel, Switzerland',
        joinDate: '2023-10-01',
        totalDonated: 25000,
        totalPatients: 40,
        activePatients: 18,
        walletAddress: '4xKXtg7CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHZ4',
        verificationStatus: 'verified',
        specialization: 'clinical_trials',
        donations: [
          {
            patientId: 'patient_001',
            amount: 150,
            date: '2024-01-16',
            status: 'completed'
          }
        ],
        preferences: {
          conditions: ['rare_diseases', 'cancer', 'infectious_diseases'],
          regions: ['global'],
          maxDonationPerPatient: 2000
        },
        impact: {
          patientsHelped: 60,
          treatmentsCompleted: 52,
          successRate: 89.7
        }
      },
      {
        id: 'sponsor_004',
        name: 'Dr. James Park',
        type: 'individual',
        organization: 'Seoul National University Hospital',
        location: 'Seoul, South Korea',
        joinDate: '2024-01-01',
        totalDonated: 1200,
        totalPatients: 4,
        activePatients: 2,
        walletAddress: '2xKXtg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHA3',
        verificationStatus: 'pending',
        specialization: 'pulmonology',
        donations: [
          {
            patientId: 'patient_002',
            amount: 200,
            date: '2024-01-12',
            status: 'completed'
          }
        ],
        preferences: {
          conditions: ['tuberculosis', 'pneumonia', 'respiratory_diseases'],
          regions: ['asia'],
          maxDonationPerPatient: 800
        },
        impact: {
          patientsHelped: 4,
          treatmentsCompleted: 3,
          successRate: 75.0
        }
      }
    ];

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const specialization = searchParams.get('specialization');
    const verificationStatus = searchParams.get('verified');

    // Filter sponsors based on query parameters
    let filteredSponsors = sponsors;

    if (type) {
      filteredSponsors = filteredSponsors.filter(s => s.type === type);
    }

    if (location) {
      filteredSponsors = filteredSponsors.filter(s => 
        s.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (specialization) {
      filteredSponsors = filteredSponsors.filter(s => 
        s.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    if (verificationStatus) {
      filteredSponsors = filteredSponsors.filter(s => 
        s.verificationStatus === (verificationStatus === 'true' ? 'verified' : 'pending')
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredSponsors,
      metadata: {
        total: filteredSponsors.length,
        totalIndividual: sponsors.filter(s => s.type === 'individual').length,
        totalOrganization: sponsors.filter(s => s.type === 'organization').length,
        totalCorporate: sponsors.filter(s => s.type === 'corporate').length,
        totalDonated: sponsors.reduce((sum, s) => sum + s.totalDonated, 0),
        totalActivePatients: sponsors.reduce((sum, s) => sum + s.activePatients, 0),
        timestamp: new Date().toISOString(),
        requester: auth.user.publicKey
      }
    });

  } catch (error) {
    console.error('Sponsors endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sponsors data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}