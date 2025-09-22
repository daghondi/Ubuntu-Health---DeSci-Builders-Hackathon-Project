'use client';

import React, { useState } from 'react';
import { useInfinitaWallet } from './InfinitaWalletProvider';
import { LivesTokenLogo } from './LivesTokenLogo';

interface DataContributionOption {
  id: string;
  category: string;
  description: string;
  dataPoints: string[];
  rewardAmount: number;
  privacyLevel: 'basic' | 'advanced' | 'zero-knowledge';
  researchPartners: string[];
  estimatedImpact: string;
}

interface ResearchPartnership {
  id: string;
  institution: string;
  studyTitle: string;
  description: string;
  dataNeeded: string[];
  rewardPerContribution: number;
  participantCount: number;
  approvalStatus: 'approved' | 'pending' | 'community-review';
  ethicsReview: boolean;
}

export const ResearchDataContribution: React.FC = () => {
  const { wallet, connect } = useInfinitaWallet();
  const [selectedContributions, setSelectedContributions] = useState<string[]>([]);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'contribute' | 'partnerships' | 'earnings' | 'privacy'>('contribute');
  
  // Mock data for demonstration
  const dataContributionOptions: DataContributionOption[] = [
    {
      id: 'treatment-outcomes',
      category: 'Treatment Outcomes & Recovery',
      description: 'Share anonymized data about your treatment effectiveness, side effects, and recovery milestones',
      dataPoints: ['Treatment Response Rate', 'Side Effect Severity', 'Quality of Life Scores', 'Recovery Timeline'],
      rewardAmount: 500,
      privacyLevel: 'zero-knowledge',
      researchPartners: ['Johns Hopkins Medical', 'Mayo Clinic Research', 'Stanford Medicine'],
      estimatedImpact: 'Help improve treatment protocols for 10,000+ future patients globally'
    },
    {
      id: 'biomarkers',
      category: 'Biomarkers & Lab Results',
      description: 'Contribute anonymized lab results and biomarker data to advance personalized medicine',
      dataPoints: ['Blood Panel Results', 'Genetic Markers', 'Protein Levels', 'Metabolic Indicators'],
      rewardAmount: 750,
      privacyLevel: 'advanced',
      researchPartners: ['MIT Bioengineering', 'Harvard Medical School', 'UCSF Precision Medicine'],
      estimatedImpact: 'Accelerate development of personalized treatment algorithms'
    },
    {
      id: 'lifestyle-data',
      category: 'Lifestyle & Wellness Tracking',
      description: 'Share daily wellness data, exercise patterns, and lifestyle factors affecting recovery',
      dataPoints: ['Daily Activity Levels', 'Sleep Patterns', 'Nutrition Data', 'Stress Indicators'],
      rewardAmount: 300,
      privacyLevel: 'basic',
      researchPartners: ['WHO Global Health', 'CDC Prevention Research', 'Ubuntu Health Collective'],
      estimatedImpact: 'Inform global wellness guidelines and prevention strategies'
    },
    {
      id: 'traditional-healing',
      category: 'Traditional & Cultural Healing',
      description: 'Document traditional healing practices and their integration with modern treatments',
      dataPoints: ['Traditional Remedies Used', 'Cultural Practices', 'Community Support Systems', 'Integration Outcomes'],
      rewardAmount: 400,
      privacyLevel: 'zero-knowledge',
      researchPartners: ['Ubuntu Heritage Institute', 'Global Traditional Medicine Council', 'Indigenous Health Research'],
      estimatedImpact: 'Preserve and validate traditional healing knowledge for future generations'
    }
  ];

  const researchPartnerships: ResearchPartnership[] = [
    {
      id: 'longevity-study',
      institution: 'Stanford Longevity Institute',
      studyTitle: 'Global Longevity Interventions & Community Health Outcomes',
      description: 'Large-scale study examining the effectiveness of various longevity treatments across different populations and cultural contexts.',
      dataNeeded: ['Treatment Response', 'Biomarkers', 'Lifestyle Data'],
      rewardPerContribution: 1200,
      participantCount: 847,
      approvalStatus: 'approved',
      ethicsReview: true
    },
    {
      id: 'cancer-immunotherapy',
      institution: 'Memorial Sloan Kettering',
      studyTitle: 'CAR-T Cell Therapy Effectiveness in Global Populations',
      description: 'Analyzing CAR-T therapy outcomes across diverse genetic backgrounds and healthcare systems.',
      dataNeeded: ['Treatment Outcomes', 'Biomarkers'],
      rewardPerContribution: 2000,
      participantCount: 234,
      approvalStatus: 'approved',
      ethicsReview: true
    },
    {
      id: 'ubuntu-healing',
      institution: 'Ubuntu Health Collective Research',
      studyTitle: 'Traditional Healing Integration in Modern Healthcare',
      description: 'Community-led research examining how traditional Ubuntu healing practices enhance modern medical treatments.',
      dataNeeded: ['Traditional Healing', 'Treatment Outcomes', 'Lifestyle Data'],
      rewardPerContribution: 800,
      participantCount: 156,
      approvalStatus: 'community-review',
      ethicsReview: true
    }
  ];

  const [currentEarnings] = useState({
    totalEarned: 2340,
    monthlyEarnings: 450,
    contributionsCount: 12,
    researchImpact: 'Your data has contributed to 3 published studies reaching 50,000+ patients worldwide'
  });

  const handleContributionToggle = (contributionId: string) => {
    setSelectedContributions(prev => 
      prev.includes(contributionId) 
        ? prev.filter(id => id !== contributionId)
        : [...prev, contributionId]
    );
  };

  const calculateTotalRewards = () => {
    return selectedContributions.reduce((total, id) => {
      const contribution = dataContributionOptions.find(c => c.id === id);
      return total + (contribution?.rewardAmount || 0);
    }, 0);
  };

  const submitDataContributions = async () => {
    if (!wallet.connected) {
      alert('Please connect your wallet first');
      return;
    }

    if (selectedContributions.length === 0) {
      alert('Please select at least one data contribution option');
      return;
    }

    // Simulate submission process
    alert(`Successfully enrolled in ${selectedContributions.length} research contributions! You'll earn ${calculateTotalRewards()} LIVES tokens monthly. Your anonymized data will help advance medical research while maintaining your privacy through zero-knowledge proofs.`);
  };

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'basic': return '🔒';
      case 'advanced': return '🛡️';
      case 'zero-knowledge': return '🔐';
      default: return '🔒';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ Ubuntu Approved</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">⏳ Review Pending</span>;
      case 'community-review': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">👥 Community Review</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <span className="text-3xl">🧬</span>
          Research Data Contribution
          <LivesTokenLogo size={32} showText={false} />
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Share your anonymized health data to advance medical research and earn $LIVES tokens. 
          Your privacy is protected through zero-knowledge proofs and Ubuntu community oversight.
        </p>
      </div>

      {/* Wallet Connection Check */}
      {!wallet.connected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Connect Your Wallet</h3>
          <p className="text-yellow-700 mb-4">Connect your Infinita wallet to participate in research data contribution and earn LIVES tokens</p>
          <button 
            onClick={connect}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Infinita Wallet
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'contribute', label: 'Data Contributions', icon: '📊' },
            { id: 'partnerships', label: 'Research Partnerships', icon: '🤝' },
            { id: 'earnings', label: 'Your Earnings', icon: '💰' },
            { id: 'privacy', label: 'Privacy Settings', icon: '🔐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Data Contributions Tab */}
      {activeTab === 'contribute' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ubuntu Community Data Sharing</h3>
            <p className="text-gray-600 mb-4">
              "I am because we are" - Your health data contributions help heal the entire Ubuntu community. 
              All data is anonymized and protected by zero-knowledge proofs.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <span className="text-green-500">✅</span>
                Zero-Knowledge Privacy
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-500">👥</span>
                Ubuntu Community Oversight
              </div>
              <div className="flex items-center gap-1">
                <LivesTokenLogo size={16} showText={false} />
                <span>Monthly LIVES Rewards</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {dataContributionOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-xl p-6 transition-all duration-200 ${
                  selectedContributions.includes(option.id)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedContributions.includes(option.id)}
                        onChange={() => handleContributionToggle(option.id)}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{option.category}</h3>
                      <span className="text-lg">{getPrivacyIcon(option.privacyLevel)}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Data Points Included:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {option.dataPoints.map((point, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Research Partners:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {option.researchPartners.map((partner, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-blue-500">🏥</span>
                              {partner}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-blue-800 text-sm">
                        <span className="text-lg">🌍</span>
                        <strong>Impact:</strong> {option.estimatedImpact}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="bg-emerald-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                        <LivesTokenLogo size={20} showText={false} />
                        <span className="text-lg">{option.rewardAmount}</span>
                      </div>
                      <div className="text-xs text-emerald-600">LIVES/month</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedContributions.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Selected Contributions: {selectedContributions.length}
                  </h3>
                  <p className="text-gray-600">
                    You'll help advance medical research while maintaining complete privacy
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-2xl font-bold text-emerald-600 mb-1">
                    <LivesTokenLogo size={24} showText={false} />
                    {calculateTotalRewards().toLocaleString()}
                  </div>
                  <div className="text-sm text-emerald-700">LIVES tokens/month</div>
                </div>
              </div>
              
              <button
                onClick={submitDataContributions}
                disabled={!wallet.connected}
                className="w-full mt-4 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="text-lg">🧬</span>
                Enroll in Research Data Sharing
                <LivesTokenLogo size={20} showText={false} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Research Partnerships Tab */}
      {activeTab === 'partnerships' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Active Research Partnerships</h2>
            <p className="text-gray-600">
              Ubuntu Health collaborates with leading research institutions worldwide. 
              All partnerships are approved by the Ubuntu community through DAO governance.
            </p>
          </div>

          <div className="grid gap-6">
            {researchPartnerships.map((partnership) => (
              <div key={partnership.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{partnership.institution}</h3>
                      {getStatusBadge(partnership.approvalStatus)}
                    </div>
                    <h4 className="text-lg text-blue-600 font-medium mb-3">{partnership.studyTitle}</h4>
                    <p className="text-gray-600 mb-4">{partnership.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Data Needed:</h5>
                        <div className="space-y-1">
                          {partnership.dataNeeded.map((data, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              {data}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Study Details:</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">👥</span>
                            {partnership.participantCount.toLocaleString()} participants
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">✅</span>
                            Ethics review completed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-blue-800 font-semibold">
                        <LivesTokenLogo size={20} showText={false} />
                        <span className="text-lg">{partnership.rewardPerContribution}</span>
                      </div>
                      <div className="text-xs text-blue-600">per contribution</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Partnership approved by Ubuntu DAO governance
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Research Contributions & Earnings</h2>
            <p className="text-gray-600">
              Track your impact on global medical research and $LIVES token rewards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-emerald-600 mb-2">
                <LivesTokenLogo size={32} showText={false} />
                {currentEarnings.totalEarned.toLocaleString()}
              </div>
              <div className="text-emerald-700 font-medium">Total Earned</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600 mb-2">
                <LivesTokenLogo size={32} showText={false} />
                {currentEarnings.monthlyEarnings}
              </div>
              <div className="text-blue-700 font-medium">This Month</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {currentEarnings.contributionsCount}
              </div>
              <div className="text-purple-700 font-medium">Data Contributions</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                3
              </div>
              <div className="text-orange-700 font-medium">Studies Published</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              Your Global Impact
            </h3>
            <p className="text-gray-700 text-lg">
              {currentEarnings.researchImpact}
            </p>
            
            <div className="mt-4 grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-xl font-bold text-emerald-600">50,000+</div>
                <div className="text-sm text-gray-600">Patients Helped</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-xl font-bold text-blue-600">15</div>
                <div className="text-sm text-gray-600">Research Papers</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Treatment Protocols Improved</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl">🔐</span>
              Privacy & Data Control Settings
            </h2>
            <p className="text-gray-600">
              You have complete control over your health data. Ubuntu Health uses zero-knowledge proofs 
              and community governance to ensure your privacy is always protected.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Protection Levels</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔐</span>
                    <div>
                      <div className="font-medium text-green-800">Zero-Knowledge Proofs</div>
                      <div className="text-sm text-green-600">Maximum privacy - your raw data never leaves your control</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">Active</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="font-medium text-blue-800">Ubuntu Community Oversight</div>
                      <div className="text-sm text-blue-600">Community governance ensures ethical data usage</div>
                    </div>
                  </div>
                  <div className="text-blue-600 font-semibold">Active</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <div className="font-medium text-purple-800">Immutable Audit Logs</div>
                      <div className="text-sm text-purple-600">Every data access is permanently recorded</div>
                    </div>
                  </div>
                  <div className="text-purple-600 font-semibold">Active</div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Usage Permissions</h3>
              
              <div className="space-y-3">
                {[
                  'Treatment outcome analysis for similar conditions',
                  'Anonymous inclusion in medical research publications',
                  'Contribution to AI/ML algorithm development',
                  'Usage in global health policy recommendations',
                  'Sharing with Ubuntu community healing circles'
                ].map((permission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <span className="text-gray-700">{permission}</span>
                    <input 
                      type="checkbox" 
                      defaultChecked={true}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                Data Sovereignty Rights
              </h3>
              <div className="text-yellow-700 space-y-2">
                <p>• You can withdraw your data contributions at any time</p>
                <p>• All data sharing requires your explicit consent</p>
                <p>• Ubuntu community can vote to block unethical research requests</p>
                <p>• Your identity is never revealed to researchers</p>
                <p>• You receive a share of any commercial value generated</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchDataContribution;