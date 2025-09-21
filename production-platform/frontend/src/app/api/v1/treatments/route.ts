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
    // Mock treatment data - in real app, this would come from database
    const treatments = [
      {
        id: 'antimalarial_protocol_v1',
        name: 'Antimalarial Protocol Version 1',
        condition: 'malaria',
        type: 'pharmaceutical',
        category: 'infectious_disease',
        status: 'active',
        approvalDate: '2023-09-15',
        lastUpdated: '2024-01-15T10:00:00Z',
        description: 'Standard WHO-approved antimalarial treatment protocol using artemisinin-based combination therapy',
        medications: [
          {
            name: 'Artemether-Lumefantrine',
            dosage: '20mg/120mg tablets',
            frequency: 'twice daily',
            duration: '3 days'
          }
        ],
        cost: {
          estimated: 45,
          currency: 'USD',
          breakdown: {
            medication: 35,
            administration: 5,
            monitoring: 5
          }
        },
        efficacy: {
          successRate: 95.2,
          averageTreatmentDays: 3,
          sideEffects: 'mild',
          contraindications: ['pregnancy_first_trimester', 'severe_liver_disease']
        },
        demographics: {
          ageRange: '6 months - 65 years',
          weightRequirement: 'min 5kg',
          specialConsiderations: ['pregnancy', 'lactation']
        },
        activePatients: 15,
        completedTreatments: 47,
        researchStudies: ['malaria_efficacy_2023', 'resistance_monitoring_2024']
      },
      {
        id: 'tb_protocol_v2',
        name: 'Tuberculosis Treatment Protocol Version 2',
        condition: 'tuberculosis',
        type: 'pharmaceutical',
        category: 'infectious_disease',
        status: 'active',
        approvalDate: '2023-11-01',
        lastUpdated: '2024-01-10T14:30:00Z',
        description: 'WHO-recommended directly observed treatment for drug-susceptible pulmonary tuberculosis',
        medications: [
          {
            name: 'Isoniazid',
            dosage: '300mg',
            frequency: 'daily',
            duration: '6 months'
          },
          {
            name: 'Rifampin',
            dosage: '600mg',
            frequency: 'daily',
            duration: '6 months'
          },
          {
            name: 'Ethambutol',
            dosage: '1200mg',
            frequency: 'daily',
            duration: '2 months'
          },
          {
            name: 'Pyrazinamide',
            dosage: '1500mg',
            frequency: 'daily',
            duration: '2 months'
          }
        ],
        cost: {
          estimated: 180,
          currency: 'USD',
          breakdown: {
            medication: 150,
            administration: 15,
            monitoring: 15
          }
        },
        efficacy: {
          successRate: 88.7,
          averageTreatmentDays: 180,
          sideEffects: 'moderate',
          contraindications: ['severe_liver_disease', 'optic_neuritis']
        },
        demographics: {
          ageRange: '12 years - adult',
          weightRequirement: 'min 35kg',
          specialConsiderations: ['hiv_coinfection', 'drug_resistance']
        },
        activePatients: 8,
        completedTreatments: 23,
        researchStudies: ['tb_outcomes_2023', 'adherence_study_2024']
      },
      {
        id: 'hepatitis_b_protocol_v1',
        name: 'Hepatitis B Treatment Protocol Version 1',
        condition: 'hepatitis_b',
        type: 'pharmaceutical',
        category: 'viral_infection',
        status: 'active',
        approvalDate: '2023-08-20',
        lastUpdated: '2024-01-05T16:45:00Z',
        description: 'Antiviral therapy for chronic hepatitis B infection using nucleos(t)ide analogues',
        medications: [
          {
            name: 'Tenofovir Disoproxil Fumarate',
            dosage: '300mg',
            frequency: 'daily',
            duration: '12+ months (ongoing)'
          }
        ],
        cost: {
          estimated: 240,
          currency: 'USD',
          breakdown: {
            medication: 200,
            administration: 20,
            monitoring: 20
          }
        },
        efficacy: {
          successRate: 76.3,
          averageTreatmentDays: 365,
          sideEffects: 'mild to moderate',
          contraindications: ['severe_renal_disease', 'bone_disease']
        },
        demographics: {
          ageRange: '12 years - adult',
          weightRequirement: 'min 35kg',
          specialConsiderations: ['renal_function', 'bone_density']
        },
        activePatients: 5,
        completedTreatments: 12,
        researchStudies: ['hepatitis_b_resistance_2023']
      },
      {
        id: 'malnutrition_protocol_v1',
        name: 'Severe Acute Malnutrition Protocol',
        condition: 'malnutrition',
        type: 'nutritional',
        category: 'nutritional_disorder',
        status: 'active',
        approvalDate: '2023-10-10',
        lastUpdated: '2024-01-12T11:20:00Z',
        description: 'WHO/UNICEF protocol for managing severe acute malnutrition in children',
        medications: [
          {
            name: 'Ready-to-Use Therapeutic Food (RUTF)',
            dosage: '175 kcal/kg/day',
            frequency: 'continuous feeding',
            duration: '6-8 weeks'
          },
          {
            name: 'Amoxicillin',
            dosage: '15mg/kg',
            frequency: 'twice daily',
            duration: '7 days'
          }
        ],
        cost: {
          estimated: 85,
          currency: 'USD',
          breakdown: {
            nutrition: 65,
            medication: 10,
            monitoring: 10
          }
        },
        efficacy: {
          successRate: 91.5,
          averageTreatmentDays: 45,
          sideEffects: 'minimal',
          contraindications: ['severe_medical_complications']
        },
        demographics: {
          ageRange: '6 months - 5 years',
          weightRequirement: 'WHZ < -3 or MUAC < 115mm',
          specialConsiderations: ['medical_complications', 'feeding_difficulties']
        },
        activePatients: 12,
        completedTreatments: 31,
        researchStudies: ['malnutrition_outcomes_2023']
      }
    ];

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const condition = searchParams.get('condition');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Filter treatments based on query parameters
    let filteredTreatments = treatments;

    if (condition) {
      filteredTreatments = filteredTreatments.filter(t => 
        t.condition.toLowerCase().includes(condition.toLowerCase())
      );
    }

    if (type) {
      filteredTreatments = filteredTreatments.filter(t => t.type === type);
    }

    if (status) {
      filteredTreatments = filteredTreatments.filter(t => t.status === status);
    }

    if (category) {
      filteredTreatments = filteredTreatments.filter(t => t.category === category);
    }

    return NextResponse.json({
      success: true,
      data: filteredTreatments,
      metadata: {
        total: filteredTreatments.length,
        totalActive: treatments.filter(t => t.status === 'active').length,
        totalPharmaceutical: treatments.filter(t => t.type === 'pharmaceutical').length,
        totalNutritional: treatments.filter(t => t.type === 'nutritional').length,
        averageSuccessRate: (treatments.reduce((sum, t) => sum + t.efficacy.successRate, 0) / treatments.length).toFixed(1),
        totalActivePatients: treatments.reduce((sum, t) => sum + t.activePatients, 0),
        totalCompletedTreatments: treatments.reduce((sum, t) => sum + t.completedTreatments, 0),
        timestamp: new Date().toISOString(),
        requester: auth.user.publicKey
      }
    });

  } catch (error) {
    console.error('Treatments endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch treatments data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}