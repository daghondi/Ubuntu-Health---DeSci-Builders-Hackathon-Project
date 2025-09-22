import React, { useState } from 'react';

// Token-gated API access for researchers to access anonymized health data
// Demonstrates the research data contribution system from the researcher perspective

interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST';
  description: string;
  tokenRequired: number;
  sampleResponse: any;
  dataCategories: string[];
  privacyLevel: 'aggregated' | 'anonymized' | 'zero-knowledge';
}

interface ResearchInstitution {
  id: string;
  name: string;
  verified: boolean;
  livesBalance: number;
  accessLevel: 'basic' | 'premium' | 'enterprise';
}

const ResearchAPIAccess: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [livesTokens, setLivesTokens] = useState(0);
  const [currentInstitution] = useState<ResearchInstitution>({
    id: 'stanford_med',
    name: 'Stanford Medicine Research',
    verified: true,
    livesBalance: 5000,
    accessLevel: 'premium'
  });

  const apiEndpoints: APIEndpoint[] = [
    {
      path: '/api/research/treatment-outcomes',
      method: 'GET',
      description: 'Access anonymized treatment outcome data with zero-knowledge proofs',
      tokenRequired: 500,
      dataCategories: ['Treatment Results', 'Recovery Progress', 'Outcome Metrics'],
      privacyLevel: 'zero-knowledge',
      sampleResponse: {
        total_records: 1247,
        zk_proof_verification: 'verified',
        privacy_budget_remaining: 0.85,
        aggregated_data: {
          success_rate: 0.78,
          average_recovery_time: 45.2,
          satisfaction_score: 4.2,
          regional_distribution: {
            africa: 0.34,
            asia: 0.28,
            europe: 0.21,
            americas: 0.17
          }
        },
        differential_privacy_noise: 'applied',
        ubuntu_community_approval: 'confirmed'
      }
    },
    {
      path: '/api/research/biomarkers',
      method: 'GET',
      description: 'Aggregated biomarker data for precision medicine research',
      tokenRequired: 800,
      dataCategories: ['Lab Results', 'Genetic Markers', 'Metabolic Data'],
      privacyLevel: 'anonymized',
      sampleResponse: {
        total_samples: 892,
        biomarker_correlations: {
          inflammatory_markers: {
            crp_levels: { mean: 2.4, std: 1.2, correlation_with_outcome: 0.67 },
            il6_levels: { mean: 8.9, std: 3.1, correlation_with_outcome: 0.72 }
          },
          metabolic_markers: {
            glucose: { mean: 95.3, std: 12.7, correlation_with_recovery: 0.45 },
            insulin: { mean: 12.8, std: 4.2, correlation_with_recovery: 0.38 }
          }
        },
        genetic_variants: {
          pharmacogenomics: ['CYP2D6*1', 'CYP3A4*22', 'SLCO1B1*5'],
          treatment_response: ['ABCB1_C3435T', 'COMT_Val158Met']
        },
        anonymization_method: 'k-anonymity_k=5',
        community_consent_rate: 0.94
      }
    },
    {
      path: '/api/research/traditional-healing',
      method: 'GET',
      description: 'Traditional healing practices integrated with modern medicine',
      tokenRequired: 300,
      dataCategories: ['Cultural Practices', 'Herbal Remedies', 'Integration Outcomes'],
      privacyLevel: 'aggregated',
      sampleResponse: {
        total_practices: 156,
        geographic_distribution: {
          southern_africa: 0.42,
          east_africa: 0.28,
          west_africa: 0.18,
          diaspora_communities: 0.12
        },
        practice_categories: {
          herbal_medicine: {
            frequency: 0.78,
            effectiveness_rating: 4.1,
            integration_success: 0.85,
            common_herbs: ['African Potato', 'Sutherlandia', 'Buchu']
          },
          spiritual_healing: {
            frequency: 0.62,
            patient_satisfaction: 4.4,
            recovery_correlation: 0.58
          },
          community_support: {
            ubuntu_circles: 0.89,
            elder_guidance: 0.73,
            collective_healing: 0.65
          }
        },
        cultural_protocols: 'respected',
        elder_council_approval: 'obtained'
      }
    },
    {
      path: '/api/research/lifestyle-correlation',
      method: 'GET',
      description: 'Lifestyle factors correlation with health outcomes',
      tokenRequired: 400,
      dataCategories: ['Exercise Data', 'Nutrition', 'Social Support', 'Sleep Patterns'],
      privacyLevel: 'anonymized',
      sampleResponse: {
        total_participants: 2341,
        lifestyle_factors: {
          physical_activity: {
            exercise_frequency: { mean: 4.2, correlation_with_recovery: 0.73 },
            activity_types: ['walking', 'traditional_dance', 'community_sports'],
            community_participation: 0.68
          },
          nutrition: {
            traditional_diet_adherence: 0.76,
            nutritional_diversity: 4.8,
            community_meal_participation: 0.54,
            recovery_correlation: 0.61
          },
          social_support: {
            ubuntu_network_strength: 8.2,
            family_involvement: 0.89,
            community_solidarity: 0.81,
            healing_impact: 0.79
          },
          sleep_quality: {
            average_duration: 7.3,
            quality_score: 6.8,
            traditional_sleep_practices: 0.34
          }
        },
        privacy_preservation: 'differential_privacy_epsilon=0.1'
      }
    }
  ];

  const handleAPICall = async (endpoint: APIEndpoint) => {
    if (currentInstitution.livesBalance < endpoint.tokenRequired) {
      alert(`Insufficient LIVES tokens. Required: ${endpoint.tokenRequired}, Available: ${currentInstitution.livesBalance}`);
      return;
    }

    // Simulate API call
    setSelectedEndpoint(endpoint);
    setLivesTokens(endpoint.tokenRequired);
    
    // Show success message
    alert(`API call successful! ${endpoint.tokenRequired} LIVES tokens consumed.`);
  };

  const getPrivacyBadgeColor = (level: string) => {
    switch (level) {
      case 'zero-knowledge': return 'bg-purple-100 text-purple-800';
      case 'anonymized': return 'bg-blue-100 text-blue-800';
      case 'aggregated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">Ubuntu Health Research API</h1>
              <p className="text-xl text-indigo-100 mb-6">
                Access privacy-preserving health data for medical research
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Institution</div>
                  <div className="font-semibold">{currentInstitution.name}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Access Level</div>
                  <div className="font-semibold capitalize">{currentInstitution.accessLevel}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">LIVES Balance</div>
                  <div className="font-semibold">{currentInstitution.livesBalance.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl mb-2">🔬</div>
              <div className="text-sm text-indigo-100">Powered by Ubuntu Community</div>
            </div>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Research Data Endpoints</h2>
          <p className="text-lg text-gray-600 mb-6">
            Access anonymized health data through our privacy-preserving API. All data is community-approved 
            and processed using zero-knowledge proofs and differential privacy.
          </p>
          
          {/* Privacy Features */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🔒 Privacy & Security Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Data Protection</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Zero-knowledge proof verification</li>
                  <li>• Differential privacy noise injection</li>
                  <li>• k-anonymity guarantees (k≥5)</li>
                  <li>• Homomorphic encryption for aggregations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Community Governance</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Ubuntu community approval required</li>
                  <li>• Elder council oversight</li>
                  <li>• Patient consent verification</li>
                  <li>• Transparent usage auditing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded font-mono">
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-gray-600 font-mono">{endpoint.path}</code>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrivacyBadgeColor(endpoint.privacyLevel)}`}>
                      {endpoint.privacyLevel.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{endpoint.tokenRequired}</div>
                    <div className="text-sm text-gray-500">LIVES tokens</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{endpoint.description}</p>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Data Categories:</div>
                  <div className="flex flex-wrap gap-2">
                    {endpoint.dataCategories.map((category, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {currentInstitution.livesBalance >= endpoint.tokenRequired ? (
                      <span className="text-green-600">✓ Sufficient balance</span>
                    ) : (
                      <span className="text-red-600">⚠ Insufficient balance</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAPICall(endpoint)}
                    disabled={currentInstitution.livesBalance < endpoint.tokenRequired}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Access Data
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sample Response */}
        {selectedEndpoint && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Sample API Response</h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm overflow-x-auto">
              <div className="mb-4">
                <span className="text-gray-400"># API Call:</span>
                <br />
                <span className="text-blue-400">curl -X {selectedEndpoint.method}</span> \
                <br />
                <span className="text-yellow-400">  -H "Authorization: Bearer YOUR_API_KEY"</span> \
                <br />
                <span className="text-yellow-400">  -H "X-LIVES-Tokens: {livesTokens}"</span> \
                <br />
                <span className="text-purple-400">  "https://api.ubuntuhealth.org{selectedEndpoint.path}"</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <span className="text-gray-400"># Response:</span>
                <pre className="mt-2 text-green-400">
                  {JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Usage Guidelines */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-yellow-900 mb-4">🔬 Research Usage Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-yellow-800 mb-3">Ethical Requirements</h4>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li>• Institutional Review Board (IRB) approval required</li>
                <li>• Research must benefit Ubuntu communities</li>
                <li>• Results must be shared with community</li>
                <li>• Respect traditional knowledge protocols</li>
                <li>• Acknowledge Ubuntu philosophy in publications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800 mb-3">Technical Requirements</h4>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li>• API key authentication required</li>
                <li>• Rate limiting: 100 requests/hour</li>
                <li>• Data retention limited to research duration</li>
                <li>• Re-identification attempts prohibited</li>
                <li>• Audit logs maintained for all access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Token Economy */}
        <div className="mt-12 bg-purple-50 border border-purple-200 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-purple-900 mb-4">💰 $LIVES Token Economy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500-2000</div>
              <div className="text-purple-700 font-medium">LIVES per contribution</div>
              <div className="text-sm text-purple-600 mt-2">Patients earn tokens for data sharing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">300-800</div>
              <div className="text-purple-700 font-medium">LIVES per API call</div>
              <div className="text-sm text-purple-600 mt-2">Researchers pay for data access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-purple-700 font-medium">Revenue to community</div>
              <div className="text-sm text-purple-600 mt-2">All fees support Ubuntu health initiatives</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAPIAccess;