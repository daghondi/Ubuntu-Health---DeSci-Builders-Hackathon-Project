import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Privacy-Preserving Research Data APIs for Ubuntu Health Platform
// Implements zero-knowledge proofs, institutional access controls, and Ubuntu community governance

interface ResearchDataRequest {
  requestId: string;
  requesterInstitution: string;
  requesterName: string;
  requesterEmail: string;
  researchTitle: string;
  researchDescription: string;
  dataRequested: ResearchDataType[];
  privacyLevel: 'Aggregated' | 'Anonymized' | 'Pseudonymized' | 'ZeroKnowledge';
  timeframe: {
    startDate: Date;
    endDate: Date;
  };
  patientCriteria: PatientCriteria;
  ethicalApproval: EthicalApproval;
  ubuntuCommunityApproval: UbuntuApprovalStatus;
  status: 'Pending' | 'Under Review' | 'Community Vote' | 'Approved' | 'Rejected' | 'Active' | 'Completed';
  requestedAt: Date;
  reviewDeadline: Date;
  dataAccessPeriod: number; // days
  maxPatientCount: number;
  compensationOffered: number; // in LIVES tokens
  researchBenefits: string;
  communityFeedback: CommunityFeedback[];
}

interface ResearchDataType {
  dataCategory: 'Demographics' | 'TreatmentOutcomes' | 'RecoveryProgress' | 'ProviderPerformance' | 'CostAnalysis' | 'GeographicPatterns' | 'TraditionalHealing';
  specificFields: string[];
  aggregationLevel: 'Individual' | 'Group' | 'Regional' | 'Global';
  privacyRequirements: string[];
}

interface PatientCriteria {
  ageRange?: [number, number];
  genderInclusion?: ('Male' | 'Female' | 'Other' | 'All')[];
  treatmentCategories?: string[];
  geographicRegions?: string[];
  treatmentOutcomes?: ('Successful' | 'Partial' | 'Unsuccessful')[];
  ubuntuHealthVerified?: boolean;
  consentRequired: boolean;
  exclusionCriteria?: string[];
}

interface EthicalApproval {
  institutionName: string;
  approvalNumber: string;
  approvalDate: Date;
  expirationDate: Date;
  ethicsCommitteeContact: string;
  ipfsDocumentHash: string;
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
}

interface UbuntuApprovalStatus {
  communityReviewRequired: boolean;
  elderCouncilApproval: 'Pending' | 'Approved' | 'Rejected' | 'Not Required';
  communityVotes: {
    approve: number;
    reject: number;
    abstain: number;
  };
  votingDeadline?: Date;
  culturalSensitivityReview: boolean;
  traditionalHealingRespect: boolean;
  communityBenefitScore: number; // 1-10
}

interface CommunityFeedback {
  feedbackId: string;
  memberWallet: string;
  memberType: 'Patient' | 'Provider' | 'Elder' | 'Community Member' | 'Researcher';
  feedback: string;
  recommendation: 'Approve' | 'Reject' | 'Modify' | 'More Info';
  concerns?: string[];
  suggestions?: string[];
  culturalConsiderations?: string;
  submittedAt: Date;
  ubuntuHealthMember: boolean;
}

interface ResearchDataset {
  datasetId: string;
  requestId: string;
  generatedAt: Date;
  dataPoints: number;
  privacyMethod: 'Aggregation' | 'Anonymization' | 'K-Anonymity' | 'Differential Privacy' | 'Zero Knowledge';
  encryptionLevel: 'None' | 'Standard' | 'Advanced' | 'Quantum-Resistant';
  accessExpirationDate: Date;
  downloadCount: number;
  integrityHash: string;
  zkProofHash?: string;
  metadata: DatasetMetadata;
  communityCompensation: number; // LIVES tokens distributed to community
  researchImpactScore?: number;
}

interface DatasetMetadata {
  totalRecords: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  geographicCoverage: string[];
  treatmentCategories: string[];
  ageDistribution: {
    range: string;
    count: number;
  }[];
  genderDistribution: {
    gender: string;
    percentage: number;
  }[];
  privacyGuarantees: string[];
  limitationsAndBiases: string[];
  recommendedUsage: string[];
  citationRequirement: string;
}

interface PrivacyPreservingQuery {
  queryId: string;
  researcherId: string;
  query: string;
  queryType: 'Aggregation' | 'Statistical' | 'ML Training' | 'Outcome Analysis';
  privacyBudget: number; // differential privacy epsilon
  noiseParameters: {
    mechanism: 'Laplace' | 'Gaussian' | 'Exponential';
    sensitivity: number;
    epsilon: number;
    delta?: number;
  };
  results?: any;
  executedAt?: Date;
  privacyLoss: number;
  communityApproved: boolean;
}

interface ZeroKnowledgeProof {
  proofId: string;
  statement: string; // What is being proven
  proof: string; // The actual ZK proof
  verificationKey: string;
  circuitHash: string;
  publicInputs: any[];
  proofType: 'Treatment Outcome' | 'Recovery Progress' | 'Cost Effectiveness' | 'Provider Performance' | 'Community Impact';
  generatedAt: Date;
  verifiedAt?: Date;
  verificationStatus: 'Pending' | 'Valid' | 'Invalid';
  communityWitnessed: boolean;
}

const ResearchDataAPI: React.FC = () => {
  const [researchRequests, setResearchRequests] = useState<ResearchDataRequest[]>([]);
  const [activeDatasets, setActiveDatasets] = useState<ResearchDataset[]>([]);
  const [zkProofs, setZkProofs] = useState<ZeroKnowledgeProof[]>([]);
  const [privacyQueries, setPrivacyQueries] = useState<PrivacyPreservingQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'datasets' | 'privacy' | 'zkproofs' | 'community'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<ResearchDataRequest | null>(null);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<ResearchDataset | null>(null);

  // New research request form state
  const [newRequest, setNewRequest] = useState<Partial<ResearchDataRequest>>({
    privacyLevel: 'Anonymized',
    status: 'Pending',
    dataRequested: [],
    patientCriteria: {
      consentRequired: true
    },
    ubuntuCommunityApproval: {
      communityReviewRequired: true,
      elderCouncilApproval: 'Pending',
      communityVotes: { approve: 0, reject: 0, abstain: 0 },
      culturalSensitivityReview: false,
      traditionalHealingRespect: false,
      communityBenefitScore: 5
    },
    communityFeedback: []
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: ResearchDataRequest[] = [
      {
        requestId: 'req_research_001',
        requesterInstitution: 'Global Health Research Institute',
        requesterName: 'Dr. Ana Rodriguez',
        requesterEmail: 'ana.rodriguez@ghri.org',
        researchTitle: 'Community-Centered Healthcare Outcomes in Underserved Populations',
        researchDescription: 'A comprehensive study examining the effectiveness of Ubuntu Health\'s community-centered approach to healthcare delivery in underserved populations, with focus on traditional healing integration.',
        dataRequested: [
          {
            dataCategory: 'TreatmentOutcomes',
            specificFields: ['treatment_success_rate', 'completion_time', 'patient_satisfaction', 'community_support_level'],
            aggregationLevel: 'Regional',
            privacyRequirements: ['k-anonymity=5', 'differential_privacy_epsilon=0.1']
          },
          {
            dataCategory: 'TraditionalHealing',
            specificFields: ['healing_method_type', 'integration_success', 'patient_preference', 'elder_involvement'],
            aggregationLevel: 'Group',
            privacyRequirements: ['cultural_sensitivity_review', 'elder_council_approval']
          }
        ],
        privacyLevel: 'ZeroKnowledge',
        timeframe: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2024-12-31')
        },
        patientCriteria: {
          ageRange: [18, 80],
          genderInclusion: ['Male', 'Female', 'Other'],
          treatmentCategories: ['General Medicine', 'Traditional Healing', 'Community Care'],
          geographicRegions: ['Sub-Saharan Africa', 'South America', 'Southeast Asia'],
          treatmentOutcomes: ['Successful', 'Partial'],
          ubuntuHealthVerified: true,
          consentRequired: true,
          exclusionCriteria: ['Mental health conditions without consent', 'Minors without guardian consent']
        },
        ethicalApproval: {
          institutionName: 'Global Health Research Institute IRB',
          approvalNumber: 'GHRI-IRB-2024-089',
          approvalDate: new Date('2024-01-15'),
          expirationDate: new Date('2025-01-15'),
          ethicsCommitteeContact: 'ethics@ghri.org',
          ipfsDocumentHash: 'QmEthicalApproval001...',
          verified: true,
          verifiedBy: 'Ubuntu Health Ethics Review Board',
          verificationDate: new Date('2024-01-20')
        },
        ubuntuCommunityApproval: {
          communityReviewRequired: true,
          elderCouncilApproval: 'Approved',
          communityVotes: {
            approve: 234,
            reject: 23,
            abstain: 45
          },
          votingDeadline: new Date('2024-02-15'),
          culturalSensitivityReview: true,
          traditionalHealingRespect: true,
          communityBenefitScore: 9
        },
        status: 'Active',
        requestedAt: new Date('2024-01-10'),
        reviewDeadline: new Date('2024-02-10'),
        dataAccessPeriod: 365,
        maxPatientCount: 5000,
        compensationOffered: 50000, // LIVES tokens
        researchBenefits: 'Research findings will be shared with Ubuntu Health communities to improve healthcare delivery. Results will inform policy recommendations for community-centered healthcare models.',
        communityFeedback: [
          {
            feedbackId: 'feedback_001',
            memberWallet: 'elder_council_001',
            memberType: 'Elder',
            feedback: 'This research respects our traditional healing methods and will benefit our communities. We support this initiative.',
            recommendation: 'Approve',
            culturalConsiderations: 'Ensure traditional healing practices are presented respectfully and not compared unfavorably to modern medicine.',
            submittedAt: new Date('2024-01-25'),
            ubuntuHealthMember: true
          },
          {
            feedbackId: 'feedback_002',
            memberWallet: 'patient_advocate_001',
            memberType: 'Community Member',
            feedback: 'Important research that could help improve healthcare for our communities. Privacy protections look comprehensive.',
            recommendation: 'Approve',
            concerns: ['Ensure data cannot be traced back to individuals'],
            suggestions: ['Include patient advocacy representatives in research oversight'],
            submittedAt: new Date('2024-01-28'),
            ubuntuHealthMember: true
          }
        ]
      },
      {
        requestId: 'req_research_002',
        requesterInstitution: 'University of Cape Town Medical School',
        requesterName: 'Prof. Thabo Mthembu',
        requesterEmail: 'thabo.mthembu@uct.ac.za',
        researchTitle: 'Traditional Healing and Modern Medicine Integration Patterns',
        researchDescription: 'Examining how traditional African healing practices integrate with modern medical treatments in the Ubuntu Health platform, focusing on patient outcomes and cultural preservation.',
        dataRequested: [
          {
            dataCategory: 'TraditionalHealing',
            specificFields: ['healing_practice_type', 'modern_medicine_combo', 'patient_preference', 'outcome_comparison'],
            aggregationLevel: 'Regional',
            privacyRequirements: ['elder_council_oversight', 'cultural_review_required']
          }
        ],
        privacyLevel: 'Anonymized',
        timeframe: {
          startDate: new Date('2023-06-01'),
          endDate: new Date('2024-05-31')
        },
        patientCriteria: {
          geographicRegions: ['Southern Africa'],
          treatmentCategories: ['Traditional Healing', 'Integrated Medicine'],
          ubuntuHealthVerified: true,
          consentRequired: true
        },
        ethicalApproval: {
          institutionName: 'University of Cape Town Human Research Ethics Committee',
          approvalNumber: 'UCT-HREC-2024-156',
          approvalDate: new Date('2024-02-01'),
          expirationDate: new Date('2025-02-01'),
          ethicsCommitteeContact: 'hrec@uct.ac.za',
          ipfsDocumentHash: 'QmUCTEthics002...',
          verified: false
        },
        ubuntuCommunityApproval: {
          communityReviewRequired: true,
          elderCouncilApproval: 'Pending',
          communityVotes: {
            approve: 0,
            reject: 0,
            abstain: 0
          },
          culturalSensitivityReview: false,
          traditionalHealingRespect: false,
          communityBenefitScore: 7
        },
        status: 'Under Review',
        requestedAt: new Date('2024-02-05'),
        reviewDeadline: new Date('2024-03-05'),
        dataAccessPeriod: 180,
        maxPatientCount: 2000,
        compensationOffered: 25000,
        researchBenefits: 'Will provide insights into successful integration models that can be replicated across Africa and other regions with strong traditional healing traditions.',
        communityFeedback: []
      }
    ];

    const mockDatasets: ResearchDataset[] = [
      {
        datasetId: 'dataset_001',
        requestId: 'req_research_001',
        generatedAt: new Date('2024-02-20'),
        dataPoints: 4847,
        privacyMethod: 'Zero Knowledge',
        encryptionLevel: 'Quantum-Resistant',
        accessExpirationDate: new Date('2025-02-20'),
        downloadCount: 3,
        integrityHash: 'sha256:a1b2c3d4e5f6...',
        zkProofHash: 'zk:proof123abc...',
        communityCompensation: 48470, // 10 LIVES per data point
        researchImpactScore: 8.7,
        metadata: {
          totalRecords: 4847,
          dateRange: {
            start: new Date('2023-01-01'),
            end: new Date('2024-01-31')
          },
          geographicCoverage: ['Kenya', 'Tanzania', 'Uganda', 'Brazil', 'Colombia', 'Philippines'],
          treatmentCategories: ['General Medicine', 'Traditional Healing', 'Community Care', 'Preventive Care'],
          ageDistribution: [
            { range: '18-30', count: 1454 },
            { range: '31-45', count: 1697 },
            { range: '46-60', count: 1242 },
            { range: '61-80', count: 454 }
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 52.3 },
            { gender: 'Male', percentage: 45.1 },
            { gender: 'Other', percentage: 2.6 }
          ],
          privacyGuarantees: [
            'Zero-knowledge proofs ensure no individual data can be reconstructed',
            'K-anonymity with k=5 for all demographic groups',
            'Differential privacy with epsilon=0.1 for statistical queries',
            'Cultural data reviewed and approved by Elder Council'
          ],
          limitationsAndBiases: [
            'Data represents patients with access to Ubuntu Health platform',
            'Geographic bias toward regions with strong community health networks',
            'Traditional healing data may not capture all cultural practices'
          ],
          recommendedUsage: [
            'Population-level health outcome analysis',
            'Community healthcare model effectiveness studies',
            'Traditional-modern medicine integration research',
            'Healthcare access and equity analysis'
          ],
          citationRequirement: 'Ubuntu Health Community Research Dataset v1.0, accessed via privacy-preserving research API. Community compensation: 48,470 LIVES tokens distributed.'
        }
      }
    ];

    const mockZkProofs: ZeroKnowledgeProof[] = [
      {
        proofId: 'zk_proof_001',
        statement: 'Treatment success rate in community-centered care is significantly higher than traditional individual care model',
        proof: 'zkSNARK proof data: 0x4a5b6c7d8e9f...',
        verificationKey: 'vk_community_outcomes_001',
        circuitHash: 'circuit_sha256:9f8e7d6c5b4a...',
        publicInputs: [0.87, 0.73, 5000], // success_rate_community, success_rate_individual, sample_size
        proofType: 'Treatment Outcome',
        generatedAt: new Date('2024-02-25'),
        verifiedAt: new Date('2024-02-25'),
        verificationStatus: 'Valid',
        communityWitnessed: true
      },
      {
        proofId: 'zk_proof_002',
        statement: 'Traditional healing integration correlates with improved patient satisfaction without revealing specific practices',
        proof: 'zkSNARK proof data: 0x1a2b3c4d5e6f...',
        verificationKey: 'vk_traditional_integration_001',
        circuitHash: 'circuit_sha256:6f5e4d3c2b1a...',
        publicInputs: [0.94, 0.81, 2847], // satisfaction_with_integration, satisfaction_without, sample_size
        proofType: 'Community Impact',
        generatedAt: new Date('2024-03-01'),
        verificationStatus: 'Pending',
        communityWitnessed: false
      }
    ];

    const mockPrivacyQueries: PrivacyPreservingQuery[] = [
      {
        queryId: 'query_001',
        researcherId: 'researcher_ana_001',
        query: 'SELECT AVG(treatment_duration), COUNT(*) FROM treatments WHERE category = "cardiovascular" GROUP BY geographic_region',
        queryType: 'Statistical',
        privacyBudget: 1.0,
        noiseParameters: {
          mechanism: 'Laplace',
          sensitivity: 1.0,
          epsilon: 0.1
        },
        results: {
          africa: { avg_duration: 89.2, count: 547, noise_added: 3.2 },
          south_america: { avg_duration: 76.8, count: 423, noise_added: 2.1 },
          asia: { avg_duration: 82.5, count: 389, noise_added: 2.8 }
        },
        executedAt: new Date('2024-02-22'),
        privacyLoss: 0.1,
        communityApproved: true
      }
    ];

    setTimeout(() => {
      setResearchRequests(mockRequests);
      setActiveDatasets(mockDatasets);
      setZkProofs(mockZkProofs);
      setPrivacyQueries(mockPrivacyQueries);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApproveRequest = (requestId: string) => {
    setResearchRequests(requests =>
      requests.map(req =>
        req.requestId === requestId
          ? { ...req, status: 'Active' }
          : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setResearchRequests(requests =>
      requests.map(req =>
        req.requestId === requestId
          ? { ...req, status: 'Rejected' }
          : req
      )
    );
  };

  const handleCommunityVote = (requestId: string, vote: 'approve' | 'reject' | 'abstain') => {
    setResearchRequests(requests =>
      requests.map(req =>
        req.requestId === requestId
          ? {
              ...req,
              ubuntuCommunityApproval: {
                ...req.ubuntuCommunityApproval,
                communityVotes: {
                  ...req.ubuntuCommunityApproval.communityVotes,
                  [vote]: req.ubuntuCommunityApproval.communityVotes[vote] + 1
                }
              }
            }
          : req
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Approved': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Under Review': return 'text-purple-600 bg-purple-100';
      case 'Community Vote': return 'text-orange-600 bg-orange-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      case 'Completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'ZeroKnowledge': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'Anonymized': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'Pseudonymized': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Aggregated': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getApprovalColor = (approval: string) => {
    switch (approval) {
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Not Required': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Privacy-Preserving Research Data API</h1>
            <p className="text-purple-100 mb-2">Ubuntu Health Community Research Platform</p>
            <p className="text-sm text-purple-200">
              "I am because we are" - Enabling research while protecting community privacy and respecting traditional knowledge
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{activeDatasets.length}</div>
            <div className="text-purple-100">Active Datasets</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Research</p>
              <p className="text-2xl font-bold text-gray-900">{researchRequests.filter(r => r.status === 'Active').length}</p>
            </div>
            <div className="text-green-500 text-2xl">🔬</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Privacy Queries</p>
              <p className="text-2xl font-bold text-gray-900">{privacyQueries.length}</p>
            </div>
            <div className="text-blue-500 text-2xl">🔒</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ZK Proofs</p>
              <p className="text-2xl font-bold text-gray-900">{zkProofs.length}</p>
            </div>
            <div className="text-purple-500 text-2xl">🛡️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Community Tokens</p>
              <p className="text-2xl font-bold text-gray-900">{activeDatasets.reduce((sum, d) => sum + d.communityCompensation, 0).toLocaleString()}</p>
            </div>
            <div className="text-orange-500 text-2xl">🪙</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'requests', label: 'Research Requests', icon: '📝' },
              { key: 'datasets', label: 'Active Datasets', icon: '📊' },
              { key: 'privacy', label: 'Privacy Queries', icon: '🔒' },
              { key: 'zkproofs', label: 'ZK Proofs', icon: '🛡️' },
              { key: 'community', label: 'Community Governance', icon: '🌍' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Research Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Research Data Requests</h3>
                <button
                  onClick={() => setShowNewRequestForm(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
                >
                  + New Request
                </button>
              </div>

              <div className="space-y-4">
                {researchRequests.map((request) => (
                  <div key={request.requestId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{request.researchTitle}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {request.requesterName} - {request.requesterInstitution}
                        </p>
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{request.researchDescription}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrivacyLevelColor(request.privacyLevel)}`}>
                            {request.privacyLevel} Privacy
                          </span>
                          <span className="text-gray-500">
                            Compensation: {request.compensationOffered.toLocaleString()} LIVES
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Requested: {request.requestedAt.toLocaleDateString()}</div>
                        <div>Deadline: {request.reviewDeadline.toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Ubuntu Community Approval Status */}
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium text-orange-900 mb-2">Ubuntu Community Governance</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Elder Council:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getApprovalColor(request.ubuntuCommunityApproval.elderCouncilApproval)}`}>
                            {request.ubuntuCommunityApproval.elderCouncilApproval}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cultural Review:</span>
                          <span className={`ml-2 ${request.ubuntuCommunityApproval.culturalSensitivityReview ? 'text-green-600' : 'text-red-600'}`}>
                            {request.ubuntuCommunityApproval.culturalSensitivityReview ? '✓ Complete' : '✗ Pending'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Community Votes:</span>
                          <span className="ml-2 text-green-600">{request.ubuntuCommunityApproval.communityVotes.approve}</span>
                          <span className="text-red-600">/{request.ubuntuCommunityApproval.communityVotes.reject}</span>
                          <span className="text-gray-500">/{request.ubuntuCommunityApproval.communityVotes.abstain}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Benefit Score:</span>
                          <span className="ml-2 font-semibold">{request.ubuntuCommunityApproval.communityBenefitScore}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Data Requested */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Data Categories Requested:</h5>
                      <div className="flex flex-wrap gap-2">
                        {request.dataRequested.map((data, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {data.dataCategory} ({data.aggregationLevel})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Community Feedback Summary */}
                    {request.communityFeedback.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-2">Community Feedback ({request.communityFeedback.length}):</h5>
                        <div className="space-y-2">
                          {request.communityFeedback.slice(0, 2).map((feedback) => (
                            <div key={feedback.feedbackId} className="bg-gray-50 p-3 rounded text-sm">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium">{feedback.memberType}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  feedback.recommendation === 'Approve' ? 'bg-green-100 text-green-600' :
                                  feedback.recommendation === 'Reject' ? 'bg-red-100 text-red-600' :
                                  'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {feedback.recommendation}
                                </span>
                              </div>
                              <p className="text-gray-700">{feedback.feedback}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors border"
                      >
                        View Details
                      </button>
                      {request.status === 'Under Review' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.requestId)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.requestId)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'Community Vote' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCommunityVote(request.requestId, 'approve')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            👍 Vote Approve
                          </button>
                          <button
                            onClick={() => handleCommunityVote(request.requestId, 'reject')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            👎 Vote Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Datasets Tab */}
          {activeTab === 'datasets' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Active Research Datasets</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeDatasets.map((dataset) => (
                  <div key={dataset.datasetId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Dataset #{dataset.datasetId}</h4>
                        <p className="text-sm text-gray-600">Generated: {dataset.generatedAt.toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrivacyLevelColor(dataset.privacyMethod)}`}>
                        {dataset.privacyMethod}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Data Points:</span>
                        <span className="font-semibold ml-2">{dataset.dataPoints.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Downloads:</span>
                        <span className="font-semibold ml-2">{dataset.downloadCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Community Compensation:</span>
                        <span className="font-semibold ml-2 text-orange-600">{dataset.communityCompensation.toLocaleString()} LIVES</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Impact Score:</span>
                        <span className="font-semibold ml-2">{dataset.researchImpactScore}/10</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Geographic Coverage</h5>
                      <div className="flex flex-wrap gap-1">
                        {dataset.metadata.geographicCoverage.map((region, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Privacy Guarantees</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {dataset.metadata.privacyGuarantees.slice(0, 2).map((guarantee, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                            {guarantee}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedDataset(dataset);
                          setShowDatasetModal(true);
                        }}
                        className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm border">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Queries Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Privacy-Preserving Queries</h3>

              <div className="space-y-4">
                {privacyQueries.map((query) => (
                  <div key={query.queryId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Query #{query.queryId}</h4>
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <code className="text-sm text-gray-700">{query.query}</code>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">Type: <span className="font-medium">{query.queryType}</span></span>
                          <span className="text-gray-600">Privacy Budget: <span className="font-medium">ε = {query.noiseParameters.epsilon}</span></span>
                          <span className="text-gray-600">Executed: <span className="font-medium">{query.executedAt?.toLocaleDateString()}</span></span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        query.communityApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {query.communityApproved ? 'Community Approved' : 'Pending Approval'}
                      </span>
                    </div>

                    {query.results && (
                      <div className="bg-blue-50 p-4 rounded">
                        <h5 className="font-medium text-blue-900 mb-2">Results (with privacy noise added)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {Object.entries(query.results).map(([region, data]: [string, any]) => (
                            <div key={region} className="bg-white p-3 rounded">
                              <div className="font-medium text-blue-800 capitalize mb-1">{region.replace('_', ' ')}</div>
                              <div className="text-gray-600">Avg Duration: {data.avg_duration} days</div>
                              <div className="text-gray-600">Count: {data.count}</div>
                              <div className="text-xs text-gray-500">Noise: ±{data.noise_added}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zero-Knowledge Proofs Tab */}
          {activeTab === 'zkproofs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Zero-Knowledge Proofs</h3>

              <div className="space-y-4">
                {zkProofs.map((proof) => (
                  <div key={proof.proofId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Proof #{proof.proofId}</h4>
                        <p className="text-gray-700 mb-2">{proof.statement}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            proof.verificationStatus === 'Valid' ? 'bg-green-100 text-green-600' :
                            proof.verificationStatus === 'Invalid' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {proof.verificationStatus}
                          </span>
                          <span className="text-gray-600">Type: {proof.proofType}</span>
                          <span className={`${proof.communityWitnessed ? 'text-green-600' : 'text-gray-500'}`}>
                            {proof.communityWitnessed ? '👥 Community Witnessed' : '⏳ Awaiting Witnesses'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Generated: {proof.generatedAt.toLocaleDateString()}</div>
                        {proof.verifiedAt && <div>Verified: {proof.verifiedAt.toLocaleDateString()}</div>}
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded">
                      <h5 className="font-medium text-purple-900 mb-2">Technical Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Verification Key:</span>
                          <div className="font-mono text-xs mt-1 break-all">{proof.verificationKey}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Circuit Hash:</span>
                          <div className="font-mono text-xs mt-1 break-all">{proof.circuitHash}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-600">Public Inputs:</span>
                        <div className="font-mono text-xs mt-1">[{proof.publicInputs.join(', ')}]</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Governance Tab */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Ubuntu Community Research Governance</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Elder Council Oversight */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Elder Council Oversight</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Reviews:</span>
                      <span className="font-semibold">
                        {researchRequests.filter(r => r.ubuntuCommunityApproval.elderCouncilApproval === 'Pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cultural Sensitivity Reviews:</span>
                      <span className="font-semibold">
                        {researchRequests.filter(r => r.ubuntuCommunityApproval.culturalSensitivityReview).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Traditional Healing Respect:</span>
                      <span className="font-semibold">
                        {researchRequests.filter(r => r.ubuntuCommunityApproval.traditionalHealingRespect).length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-orange-50 rounded">
                    <p className="text-sm text-orange-800">
                      <strong>Ubuntu Principle:</strong> All research involving traditional healing practices 
                      must be reviewed and approved by Elder Council to ensure cultural respect and community benefit.
                    </p>
                  </div>
                </div>

                {/* Community Voting Stats */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Community Participation</h4>
                  <div className="space-y-4">
                    {researchRequests.map((request) => (
                      <div key={request.requestId} className="border-l-4 border-orange-500 pl-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {request.researchTitle.substring(0, 50)}...
                        </div>
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-green-600">
                            👍 {request.ubuntuCommunityApproval.communityVotes.approve}
                          </span>
                          <span className="text-red-600">
                            👎 {request.ubuntuCommunityApproval.communityVotes.reject}
                          </span>
                          <span className="text-gray-500">
                            ⭕ {request.ubuntuCommunityApproval.communityVotes.abstain}
                          </span>
                          <span className="text-purple-600">
                            Benefit: {request.ubuntuCommunityApproval.communityBenefitScore}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Compensation */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Community Compensation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total LIVES Distributed:</span>
                      <span className="font-semibold text-orange-600">
                        {activeDatasets.reduce((sum, d) => sum + d.communityCompensation, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Per Data Point Rate:</span>
                      <span className="font-semibold">10 LIVES</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Research Proposals Funded:</span>
                      <span className="font-semibold">
                        {researchRequests.filter(r => r.compensationOffered > 0).length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded">
                    <p className="text-sm text-green-800">
                      <strong>Fair Compensation:</strong> Ubuntu Health ensures community members 
                      are fairly compensated for contributing their health data to research.
                    </p>
                  </div>
                </div>

                {/* Privacy Protection */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Privacy Protection</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Zero-Knowledge Proofs:</span>
                      <span className="font-semibold">{zkProofs.filter(p => p.verificationStatus === 'Valid').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Differential Privacy Queries:</span>
                      <span className="font-semibold">{privacyQueries.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Community Witnessed Proofs:</span>
                      <span className="font-semibold">{zkProofs.filter(p => p.communityWitnessed).length}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Privacy First:</strong> All research uses advanced cryptographic techniques 
                      to ensure individual privacy while enabling valuable community insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Detail Modal */}
      {showDatasetModal && selectedDataset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Research Dataset Details</h2>
                <button
                  onClick={() => setShowDatasetModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Dataset Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dataset ID:</span>
                        <span className="font-mono">{selectedDataset.datasetId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Records:</span>
                        <span className="font-semibold">{selectedDataset.metadata.totalRecords.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Privacy Method:</span>
                        <span className="font-semibold">{selectedDataset.privacyMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Encryption:</span>
                        <span className="font-semibold">{selectedDataset.encryptionLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Geographic Coverage</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDataset.metadata.geographicCoverage.map((region, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Age Distribution</h3>
                    <div className="space-y-1">
                      {selectedDataset.metadata.ageDistribution.map((age, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{age.range} years</span>
                          <span className="font-semibold">{age.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Privacy Guarantees</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedDataset.metadata.privacyGuarantees.map((guarantee, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></span>
                          <span className="text-gray-700">{guarantee}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Recommended Usage</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedDataset.metadata.recommendedUsage.map((usage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
                          <span className="text-gray-700">{usage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Limitations & Biases</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedDataset.metadata.limitationsAndBiases.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-2"></span>
                          <span className="text-gray-700">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Citation Requirement</h3>
                <p className="text-sm text-gray-700 font-mono">{selectedDataset.metadata.citationRequirement}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchDataAPI;
