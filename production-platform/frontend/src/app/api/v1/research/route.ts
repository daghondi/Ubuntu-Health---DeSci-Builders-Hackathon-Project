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
    // Mock research data - in real app, this would come from database
    const research = [
      {
        id: 'malaria_efficacy_2023',
        title: 'Efficacy of Artemisinin-Based Combination Therapy in Sub-Saharan Africa',
        description: 'Multi-site study evaluating the effectiveness of ACT treatment protocols across different malaria endemic regions',
        category: 'treatment_efficacy',
        condition: 'malaria',
        status: 'active',
        phase: 'phase_3',
        startDate: '2023-06-01',
        expectedEndDate: '2024-12-31',
        lastUpdated: '2024-01-15T16:20:00Z',
        principalInvestigator: {
          name: 'Dr. Amara Kone',
          institution: 'West African Health Research Institute',
          email: 'a.kone@wahri.org'
        },
        collaborators: [
          'University of Oxford - Tropical Medicine',
          'Makerere University - Uganda',
          'University of Ghana Medical School'
        ],
        participants: {
          enrolled: 1247,
          target: 1500,
          completed: 892,
          active: 355
        },
        locations: [
          'Kampala, Uganda',
          'Accra, Ghana',
          'Bamako, Mali',
          'Lagos, Nigeria'
        ],
        objectives: {
          primary: 'Evaluate 28-day cure rate of artemether-lumefantrine treatment',
          secondary: [
            'Assess treatment adherence rates',
            'Monitor adverse events',
            'Evaluate cost-effectiveness',
            'Study drug resistance patterns'
          ]
        },
        outcomes: {
          preliminary: {
            cureRate: 94.2,
            adherenceRate: 89.1,
            adverseEvents: 12.5,
            patientSatisfaction: 87.3
          }
        },
        funding: {
          totalAmount: 2500000,
          currency: 'USD',
          sources: [
            'WHO Special Programme for Research',
            'Gates Foundation',
            'Wellcome Trust'
          ]
        },
        publications: [
          {
            title: 'Interim Analysis: ACT Efficacy in West Africa',
            journal: 'Tropical Medicine International',
            date: '2023-11-15',
            doi: '10.1234/tmi.2023.001'
          }
        ],
        dataSharing: {
          policy: 'open_access',
          repository: 'WHO Global Malaria Research Database',
          embargoEndDate: '2025-06-01'
        }
      },
      {
        id: 'resistance_monitoring_2024',
        title: 'Antimalarial Drug Resistance Surveillance Network',
        description: 'Real-time monitoring of antimalarial drug resistance markers using molecular surveillance',
        category: 'drug_resistance',
        condition: 'malaria',
        status: 'active',
        phase: 'observational',
        startDate: '2024-01-01',
        expectedEndDate: '2026-12-31',
        lastUpdated: '2024-01-18T10:45:00Z',
        principalInvestigator: {
          name: 'Dr. Maria Rodriguez',
          institution: 'Barcelona Institute for Global Health',
          email: 'm.rodriguez@isglobal.org'
        },
        collaborators: [
          'London School of Hygiene & Tropical Medicine',
          'Swiss Tropical and Public Health Institute',
          'Centers for Disease Control and Prevention'
        ],
        participants: {
          enrolled: 3500,
          target: 5000,
          completed: 0,
          active: 3500
        },
        locations: [
          'Multiple sites across Africa',
          'Southeast Asian sites',
          'South American sites'
        ],
        objectives: {
          primary: 'Monitor emergence and spread of antimalarial drug resistance',
          secondary: [
            'Develop early warning systems',
            'Characterize resistance mutations',
            'Assess treatment failure rates',
            'Guide policy recommendations'
          ]
        },
        outcomes: {
          preliminary: {
            resistanceRate: 3.8,
            newMutations: 7,
            surveillanceCoverage: 78.5,
            reportingCompliance: 92.1
          }
        },
        funding: {
          totalAmount: 4200000,
          currency: 'USD',
          sources: [
            'European Commission Horizon 2020',
            'National Institutes of Health',
            'UK Medical Research Council'
          ]
        },
        publications: [],
        dataSharing: {
          policy: 'controlled_access',
          repository: 'Global Resistance Surveillance Network',
          embargoEndDate: null
        }
      },
      {
        id: 'tb_outcomes_2023',
        title: 'Patient-Centered Outcomes in Tuberculosis Treatment',
        description: 'Longitudinal study of quality of life and social outcomes following TB treatment completion',
        category: 'patient_outcomes',
        condition: 'tuberculosis',
        status: 'recruiting',
        phase: 'observational',
        startDate: '2023-09-01',
        expectedEndDate: '2025-08-31',
        lastUpdated: '2024-01-12T14:15:00Z',
        principalInvestigator: {
          name: 'Dr. Rajesh Patel',
          institution: 'Indian Council of Medical Research',
          email: 'r.patel@icmr.gov.in'
        },
        collaborators: [
          'Harvard T.H. Chan School of Public Health',
          'University of Cape Town',
          'All India Institute of Medical Sciences'
        ],
        participants: {
          enrolled: 567,
          target: 800,
          completed: 123,
          active: 444
        },
        locations: [
          'New Delhi, India',
          'Mumbai, India',
          'Cape Town, South Africa',
          'São Paulo, Brazil'
        ],
        objectives: {
          primary: 'Assess long-term quality of life outcomes post-TB treatment',
          secondary: [
            'Evaluate return to work rates',
            'Assess social stigma impact',
            'Study healthcare utilization patterns',
            'Analyze cost burden on families'
          ]
        },
        outcomes: {
          preliminary: {
            qualityOfLifeImprovement: 68.4,
            returnToWorkRate: 73.2,
            stigmaReduction: 45.7,
            patientSatisfaction: 81.9
          }
        },
        funding: {
          totalAmount: 1800000,
          currency: 'USD',
          sources: [
            'Indian Council of Medical Research',
            'Stop TB Partnership',
            'Ford Foundation'
          ]
        },
        publications: [
          {
            title: 'Social Impact of TB: Interim Findings',
            journal: 'International Journal of Tuberculosis and Lung Disease',
            date: '2023-12-20',
            doi: '10.1234/ijtld.2023.045'
          }
        ],
        dataSharing: {
          policy: 'open_access',
          repository: 'TB Research Database',
          embargoEndDate: '2026-09-01'
        }
      },
      {
        id: 'adherence_study_2024',
        title: 'Digital Health Tools for TB Treatment Adherence',
        description: 'Randomized controlled trial of mobile health interventions to improve TB treatment adherence',
        category: 'digital_health',
        condition: 'tuberculosis',
        status: 'active',
        phase: 'phase_2',
        startDate: '2024-01-15',
        expectedEndDate: '2025-07-15',
        lastUpdated: '2024-01-20T11:30:00Z',
        principalInvestigator: {
          name: 'Dr. Sarah Chen',
          institution: 'University of California San Francisco',
          email: 's.chen@ucsf.edu'
        },
        collaborators: [
          'Kenya Medical Research Institute',
          'University of the Witwatersrand',
          'PATH Digital Health'
        ],
        participants: {
          enrolled: 245,
          target: 400,
          completed: 0,
          active: 245
        },
        locations: [
          'Nairobi, Kenya',
          'Johannesburg, South Africa',
          'Pune, India'
        ],
        objectives: {
          primary: 'Compare treatment completion rates with and without digital health tools',
          secondary: [
            'Assess user engagement with mobile apps',
            'Evaluate cost-effectiveness',
            'Study healthcare provider satisfaction',
            'Analyze data quality improvements'
          ]
        },
        outcomes: {
          preliminary: {
            appEngagement: 76.8,
            adherenceRate: 91.3,
            providerSatisfaction: 84.2,
            technicalIssues: 8.7
          }
        },
        funding: {
          totalAmount: 950000,
          currency: 'USD',
          sources: [
            'National Science Foundation',
            'Google.org',
            'USAID Digital Health Initiative'
          ]
        },
        publications: [],
        dataSharing: {
          policy: 'controlled_access',
          repository: 'Digital Health Research Consortium',
          embargoEndDate: '2026-01-15'
        }
      },
      {
        id: 'hepatitis_b_resistance_2023',
        title: 'Hepatitis B Antiviral Resistance in Low-Resource Settings',
        description: 'Prospective cohort study of antiviral resistance development in chronic hepatitis B patients',
        category: 'drug_resistance',
        condition: 'hepatitis_b',
        status: 'completed',
        phase: 'observational',
        startDate: '2021-03-01',
        expectedEndDate: '2023-12-31',
        actualEndDate: '2023-12-31',
        lastUpdated: '2024-01-05T09:20:00Z',
        principalInvestigator: {
          name: 'Dr. Li Wei',
          institution: 'Beijing University of Chinese Medicine',
          email: 'l.wei@bucm.edu.cn'
        },
        collaborators: [
          'University of Washington',
          'Chiang Mai University',
          'University of Melbourne'
        ],
        participants: {
          enrolled: 892,
          target: 800,
          completed: 847,
          active: 0
        },
        locations: [
          'Beijing, China',
          'Bangkok, Thailand',
          'Ho Chi Minh City, Vietnam',
          'Mumbai, India'
        ],
        objectives: {
          primary: 'Determine incidence of antiviral resistance in tenofovir-treated patients',
          secondary: [
            'Identify resistance risk factors',
            'Characterize resistance mutations',
            'Evaluate treatment switching strategies',
            'Assess long-term viral suppression'
          ]
        },
        outcomes: {
          final: {
            resistanceRate: 2.3,
            viralSuppressionRate: 89.7,
            treatmentSwitchingRate: 6.8,
            adverseEventRate: 11.2
          }
        },
        funding: {
          totalAmount: 1200000,
          currency: 'USD',
          sources: [
            'Asian Pacific Association for the Study of the Liver',
            'Gilead Sciences Research Grant',
            'National Natural Science Foundation of China'
          ]
        },
        publications: [
          {
            title: 'Tenofovir Resistance in Chronic Hepatitis B: A Multi-Site Cohort Study',
            journal: 'Hepatology International',
            date: '2024-01-03',
            doi: '10.1234/hep.2024.012'
          }
        ],
        dataSharing: {
          policy: 'open_access',
          repository: 'Global Hepatitis Research Database',
          embargoEndDate: null
        }
      }
    ];

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const status = searchParams.get('status');
    const phase = searchParams.get('phase');

    // Filter research based on query parameters
    let filteredResearch = research;

    if (category) {
      filteredResearch = filteredResearch.filter(r => r.category === category);
    }

    if (condition) {
      filteredResearch = filteredResearch.filter(r => r.condition === condition);
    }

    if (status) {
      filteredResearch = filteredResearch.filter(r => r.status === status);
    }

    if (phase) {
      filteredResearch = filteredResearch.filter(r => r.phase === phase);
    }

    // Calculate summary statistics
    const totalFunding = research.reduce((sum, r) => sum + r.funding.totalAmount, 0);
    const totalParticipants = research.reduce((sum, r) => sum + r.participants.enrolled, 0);
    const totalPublications = research.reduce((sum, r) => sum + r.publications.length, 0);

    return NextResponse.json({
      success: true,
      data: filteredResearch,
      metadata: {
        total: filteredResearch.length,
        totalActive: research.filter(r => r.status === 'active').length,
        totalCompleted: research.filter(r => r.status === 'completed').length,
        totalRecruiting: research.filter(r => r.status === 'recruiting').length,
        totalFunding: totalFunding,
        totalParticipants: totalParticipants,
        totalPublications: totalPublications,
        categories: {
          treatment_efficacy: research.filter(r => r.category === 'treatment_efficacy').length,
          drug_resistance: research.filter(r => r.category === 'drug_resistance').length,
          patient_outcomes: research.filter(r => r.category === 'patient_outcomes').length,
          digital_health: research.filter(r => r.category === 'digital_health').length
        },
        conditions: {
          malaria: research.filter(r => r.condition === 'malaria').length,
          tuberculosis: research.filter(r => r.condition === 'tuberculosis').length,
          hepatitis_b: research.filter(r => r.condition === 'hepatitis_b').length
        },
        timestamp: new Date().toISOString(),
        requester: auth.user.publicKey
      }
    });

  } catch (error) {
    console.error('Research endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch research data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}