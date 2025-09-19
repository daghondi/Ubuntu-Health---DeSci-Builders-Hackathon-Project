import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Streamlined interfaces for Ubuntu Health research dashboard
interface ResearchMetrics {
  totalTreatments: number;
  completedTreatments: number;
  activeTreatments: number;
  successRate: number;
  averageTreatmentDuration: number;
  totalPatients: number;
  totalProviders: number;
  totalSponsors: number;
  researchContributions: number;
  anonymizedDatasets: number;
}

interface TreatmentCategoryData {
  category: string;
  totalCases: number;
  successRate: number;
  averageCost: number;
  averageDuration: number;
  ubuntuHealthVerified: number;
  trending: 'up' | 'down' | 'stable';
}

interface GeographicData {
  region: string;
  country: string;
  totalTreatments: number;
  successRate: number;
  averageCost: number;
  providers: number;
  topCategories: string[];
}

interface OutcomeData {
  treatmentId: string;
  category: string;
  duration: number;
  cost: number;
  outcome: 'successful' | 'partial' | 'unsuccessful';
  patientAge: number;
  patientGender: 'M' | 'F' | 'Other' | 'Not specified';
  region: string;
  milestones: number;
  completedMilestones: number;
  ubuntuHealthVerified: boolean;
  sponsorshipStatus: 'fully_sponsored' | 'partially_sponsored' | 'self_funded';
}

interface ResearchInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  significance: 'high' | 'medium' | 'low';
  dataPoints: number;
  generatedDate: Date;
  keyFindings: string[];
  impact: string;
}

const ResearchDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null);
  const [categoryData, setCategoryData] = useState<TreatmentCategoryData[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [outcomeData, setOutcomeData] = useState<OutcomeData[]>([]);
  const [insights, setInsights] = useState<ResearchInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y' | 'all'>('90d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInsight, setSelectedInsight] = useState<ResearchInsight | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockMetrics: ResearchMetrics = {
      totalTreatments: 2847,
      completedTreatments: 2198,
      activeTreatments: 649,
      successRate: 87.2,
      averageTreatmentDuration: 89, // days
      totalPatients: 2847,
      totalProviders: 324,
      totalSponsors: 1456,
      researchContributions: 89,
      anonymizedDatasets: 156
    };

    const mockCategoryData: TreatmentCategoryData[] = [
      {
        category: 'Cardiovascular',
        totalCases: 567,
        successRate: 91.2,
        averageCost: 15420,
        averageDuration: 95,
        ubuntuHealthVerified: 534,
        trending: 'up'
      },
      {
        category: 'Oncology',
        totalCases: 423,
        successRate: 78.9,
        averageCost: 32100,
        averageDuration: 156,
        ubuntuHealthVerified: 398,
        trending: 'up'
      },
      {
        category: 'Orthopedics',
        totalCases: 389,
        successRate: 94.1,
        averageCost: 8750,
        averageDuration: 67,
        ubuntuHealthVerified: 367,
        trending: 'stable'
      },
      {
        category: 'Diabetes Management',
        totalCases: 334,
        successRate: 89.8,
        averageCost: 4200,
        averageDuration: 120,
        ubuntuHealthVerified: 312,
        trending: 'up'
      },
      {
        category: 'Mental Health',
        totalCases: 298,
        successRate: 82.5,
        averageCost: 3800,
        averageDuration: 134,
        ubuntuHealthVerified: 276,
        trending: 'down'
      },
      {
        category: 'Pediatrics',
        totalCases: 267,
        successRate: 93.6,
        averageCost: 6900,
        averageDuration: 78,
        ubuntuHealthVerified: 251,
        trending: 'stable'
      }
    ];

    const mockGeographicData: GeographicData[] = [
      {
        region: 'South America',
        country: 'Brazil',
        totalTreatments: 687,
        successRate: 89.2,
        averageCost: 12400,
        providers: 78,
        topCategories: ['Cardiovascular', 'Diabetes Management', 'Orthopedics']
      },
      {
        region: 'Southeast Asia',
        country: 'Philippines',
        totalTreatments: 534,
        successRate: 86.7,
        averageCost: 8900,
        providers: 65,
        topCategories: ['Pediatrics', 'Infectious Diseases', 'General Medicine']
      },
      {
        region: 'Africa',
        country: 'Nigeria',
        totalTreatments: 456,
        successRate: 85.1,
        averageCost: 5600,
        providers: 52,
        topCategories: ['Maternal Health', 'Infectious Diseases', 'General Medicine']
      },
      {
        region: 'Middle East',
        country: 'Egypt',
        totalTreatments: 398,
        successRate: 88.4,
        averageCost: 9800,
        providers: 43,
        topCategories: ['Oncology', 'Cardiovascular', 'Kidney Disease']
      }
    ];

    const mockInsights: ResearchInsight[] = [
      {
        id: '1',
        title: 'Ubuntu Health Verification Improves Treatment Success Rates',
        description: 'Analysis of treatment outcomes shows a significant correlation between Ubuntu Health verification and treatment success rates across all categories.',
        category: 'Treatment Efficacy',
        significance: 'high',
        dataPoints: 2847,
        generatedDate: new Date('2024-01-25'),
        keyFindings: [
          'Ubuntu Health verified treatments show 12.3% higher success rates',
          'Verified providers maintain 94.1% average success rate vs 81.8% for non-verified',
          'Patient satisfaction scores are 18% higher with verified treatments',
          'Treatment completion rates improve by 15.7% with verification'
        ],
        impact: 'This insight supports the value of Ubuntu Health verification in improving patient outcomes and should be highlighted to encourage more providers to seek verification.'
      },
      {
        id: '2',
        title: 'Sponsor Support Correlation with Treatment Completion',
        description: 'Examination of sponsorship patterns reveals strong relationships between community support levels and treatment completion rates.',
        category: 'Community Impact',
        significance: 'high',
        dataPoints: 1856,
        generatedDate: new Date('2024-01-22'),
        keyFindings: [
          'Fully sponsored treatments have 96.3% completion rate',
          'Partially sponsored treatments show 88.7% completion rate',
          'Self-funded treatments complete at 79.4% rate',
          'Multiple sponsors per treatment improve outcomes by 8.2%'
        ],
        impact: 'Community sponsorship significantly improves treatment outcomes, suggesting the Ubuntu philosophy of collective support directly benefits patient health.'
      },
      {
        id: '3',
        title: 'Regional Treatment Access and Success Patterns',
        description: 'Geographic analysis of treatment accessibility and outcomes reveals important disparities and opportunities for platform expansion.',
        category: 'Global Health Access',
        significance: 'medium',
        dataPoints: 2847,
        generatedDate: new Date('2024-01-20'),
        keyFindings: [
          'Urban areas show 23% higher treatment access rates',
          'Rural regions demonstrate stronger community sponsorship patterns',
          'Success rates vary by less than 5% across geographic regions',
          'Provider density correlates with treatment diversity'
        ],
        impact: 'Platform expansion should focus on rural provider recruitment while maintaining urban treatment quality standards.'
      },
      {
        id: '4',
        title: 'Milestone-Based Treatment Structure Effectiveness',
        description: 'Analysis of milestone completion patterns and their impact on overall treatment success and patient engagement.',
        category: 'Treatment Structure',
        significance: 'medium',
        dataPoints: 2198,
        generatedDate: new Date('2024-01-18'),
        keyFindings: [
          'Treatments with 3-5 milestones show optimal completion rates (92.1%)',
          'Early milestone completion predicts overall success with 87% accuracy',
          'Patient engagement increases 34% with milestone-based progress tracking',
          'Sponsors prefer supporting treatments with clear milestone structures'
        ],
        impact: 'Milestone-based treatment structure proves effective for both patient outcomes and sponsor engagement, validating current platform approach.'
      }
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setCategoryData(mockCategoryData);
      setGeographicData(mockGeographicData);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selected timeframe and category
  const filteredCategoryData = categoryData.filter(cat => 
    selectedCategory === 'all' || cat.category === selectedCategory
  );

  const getTrendingIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (!metrics) {
    return <div>Error loading research data</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Research Dashboard</h1>
            <p className="text-purple-100 mb-2">Ubuntu Health Platform - Anonymized Treatment Data Analysis</p>
            <p className="text-sm text-purple-200">
              Contributing to global healthcare research through community-centered data
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{metrics.researchContributions}</div>
            <div className="text-purple-100">Research Contributions</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.successRate}%</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Treatments</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalTreatments.toLocaleString()}</p>
            </div>
            <div className="text-blue-500 text-2xl">🏥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Treatments</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeTreatments}</p>
            </div>
            <div className="text-orange-500 text-2xl">⚡</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.averageTreatmentDuration}d</p>
            </div>
            <div className="text-purple-500 text-2xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ubuntu Health Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.totalPatients.toLocaleString()}</div>
            <div className="text-gray-600">Patients Served</div>
            <div className="text-sm text-gray-500 mt-1">Across {geographicData.length} countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{metrics.totalProviders}</div>
            <div className="text-gray-600">Verified Providers</div>
            <div className="text-sm text-gray-500 mt-1">Ubuntu Health verified healthcare professionals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{metrics.totalSponsors.toLocaleString()}</div>
            <div className="text-gray-600">Community Sponsors</div>
            <div className="text-sm text-gray-500 mt-1">Supporting healing through Ubuntu philosophy</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment Categories Analysis */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Treatment Categories</h2>
              <select
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categoryData.map(cat => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredCategoryData.map((category) => (
              <div key={category.category} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.category}</h3>
                    <p className="text-sm text-gray-600">{category.totalCases} treatments</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTrendingIcon(category.trending)}</span>
                    <span className="text-sm font-semibold text-green-600">{category.successRate}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Avg Cost:</span>
                    <span className="font-semibold ml-2">${category.averageCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Duration:</span>
                    <span className="font-semibold ml-2">{category.averageDuration} days</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Ubuntu Health Verified:</span>
                    <span className="font-semibold ml-2 text-orange-600">
                      {category.ubuntuHealthVerified} ({((category.ubuntuHealthVerified / category.totalCases) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Success Rate Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Success Rate</span>
                    <span className="text-xs font-semibold">{category.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Geographic Distribution</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {geographicData.map((region) => (
              <div key={region.country} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{region.country}</h3>
                    <p className="text-sm text-gray-600">{region.region}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{region.totalTreatments}</div>
                    <div className="text-sm text-gray-600">treatments</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-semibold ml-2 text-green-600">{region.successRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Providers:</span>
                    <span className="font-semibold ml-2">{region.providers}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Avg Cost:</span>
                    <span className="font-semibold ml-2">${region.averageCost.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-2">Top Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {region.topCategories.map((cat, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Insights */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Research Insights</h2>
          <p className="text-gray-600 text-sm mt-1">
            AI-generated insights from anonymized treatment data contributing to global healthcare research
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSignificanceColor(insight.significance)}`}>
                      {insight.significance} significance
                    </span>
                    <span className="text-gray-500">{insight.dataPoints.toLocaleString()} data points</span>
                    <span className="text-gray-500">{insight.generatedDate.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-purple-500 text-xl ml-4">🔍</div>
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">Key Finding:</span> {insight.keyFindings[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Privacy Notice */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="text-orange-500 text-xl">🔒</div>
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Data Privacy & Research Ethics</h3>
            <p className="text-orange-800 text-sm">
              All research data is fully anonymized and aggregated to protect patient privacy. Individual treatment details 
              are never shared or identifiable. This research contributes to the global Ubuntu Health mission of improving 
              healthcare access and outcomes through community-centered data insights.
            </p>
          </div>
        </div>
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedInsight.title}</h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSignificanceColor(selectedInsight.significance)}`}>
                      {selectedInsight.significance} significance
                    </span>
                    <span className="text-gray-600">{selectedInsight.category}</span>
                    <span className="text-gray-600">{selectedInsight.dataPoints.toLocaleString()} data points</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedInsight.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Key Findings</h3>
                  <ul className="space-y-2">
                    {selectedInsight.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span className="text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Research Impact</h3>
                  <p className="text-gray-700">{selectedInsight.impact}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 text-sm">
                    <strong>Generated:</strong> {selectedInsight.generatedDate.toLocaleDateString()} • 
                    <strong> Category:</strong> {selectedInsight.category} • 
                    <strong> Data Points:</strong> {selectedInsight.dataPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchDashboard;
