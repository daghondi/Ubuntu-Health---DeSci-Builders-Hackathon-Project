import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Research Data Contribution Interface for Ubuntu Health Platform
// Allows patients to share anonymized data and earn $LIVES tokens

interface DataContribution {
  id: string;
  category: 'treatment-outcomes' | 'biomarkers' | 'lifestyle' | 'traditional-healing';
  status: 'pending' | 'approved' | 'rejected' | 'rewarded';
  zkProofHash: string;
  rewardAmount: number;
  submittedAt: Date;
  processedAt?: Date;
  researchPartners: string[];
}

interface ResearchPartnership {
  id: string;
  name: string;
  institution: string;
  description: string;
  dataRequested: string[];
  compensation: number; // LIVES tokens per contribution
  status: 'active' | 'pending' | 'expired';
  communityApproval: number; // percentage
  participants: number;
  privacyLevel: 'aggregated' | 'anonymized' | 'zero-knowledge';
}

interface PrivacySettings {
  allowTreatmentOutcomes: boolean;
  allowBiomarkers: boolean;
  allowLifestyleData: boolean;
  allowTraditionalHealing: boolean;
  communityApprovalRequired: boolean;
  minCompensation: number;
  dataRetentionPeriod: number; // days
}

const ResearchDataContribution: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contribute' | 'partnerships' | 'earnings' | 'privacy'>('contribute');
  const [contributions, setContributions] = useState<DataContribution[]>([]);
  const [partnerships, setPartnerships] = useState<ResearchPartnership[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    allowTreatmentOutcomes: true,
    allowBiomarkers: false,
    allowLifestyleData: true,
    allowTraditionalHealing: true,
    communityApprovalRequired: true,
    minCompensation: 100,
    dataRetentionPeriod: 365
  });
  
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [selectedPartnership, setSelectedPartnership] = useState<ResearchPartnership | null>(null);
  const [showContributionModal, setShowContributionModal] = useState(false);

  useEffect(() => {
    // Load mock data for demonstration
    const mockContributions: DataContribution[] = [
      {
        id: '1',
        category: 'treatment-outcomes',
        status: 'rewarded',
        zkProofHash: 'zk_proof_hash_12345',
        rewardAmount: 500,
        submittedAt: new Date('2024-12-01'),
        processedAt: new Date('2024-12-02'),
        researchPartners: ['WHO Global Health Initiative', 'Stanford Medicine']
      },
      {
        id: '2',
        category: 'traditional-healing',
        status: 'pending',
        zkProofHash: 'zk_proof_hash_67890',
        rewardAmount: 300,
        submittedAt: new Date('2024-12-15'),
        researchPartners: ['Traditional Medicine Research Collective']
      }
    ];

    const mockPartnerships: ResearchPartnership[] = [
      {
        id: '1',
        name: 'Global Treatment Outcomes Study',
        institution: 'WHO Global Health Initiative',
        description: 'Large-scale analysis of treatment effectiveness across diverse populations with focus on Ubuntu healthcare approaches.',
        dataRequested: ['Treatment outcomes', 'Recovery timelines', 'Community support impact'],
        compensation: 500,
        status: 'active',
        communityApproval: 89,
        participants: 1247,
        privacyLevel: 'zero-knowledge'
      },
      {
        id: '2',
        name: 'Traditional Healing Integration Study',
        institution: 'Traditional Medicine Research Collective',
        description: 'Research on integrating traditional healing practices with modern medicine in Ubuntu community contexts.',
        dataRequested: ['Traditional healing practices', 'Treatment combinations', 'Cultural protocols'],
        compensation: 300,
        status: 'active',
        communityApproval: 94,
        participants: 453,
        privacyLevel: 'anonymized'
      },
      {
        id: '3',
        name: 'Lifestyle and Recovery Correlation',
        institution: 'Stanford Medicine',
        description: 'Understanding how lifestyle factors impact recovery in community-supported healthcare settings.',
        dataRequested: ['Lifestyle data', 'Social support networks', 'Recovery progress'],
        compensation: 400,
        status: 'pending',
        communityApproval: 67,
        participants: 0,
        privacyLevel: 'aggregated'
      }
    ];

    setContributions(mockContributions);
    setPartnerships(mockPartnerships);
    
    // Calculate earnings
    const total = mockContributions
      .filter(c => c.status === 'rewarded')
      .reduce((sum, c) => sum + c.rewardAmount, 0);
    const pending = mockContributions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.rewardAmount, 0);
    
    setTotalEarnings(total);
    setPendingRewards(pending);
  }, []);

  const handleDataContribution = (category: DataContribution['category']) => {
    const availablePartnerships = partnerships.filter(p => 
      p.status === 'active' && 
      p.communityApproval >= 75 &&
      isDataCategoryAllowed(category)
    );

    if (availablePartnerships.length === 0) {
      alert('No active research partnerships available for this data category.');
      return;
    }

    // Simulate zero-knowledge proof generation
    const zkProofHash = `zk_proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newContribution: DataContribution = {
      id: Date.now().toString(),
      category,
      status: 'pending',
      zkProofHash,
      rewardAmount: availablePartnerships[0].compensation,
      submittedAt: new Date(),
      researchPartners: [availablePartnerships[0].name]
    };

    setContributions(prev => [newContribution, ...prev]);
    setShowContributionModal(false);
    
    // Show success message
    alert(`Data contribution submitted! You'll earn ${availablePartnerships[0].compensation} LIVES tokens once processed.`);
  };

  const isDataCategoryAllowed = (category: DataContribution['category']): boolean => {
    switch (category) {
      case 'treatment-outcomes':
        return privacySettings.allowTreatmentOutcomes;
      case 'biomarkers':
        return privacySettings.allowBiomarkers;
      case 'lifestyle':
        return privacySettings.allowLifestyleData;
      case 'traditional-healing':
        return privacySettings.allowTraditionalHealing;
      default:
        return false;
    }
  };

  const getStatusColor = (status: DataContribution['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'rewarded': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryName = (category: DataContribution['category']) => {
    switch (category) {
      case 'treatment-outcomes': return 'Treatment Outcomes';
      case 'biomarkers': return 'Biomarkers';
      case 'lifestyle': return 'Lifestyle Data';
      case 'traditional-healing': return 'Traditional Healing';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Research Data Contribution</h1>
          <p className="text-xl text-purple-100 mb-6">
            Share your anonymized health data to advance medical research and earn $LIVES tokens
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <div className="text-3xl font-bold">{totalEarnings}</div>
              <div className="text-purple-100">Total LIVES Earned</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <div className="text-3xl font-bold">{pendingRewards}</div>
              <div className="text-purple-100">Pending Rewards</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <div className="text-3xl font-bold">{contributions.length}</div>
              <div className="text-purple-100">Data Contributions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'contribute', name: 'Contribute Data', icon: '🔬' },
              { id: 'partnerships', name: 'Research Partnerships', icon: '🤝' },
              { id: 'earnings', name: 'My Earnings', icon: '💰' },
              { id: 'privacy', name: 'Privacy Settings', icon: '🔒' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'contribute' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contribute Your Health Data</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your anonymized health data helps advance medical research while earning you $LIVES tokens. 
                All data is processed using zero-knowledge proofs to ensure complete privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Treatment Outcomes */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📊</div>
                    <h3 className="text-lg font-semibold">Treatment Outcomes</h3>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    500 LIVES
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Share your treatment results, recovery progress, and outcome data to help researchers 
                  understand treatment effectiveness.
                </p>
                <ul className="text-sm text-gray-500 mb-4 space-y-1">
                  <li>• Treatment response rates</li>
                  <li>• Recovery timelines</li>
                  <li>• Side effects and complications</li>
                  <li>• Quality of life improvements</li>
                </ul>
                <button
                  onClick={() => handleDataContribution('treatment-outcomes')}
                  disabled={!privacySettings.allowTreatmentOutcomes}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {privacySettings.allowTreatmentOutcomes ? 'Contribute Data' : 'Disabled in Privacy Settings'}
                </button>
              </div>

              {/* Biomarkers */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🧬</div>
                    <h3 className="text-lg font-semibold">Biomarkers</h3>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    800 LIVES
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Contribute lab results, genetic markers, and biological indicators to support 
                  precision medicine research.
                </p>
                <ul className="text-sm text-gray-500 mb-4 space-y-1">
                  <li>• Blood test results</li>
                  <li>• Genetic markers</li>
                  <li>• Metabolic indicators</li>
                  <li>• Inflammatory markers</li>
                </ul>
                <button
                  onClick={() => handleDataContribution('biomarkers')}
                  disabled={!privacySettings.allowBiomarkers}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {privacySettings.allowBiomarkers ? 'Contribute Data' : 'Disabled in Privacy Settings'}
                </button>
              </div>

              {/* Lifestyle Data */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🏃‍♀️</div>
                    <h3 className="text-lg font-semibold">Lifestyle Data</h3>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    300 LIVES
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Share lifestyle information to help researchers understand how daily habits 
                  impact health outcomes and recovery.
                </p>
                <ul className="text-sm text-gray-500 mb-4 space-y-1">
                  <li>• Exercise patterns</li>
                  <li>• Dietary habits</li>
                  <li>• Sleep quality</li>
                  <li>• Stress levels</li>
                </ul>
                <button
                  onClick={() => handleDataContribution('lifestyle')}
                  disabled={!privacySettings.allowLifestyleData}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {privacySettings.allowLifestyleData ? 'Contribute Data' : 'Disabled in Privacy Settings'}
                </button>
              </div>

              {/* Traditional Healing */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🌿</div>
                    <h3 className="text-lg font-semibold">Traditional Healing</h3>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    400 LIVES
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Contribute data about traditional healing practices and their integration with 
                  modern medicine in your recovery journey.
                </p>
                <ul className="text-sm text-gray-500 mb-4 space-y-1">
                  <li>• Traditional remedies used</li>
                  <li>• Cultural healing practices</li>
                  <li>• Integration with modern medicine</li>
                  <li>• Community healing support</li>
                </ul>
                <button
                  onClick={() => handleDataContribution('traditional-healing')}
                  disabled={!privacySettings.allowTraditionalHealing}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {privacySettings.allowTraditionalHealing ? 'Contribute Data' : 'Disabled in Privacy Settings'}
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Privacy Protection</h3>
                  <p className="text-blue-800 mb-4">
                    Your data is protected using advanced privacy-preserving technologies:
                  </p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <strong>Zero-Knowledge Proofs:</strong> Researchers can verify data without seeing raw information</li>
                    <li>• <strong>Differential Privacy:</strong> Statistical noise protects individual privacy</li>
                    <li>• <strong>Ubuntu Community Governance:</strong> Community approves all research partnerships</li>
                    <li>• <strong>Data Sovereignty:</strong> You control how your data is used and for how long</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Research Partnerships</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These research institutions have been approved by the Ubuntu community to access anonymized health data.
              </p>
            </div>

            {partnerships.map((partnership) => (
              <div key={partnership.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{partnership.name}</h3>
                    <p className="text-gray-600">{partnership.institution}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{partnership.compensation} LIVES</div>
                    <div className="text-sm text-gray-500">per contribution</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{partnership.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Community Approval</div>
                    <div className="text-lg font-semibold text-green-600">{partnership.communityApproval}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Participants</div>
                    <div className="text-lg font-semibold text-blue-600">{partnership.participants}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Privacy Level</div>
                    <div className="text-lg font-semibold text-purple-600 capitalize">{partnership.privacyLevel}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Data Requested:</div>
                  <div className="flex flex-wrap gap-2">
                    {partnership.dataRequested.map((data, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {data}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    partnership.status === 'active' ? 'bg-green-100 text-green-800' :
                    partnership.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {partnership.status.charAt(0).toUpperCase() + partnership.status.slice(1)}
                  </span>
                  
                  {partnership.status === 'active' && (
                    <button
                      onClick={() => setSelectedPartnership(partnership)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      Contribute to This Study
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Research Earnings</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Track your $LIVES token earnings from research data contributions.
              </p>
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg p-6">
                <div className="text-3xl font-bold">{totalEarnings}</div>
                <div className="text-green-100">Total LIVES Earned</div>
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-6">
                <div className="text-3xl font-bold">{pendingRewards}</div>
                <div className="text-blue-100">Pending Rewards</div>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg p-6">
                <div className="text-3xl font-bold">{contributions.filter(c => c.status === 'rewarded').length}</div>
                <div className="text-purple-100">Successful Contributions</div>
              </div>
            </div>

            {/* Contributions History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Contribution History</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {contributions.map((contribution) => (
                  <div key={contribution.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{getCategoryName(contribution.category)}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contribution.status)}`}>
                            {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          Research Partners: {contribution.researchPartners.join(', ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Submitted: {contribution.submittedAt.toLocaleDateString()}
                          {contribution.processedAt && ` • Processed: ${contribution.processedAt.toLocaleDateString()}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-purple-600">
                          {contribution.rewardAmount} LIVES
                        </div>
                        <div className="text-sm text-gray-500">
                          ZK Proof: {contribution.zkProofHash.slice(0, 10)}...
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Settings</h2>
              <p className="text-gray-600">
                Control how your health data is used for research and set your participation preferences.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Data Sharing Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Treatment Outcomes</div>
                    <div className="text-sm text-gray-500">Share treatment results and recovery progress</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.allowTreatmentOutcomes}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      allowTreatmentOutcomes: e.target.checked
                    }))}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Biomarkers</div>
                    <div className="text-sm text-gray-500">Share lab results and biological indicators</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.allowBiomarkers}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      allowBiomarkers: e.target.checked
                    }))}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Lifestyle Data</div>
                    <div className="text-sm text-gray-500">Share exercise, diet, and wellness information</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.allowLifestyleData}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      allowLifestyleData: e.target.checked
                    }))}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Traditional Healing</div>
                    <div className="text-sm text-gray-500">Share traditional medicine and cultural practices</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.allowTraditionalHealing}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      allowTraditionalHealing: e.target.checked
                    }))}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Governance Settings</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Require Community Approval</div>
                    <div className="text-sm text-gray-500">All research partnerships must be approved by Ubuntu community</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.communityApprovalRequired}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      communityApprovalRequired: e.target.checked
                    }))}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Minimum Compensation (LIVES tokens)</label>
                  <input
                    type="number"
                    value={privacySettings.minCompensation}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      minCompensation: parseInt(e.target.value) || 0
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Only participate in research offering at least this many tokens
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">Data Retention Period (days)</label>
                  <input
                    type="number"
                    value={privacySettings.dataRetentionPeriod}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      dataRetentionPeriod: parseInt(e.target.value) || 0
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="30"
                    max="3650"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    How long researchers can store your anonymized data
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Privacy Information</h3>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• All data is anonymized using zero-knowledge proofs before sharing</li>
                    <li>• You can revoke data sharing permissions at any time</li>
                    <li>• The Ubuntu community votes on all new research partnerships</li>
                    <li>• Researchers cannot identify individual patients from the data</li>
                    <li>• Your wallet address is never linked to your health data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => alert('Privacy settings saved successfully!')}
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
              >
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDataContribution;