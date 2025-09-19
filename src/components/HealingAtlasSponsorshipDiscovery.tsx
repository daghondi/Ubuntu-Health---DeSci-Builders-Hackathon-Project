import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Enhanced interfaces for Healing Atlas Sponsorship Discovery Platform
interface TreatmentPass {
  passId: number;
  patient: {
    publicKey: string;
    anonymizedName: string;
    age: number;
    location: string;
    patientStory: string;
  };
  treatment: {
    title: string;
    description: string;
    category: string;
    urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    estimatedCost: number;
    treatmentDurationDays: number;
    traditionalHealingComponent?: TraditionalHealing;
  };
  funding: {
    target: number;
    currentFunding: number;
    fundingPercentage: number;
    sponsorsCount: number;
    escrowAddress?: string;
    timeRemaining: string;
  };
  milestones: EnhancedTreatmentMilestone[];
  sponsors: EnhancedSponsor[];
  verification: {
    ubuntuHealthVerified: boolean;
    medicalProviderVerified: boolean;
    communityEndorsed: boolean;
    verificationTimestamp: Date;
    verifyingProvider?: string;
  };
  sponsorship: {
    sponsorshipTiers: SponsorshipTier[];
    ubuntuMemberBenefits: string[];
    sponsorMatching: SponsorMatchingCriteria;
    rewardStructure: SponsorshipRewards;
  };
  blockchain: {
    treatmentPassAddress: string;
    escrowAddress?: string;
    nftMintAddress?: string;
    livesTokenRewards: number;
  };
  status: 'FundingRequired' | 'PartiallyFunded' | 'FullyFunded' | 'TreatmentInProgress' | 'TreatmentCompleted' | 'TreatmentPaused' | 'TreatmentCancelled';
  createdAt: Date;
  lastUpdated: Date;
}

interface EnhancedTreatmentMilestone {
  milestoneId: number;
  description: string;
  fundingAmount: number;
  verificationRequired: 'HealthcareProvider' | 'PatientSelfReport' | 'UbuntuHealthCommunity' | 'AutomatedVerification' | 'ThirdPartyMedical';
  completionStatus: 'NotStarted' | 'InProgress' | 'AwaitingVerification' | 'Verified' | 'Failed';
  expectedCompletion: Date;
  completionTimestamp?: Date;
  verifyingProvider?: string;
  verificationEvidence?: string;
  cryptographicProof?: string;
  escrowReleaseSchedule: {
    releaseAmount: number;
    releaseConditions: string[];
    emergencyReleaseEnabled: boolean;
  };
  livesTokenReward: number; // $LIVES tokens earned upon completion
}

interface EnhancedSponsor {
  wallet: string;
  amountContributed: number;
  sponsoredMilestones: number[];
  firstSponsoredAt: Date;
  lastSponsoredAt: Date;
  sponsorMessage?: string;
  anonymous: boolean;
  ubuntuHealthMember: boolean;
  sponsorshipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Ubuntu Champion';
  livesTokensEarned: number;
  sponsorshipHistory: {
    totalTreatmentsSponsored: number;
    totalAmountSponsored: number;
    successfulTreatments: number;
  };
}

interface SponsorshipTier {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Ubuntu Champion';
  minimumAmount: number;
  benefits: string[];
  livesTokenMultiplier: number;
  exclusiveAccess: string[];
  milestoneAccess: number[]; // specific milestones this tier can sponsor
}

interface SponsorMatchingCriteria {
  preferredSponsorTypes: string[];
  sponsorshipGoals: string[];
  impactAreas: string[];
  communityConnections: string[];
  previousSponsorSuccess: boolean;
}

interface SponsorshipRewards {
  baseLivesTokenReward: number; // per $1 sponsored
  milestoneCompletionBonus: number;
  ubuntuMemberMultiplier: number;
  longTermSponsorBonus: number;
  communityImpactBonus: number;
}

interface TraditionalHealing {
  practices: string[];
  culturalSignificance: string;
  elderEndorsement?: string;
  communitySupport: string;
  integrationWithModernMedicine: string;
}

interface AdvancedFilterOptions {
  categories: string[];
  urgencyLevels: string[];
  fundingRanges: { min: number; max: number }[];
  locations: string[];
  sponsorshipTiers: string[];
  verificationStatus: string[];
  timeframes: string[];
  traditionalHealingIncluded: boolean;
  ubuntuHealthVerified: boolean;
  availableMilestones: number[];
  livesTokenRewards: { min: number; max: number };
}

interface SponsorProfile {
  wallet: string;
  ubuntuHealthMember: boolean;
  sponsorshipPreferences: {
    categories: string[];
    maxAmount: number;
    preferredTiers: string[];
    communityFocus: string[];
  };
  sponsorshipHistory: {
    totalSponsored: number;
    treatmentsSupported: number;
    successRate: number;
    averageSponsorshipAmount: number;
  };
  livesTokenBalance: {
    current: number;
    earned: number;
    pending: number;
  };
}

const HealingAtlasSponsorshipDiscovery: React.FC = () => {
  const [treatmentPasses, setTreatmentPasses] = useState<TreatmentPass[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<TreatmentPass[]>([]);
  const [filters, setFilters] = useState<AdvancedFilterOptions>({
    categories: [],
    urgencyLevels: [],
    fundingRanges: [],
    locations: [],
    sponsorshipTiers: [],
    verificationStatus: [],
    timeframes: [],
    traditionalHealingIncluded: false,
    ubuntuHealthVerified: false,
    availableMilestones: [],
    livesTokenRewards: { min: 0, max: 1000 }
  });
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentPass | null>(null);
  const [sponsorProfile, setSponsorProfile] = useState<SponsorProfile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'urgency' | 'funding' | 'milestones' | 'rewards'>('urgency');
  const [loading, setLoading] = useState(true);
  const [sponsorshipMode, setSponsorshipMode] = useState<'browse' | 'sponsor' | 'track'>('browse');

  // Enhanced mock data for Healing Atlas platform
  useEffect(() => {
    const mockTreatmentPasses: TreatmentPass[] = [
      {
        passId: 1001,
        patient: {
          publicKey: '7xKWmJpqKq8YhfkGHNR4rD5mPkXcVzQa9nE3pJ6wRsS4',
          anonymizedName: 'Maria S.',
          age: 45,
          location: 'São Paulo, Brazil',
          patientStory: 'After months of chest pain and shortness of breath, I was diagnosed with a heart valve problem requiring surgery. My family has been supportive, but the financial burden is overwhelming. Through Ubuntu Health, I hope to find sponsors who believe in my healing journey.'
        },
        treatment: {
          title: 'Heart Valve Replacement Surgery',
          description: 'Critical heart valve replacement surgery with 6-month recovery period including cardiac rehabilitation and ongoing monitoring.',
          category: 'Cardiovascular',
          urgencyLevel: 'High',
          estimatedCost: 15420,
          treatmentDurationDays: 180,
          traditionalHealingComponent: {
            practices: ['Breathing exercises', 'Heart-strengthening herbs', 'Community prayer circles'],
            culturalSignificance: 'Heart health is considered sacred in our community - the heart connects us to Ubuntu',
            elderEndorsement: 'Elder Maria recommends combining modern surgery with traditional heart-strengthening practices',
            communitySupport: 'Local community will provide daily visits and traditional healing foods during recovery',
            integrationWithModernMedicine: 'Traditional practices will complement post-surgery rehabilitation under medical supervision'
          }
        },
        funding: {
          target: 15420,
          currentFunding: 8950,
          fundingPercentage: 58,
          sponsorsCount: 12,
          escrowAddress: 'ESCrow7xKWmJpqKq8YhfkGHNR4rD5mPkXcVzQa9nE3pJ6',
          timeRemaining: '23 days'
        },
        milestones: [
          {
            milestoneId: 1,
            description: 'Pre-surgical consultation and cardiac catheterization',
            fundingAmount: 2850,
            verificationRequired: 'HealthcareProvider',
            completionStatus: 'Verified',
            expectedCompletion: new Date('2024-09-25'),
            completionTimestamp: new Date('2024-09-22'),
            verifyingProvider: 'Dr. João Silva - Cardiologist',
            verificationEvidence: 'QmX7K3mMd8P9LqR4sN6vF2gH8jT1wE5yZ9cA3bV6nM7kL2',
            cryptographicProof: '0x8f92e3...',
            escrowReleaseSchedule: {
              releaseAmount: 2850,
              releaseConditions: ['Medical provider verification', 'Patient consent'],
              emergencyReleaseEnabled: true
            },
            livesTokenReward: 285
          },
          {
            milestoneId: 2,
            description: 'Heart valve replacement surgery',
            fundingAmount: 8500,
            verificationRequired: 'HealthcareProvider',
            completionStatus: 'InProgress',
            expectedCompletion: new Date('2024-10-15'),
            escrowReleaseSchedule: {
              releaseAmount: 8500,
              releaseConditions: ['Surgical completion', 'Post-op stability', 'Ubuntu Health verification'],
              emergencyReleaseEnabled: true
            },
            livesTokenReward: 850
          },
          {
            milestoneId: 3,
            description: 'Post-surgical recovery and cardiac rehabilitation',
            fundingAmount: 4070,
            verificationRequired: 'UbuntuHealthCommunity',
            completionStatus: 'NotStarted',
            expectedCompletion: new Date('2025-01-15'),
            escrowReleaseSchedule: {
              releaseAmount: 4070,
              releaseConditions: ['Rehabilitation completion', 'Community milestone verification', 'Traditional healing integration'],
              emergencyReleaseEnabled: false
            },
            livesTokenReward: 407
          }
        ],
        sponsors: [
          {
            wallet: 'SPONSOR123abc...',
            amountContributed: 2500,
            sponsoredMilestones: [1, 2],
            firstSponsoredAt: new Date('2024-09-10'),
            lastSponsoredAt: new Date('2024-09-15'),
            sponsorMessage: 'Wishing you strength and healing on your Ubuntu journey. I am because we are.',
            anonymous: false,
            ubuntuHealthMember: true,
            sponsorshipTier: 'Gold',
            livesTokensEarned: 3750, // 1.5x Ubuntu member bonus
            sponsorshipHistory: {
              totalTreatmentsSponsored: 8,
              totalAmountSponsored: 18750,
              successfulTreatments: 7
            }
          }
        ],
        verification: {
          ubuntuHealthVerified: true,
          medicalProviderVerified: true,
          communityEndorsed: true,
          verificationTimestamp: new Date('2024-09-08'),
          verifyingProvider: 'Hospital das Clínicas - São Paulo'
        },
        sponsorship: {
          sponsorshipTiers: [
            {
              tier: 'Bronze',
              minimumAmount: 100,
              benefits: ['Recovery updates', 'Thank you message'],
              livesTokenMultiplier: 1.0,
              exclusiveAccess: [],
              milestoneAccess: [1, 3]
            },
            {
              tier: 'Silver',
              minimumAmount: 500,
              benefits: ['Recovery updates', 'Video messages', 'Traditional healing insights'],
              livesTokenMultiplier: 1.2,
              exclusiveAccess: ['Monthly community calls'],
              milestoneAccess: [1, 2, 3]
            },
            {
              tier: 'Gold',
              minimumAmount: 1000,
              benefits: ['All Silver benefits', 'Direct communication with patient', 'Cultural exchange'],
              livesTokenMultiplier: 1.5,
              exclusiveAccess: ['Priority milestone selection', 'Traditional healing workshops'],
              milestoneAccess: [1, 2, 3]
            }
          ],
          ubuntuMemberBenefits: [
            '1.5x $LIVES token rewards',
            'Priority access to Ubuntu Health verified treatments',
            'Exclusive traditional healing content',
            'Community elder guidance access'
          ],
          sponsorMatching: {
            preferredSponsorTypes: ['Healthcare professionals', 'Heart health advocates', 'Ubuntu philosophy supporters'],
            sponsorshipGoals: ['Complete surgical funding', 'Support recovery journey', 'Cultural healing integration'],
            impactAreas: ['Cardiovascular health', 'Community healing', 'Traditional medicine integration'],
            communityConnections: ['Brazilian Ubuntu Health community', 'Cardiac patient support network'],
            previousSponsorSuccess: true
          },
          rewardStructure: {
            baseLivesTokenReward: 10, // 10 $LIVES per $1 sponsored
            milestoneCompletionBonus: 100,
            ubuntuMemberMultiplier: 1.5,
            longTermSponsorBonus: 200,
            communityImpactBonus: 150
          }
        },
        blockchain: {
          treatmentPassAddress: 'PASS7xKWmJpqKq8YhfkGHNR4rD5mPkXcVzQa9nE3pJ6wRsS4',
          escrowAddress: 'ESCrow7xKWmJpqKq8YhfkGHNR4rD5mPkXcVzQa9nE3pJ6',
          nftMintAddress: 'NFT7xKWmJpqKq8YhfkGHNR4rD5mPkXcVzQa9nE3pJ6wRsS4',
          livesTokenRewards: 1542
        },
        status: 'TreatmentInProgress',
        createdAt: new Date('2024-09-05'),
        lastUpdated: new Date('2024-09-22')
      }
    ];

    const mockSponsorProfile: SponsorProfile = {
      wallet: 'SPONSOR123abc...',
      ubuntuHealthMember: true,
      sponsorshipPreferences: {
        categories: ['Cardiovascular', 'Maternal Health', 'Mental Health'],
        maxAmount: 5000,
        preferredTiers: ['Gold', 'Platinum'],
        communityFocus: ['Traditional healing integration', 'Community support', 'Long-term recovery']
      },
      sponsorshipHistory: {
        totalSponsored: 18750,
        treatmentsSupported: 8,
        successRate: 87.5,
        averageSponsorshipAmount: 2344
      },
      livesTokenBalance: {
        current: 15420,
        earned: 28750,
        pending: 850
      }
    };

    setTimeout(() => {
      setTreatmentPasses(mockTreatmentPasses);
      setFilteredTreatments(mockTreatmentPasses);
      setSponsorProfile(mockSponsorProfile);
      setLoading(false);
    }, 1000);
  }, []);

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = [...treatmentPasses];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(tp => filters.categories.includes(tp.treatment.category));
    }

    if (filters.urgencyLevels.length > 0) {
      filtered = filtered.filter(tp => filters.urgencyLevels.includes(tp.treatment.urgencyLevel));
    }

    if (filters.ubuntuHealthVerified) {
      filtered = filtered.filter(tp => tp.verification.ubuntuHealthVerified);
    }

    if (filters.traditionalHealingIncluded) {
      filtered = filtered.filter(tp => tp.treatment.traditionalHealingComponent);
    }

    // Sort treatments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'urgency':
          const urgencyOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return urgencyOrder[b.treatment.urgencyLevel] - urgencyOrder[a.treatment.urgencyLevel];
        case 'funding':
          return (b.funding.target - b.funding.currentFunding) - (a.funding.target - a.funding.currentFunding);
        case 'rewards':
          return b.blockchain.livesTokenRewards - a.blockchain.livesTokenRewards;
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    setFilteredTreatments(filtered);
  }, [filters, treatmentPasses, sortBy]);

  const handleSponsorTreatment = (treatment: TreatmentPass, tier: string, amount: number) => {
    // Implementation for sponsoring a treatment with enhanced escrow integration
    console.log('Sponsoring treatment:', treatment.passId, 'Tier:', tier, 'Amount:', amount);
    // This would integrate with the milestone escrow smart contract
  };

  const calculatePotentialRewards = (amount: number, treatment: TreatmentPass): number => {
    const baseReward = amount * treatment.sponsorship.rewardStructure.baseLivesTokenReward;
    const memberMultiplier = sponsorProfile?.ubuntuHealthMember ? 
      treatment.sponsorship.rewardStructure.ubuntuMemberMultiplier : 1;
    return Math.floor(baseReward * memberMultiplier);
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
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-3">Healing Atlas Sponsorship Discovery</h1>
            <p className="text-orange-100 text-lg mb-3">"I am because we are" - Discover treatments to sponsor</p>
            <p className="text-orange-200">
              Connect with patients worldwide and support their healing journeys with milestone-based sponsorship
            </p>
          </div>
          <div className="text-right">
            {sponsorProfile && (
              <div className="bg-orange-400 bg-opacity-30 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">{sponsorProfile.livesTokenBalance.current.toLocaleString()}</div>
                <div className="text-orange-100 text-sm">$LIVES Balance</div>
                <div className="text-orange-200 text-xs mt-1">
                  {sponsorProfile.livesTokenBalance.pending} pending
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
              <option value="map">Map View</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="urgency">Sort by Urgency</option>
              <option value="funding">Sort by Funding Needed</option>
              <option value="rewards">Sort by $LIVES Rewards</option>
              <option value="newest">Sort by Newest</option>
            </select>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ubuntuVerified"
                checked={filters.ubuntuHealthVerified}
                onChange={(e) => setFilters(prev => ({ ...prev, ubuntuHealthVerified: e.target.checked }))}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="ubuntuVerified" className="text-sm text-gray-700">Ubuntu Health Verified Only</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="traditionalHealing"
                checked={filters.traditionalHealingIncluded}
                onChange={(e) => setFilters(prev => ({ ...prev, traditionalHealingIncluded: e.target.checked }))}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="traditionalHealing" className="text-sm text-gray-700">Traditional Healing Included</label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sponsorship Mode:</span>
            <div className="flex bg-gray-100 rounded-md p-1">
              {['browse', 'sponsor', 'track'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSponsorshipMode(mode as any)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    sponsorshipMode === mode
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Pass Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTreatments.map((treatment) => (
          <div
            key={treatment.passId}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{treatment.treatment.title}</h3>
                  <p className="text-gray-600 text-sm">{treatment.patient.anonymizedName} • {treatment.patient.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    treatment.treatment.urgencyLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                    treatment.treatment.urgencyLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                    treatment.treatment.urgencyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {treatment.treatment.urgencyLevel}
                  </span>
                  {treatment.verification.ubuntuHealthVerified && (
                    <span className="inline-block w-4 h-4 bg-orange-500 rounded-full" title="Ubuntu Health Verified"></span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {treatment.treatment.category}
                </span>
                <span className="font-medium">
                  {treatment.blockchain.livesTokenRewards} $LIVES potential
                </span>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                <span className="text-sm text-gray-600">
                  ${treatment.funding.currentFunding.toLocaleString()} / ${treatment.funding.target.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${treatment.funding.fundingPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{treatment.funding.sponsorsCount} sponsors</span>
                <span>{treatment.funding.timeRemaining} remaining</span>
              </div>
            </div>

            {/* Milestones Preview */}
            <div className="p-6 border-b">
              <h4 className="font-semibold text-gray-900 mb-3">Treatment Milestones</h4>
              <div className="space-y-2">
                {treatment.milestones.slice(0, 2).map((milestone) => (
                  <div key={milestone.milestoneId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        milestone.completionStatus === 'Verified' ? 'bg-green-500' :
                        milestone.completionStatus === 'InProgress' ? 'bg-blue-500' :
                        milestone.completionStatus === 'AwaitingVerification' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-700 truncate max-w-48">
                        {milestone.description}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${milestone.fundingAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-orange-600">
                        +{milestone.livesTokenReward} $LIVES
                      </div>
                    </div>
                  </div>
                ))}
                {treatment.milestones.length > 2 && (
                  <div className="text-xs text-gray-500 text-center pt-2">
                    +{treatment.milestones.length - 2} more milestones
                  </div>
                )}
              </div>
            </div>

            {/* Traditional Healing Component */}
            {treatment.treatment.traditionalHealingComponent && (
              <div className="p-6 border-b bg-orange-50">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-orange-600 text-lg">🌿</span>
                  <h4 className="font-semibold text-orange-900">Traditional Healing Integration</h4>
                </div>
                <p className="text-sm text-orange-800 mb-2">
                  {treatment.treatment.traditionalHealingComponent.culturalSignificance}
                </p>
                <div className="flex flex-wrap gap-1">
                  {treatment.treatment.traditionalHealingComponent.practices.slice(0, 3).map((practice, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                      {practice}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsorship Options */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {treatment.sponsorship.sponsorshipTiers.slice(0, 2).map((tier) => (
                  <button
                    key={tier.tier}
                    onClick={() => handleSponsorTreatment(treatment, tier.tier, tier.minimumAmount)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      tier.tier === 'Gold' ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100' :
                      tier.tier === 'Silver' ? 'border-gray-400 bg-gray-50 hover:bg-gray-100' :
                      'border-orange-400 bg-orange-50 hover:bg-orange-100'
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">{tier.tier}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      ${tier.minimumAmount.toLocaleString()} minimum
                    </div>
                    <div className="text-xs text-green-600">
                      +{calculatePotentialRewards(tier.minimumAmount, treatment)} $LIVES
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTreatment(treatment)}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleSponsorTreatment(treatment, 'Custom', 0)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Custom Amount
                </button>
              </div>

              {sponsorProfile?.ubuntuHealthMember && (
                <div className="mt-3 p-3 bg-orange-100 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600 text-sm">🤝</span>
                    <span className="text-orange-800 text-sm font-medium">Ubuntu Health Member Benefits:</span>
                  </div>
                  <div className="text-orange-700 text-xs mt-1">
                    1.5x $LIVES rewards • Priority milestone access • Cultural healing insights
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Treatment Detail Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedTreatment.treatment.title}</h2>
                  <p className="text-gray-600">{selectedTreatment.patient.anonymizedName} • {selectedTreatment.patient.location}</p>
                </div>
                <button
                  onClick={() => setSelectedTreatment(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Detailed treatment information would go here */}
              <div className="bg-orange-50 p-6 rounded-lg">
                <p className="text-orange-800 text-center italic">
                  "Through Ubuntu Health's Healing Atlas, we transform individual healing into collective strength. 
                  I am because we are - and together, we heal."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealingAtlasSponsorshipDiscovery;
