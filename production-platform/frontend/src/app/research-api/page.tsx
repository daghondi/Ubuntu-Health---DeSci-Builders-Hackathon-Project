'use client';

import React, { useState } from 'react';
import { LivesTokenLogo } from '../../components/LivesTokenLogo';

interface APIEndpoint {
  endpoint: string;
  method: string;
  description: string;
  requiredTokens: number;
  dataCategory: string;
  sampleResponse: any;
}

export default function ResearcherAPIPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  const apiEndpoints: APIEndpoint[] = [
    {
      endpoint: '/api/v1/research/treatment-outcomes',
      method: 'GET',
      description: 'Access anonymized treatment outcome data with ZK-proof verification',
      requiredTokens: 1000,
      dataCategory: 'Treatment Outcomes',
      sampleResponse: {
        total_records: 2847,
        anonymized_data: [
          {
            treatment_id: "zk_proof_hash_abc123",
            condition_category: "cancer_immunotherapy",
            treatment_response_score: 8.2,
            side_effects_severity: 2.1,
            recovery_timeline_days: 45,
            quality_of_life_improvement: 6.8,
            demographic_cluster: "cluster_a1",
            zkproof_verified: true
          }
        ],
        privacy_guarantees: {
          differential_privacy: true,
          zero_knowledge_proofs: true,
          ubuntu_community_approved: true
        }
      }
    },
    {
      endpoint: '/api/v1/research/biomarkers',
      method: 'GET',
      description: 'Anonymized biomarker and lab result data for precision medicine research',
      requiredTokens: 1500,
      dataCategory: 'Biomarkers & Lab Results',
      sampleResponse: {
        total_records: 1943,
        anonymized_data: [
          {
            biomarker_profile: "anonymized_profile_xyz789",
            protein_levels: [12.4, 8.7, 15.2],
            genetic_markers: "cluster_based_encoding",
            metabolic_indicators: [0.82, 1.15, 0.94],
            treatment_correlation: 0.73,
            zkproof_verified: true
          }
        ],
        data_quality: {
          completeness: 0.94,
          accuracy_verified: true,
          temporal_range: "2023-2025"
        }
      }
    },
    {
      endpoint: '/api/v1/research/traditional-healing',
      method: 'GET',
      description: 'Ubuntu traditional healing practices integrated with modern treatment outcomes',
      requiredTokens: 800,
      dataCategory: 'Traditional & Cultural Healing',
      sampleResponse: {
        total_records: 456,
        ubuntu_healing_data: [
          {
            traditional_practice_id: "ubuntu_healing_001",
            cultural_context: "southern_african",
            healing_method_category: "herbal_complementary",
            integration_with_modern_treatment: true,
            outcome_improvement_factor: 1.34,
            community_validation_score: 9.1,
            elder_approval: true
          }
        ],
        cultural_sovereignty: {
          community_consent: true,
          elder_validation: true,
          cultural_protocol_followed: true
        }
      }
    },
    {
      endpoint: '/api/v1/research/lifestyle-wellness',
      method: 'GET',
      description: 'Lifestyle and wellness data correlated with treatment effectiveness',
      requiredTokens: 600,
      dataCategory: 'Lifestyle & Wellness',
      sampleResponse: {
        total_records: 3241,
        wellness_data: [
          {
            lifestyle_profile: "anonymized_wellness_profile",
            activity_levels: [7.2, 8.1, 6.9],
            sleep_quality_scores: [8.3, 7.8, 8.7],
            stress_indicators: [3.2, 2.8, 4.1],
            nutrition_compliance: 0.87,
            treatment_synergy_score: 1.28
          }
        ],
        correlations: {
          lifestyle_treatment_correlation: 0.68,
          wellness_recovery_correlation: 0.74
        }
      }
    }
  ];

  const handleAPIRequest = (endpoint: APIEndpoint) => {
    setSelectedEndpoint(endpoint);
    setShowResponse(true);
    
    // Simulate API request
    setTimeout(() => {
      alert(`API Request successful! Retrieved ${endpoint.sampleResponse.total_records || 'multiple'} anonymized records. ${endpoint.requiredTokens} LIVES tokens have been deducted from your research account.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <span className="text-3xl">🔬</span>
              Ubuntu Health Research API
              <LivesTokenLogo size={32} showText={false} />
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access anonymized health data through our token-gated API system. 
              All data is protected by zero-knowledge proofs and approved by Ubuntu community governance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Sidebar - API Authentication */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-lg">🔑</span>
                API Authentication
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Institution API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium mb-2">
                    <LivesTokenLogo size={20} showText={false} />
                    Token Balance
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">2,500 LIVES</div>
                  <div className="text-sm text-emerald-700">Available for API requests</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Research Institution</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>Stanford Medical School</div>
                    <div>Ethics Review: ✅ Approved</div>
                    <div>Ubuntu DAO Status: ✅ Verified</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                  <strong>API Usage:</strong> All requests are logged for transparency. 
                  Data usage must comply with Ubuntu community guidelines and institutional ethics review.
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - API Endpoints */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Research Endpoints</h2>
              
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {endpoint.endpoint}
                          </code>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">{endpoint.dataCategory}</h3>
                        <p className="text-gray-600 mb-4">{endpoint.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="text-blue-500">🔐</span>
                            Zero-Knowledge Proofs
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-green-500">👥</span>
                            Ubuntu Community Approved
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-purple-500">📊</span>
                            Differential Privacy
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className="bg-emerald-100 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                            <LivesTokenLogo size={18} showText={false} />
                            <span>{endpoint.requiredTokens}</span>
                          </div>
                          <div className="text-xs text-emerald-600">per request</div>
                        </div>
                        
                        <button
                          onClick={() => handleAPIRequest(endpoint)}
                          disabled={!apiKey}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          Test API
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Response Display */}
            {showResponse && selectedEndpoint && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  API Response - {selectedEndpoint.dataCategory}
                </h3>
                
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="mb-2 text-gray-400"># API Request</div>
                  <div className="text-blue-400">GET {selectedEndpoint.endpoint}</div>
                  <div className="text-gray-400 mt-2"># Response (200 OK)</div>
                  <pre className="mt-2 text-green-400">
                    {JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}
                  </pre>
                </div>
                
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Privacy Guarantees</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>✅ All data is anonymized using zero-knowledge proofs</div>
                    <div>✅ Patient identities are cryptographically protected</div>
                    <div>✅ Ubuntu community has approved this data usage</div>
                    <div>✅ Differential privacy ensures no individual can be identified</div>
                    <div>✅ Cultural sovereignty maintained for traditional healing data</div>
                  </div>
                </div>
              </div>
            )}

            {/* Documentation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ubuntu Health Research API Documentation</h3>
              
              <div className="space-y-4 text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Authentication</h4>
                  <p>All API requests require a valid research institution API key and sufficient LIVES token balance. 
                  Institutions must be approved by the Ubuntu Health DAO and have completed ethics review.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Token-Gated Access</h4>
                  <p>Each API request costs LIVES tokens based on the data sensitivity and computational resources required. 
                  Tokens are automatically deducted upon successful requests.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Privacy Protection</h4>
                  <p>All data is anonymized using zero-knowledge proofs. Raw patient data never leaves the Ubuntu Health 
                  secure environment. Researchers receive mathematically proven aggregated insights.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Ubuntu Community Governance</h4>
                  <p>Research partnerships and data usage are governed by Ubuntu DAO. The community votes on 
                  ethical data usage, research priorities, and benefit sharing with data contributors.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Rate Limits</h4>
                  <p>API requests are limited to ensure fair access and prevent abuse. Enterprise plans 
                  available for high-volume research institutions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}