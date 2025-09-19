import React, { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Streamlined interfaces for Ubuntu Health platform
interface TreatmentMilestone {
  milestoneId: number;
  description: string;
  fundingAmount: number;
  verificationRequired: 'MedicalProvider' | 'PatientReported' | 'ThirdPartyEvidence' | 'CommunityWitness';
  completionStatus: 'NotStarted' | 'InProgress' | 'AwaitingVerification' | 'Verified' | 'Failed';
  expectedCompletion: Date;
  completionTimestamp?: Date;
  verifyingProvider?: string;
  verificationEvidence?: string;
  cryptographicProof?: string;
}

interface Sponsor {
  wallet: string;
  amountContributed: number;
  sponsoredMilestones: number[];
  firstSponsoredAt: Date;
  lastSponsoredAt: Date;
  sponsorMessage?: string;
  anonymous: boolean;
  ubuntuHealthMember: boolean;
}

interface TreatmentPass {
  passId: number;
  patient: string;
  treatmentTitle: string;
  treatmentDescription: string;
  treatmentCategory: string;
  fundingTarget: number;
  currentFunding: number;
  fundingPercentage: number;
  milestones: TreatmentMilestone[];
  sponsors: Sponsor[];
  createdAt: Date;
  treatmentDurationDays: number;
  status: 'FundingRequired' | 'PartiallyFunded' | 'FullyFunded' | 'TreatmentInProgress' | 'TreatmentCompleted' | 'TreatmentPaused' | 'TreatmentCancelled';
  ubuntuHealthVerified: boolean;
  verificationTimestamp?: Date;
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  patientAge: number;
  patientLocation: string;
}

interface FilterOptions {
  category: string;
  urgency: string;
  fundingRange: [number, number];
  verified: boolean | null;
  search: string;
}

const TreatmentRequestBrowser: React.FC = () => {
  const [treatmentPasses, setTreatmentPasses] = useState<TreatmentPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<TreatmentPass | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    urgency: '',
    fundingRange: [0, 100000],
    verified: null,
    search: ''
  });

  // Mock data for demonstration - streamlined without complex governance
  useEffect(() => {
    const mockData: TreatmentPass[] = [
      {
        passId: 1,
        patient: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHRv',
        treatmentTitle: 'Heart Surgery for Maria',
        treatmentDescription: 'Maria needs urgent heart valve replacement surgery. She is a 45-year-old mother of three who has been struggling with heart complications for the past year.',
        treatmentCategory: 'Cardiovascular',
        fundingTarget: 25000,
        currentFunding: 8500,
        fundingPercentage: 34,
        createdAt: new Date('2024-01-15'),
        treatmentDurationDays: 30,
        status: 'PartiallyFunded',
        ubuntuHealthVerified: true,
        verificationTimestamp: new Date('2024-01-16'),
        urgencyLevel: 'High',
        patientAge: 45,
        patientLocation: 'São Paulo, Brazil',
        milestones: [
          {
            milestoneId: 1,
            description: 'Pre-operative assessments and blood work',
            fundingAmount: 2500,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'Verified',
            expectedCompletion: new Date('2024-02-01'),
            completionTimestamp: new Date('2024-01-28'),
            verifyingProvider: 'Dr. Santos, Cardiologist',
            cryptographicProof: 'ipfs://QmX7Y8Z9...'
          },
          {
            milestoneId: 2,
            description: 'Heart valve replacement surgery',
            fundingAmount: 18000,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'InProgress',
            expectedCompletion: new Date('2024-02-15')
          },
          {
            milestoneId: 3,
            description: 'Post-operative recovery and monitoring',
            fundingAmount: 4500,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'NotStarted',
            expectedCompletion: new Date('2024-03-01')
          }
        ],
        sponsors: [
          {
            wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            amountContributed: 5000,
            sponsoredMilestones: [1, 2],
            firstSponsoredAt: new Date('2024-01-16'),
            lastSponsoredAt: new Date('2024-01-16'),
            sponsorMessage: 'Sending love and support for your recovery! 💖',
            anonymous: false,
            ubuntuHealthMember: true
          },
          {
            wallet: '4vJ5JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi',
            amountContributed: 3500,
            sponsoredMilestones: [1],
            firstSponsoredAt: new Date('2024-01-18'),
            lastSponsoredAt: new Date('2024-01-18'),
            anonymous: true,
            ubuntuHealthMember: false
          }
        ]
      },
      {
        passId: 2,
        patient: '2yGAot6V9uB3AuXnvQRBNkgzkv9A4h2ixKHnJFwZGGFN',
        treatmentTitle: 'Cancer Treatment for Ahmed',
        treatmentDescription: 'Ahmed is a 38-year-old father diagnosed with lymphoma. He needs chemotherapy treatment to fight this aggressive cancer.',
        treatmentCategory: 'Oncology',
        fundingTarget: 45000,
        currentFunding: 12000,
        fundingPercentage: 27,
        createdAt: new Date('2024-01-10'),
        treatmentDurationDays: 180,
        status: 'PartiallyFunded',
        ubuntuHealthVerified: true,
        verificationTimestamp: new Date('2024-01-11'),
        urgencyLevel: 'Critical',
        patientAge: 38,
        patientLocation: 'Cairo, Egypt',
        milestones: [
          {
            milestoneId: 1,
            description: 'Initial diagnostic tests and staging',
            fundingAmount: 5000,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'Verified',
            expectedCompletion: new Date('2024-01-25'),
            completionTimestamp: new Date('2024-01-24'),
            verifyingProvider: 'Dr. Hassan, Oncologist'
          },
          {
            milestoneId: 2,
            description: 'First round of chemotherapy (4 cycles)',
            fundingAmount: 20000,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'InProgress',
            expectedCompletion: new Date('2024-03-15')
          },
          {
            milestoneId: 3,
            description: 'Mid-treatment assessment and imaging',
            fundingAmount: 8000,
            verificationRequired: 'ThirdPartyEvidence',
            completionStatus: 'NotStarted',
            expectedCompletion: new Date('2024-04-01')
          },
          {
            milestoneId: 4,
            description: 'Second round of chemotherapy if needed',
            fundingAmount: 12000,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'NotStarted',
            expectedCompletion: new Date('2024-06-01')
          }
        ],
        sponsors: [
          {
            wallet: '8wKT3N5YcX2LoQRX6eKqmfR4Uv9GfB3yTpPnMcVwQ8R',
            amountContributed: 10000,
            sponsoredMilestones: [1, 2],
            firstSponsoredAt: new Date('2024-01-12'),
            lastSponsoredAt: new Date('2024-01-12'),
            sponsorMessage: 'Stay strong, Ahmed. We believe in your recovery! 🙏',
            anonymous: false,
            ubuntuHealthMember: true
          },
          {
            wallet: '3kL9JmNqR8VzXyQoP2FdTwE5Y7BfC4tGhRsLmPnKjWv',
            amountContributed: 2000,
            sponsoredMilestones: [1],
            firstSponsoredAt: new Date('2024-01-14'),
            lastSponsoredAt: new Date('2024-01-14'),
            anonymous: true,
            ubuntuHealthMember: false
          }
        ]
      },
      {
        passId: 3,
        patient: '6tRgH4vN8mQ2BfY7ePxKzWcL9jQnMrSt5uVbFdGh3Pk',
        treatmentTitle: 'Diabetes Management for Elena',
        treatmentDescription: 'Elena needs continuous glucose monitoring equipment and insulin supplies to manage her Type 1 diabetes effectively.',
        treatmentCategory: 'Endocrinology',
        fundingTarget: 8000,
        currentFunding: 3200,
        fundingPercentage: 40,
        createdAt: new Date('2024-01-20'),
        treatmentDurationDays: 365,
        status: 'PartiallyFunded',
        ubuntuHealthVerified: true,
        verificationTimestamp: new Date('2024-01-21'),
        urgencyLevel: 'Medium',
        patientAge: 28,
        patientLocation: 'Barcelona, Spain',
        milestones: [
          {
            milestoneId: 1,
            description: 'Continuous glucose monitor setup',
            fundingAmount: 2000,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'Verified',
            expectedCompletion: new Date('2024-02-01'),
            completionTimestamp: new Date('2024-01-30'),
            verifyingProvider: 'Dr. Rodriguez, Endocrinologist'
          },
          {
            milestoneId: 2,
            description: '6-month insulin supply',
            fundingAmount: 4000,
            verificationRequired: 'PatientReported',
            completionStatus: 'InProgress',
            expectedCompletion: new Date('2024-02-15')
          },
          {
            milestoneId: 3,
            description: 'Quarterly check-ups and adjustments',
            fundingAmount: 2000,
            verificationRequired: 'MedicalProvider',
            completionStatus: 'NotStarted',
            expectedCompletion: new Date('2024-08-01')
          }
        ],
        sponsors: [
          {
            wallet: '5nP8QrM3vB7FzYjL4XwRcE2tGhKsNmQbVdPfTyUj9Wz',
            amountContributed: 3200,
            sponsoredMilestones: [1, 2],
            firstSponsoredAt: new Date('2024-01-22'),
            lastSponsoredAt: new Date('2024-01-22'),
            sponsorMessage: 'Managing diabetes is tough, but you've got this! 💪',
            anonymous: false,
            ubuntuHealthMember: true
          }
        ]
      }
    ];

    setTimeout(() => {
      setTreatmentPasses(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter treatment passes based on current filters
  const filteredPasses = useMemo(() => {
    return treatmentPasses.filter(pass => {
      if (filters.category && pass.treatmentCategory !== filters.category) return false;
      if (filters.urgency && pass.urgencyLevel !== filters.urgency) return false;
      if (pass.fundingTarget < filters.fundingRange[0] || pass.fundingTarget > filters.fundingRange[1]) return false;
      if (filters.verified !== null && pass.ubuntuHealthVerified !== filters.verified) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!pass.treatmentTitle.toLowerCase().includes(searchLower) &&
            !pass.treatmentDescription.toLowerCase().includes(searchLower) &&
            !pass.patientLocation.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
  }, [treatmentPasses, filters]);

  const handleSponsor = async (passId: number, amount: number, milestones: number[]) => {
    // This would integrate with Solana smart contract
    console.log(`Sponsoring treatment pass ${passId} with ${amount} for milestones:`, milestones);
    // Implementation would call the smart contract sponsor_treatment function
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FundingRequired': return 'text-red-600 bg-red-100';
      case 'PartiallyFunded': return 'text-yellow-600 bg-yellow-100';
      case 'FullyFunded': return 'text-green-600 bg-green-100';
      case 'TreatmentInProgress': return 'text-blue-600 bg-blue-100';
      case 'TreatmentCompleted': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Treatment Request Browser</h1>
        <p className="text-lg text-gray-600">Discover and sponsor treatment requests from patients worldwide</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-orange-600">
          <span>Ubuntu Health</span>
          <span>•</span>
          <span>I am because we are</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filter Treatment Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Oncology">Oncology</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              value={filters.urgency}
              onChange={(e) => setFilters({...filters, urgency: e.target.value})}
            >
              <option value="">All Urgency Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              value={filters.verified === null ? '' : filters.verified.toString()}
              onChange={(e) => setFilters({...filters, verified: e.target.value === '' ? null : e.target.value === 'true'})}
            >
              <option value="">All Statuses</option>
              <option value="true">Ubuntu Health Verified</option>
              <option value="false">Pending Verification</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search treatments..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredPasses.length} of {treatmentPasses.length} treatment requests
        </p>
        <div className="flex items-center space-x-2 text-sm">
          <span className="inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
          <span>Ubuntu Health Verified</span>
        </div>
      </div>

      {/* Treatment Pass Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPasses.map((pass) => (
          <div
            key={pass.passId}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-orange-500"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pass.treatmentTitle}</h3>
                    {pass.ubuntuHealthVerified && (
                      <span className="inline-block w-4 h-4 bg-orange-500 rounded-full" title="Ubuntu Health Verified"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{pass.patientLocation}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(pass.urgencyLevel)}`}>
                    {pass.urgencyLevel}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{pass.treatmentDescription}</p>

              {/* Funding Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{pass.fundingPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${pass.fundingPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-gray-600">${pass.currentFunding.toLocaleString()} raised</span>
                  <span className="font-semibold text-gray-900">${pass.fundingTarget.toLocaleString()} goal</span>
                </div>
              </div>

              {/* Status and Category */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pass.status)}`}>
                  {pass.status.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-xs text-gray-500">{pass.treatmentCategory}</span>
              </div>

              {/* Milestones Summary */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Milestones ({pass.milestones.length})</p>
                <div className="flex space-x-1">
                  {pass.milestones.map((milestone) => (
                    <div
                      key={milestone.milestoneId}
                      className={`w-4 h-4 rounded-full ${
                        milestone.completionStatus === 'Verified' ? 'bg-green-500' :
                        milestone.completionStatus === 'InProgress' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`}
                      title={milestone.description}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Sponsors */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Sponsors ({pass.sponsors.length})
                  {pass.sponsors.some(s => s.ubuntuHealthMember) && (
                    <span className="ml-2 text-orange-600 text-xs">Ubuntu Health Members</span>
                  )}
                </p>
                <div className="flex -space-x-2">
                  {pass.sponsors.slice(0, 5).map((sponsor, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold ${
                        sponsor.ubuntuHealthMember ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                      title={sponsor.anonymous ? 'Anonymous Sponsor' : `Sponsor: ${sponsor.wallet.slice(0, 8)}...`}
                    >
                      {sponsor.anonymous ? '?' : sponsor.wallet.slice(0, 1).toUpperCase()}
                    </div>
                  ))}
                  {pass.sponsors.length > 5 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                      +{pass.sponsors.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPass(pass)}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleSponsor(pass.passId, 1000, [1])}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium border"
                >
                  Sponsor Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredPasses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No treatment requests found</div>
          <p className="text-gray-600">Try adjusting your filters to see more results</p>
        </div>
      )}

      {/* Treatment Pass Detail Modal */}
      {selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPass.treatmentTitle}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{selectedPass.patientLocation}</span>
                    <span>•</span>
                    <span>Age: {selectedPass.patientAge}</span>
                    <span>•</span>
                    <span>{selectedPass.treatmentCategory}</span>
                    {selectedPass.ubuntuHealthVerified && (
                      <>
                        <span>•</span>
                        <span className="text-orange-600 font-medium">Ubuntu Health Verified</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPass(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Treatment Details</h3>
                  <p className="text-gray-700 mb-4">{selectedPass.treatmentDescription}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">Funding Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Target Amount:</span>
                        <span className="font-semibold">${selectedPass.fundingTarget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount Raised:</span>
                        <span className="font-semibold text-green-600">${selectedPass.currentFunding.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-semibold">${(selectedPass.fundingTarget - selectedPass.currentFunding).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-3">Treatment Milestones</h4>
                  <div className="space-y-3">
                    {selectedPass.milestones.map((milestone) => (
                      <div key={milestone.milestoneId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{milestone.description}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            milestone.completionStatus === 'Verified' ? 'bg-green-100 text-green-600' :
                            milestone.completionStatus === 'InProgress' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {milestone.completionStatus}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Amount: ${milestone.fundingAmount.toLocaleString()}</div>
                          <div>Expected: {milestone.expectedCompletion.toLocaleDateString()}</div>
                          {milestone.verifyingProvider && (
                            <div>Verified by: {milestone.verifyingProvider}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Sponsors</h3>
                  <div className="space-y-3 mb-6">
                    {selectedPass.sponsors.map((sponsor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">
                              {sponsor.anonymous ? 'Anonymous Sponsor' : `${sponsor.wallet.slice(0, 8)}...`}
                            </span>
                            {sponsor.ubuntuHealthMember && (
                              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                                Ubuntu Health Member
                              </span>
                            )}
                          </div>
                          <span className="font-semibold">${sponsor.amountContributed.toLocaleString()}</span>
                        </div>
                        {sponsor.sponsorMessage && (
                          <p className="text-sm text-gray-600 italic">"{sponsor.sponsorMessage}"</p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          Sponsored on {sponsor.firstSponsoredAt.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-3">Sponsor This Treatment</h4>
                    <p className="text-sm text-orange-800 mb-4">
                      Help {selectedPass.treatmentTitle.split(' ').slice(-1)[0]} access the healthcare they need. 
                      Your contribution goes directly to verified treatment milestones.
                    </p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm">
                          Sponsor $100
                        </button>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm">
                          Sponsor $500
                        </button>
                      </div>
                      <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors font-medium">
                        Custom Amount
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentRequestBrowser;
