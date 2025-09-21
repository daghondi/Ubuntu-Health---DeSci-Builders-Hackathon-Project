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
    // Mock governance data - in real app, this would come from blockchain/database
    const governance = [
      {
        id: 'proposal_001',
        title: 'Approve New Antimalarial Treatment Protocol v2.0',
        description: 'Community proposal to approve updated antimalarial treatment protocol incorporating latest WHO guidelines and resistance data',
        type: 'treatment_protocol',
        category: 'medical_protocol',
        status: 'active',
        phase: 'voting',
        proposer: {
          address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU9',
          name: 'Dr. Amara Kone',
          role: 'medical_researcher',
          reputation: 98.5
        },
        submissionDate: '2024-01-10T08:00:00Z',
        votingStartDate: '2024-01-15T08:00:00Z',
        votingEndDate: '2024-01-29T23:59:59Z',
        executionDate: null,
        voting: {
          totalVotes: 2847,
          yesVotes: 2156,
          noVotes: 445,
          abstainVotes: 246,
          quorumRequired: 2000,
          quorumMet: true,
          yesPercentage: 75.7,
          noPercentage: 15.6,
          abstainPercentage: 8.7
        },
        details: {
          targetCondition: 'malaria',
          estimatedCost: 48,
          previousProtocolId: 'antimalarial_protocol_v1',
          evidenceDocuments: [
            'WHO_Guidelines_2024.pdf',
            'Resistance_Study_Results.pdf',
            'Cost_Effectiveness_Analysis.pdf'
          ],
          impactedPatients: 'All current and future malaria patients',
          implementationTimeline: '30 days post-approval'
        },
        supporters: [
          {
            address: '8xKXtg5CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHX6',
            name: 'Dr. Sarah Mitchell',
            votingPower: 125,
            vote: 'yes',
            timestamp: '2024-01-16T10:30:00Z'
          },
          {
            address: '6xKXtg6CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHY5',
            name: 'Global Health Foundation',
            votingPower: 450,
            vote: 'yes',
            timestamp: '2024-01-17T14:15:00Z'
          }
        ],
        comments: [
          {
            author: 'Dr. Sarah Mitchell',
            content: 'Strong evidence base supports this protocol update. The resistance data is particularly compelling.',
            timestamp: '2024-01-16T10:35:00Z',
            likes: 23
          },
          {
            author: 'Community Health Worker - Uganda',
            content: 'We need this update urgently. Current protocol showing reduced effectiveness in our region.',
            timestamp: '2024-01-18T09:20:00Z',
            likes: 18
          }
        ]
      },
      {
        id: 'proposal_002',
        title: 'Establish Patient Data Privacy Standards',
        description: 'Proposal to implement comprehensive data privacy standards for patient information across all platform interactions',
        type: 'policy',
        category: 'data_privacy',
        status: 'active',
        phase: 'discussion',
        proposer: {
          address: '5xKXtg4CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHW7',
          name: 'Privacy Advocates Coalition',
          role: 'community_organization',
          reputation: 87.2
        },
        submissionDate: '2024-01-18T12:00:00Z',
        votingStartDate: '2024-01-25T08:00:00Z',
        votingEndDate: '2024-02-08T23:59:59Z',
        executionDate: null,
        voting: {
          totalVotes: 0,
          yesVotes: 0,
          noVotes: 0,
          abstainVotes: 0,
          quorumRequired: 1500,
          quorumMet: false,
          yesPercentage: 0,
          noPercentage: 0,
          abstainPercentage: 0
        },
        details: {
          targetCondition: 'all',
          estimatedCost: 25000,
          previousProtocolId: null,
          evidenceDocuments: [
            'GDPR_Compliance_Analysis.pdf',
            'HIPAA_Requirements.pdf',
            'Blockchain_Privacy_Best_Practices.pdf'
          ],
          impactedPatients: 'All platform users',
          implementationTimeline: '90 days post-approval'
        },
        supporters: [],
        comments: [
          {
            author: 'Tech Ethics Committee',
            content: 'Critical proposal for maintaining trust. We should consider zero-knowledge proofs for sensitive data.',
            timestamp: '2024-01-19T15:45:00Z',
            likes: 31
          }
        ]
      },
      {
        id: 'proposal_003',
        title: 'Fund Digital Health Tools Research Initiative',
        description: 'Allocate 500,000 UBUNTU tokens to fund research into mobile health applications for treatment adherence monitoring',
        type: 'funding',
        category: 'research_funding',
        status: 'passed',
        phase: 'executed',
        proposer: {
          address: '2xKXtg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHA3',
          name: 'Dr. Sarah Chen',
          role: 'digital_health_researcher',
          reputation: 94.1
        },
        submissionDate: '2023-12-01T08:00:00Z',
        votingStartDate: '2023-12-05T08:00:00Z',
        votingEndDate: '2023-12-19T23:59:59Z',
        executionDate: '2023-12-22T10:00:00Z',
        voting: {
          totalVotes: 3542,
          yesVotes: 2896,
          noVotes: 423,
          abstainVotes: 223,
          quorumRequired: 2500,
          quorumMet: true,
          yesPercentage: 81.8,
          noPercentage: 11.9,
          abstainPercentage: 6.3
        },
        details: {
          targetCondition: 'tuberculosis',
          estimatedCost: 500000,
          previousProtocolId: null,
          evidenceDocuments: [
            'Digital_Health_Proposal.pdf',
            'Budget_Breakdown.xlsx',
            'Research_Timeline.pdf'
          ],
          impactedPatients: 'TB patients using digital health tools',
          implementationTimeline: 'Immediate upon execution'
        },
        supporters: [
          {
            address: '6xKXtg6CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHY5',
            name: 'Global Health Foundation',
            votingPower: 450,
            vote: 'yes',
            timestamp: '2023-12-06T11:20:00Z'
          },
          {
            address: '4xKXtg7CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHZ4',
            name: 'PharmaCorp Research',
            votingPower: 380,
            vote: 'yes',
            timestamp: '2023-12-07T16:45:00Z'
          }
        ],
        executionDetails: {
          transactionHash: '9xKXtg3CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHV8funding',
          fundsAllocated: 500000,
          recipientAddress: '2xKXtg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHA3',
          executorAddress: '1xKXtg1CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHT1'
        },
        comments: [
          {
            author: 'Community Health Advocate',
            content: 'Excellent use of funds. Digital tools will revolutionize treatment adherence.',
            timestamp: '2023-12-20T14:30:00Z',
            likes: 45
          }
        ]
      },
      {
        id: 'proposal_004',
        title: 'Implement Multi-Signature Wallet for Large Transactions',
        description: 'Require multi-signature approval for transactions exceeding 100,000 UBUNTU tokens to enhance security',
        type: 'security',
        category: 'platform_security',
        status: 'rejected',
        phase: 'completed',
        proposer: {
          address: '3xKXtg9CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU2',
          name: 'Security Working Group',
          role: 'security_committee',
          reputation: 91.8
        },
        submissionDate: '2024-01-05T08:00:00Z',
        votingStartDate: '2024-01-08T08:00:00Z',
        votingEndDate: '2024-01-22T23:59:59Z',
        executionDate: null,
        voting: {
          totalVotes: 2234,
          yesVotes: 893,
          noVotes: 1119,
          abstainVotes: 222,
          quorumRequired: 2000,
          quorumMet: true,
          yesPercentage: 39.9,
          noPercentage: 50.1,
          abstainPercentage: 9.9
        },
        details: {
          targetCondition: 'all',
          estimatedCost: 75000,
          previousProtocolId: null,
          evidenceDocuments: [
            'Security_Assessment.pdf',
            'Multi_Sig_Implementation_Plan.pdf',
            'Cost_Benefit_Analysis.pdf'
          ],
          impactedPatients: 'Platform-wide security enhancement',
          implementationTimeline: '60 days post-approval'
        },
        supporters: [
          {
            address: '8xKXtg5CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHX6',
            name: 'Dr. Sarah Mitchell',
            votingPower: 125,
            vote: 'yes',
            timestamp: '2024-01-09T09:15:00Z'
          }
        ],
        rejectionReason: 'Community felt implementation complexity outweighed security benefits',
        comments: [
          {
            author: 'Platform Developer',
            content: 'While security is important, this would significantly slow down emergency funding.',
            timestamp: '2024-01-12T11:30:00Z',
            likes: 28
          },
          {
            author: 'Security Researcher',
            content: 'Current smart contract security measures are adequate for now.',
            timestamp: '2024-01-15T08:45:00Z',
            likes: 19
          }
        ]
      },
      {
        id: 'proposal_005',
        title: 'Create Medical Advisory Board',
        description: 'Establish a rotating medical advisory board of 7 healthcare professionals to review treatment protocols',
        type: 'governance',
        category: 'organizational_structure',
        status: 'draft',
        phase: 'preparation',
        proposer: {
          address: '4xKXtg7CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHZ4',
          name: 'Medical Professional Alliance',
          role: 'professional_organization',
          reputation: 96.3
        },
        submissionDate: null,
        votingStartDate: null,
        votingEndDate: null,
        executionDate: null,
        voting: {
          totalVotes: 0,
          yesVotes: 0,
          noVotes: 0,
          abstainVotes: 0,
          quorumRequired: 2000,
          quorumMet: false,
          yesPercentage: 0,
          noPercentage: 0,
          abstainPercentage: 0
        },
        details: {
          targetCondition: 'all',
          estimatedCost: 120000,
          previousProtocolId: null,
          evidenceDocuments: [
            'Advisory_Board_Structure.pdf',
            'Selection_Criteria.pdf'
          ],
          impactedPatients: 'All patients through improved protocol oversight',
          implementationTimeline: '120 days post-approval'
        },
        supporters: [],
        comments: []
      }
    ];

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const phase = searchParams.get('phase');

    // Filter governance based on query parameters
    let filteredGovernance = governance;

    if (status) {
      filteredGovernance = filteredGovernance.filter(g => g.status === status);
    }

    if (type) {
      filteredGovernance = filteredGovernance.filter(g => g.type === type);
    }

    if (category) {
      filteredGovernance = filteredGovernance.filter(g => g.category === category);
    }

    if (phase) {
      filteredGovernance = filteredGovernance.filter(g => g.phase === phase);
    }

    // Calculate summary statistics
    const totalVotes = governance.reduce((sum, g) => sum + g.voting.totalVotes, 0);
    const totalProposals = governance.length;
    const activeProposals = governance.filter(g => g.status === 'active').length;

    return NextResponse.json({
      success: true,
      data: filteredGovernance,
      metadata: {
        total: filteredGovernance.length,
        totalActive: governance.filter(g => g.status === 'active').length,
        totalPassed: governance.filter(g => g.status === 'passed').length,
        totalRejected: governance.filter(g => g.status === 'rejected').length,
        totalDraft: governance.filter(g => g.status === 'draft').length,
        totalVotes: totalVotes,
        averageParticipation: totalProposals > 0 ? (totalVotes / totalProposals).toFixed(0) : 0,
        categories: {
          medical_protocol: governance.filter(g => g.category === 'medical_protocol').length,
          data_privacy: governance.filter(g => g.category === 'data_privacy').length,
          research_funding: governance.filter(g => g.category === 'research_funding').length,
          platform_security: governance.filter(g => g.category === 'platform_security').length,
          organizational_structure: governance.filter(g => g.category === 'organizational_structure').length
        },
        types: {
          treatment_protocol: governance.filter(g => g.type === 'treatment_protocol').length,
          policy: governance.filter(g => g.type === 'policy').length,
          funding: governance.filter(g => g.type === 'funding').length,
          security: governance.filter(g => g.type === 'security').length,
          governance: governance.filter(g => g.type === 'governance').length
        },
        timestamp: new Date().toISOString(),
        requester: auth.user.publicKey
      }
    });

  } catch (error) {
    console.error('Governance endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch governance data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}