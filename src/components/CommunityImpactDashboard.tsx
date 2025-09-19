import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Streamlined interfaces for Ubuntu Health community impact tracking
interface CommunityMetrics {
  totalMembers: number;
  activeTreatments: number;
  completedTreatments: number;
  totalSponsored: number;
  livesImpacted: number;
  verifiedProviders: number;
  globalReach: number; // countries
  communityGrowthRate: number; // monthly %
  averageSuccessRate: number;
  ubuntuHealthMembers: number;
}

interface PatientStory {
  id: string;
  patientName: string; // anonymized
  treatmentTitle: string;
  category: string;
  location: string;
  story: string;
  outcome: string;
  sponsorsCount: number;
  totalSponsored: number;
  treatmentDate: Date;
  completionDate?: Date;
  images?: string[];
  verified: boolean;
  featured: boolean;
}

interface CommunityMilestone {
  id: string;
  title: string;
  description: string;
  achievedDate: Date;
  value: number;
  type: 'treatments' | 'sponsors' | 'funding' | 'providers' | 'countries' | 'members';
  icon: string;
  significance: 'major' | 'significant' | 'milestone';
}

interface ImpactByRegion {
  region: string;
  country: string;
  flag: string;
  totalTreatments: number;
  completedTreatments: number;
  totalSponsored: number;
  activeProviders: number;
  successRate: number;
  topCategories: string[];
  recentGrowth: number; // percentage
}

interface MonthlyGrowth {
  month: string;
  newPatients: number;
  newSponsors: number;
  newProviders: number;
  completedTreatments: number;
  totalFunding: number;
}

const CommunityImpactDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [patientStories, setPatientStories] = useState<PatientStory[]>([]);
  const [milestones, setMilestones] = useState<CommunityMilestone[]>([]);
  const [regionalImpact, setRegionalImpact] = useState<ImpactByRegion[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<MonthlyGrowth[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<PatientStory | null>(null);
  const [timeframe, setTimeframe] = useState<'3m' | '6m' | '1y' | 'all'>('6m');

  // Mock data for demonstration
  useEffect(() => {
    const mockMetrics: CommunityMetrics = {
      totalMembers: 12847,
      activeTreatments: 649,
      completedTreatments: 2198,
      totalSponsored: 3420000,
      livesImpacted: 2847,
      verifiedProviders: 324,
      globalReach: 47,
      communityGrowthRate: 23.4,
      averageSuccessRate: 87.2,
      ubuntuHealthMembers: 8956
    };

    const mockPatientStories: PatientStory[] = [
      {
        id: '1',
        patientName: 'Maria S.',
        treatmentTitle: 'Heart Surgery Recovery',
        category: 'Cardiovascular',
        location: 'São Paulo, Brazil',
        story: 'After months of chest pain and shortness of breath, I was diagnosed with a heart valve problem that required surgery. Thanks to the Ubuntu Health community, I received not just the funding I needed, but also emotional support from sponsors around the world. The surgery was successful, and I\'m now back to playing with my grandchildren.',
        outcome: 'Successful valve replacement surgery with full recovery. Patient returned to normal activities within 3 months.',
        sponsorsCount: 12,
        totalSponsored: 15420,
        treatmentDate: new Date('2024-01-15'),
        completionDate: new Date('2024-04-15'),
        verified: true,
        featured: true
      },
      {
        id: '2',
        patientName: 'Ahmed K.',
        treatmentTitle: 'Cancer Treatment Support',
        category: 'Oncology',
        location: 'Cairo, Egypt',
        story: 'When I was diagnosed with lymphoma, I felt overwhelmed not just by the medical challenge, but by the financial burden. The Ubuntu Health platform connected me with people who believed in my healing journey. Their support gave me hope and strength to fight. Today, I\'m cancer-free and eternally grateful.',
        outcome: 'Complete remission achieved after 6 months of treatment. Patient is now in follow-up care.',
        sponsorsCount: 18,
        totalSponsored: 32100,
        treatmentDate: new Date('2023-12-01'),
        completionDate: new Date('2024-06-01'),
        verified: true,
        featured: true
      },
      {
        id: '3',
        patientName: 'Grace M.',
        treatmentTitle: 'Diabetes Management Program',
        category: 'Endocrinology',
        location: 'Lagos, Nigeria',
        story: 'Managing diabetes was becoming impossible without proper medication and monitoring equipment. The Ubuntu Health community not only helped fund my treatment but connected me with others facing similar challenges. I learned so much about managing my condition and now help others in my local community.',
        outcome: 'Achieved stable blood sugar control and learned comprehensive diabetes management.',
        sponsorsCount: 8,
        totalSponsored: 4200,
        treatmentDate: new Date('2024-02-10'),
        completionDate: new Date('2024-05-10'),
        verified: true,
        featured: false
      }
    ];

    const mockMilestones: CommunityMilestone[] = [
      {
        id: '1',
        title: '10,000 Community Members',
        description: 'Ubuntu Health community reached 10,000 registered members across 40+ countries',
        achievedDate: new Date('2024-08-15'),
        value: 10000,
        type: 'members',
        icon: '👥',
        significance: 'major'
      },
      {
        id: '2',
        title: '$3M+ in Community Sponsorship',
        description: 'Community sponsors have contributed over $3 million to support treatments worldwide',
        achievedDate: new Date('2024-07-22'),
        value: 3000000,
        type: 'funding',
        icon: '💝',
        significance: 'major'
      },
      {
        id: '3',
        title: '2,000 Treatments Completed',
        description: 'Celebrated the completion of our 2,000th successful treatment through the platform',
        achievedDate: new Date('2024-06-30'),
        value: 2000,
        type: 'treatments',
        icon: '🎉',
        significance: 'significant'
      },
      {
        id: '4',
        title: '300+ Verified Providers',
        description: 'Network of Ubuntu Health verified healthcare providers reached 300+ professionals',
        achievedDate: new Date('2024-05-18'),
        value: 300,
        type: 'providers',
        icon: '👩‍⚕️',
        significance: 'milestone'
      }
    ];

    const mockRegionalImpact: ImpactByRegion[] = [
      {
        region: 'South America',
        country: 'Brazil',
        flag: '🇧🇷',
        totalTreatments: 687,
        completedTreatments: 589,
        totalSponsored: 852400,
        activeProviders: 78,
        successRate: 89.2,
        topCategories: ['Cardiovascular', 'Diabetes Management', 'Orthopedics'],
        recentGrowth: 15.3
      },
      {
        region: 'Africa',
        country: 'Nigeria',
        flag: '🇳🇬',
        totalTreatments: 534,
        completedTreatments: 456,
        totalSponsored: 475200,
        activeProviders: 65,
        successRate: 86.7,
        topCategories: ['Maternal Health', 'Infectious Diseases', 'General Medicine'],
        recentGrowth: 28.7
      },
      {
        region: 'Southeast Asia',
        country: 'Philippines',
        flag: '🇵🇭',
        totalTreatments: 456,
        completedTreatments: 398,
        totalSponsored: 405600,
        activeProviders: 52,
        successRate: 85.1,
        topCategories: ['Pediatrics', 'Infectious Diseases', 'General Medicine'],
        recentGrowth: 22.1
      },
      {
        region: 'Middle East',
        country: 'Egypt',
        flag: '🇪🇬',
        totalTreatments: 398,
        completedTreatments: 352,
        totalSponsored: 390200,
        activeProviders: 43,
        successRate: 88.4,
        topCategories: ['Oncology', 'Cardiovascular', 'Kidney Disease'],
        recentGrowth: 18.9
      }
    ];

    const mockMonthlyGrowth: MonthlyGrowth[] = [
      { month: 'Mar 2024', newPatients: 245, newSponsors: 189, newProviders: 12, completedTreatments: 67, totalFunding: 342000 },
      { month: 'Apr 2024', newPatients: 298, newSponsors: 234, newProviders: 15, completedTreatments: 89, totalFunding: 456000 },
      { month: 'May 2024', newPatients: 334, newSponsors: 267, newProviders: 18, completedTreatments: 95, totalFunding: 523000 },
      { month: 'Jun 2024', newPatients: 378, newSponsors: 298, newProviders: 21, completedTreatments: 112, totalFunding: 634000 },
      { month: 'Jul 2024', newPatients: 412, newSponsors: 334, newProviders: 25, completedTreatments: 128, totalFunding: 742000 },
      { month: 'Aug 2024', newPatients: 456, newSponsors: 378, newProviders: 28, completedTreatments: 145, totalFunding: 851000 }
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setPatientStories(mockPatientStories);
      setMilestones(mockMilestones);
      setRegionalImpact(mockRegionalImpact);
      setMonthlyGrowth(mockMonthlyGrowth);
      setLoading(false);
    }, 1000);
  }, []);

  const getMilestoneSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'major': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'significant': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'milestone': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'funding':
        return `$${(value / 1000000).toFixed(1)}M`;
      case 'treatments':
      case 'providers':
      case 'members':
      case 'countries':
        return value.toLocaleString();
      default:
        return value.toString();
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

  if (!metrics) {
    return <div>Error loading community data</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-3">Ubuntu Health Community Impact</h1>
            <p className="text-orange-100 text-lg mb-3">"I am because we are" - Healing together across the globe</p>
            <p className="text-orange-200">
              Connecting communities, transforming healthcare, changing lives through collective compassion
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">{metrics.livesImpacted.toLocaleString()}</div>
            <div className="text-orange-100 text-lg">Lives Impacted</div>
            <div className="text-orange-200 text-sm mt-2">Across {metrics.globalReach} countries</div>
          </div>
        </div>
      </div>

      {/* Key Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Community Members</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalMembers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{metrics.communityGrowthRate}% this month</p>
            </div>
            <div className="text-green-500 text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sponsored</p>
              <p className="text-3xl font-bold text-gray-900">${(metrics.totalSponsored / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-blue-600">Community-funded treatments</p>
            </div>
            <div className="text-blue-500 text-3xl">💝</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.averageSuccessRate}%</p>
              <p className="text-xs text-purple-600">Treatment completion rate</p>
            </div>
            <div className="text-purple-500 text-3xl">📈</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ubuntu Members</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.ubuntuHealthMembers.toLocaleString()}</p>
              <p className="text-xs text-orange-600">{((metrics.ubuntuHealthMembers / metrics.totalMembers) * 100).toFixed(1)}% of community</p>
            </div>
            <div className="text-orange-500 text-3xl">🤝</div>
          </div>
        </div>
      </div>

      {/* Community Milestones */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Community Milestones</h2>
          <p className="text-gray-600">Celebrating our collective achievements in global healthcare</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-6 rounded-lg border-2 ${getMilestoneSignificanceColor(milestone.significance)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{milestone.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{milestone.title}</h3>
                    <p className="text-sm mb-3">{milestone.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {formatValue(milestone.value, milestone.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {milestone.achievedDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Success Stories */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Patient Success Stories</h2>
            <p className="text-gray-600 text-sm">Real stories of healing and hope from our community</p>
          </div>
          <div className="divide-y divide-gray-200">
            {patientStories.filter(story => story.featured).map((story) => (
              <div
                key={story.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedStory(story)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{story.treatmentTitle}</h3>
                    <p className="text-sm text-gray-600">{story.patientName} • {story.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {story.verified && (
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full" title="Verified Success Story"></span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {story.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{story.story}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      <strong>{story.sponsorsCount}</strong> sponsors
                    </span>
                    <span className="text-gray-600">
                      <strong>${story.totalSponsored.toLocaleString()}</strong> funded
                    </span>
                  </div>
                  <span className="text-green-600 font-medium">✓ Successful</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Impact by Region */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Global Impact</h2>
            <p className="text-gray-600 text-sm">Healthcare transformation across continents</p>
          </div>
          <div className="divide-y divide-gray-200">
            {regionalImpact.map((region) => (
              <div key={region.country} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{region.flag}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{region.country}</h3>
                      <p className="text-sm text-gray-600">{region.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{region.totalTreatments}</div>
                    <div className="text-sm text-gray-600">treatments</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-semibold ml-2 text-green-600">{region.successRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Providers:</span>
                    <span className="font-semibold ml-2">{region.activeProviders}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Funded:</span>
                    <span className="font-semibold ml-2">${region.totalSponsored.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Growth:</span>
                    <span className="font-semibold ml-2 text-blue-600">+{region.recentGrowth}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-2">Top Treatment Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {region.topCategories.map((category, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Community Growth</h2>
            <p className="text-gray-600 text-sm">Monthly growth across key metrics</p>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-600">Month</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">New Patients</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">New Sponsors</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Completed</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Funding</th>
              </tr>
            </thead>
            <tbody>
              {monthlyGrowth.map((month, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{month.month}</td>
                  <td className="py-3 px-4 text-right">{month.newPatients}</td>
                  <td className="py-3 px-4 text-right">{month.newSponsors}</td>
                  <td className="py-3 px-4 text-right">{month.completedTreatments}</td>
                  <td className="py-3 px-4 text-right font-semibold">${month.totalFunding.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ubuntu Philosophy Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-900 mb-4">The Ubuntu Way</h2>
          <p className="text-lg text-orange-800 mb-6 italic">
            "I am because we are" - This ancient African philosophy guides our community-centered approach to healthcare
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-sm text-gray-600">
                Every treatment is supported by a community of caring individuals who believe in collective healing
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Global Connection</h3>
              <p className="text-sm text-gray-600">
                Connecting patients, providers, and sponsors across borders to create a worldwide healing network
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">💫</div>
              <h3 className="font-semibold text-gray-900 mb-2">Shared Humanity</h3>
              <p className="text-sm text-gray-600">
                Recognizing that healthcare is a human right and that we all have a role in each other's wellbeing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStory.treatmentTitle}</h2>
                  <p className="text-gray-600">{selectedStory.patientName} • {selectedStory.location}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedStory.category}
                    </span>
                    {selectedStory.verified && (
                      <span className="flex items-center space-x-1 text-green-600">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium">Verified Story</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Patient's Story</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedStory.story}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Treatment Outcome</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedStory.outcome}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Community Support</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sponsors:</span>
                      <span className="font-semibold ml-2">{selectedStory.sponsorsCount} community members</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Funded:</span>
                      <span className="font-semibold ml-2">${selectedStory.totalSponsored.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Treatment Started:</span>
                      <span className="font-semibold ml-2">{selectedStory.treatmentDate.toLocaleDateString()}</span>
                    </div>
                    {selectedStory.completionDate && (
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-semibold ml-2">{selectedStory.completionDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-800 text-sm text-center italic">
                    "Through Ubuntu Health, I learned that healing is not just individual - it's a community journey. 
                    I am because we are, and we are all stronger when we support each other."
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

export default CommunityImpactDashboard;
