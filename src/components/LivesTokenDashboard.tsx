import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';

// $LIVES Token Economics Integration for Ubuntu Health Platform
interface LivesTokenEconomics {
  tokenMint: string;
  treasuryAccount: string;
  userTokenAccount: string;
  rewardRates: {
    sponsorshipBaseReward: number;
    milestoneCompletionBonus: number;
    recoveryLoggingReward: number;
    providerVerificationReward: number;
    researchContributionReward: number;
    communityEngagementReward: number;
    referralBonus: number;
  };
  ubuntuMemberBonuses: {
    sponsorshipBonusMultiplier: number;
    recoveryLoggingBonusMultiplier: number;
    providerVerificationBonusMultiplier: number;
    communityParticipationBonusMultiplier: number;
  };
}

interface UserTokenData {
  wallet: string;
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  stakedAmount: number;
  pendingRewards: number;
  lastClaimTimestamp: Date;
  ubuntuHealthMember: boolean;
  memberSince?: Date;
  activityTracking: {
    treatmentsSponsored: number;
    totalSponsoredUsd: number;
    recoveryLogEntries: number;
    milestonesCompleted: number;
    verificationsPerformed: number;
    researchContributions: number;
    communityActions: number;
    referralsMade: number;
  };
}

interface RewardTransaction {
  id: string;
  type: 'Sponsorship' | 'MilestoneCompletion' | 'RecoveryLogging' | 'ProviderVerification' | 'ResearchContribution' | 'CommunityEngagement' | 'ReferralBonus';
  amount: number;
  baseAmount: number;
  ubuntuMemberBonus: boolean;
  timestamp: Date;
  description: string;
  relatedTreatmentId?: string;
  transactionSignature?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface StakingPool {
  poolId: string;
  poolName: string;
  apy: number;
  totalStaked: number;
  userStaked: number;
  stakingPeriod: 'flexible' | '30days' | '90days' | '180days' | '365days';
  minimumStake: number;
  ubuntuMemberBenefits: string[];
  rewards: {
    earned: number;
    pending: number;
    lastClaim: Date;
  };
}

const LivesTokenDashboard: React.FC = () => {
  const [userTokenData, setUserTokenData] = useState<UserTokenData | null>(null);
  const [rewardHistory, setRewardHistory] = useState<RewardTransaction[]>([]);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'staking' | 'history'>('overview');
  const [connection, setConnection] = useState<Connection | null>(null);
  const [wallet, setWallet] = useState<any>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockUserTokenData: UserTokenData = {
      wallet: 'SPONSOR123abc...',
      totalEarned: 28750,
      totalSpent: 13330,
      currentBalance: 15420,
      stakedAmount: 5000,
      pendingRewards: 850,
      lastClaimTimestamp: new Date('2024-09-20'),
      ubuntuHealthMember: true,
      memberSince: new Date('2024-01-15'),
      activityTracking: {
        treatmentsSponsored: 8,
        totalSponsoredUsd: 18750,
        recoveryLogEntries: 45,
        milestonesCompleted: 12,
        verificationsPerformed: 3,
        researchContributions: 7,
        communityActions: 23,
        referralsMade: 2
      }
    };

    const mockRewardHistory: RewardTransaction[] = [
      {
        id: '1',
        type: 'Sponsorship',
        amount: 3750,
        baseAmount: 2500,
        ubuntuMemberBonus: true,
        timestamp: new Date('2024-09-22'),
        description: 'Heart valve replacement surgery sponsorship - $2,500 contribution',
        relatedTreatmentId: '1001',
        transactionSignature: '5KJp9...xyz',
        status: 'confirmed'
      },
      {
        id: '2',
        type: 'MilestoneCompletion',
        amount: 100,
        baseAmount: 100,
        ubuntuMemberBonus: false,
        timestamp: new Date('2024-09-20'),
        description: 'Pre-surgical consultation milestone verified',
        relatedTreatmentId: '1001',
        transactionSignature: '7Mnq2...abc',
        status: 'confirmed'
      },
      {
        id: '3',
        type: 'RecoveryLogging',
        amount: 6,
        baseAmount: 5,
        ubuntuMemberBonus: true,
        timestamp: new Date('2024-09-19'),
        description: 'Daily recovery log entry submitted',
        status: 'pending'
      },
      {
        id: '4',
        type: 'CommunityEngagement',
        amount: 14,
        baseAmount: 10,
        ubuntuMemberBonus: true,
        timestamp: new Date('2024-09-18'),
        description: 'Participated in community healing circle discussion',
        status: 'confirmed'
      }
    ];

    const mockStakingPools: StakingPool[] = [
      {
        poolId: 'ubuntu-healing-pool',
        poolName: 'Ubuntu Healing Pool',
        apy: 12.5,
        totalStaked: 2450000,
        userStaked: 5000,
        stakingPeriod: '90days',
        minimumStake: 100,
        ubuntuMemberBenefits: ['1.5x rewards', 'Priority unstaking', 'Governance voting rights'],
        rewards: {
          earned: 156.25,
          pending: 23.45,
          lastClaim: new Date('2024-09-15')
        }
      },
      {
        poolId: 'community-support-pool',
        poolName: 'Community Support Pool',
        apy: 8.0,
        totalStaked: 1875000,
        userStaked: 0,
        stakingPeriod: 'flexible',
        minimumStake: 50,
        ubuntuMemberBenefits: ['Community priority support', 'Ubuntu wisdom access'],
        rewards: {
          earned: 0,
          pending: 0,
          lastClaim: new Date('2024-01-01')
        }
      }
    ];

    setTimeout(() => {
      setUserTokenData(mockUserTokenData);
      setRewardHistory(mockRewardHistory);
      setStakingPools(mockStakingPools);
      setLoading(false);
    }, 1000);
  }, []);

  const handleClaimRewards = async () => {
    setClaiming(true);
    try {
      // Implementation would integrate with claim_pending_rewards instruction
      console.log('Claiming pending rewards...');
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (userTokenData) {
        const claimedAmount = userTokenData.pendingRewards;
        setUserTokenData(prev => prev ? {
          ...prev,
          currentBalance: prev.currentBalance + claimedAmount,
          pendingRewards: 0,
          lastClaimTimestamp: new Date()
        } : null);

        // Add claim transaction to history
        const claimTransaction: RewardTransaction = {
          id: Date.now().toString(),
          type: 'CommunityEngagement',
          amount: claimedAmount,
          baseAmount: claimedAmount,
          ubuntuMemberBonus: false,
          timestamp: new Date(),
          description: `Claimed ${claimedAmount} $LIVES tokens`,
          status: 'confirmed'
        };
        setRewardHistory(prev => [claimTransaction, ...prev]);
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
    } finally {
      setClaiming(false);
    }
  };

  const handleStakeTokens = async (poolId: string, amount: number) => {
    try {
      console.log('Staking tokens:', poolId, amount);
      // Implementation would integrate with staking smart contract
      
      if (userTokenData) {
        setUserTokenData(prev => prev ? {
          ...prev,
          currentBalance: prev.currentBalance - amount,
          stakedAmount: prev.stakedAmount + amount
        } : null);

        setStakingPools(prev => prev.map(pool => 
          pool.poolId === poolId 
            ? { ...pool, userStaked: pool.userStaked + amount }
            : pool
        ));
      }
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!userTokenData) {
    return <div>Error loading token data</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-3">$LIVES Token Dashboard</h1>
            <p className="text-orange-100 text-lg mb-3">Ubuntu Health Community Token Economy</p>
            <p className="text-orange-200">
              "I am because we are" - Your contributions to healing earn $LIVES tokens
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{userTokenData.currentBalance.toLocaleString()}</div>
            <div className="text-orange-100 text-lg">$LIVES Balance</div>
            {userTokenData.ubuntuHealthMember && (
              <div className="mt-2 px-3 py-1 bg-orange-400 bg-opacity-30 rounded-full text-sm font-medium">
                🤝 Ubuntu Health Member
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-3xl font-bold text-gray-900">{userTokenData.totalEarned.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{userTokenData.pendingRewards} pending</p>
            </div>
            <div className="text-green-500 text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staked Amount</p>
              <p className="text-3xl font-bold text-gray-900">{userTokenData.stakedAmount.toLocaleString()}</p>
              <p className="text-xs text-blue-600">Earning rewards</p>
            </div>
            <div className="text-blue-500 text-3xl">📈</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Treatments Sponsored</p>
              <p className="text-3xl font-bold text-gray-900">{userTokenData.activityTracking.treatmentsSponsored}</p>
              <p className="text-xs text-purple-600">${userTokenData.activityTracking.totalSponsoredUsd.toLocaleString()} total</p>
            </div>
            <div className="text-purple-500 text-3xl">🤝</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Community Actions</p>
              <p className="text-3xl font-bold text-gray-900">{userTokenData.activityTracking.communityActions}</p>
              <p className="text-xs text-orange-600">Ubuntu contributions</p>
            </div>
            <div className="text-orange-500 text-3xl">🌍</div>
          </div>
        </div>
      </div>

      {/* Pending Rewards Claim */}
      {userTokenData.pendingRewards > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                🎉 You have {userTokenData.pendingRewards} $LIVES tokens ready to claim!
              </h3>
              <p className="text-yellow-700">
                Claim your rewards from recent activities including sponsorships, recovery logging, and community engagement.
              </p>
            </div>
            <button
              onClick={handleClaimRewards}
              disabled={claiming}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
            >
              {claiming ? 'Claiming...' : 'Claim Rewards'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'rewards', label: 'Reward Activities', icon: '🏆' },
              { id: 'staking', label: 'Staking Pools', icon: '📈' },
              { id: 'history', label: 'Transaction History', icon: '📜' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Activity Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Ubuntu Health Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Recovery Log Entries</span>
                      <span className="font-semibold text-gray-900">{userTokenData.activityTracking.recoveryLogEntries}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Milestones Completed</span>
                      <span className="font-semibold text-gray-900">{userTokenData.activityTracking.milestonesCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Verifications Performed</span>
                      <span className="font-semibold text-gray-900">{userTokenData.activityTracking.verificationsPerformed}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Research Contributions</span>
                      <span className="font-semibold text-gray-900">{userTokenData.activityTracking.researchContributions}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Referrals Made</span>
                      <span className="font-semibold text-gray-900">{userTokenData.activityTracking.referralsMade}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <span className="text-orange-800 font-medium">Ubuntu Member Since</span>
                      <span className="font-semibold text-orange-900">
                        {userTokenData.memberSince?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubuntu Health Member Benefits */}
              {userTokenData.ubuntuHealthMember && (
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">🤝 Ubuntu Health Member Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-orange-600">✓</span>
                      <span className="text-orange-800">1.5x sponsorship rewards</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-orange-600">✓</span>
                      <span className="text-orange-800">1.2x recovery logging rewards</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-orange-600">✓</span>
                      <span className="text-orange-800">Priority verification rewards</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-orange-600">✓</span>
                      <span className="text-orange-800">Enhanced staking rewards</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Ways to Earn $LIVES Tokens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">🤝</span>
                    <h4 className="font-semibold text-gray-900">Sponsor Treatments</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Earn 10 $LIVES per $1 sponsored. Ubuntu members get 1.5x bonus!
                  </p>
                  <div className="bg-green-50 p-3 rounded text-green-800 text-sm">
                    Your earnings: {(userTokenData.activityTracking.totalSponsoredUsd * 10 * 1.5).toLocaleString()} $LIVES
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">📝</span>
                    <h4 className="font-semibold text-gray-900">Recovery Logging</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Earn 5 $LIVES per daily recovery log entry. Ubuntu members get 1.2x bonus!
                  </p>
                  <div className="bg-green-50 p-3 rounded text-green-800 text-sm">
                    Your earnings: {(userTokenData.activityTracking.recoveryLogEntries * 5 * 1.2).toLocaleString()} $LIVES
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">✅</span>
                    <h4 className="font-semibold text-gray-900">Milestone Verification</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Earn 100 $LIVES per milestone completed or verified.
                  </p>
                  <div className="bg-green-50 p-3 rounded text-green-800 text-sm">
                    Your earnings: {(userTokenData.activityTracking.milestonesCompleted * 100).toLocaleString()} $LIVES
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">🔬</span>
                    <h4 className="font-semibold text-gray-900">Research Contribution</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Earn 25 $LIVES per research data contribution.
                  </p>
                  <div className="bg-green-50 p-3 rounded text-green-800 text-sm">
                    Your earnings: {(userTokenData.activityTracking.researchContributions * 25).toLocaleString()} $LIVES
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staking' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Staking Pools</h3>
              <div className="space-y-4">
                {stakingPools.map((pool) => (
                  <div key={pool.poolId} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{pool.poolName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>APY: <strong className="text-green-600">{pool.apy}%</strong></span>
                          <span>Period: <strong>{pool.stakingPeriod}</strong></span>
                          <span>Min: <strong>{pool.minimumStake} $LIVES</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{pool.userStaked.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Your stake</div>
                      </div>
                    </div>

                    {userTokenData.ubuntuHealthMember && (
                      <div className="mb-4 p-3 bg-orange-50 rounded border border-orange-200">
                        <div className="text-sm font-medium text-orange-900 mb-1">Ubuntu Member Benefits:</div>
                        <div className="text-xs text-orange-800">
                          {pool.ubuntuMemberBenefits.join(' • ')}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Total Pool: {pool.totalStaked.toLocaleString()} $LIVES
                      </div>
                      <button
                        onClick={() => handleStakeTokens(pool.poolId, pool.minimumStake)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                      >
                        Stake Tokens
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <div className="space-y-3">
                {rewardHistory.map((transaction) => (
                  <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{transaction.type}</span>
                          {transaction.ubuntuMemberBonus && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                              Ubuntu Bonus
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.timestamp.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">+{transaction.amount} $LIVES</div>
                        {transaction.ubuntuMemberBonus && (
                          <div className="text-xs text-orange-600">
                            Base: {transaction.baseAmount} + Ubuntu bonus
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ubuntu Philosophy Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-900 mb-4">The Ubuntu Token Economy</h2>
          <p className="text-lg text-orange-800 mb-6 italic">
            "I am because we are" - $LIVES tokens represent our collective commitment to healing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Value</h3>
              <p className="text-sm text-gray-600">
                Every $LIVES token earned represents a contribution to someone's healing journey
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Circular Economy</h3>
              <p className="text-sm text-gray-600">
                Tokens flow through the community, creating sustainable incentives for healing
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Growing Together</h3>
              <p className="text-sm text-gray-600">
                As the community grows, token value grows, benefiting all Ubuntu Health members
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivesTokenDashboard;
