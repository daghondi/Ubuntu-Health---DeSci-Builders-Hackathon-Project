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
    // Mock sponsorship data - in real app, this would come from database
    const sponsorships = [
      {
        id: 'sponsorship_001',
        patientId: 'patient_001',
        patientName: 'Alex Johnson',
        sponsorId: 'sponsor_001',
        sponsorName: 'Dr. Sarah Mitchell',
        amount: 350,
        currency: 'USD',
        status: 'active',
        startDate: '2024-01-15T08:00:00Z',
        expectedEndDate: '2024-02-15T08:00:00Z',
        actualEndDate: null,
        transactionHash: '5xKXtg9CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU9abc123',
        blockchainNetwork: 'solana',
        milestone: {
          current: 3,
          total: 4,
          description: 'Week 3 of antimalarial treatment',
          nextMilestone: 'Final assessment and treatment completion',
          nextMilestoneDate: '2024-02-01T08:00:00Z'
        },
        treatment: {
          id: 'antimalarial_protocol_v1',
          name: 'Antimalarial Protocol Version 1',
          progress: 75
        },
        outcomes: {
          symptomsImprovement: 85,
          adherenceRate: 92,
          sideEffects: 'minimal',
          qualityOfLife: 'improved'
        },
        verification: {
          medicalProvider: 'Kampala Health Center',
          lastVerified: '2024-01-18T14:30:00Z',
          nextVerification: '2024-01-25T14:30:00Z',
          verificationMethod: 'clinic_visit'
        },
        smartContract: {
          address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU9',
          milestonesReleased: 3,
          remainingFunds: 87.5
        }
      },
      {
        id: 'sponsorship_002',
        patientId: 'patient_002',
        patientName: 'Maria Santos',
        sponsorId: 'sponsor_002',
        sponsorName: 'Global Health Foundation',
        amount: 620,
        currency: 'USD',
        status: 'active',
        startDate: '2024-01-10T10:00:00Z',
        expectedEndDate: '2024-07-10T10:00:00Z',
        actualEndDate: null,
        transactionHash: '6xKXtg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHV8def456',
        blockchainNetwork: 'solana',
        milestone: {
          current: 2,
          total: 6,
          description: 'Month 2 of TB treatment intensive phase',
          nextMilestone: 'End of intensive phase assessment',
          nextMilestoneDate: '2024-03-10T10:00:00Z'
        },
        treatment: {
          id: 'tb_protocol_v2',
          name: 'Tuberculosis Treatment Protocol Version 2',
          progress: 33
        },
        outcomes: {
          symptomsImprovement: 60,
          adherenceRate: 88,
          sideEffects: 'moderate',
          qualityOfLife: 'stable'
        },
        verification: {
          medicalProvider: 'São Paulo TB Clinic',
          lastVerified: '2024-01-17T09:15:00Z',
          nextVerification: '2024-02-10T09:15:00Z',
          verificationMethod: 'directly_observed_treatment'
        },
        smartContract: {
          address: '9yNXtg3CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHV8',
          milestonesReleased: 2,
          remainingFunds: 413.33
        }
      },
      {
        id: 'sponsorship_003',
        patientId: 'patient_001',
        patientName: 'Alex Johnson',
        sponsorId: 'sponsor_003',
        sponsorName: 'PharmaCorp Research',
        amount: 150,
        currency: 'USD',
        status: 'active',
        startDate: '2024-01-16T12:00:00Z',
        expectedEndDate: '2024-02-15T12:00:00Z',
        actualEndDate: null,
        transactionHash: '4xKXtg7CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHZ4ghi789',
        blockchainNetwork: 'solana',
        milestone: {
          current: 3,
          total: 4,
          description: 'Week 3 of antimalarial treatment - research data collection',
          nextMilestone: 'Final assessment and research data compilation',
          nextMilestoneDate: '2024-02-01T12:00:00Z'
        },
        treatment: {
          id: 'antimalarial_protocol_v1',
          name: 'Antimalarial Protocol Version 1',
          progress: 75
        },
        outcomes: {
          symptomsImprovement: 85,
          adherenceRate: 95,
          sideEffects: 'minimal',
          qualityOfLife: 'improved'
        },
        verification: {
          medicalProvider: 'Kampala Health Center',
          lastVerified: '2024-01-18T14:30:00Z',
          nextVerification: '2024-01-25T14:30:00Z',
          verificationMethod: 'research_protocol'
        },
        smartContract: {
          address: '4xKXtg7CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHZ4',
          milestonesReleased: 3,
          remainingFunds: 37.5
        }
      },
      {
        id: 'sponsorship_004',
        patientId: 'patient_003',
        patientName: 'Chen Wei',
        sponsorId: 'sponsor_001',
        sponsorName: 'Dr. Sarah Mitchell',
        amount: 150,
        currency: 'USD',
        status: 'pending',
        startDate: '2024-01-25T07:00:00Z',
        expectedEndDate: '2025-01-25T07:00:00Z',
        actualEndDate: null,
        transactionHash: '5xKXtg4CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHW7jkl012',
        blockchainNetwork: 'solana',
        milestone: {
          current: 0,
          total: 12,
          description: 'Awaiting treatment initiation',
          nextMilestone: 'Treatment initiation and baseline assessment',
          nextMilestoneDate: '2024-01-25T07:00:00Z'
        },
        treatment: {
          id: 'hepatitis_b_protocol_v1',
          name: 'Hepatitis B Treatment Protocol Version 1',
          progress: 0
        },
        outcomes: {
          symptomsImprovement: 0,
          adherenceRate: 0,
          sideEffects: 'none',
          qualityOfLife: 'baseline'
        },
        verification: {
          medicalProvider: 'Mumbai Liver Care Center',
          lastVerified: '2024-01-20T11:45:00Z',
          nextVerification: '2024-01-25T11:45:00Z',
          verificationMethod: 'baseline_assessment'
        },
        smartContract: {
          address: '5xKXtg4CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHW7',
          milestonesReleased: 0,
          remainingFunds: 150
        }
      },
      {
        id: 'sponsorship_005',
        patientId: 'patient_002',
        patientName: 'Maria Santos',
        sponsorId: 'sponsor_004',
        sponsorName: 'Dr. James Park',
        amount: 200,
        currency: 'USD',
        status: 'completed',
        startDate: '2024-01-12T13:30:00Z',
        expectedEndDate: '2024-01-19T13:30:00Z',
        actualEndDate: '2024-01-19T13:30:00Z',
        transactionHash: '2xKXtg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHA3mno345',
        blockchainNetwork: 'solana',
        milestone: {
          current: 1,
          total: 1,
          description: 'Initial treatment support completed',
          nextMilestone: null,
          nextMilestoneDate: null
        },
        treatment: {
          id: 'tb_protocol_v2',
          name: 'Tuberculosis Treatment Protocol Version 2',
          progress: 10
        },
        outcomes: {
          symptomsImprovement: 25,
          adherenceRate: 100,
          sideEffects: 'mild',
          qualityOfLife: 'improved'
        },
        verification: {
          medicalProvider: 'São Paulo TB Clinic',
          lastVerified: '2024-01-19T13:30:00Z',
          nextVerification: null,
          verificationMethod: 'milestone_completion'
        },
        smartContract: {
          address: '2xKXtg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHA3',
          milestonesReleased: 1,
          remainingFunds: 0
        }
      }
    ];

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    const sponsorId = searchParams.get('sponsorId');

    // Filter sponsorships based on query parameters
    let filteredSponsorships = sponsorships;

    if (status) {
      filteredSponsorships = filteredSponsorships.filter(s => s.status === status);
    }

    if (patientId) {
      filteredSponsorships = filteredSponsorships.filter(s => s.patientId === patientId);
    }

    if (sponsorId) {
      filteredSponsorships = filteredSponsorships.filter(s => s.sponsorId === sponsorId);
    }

    // Calculate summary statistics
    const totalAmount = sponsorships.reduce((sum, s) => sum + s.amount, 0);
    const activeAmount = sponsorships
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0);
    const completedAmount = sponsorships
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.amount, 0);

    return NextResponse.json({
      success: true,
      data: filteredSponsorships,
      metadata: {
        total: filteredSponsorships.length,
        totalActive: sponsorships.filter(s => s.status === 'active').length,
        totalCompleted: sponsorships.filter(s => s.status === 'completed').length,
        totalPending: sponsorships.filter(s => s.status === 'pending').length,
        totalAmount: totalAmount,
        activeAmount: activeAmount,
        completedAmount: completedAmount,
        averageAmount: (totalAmount / sponsorships.length).toFixed(2),
        uniquePatients: [...new Set(sponsorships.map(s => s.patientId))].length,
        uniqueSponsors: [...new Set(sponsorships.map(s => s.sponsorId))].length,
        timestamp: new Date().toISOString(),
        requester: auth.user.publicKey
      }
    });

  } catch (error) {
    console.error('Sponsorships endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sponsorships data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}