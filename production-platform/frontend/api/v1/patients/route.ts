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
    // Mock patient data - in real app, this would come from database
    const patients = [
      {
        id: 'patient_001',
        name: 'Alex Johnson',
        age: 34,
        location: 'Kampala, Uganda',
        condition: 'Malaria Treatment',
        status: 'active',
        treatmentStartDate: '2024-01-15',
        sponsorshipGoal: 500,
        sponsorshipRaised: 350,
        sponsorshipPercentage: 70,
        treatments: ['antimalarial_protocol_v1'],
        sponsors: ['sponsor_001', 'sponsor_003'],
        walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU9',
        lastUpdated: '2024-01-20T10:30:00Z',
        medicalHistory: {
          allergies: ['penicillin'],
          previousTreatments: ['malaria_2023'],
          chronicConditions: []
        },
        demographics: {
          gender: 'male',
          occupation: 'farmer',
          education: 'primary',
          householdSize: 5
        }
      },
      {
        id: 'patient_002',
        name: 'Maria Santos',
        age: 28,
        location: 'São Paulo, Brazil',
        condition: 'Tuberculosis Treatment',
        status: 'active',
        treatmentStartDate: '2024-01-10',
        sponsorshipGoal: 800,
        sponsorshipRaised: 620,
        sponsorshipPercentage: 77.5,
        treatments: ['tb_protocol_v2'],
        sponsors: ['sponsor_002', 'sponsor_004'],
        walletAddress: '9yNXtg3CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHV8',
        lastUpdated: '2024-01-20T14:15:00Z',
        medicalHistory: {
          allergies: [],
          previousTreatments: [],
          chronicConditions: ['diabetes_type2']
        },
        demographics: {
          gender: 'female',
          occupation: 'teacher',
          education: 'university',
          householdSize: 3
        }
      },
      {
        id: 'patient_003',
        name: 'Chen Wei',
        age: 45,
        location: 'Mumbai, India',
        condition: 'Hepatitis B Treatment',
        status: 'pending',
        treatmentStartDate: '2024-01-25',
        sponsorshipGoal: 1200,
        sponsorshipRaised: 150,
        sponsorshipPercentage: 12.5,
        treatments: ['hepatitis_b_protocol_v1'],
        sponsors: ['sponsor_001'],
        walletAddress: '5xKXtg4CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHW7',
        lastUpdated: '2024-01-20T09:45:00Z',
        medicalHistory: {
          allergies: ['shellfish'],
          previousTreatments: ['hepatitis_screening_2023'],
          chronicConditions: ['hypertension']
        },
        demographics: {
          gender: 'male',
          occupation: 'construction_worker',
          education: 'secondary',
          householdSize: 7
        }
      }
    ];

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const condition = searchParams.get('condition');

    // Filter patients based on query parameters
    let filteredPatients = patients;

    if (status) {
      filteredPatients = filteredPatients.filter(p => p.status === status);
    }

    if (location) {
      filteredPatients = filteredPatients.filter(p => 
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (condition) {
      filteredPatients = filteredPatients.filter(p => 
        p.condition.toLowerCase().includes(condition.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredPatients,
      metadata: {
        total: filteredPatients.length,
        totalActive: patients.filter(p => p.status === 'active').length,
        totalPending: patients.filter(p => p.status === 'pending').length,
        totalSponsorship: patients.reduce((sum, p) => sum + p.sponsorshipRaised, 0),
        timestamp: new Date().toISOString(),
        requester: auth.user.publicKey
      }
    });

  } catch (error) {
    console.error('Patients endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch patients data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}