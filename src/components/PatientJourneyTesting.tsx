import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Patient Journey Testing Framework for Ubuntu Health Platform
// Comprehensive end-to-end testing and user experience validation

interface PatientJourneyStep {
  stepId: string;
  stepName: string;
  description: string;
  category: 'Onboarding' | 'Discovery' | 'Matching' | 'Treatment' | 'Recovery' | 'Community' | 'Completion';
  requiredComponents: string[];
  testScenarios: TestScenario[];
  ubuntuPhilosophyElements: string[];
  culturalConsiderations: string[];
  expectedOutcome: string;
  status: 'Not Started' | 'In Progress' | 'Passed' | 'Failed' | 'Blocked';
  lastTested: Date | null;
  testDuration: number; // minutes
  automationLevel: 'Manual' | 'Semi-Automated' | 'Fully Automated';
}

interface TestScenario {
  scenarioId: string;
  scenarioName: string;
  userPersona: UserPersona;
  preconditions: string[];
  testSteps: TestStep[];
  expectedResults: ExpectedResult[];
  actualResults?: ActualResult[];
  status: 'Not Started' | 'Running' | 'Passed' | 'Failed';
  executionTime: number;
  errorMessages: string[];
  screenshots: string[];
  culturalValidation: CulturalValidation;
  communityImpact: CommunityImpact;
}

interface TestStep {
  stepNumber: number;
  action: string;
  component: string;
  data: any;
  validation: string;
  ubuntuPrincipleCheck?: string;
  culturalSensitivityCheck?: string;
  communityConnectionCheck?: string;
}

interface UserPersona {
  personaId: string;
  name: string;
  age: number;
  location: string;
  culturalBackground: string;
  healthCondition: string;
  techSavviness: 'Low' | 'Medium' | 'High';
  languagePreferences: string[];
  traditionalHealingExperience: 'None' | 'Some' | 'Extensive';
  communityConnections: 'Isolated' | 'Some' | 'Strong';
  economicStatus: 'Low Income' | 'Middle Income' | 'High Income';
  disabilities?: string[];
  internetAccess: 'Limited' | 'Regular' | 'Excellent';
  deviceTypes: ('Mobile' | 'Tablet' | 'Desktop')[];
}

interface ExpectedResult {
  resultId: string;
  description: string;
  type: 'UI Element' | 'Data State' | 'Blockchain State' | 'Community Interaction' | 'Cultural Respect';
  success_criteria: string;
  ubuntuPhilosophyAlignment: string;
  culturalAppropriatenessCheck: string;
}

interface ActualResult {
  resultId: string;
  description: string;
  success: boolean;
  timestamp: Date;
  details: string;
  screenshots?: string[];
  errorLogs?: string[];
  performanceMetrics?: {
    loadTime: number;
    responseTime: number;
    memoryUsage: number;
  };
}

interface CulturalValidation {
  elderReviewRequired: boolean;
  elderReviewPassed?: boolean;
  culturalElementsRespected: string[];
  traditionalKnowledgeProtected: boolean;
  communityConsentObtained: boolean;
  languageAccessibility: boolean;
  culturalSymbolsAppropriate: boolean;
  feedbackFromCommunityElders?: string[];
}

interface CommunityImpact {
  communityEngagementLevel: number; // 1-10
  collectiveHealingPromoted: boolean;
  socialSupportFacilitated: boolean;
  communityResourcesUtilized: boolean;
  intergenerationalKnowledgeShared: boolean;
  communityEmpowermentMeasured: number; // 1-10
  culturalContinuitySupported: boolean;
}

interface TestExecution {
  executionId: string;
  testSuite: string;
  startTime: Date;
  endTime?: Date;
  status: 'Running' | 'Completed' | 'Failed' | 'Cancelled';
  totalScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  blockedScenarios: number;
  overallScore: number; // percentage
  culturalComplianceScore: number; // percentage
  communityImpactScore: number; // percentage
  performanceMetrics: {
    averageLoadTime: number;
    averageResponseTime: number;
    errorRate: number;
    userSatisfactionScore: number;
  };
  keyFindings: string[];
  recommendations: string[];
  ubuntuPhilosophyAlignment: number; // 1-10
}

interface UserFeedback {
  feedbackId: string;
  userPersonaId: string;
  journeyStep: string;
  rating: number; // 1-5
  feedback: string;
  culturalAppropriatenessRating: number; // 1-5
  easeOfUse: number; // 1-5
  communityConnectionFeeling: number; // 1-5
  traditionalHealingRespect: number; // 1-5
  suggestions: string[];
  timestamp: Date;
  language: string;
  deviceUsed: string;
}

const PatientJourneyTesting: React.FC = () => {
  const [journeySteps, setJourneySteps] = useState<PatientJourneyStep[]>([]);
  const [testExecutions, setTestExecutions] = useState<TestExecution[]>([]);
  const [userPersonas, setUserPersonas] = useState<UserPersona[]>([]);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'journey' | 'executions' | 'personas' | 'feedback' | 'analytics'>('journey');
  const [selectedStep, setSelectedStep] = useState<PatientJourneyStep | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [runningTest, setRunningTest] = useState<string | null>(null);

  // Mock data for comprehensive testing framework
  useEffect(() => {
    const mockPersonas: UserPersona[] = [
      {
        personaId: 'persona_001',
        name: 'Amara - Rural Kenya Patient',
        age: 34,
        location: 'Kibera, Nairobi, Kenya',
        culturalBackground: 'Kikuyu',
        healthCondition: 'Maternal Health - Pregnancy Care',
        techSavviness: 'Medium',
        languagePreferences: ['Swahili', 'English', 'Kikuyu'],
        traditionalHealingExperience: 'Extensive',
        communityConnections: 'Strong',
        economicStatus: 'Low Income',
        internetAccess: 'Limited',
        deviceTypes: ['Mobile']
      },
      {
        personaId: 'persona_002',
        name: 'João - Urban Brazil Community Leader',
        age: 56,
        location: 'Favela da Rocinha, Rio de Janeiro, Brazil',
        culturalBackground: 'Afro-Brazilian',
        healthCondition: 'Diabetes Management',
        techSavviness: 'High',
        languagePreferences: ['Portuguese', 'Spanish'],
        traditionalHealingExperience: 'Some',
        communityConnections: 'Strong',
        economicStatus: 'Middle Income',
        internetAccess: 'Regular',
        deviceTypes: ['Mobile', 'Desktop']
      },
      {
        personaId: 'persona_003',
        name: 'Lila - Indigenous Philippines Elder',
        age: 67,
        location: 'Cordillera Mountains, Philippines',
        culturalBackground: 'Igorot',
        healthCondition: 'Arthritis and Traditional Medicine',
        techSavviness: 'Low',
        languagePreferences: ['Ilocano', 'Tagalog'],
        traditionalHealingExperience: 'Extensive',
        communityConnections: 'Strong',
        economicStatus: 'Low Income',
        disabilities: ['Limited mobility'],
        internetAccess: 'Limited',
        deviceTypes: ['Mobile']
      },
      {
        personaId: 'persona_004',
        name: 'Marcus - Urban South Africa Youth',
        age: 24,
        location: 'Soweto, Johannesburg, South Africa',
        culturalBackground: 'Zulu',
        healthCondition: 'Mental Health - Depression',
        techSavviness: 'High',
        languagePreferences: ['English', 'Zulu', 'Xhosa'],
        traditionalHealingExperience: 'None',
        communityConnections: 'Some',
        economicStatus: 'Low Income',
        internetAccess: 'Excellent',
        deviceTypes: ['Mobile', 'Tablet']
      }
    ];

    const mockJourneySteps: PatientJourneyStep[] = [
      {
        stepId: 'step_001',
        stepName: 'Platform Discovery & First Impression',
        description: 'Patient discovers Ubuntu Health platform and forms initial impressions',
        category: 'Onboarding',
        requiredComponents: ['Landing Page', 'Ubuntu Philosophy Explanation', 'Cultural Welcome'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'I am because we are messaging',
          'Community-centered healthcare explanation',
          'Traditional healing respect demonstration'
        ],
        culturalConsiderations: [
          'Multi-language support',
          'Cultural symbols and imagery',
          'Respect for traditional healing practices',
          'Community values emphasis'
        ],
        expectedOutcome: 'Patient feels welcomed, understands Ubuntu philosophy, and wants to learn more',
        status: 'Passed',
        lastTested: new Date('2024-03-15T10:00:00Z'),
        testDuration: 15,
        automationLevel: 'Semi-Automated'
      },
      {
        stepId: 'step_002',
        stepName: 'Patient Registration & Community Connection',
        description: 'Patient creates account and connects with community',
        category: 'Onboarding',
        requiredComponents: ['Registration Form', 'Cultural Background Input', 'Community Matching', 'Privacy Settings'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'Community connection emphasis',
          'Collective consent options',
          'Traditional healing preferences',
          'Elder connection opportunities'
        ],
        culturalConsiderations: [
          'Cultural background sensitivity',
          'Traditional name formats',
          'Community hierarchy respect',
          'Privacy in collectivist cultures'
        ],
        expectedOutcome: 'Patient successfully registered with appropriate community connections',
        status: 'Passed',
        lastTested: new Date('2024-03-15T09:30:00Z'),
        testDuration: 25,
        automationLevel: 'Semi-Automated'
      },
      {
        stepId: 'step_003',
        stepName: 'Health Assessment & Traditional Integration',
        description: 'Comprehensive health assessment including traditional healing context',
        category: 'Discovery',
        requiredComponents: ['Health Assessment Form', 'Traditional Healing History', 'Community Health Context', 'AI Health Insights'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'Holistic health view',
          'Community health factors',
          'Traditional healing integration',
          'Collective wellbeing assessment'
        ],
        culturalConsiderations: [
          'Traditional healing practice respect',
          'Cultural symptom descriptions',
          'Community health interdependence',
          'Spiritual health components'
        ],
        expectedOutcome: 'Comprehensive health profile created with traditional and modern elements',
        status: 'In Progress',
        lastTested: new Date('2024-03-14T14:20:00Z'),
        testDuration: 35,
        automationLevel: 'Manual'
      },
      {
        stepId: 'step_004',
        stepName: 'Treatment Discovery & Community Sponsorship',
        description: 'Patient discovers treatment options and community sponsorship opportunities',
        category: 'Matching',
        requiredComponents: ['Healing Atlas', 'Sponsorship Discovery', 'Community Support Network', 'Traditional Healing Options'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'Community support emphasis',
          'Collective healing approaches',
          'Traditional-modern integration',
          'Mutual aid philosophy'
        ],
        culturalConsiderations: [
          'Traditional healing practitioner verification',
          'Cultural treatment preferences',
          'Community elder involvement',
          'Economic accessibility'
        ],
        expectedOutcome: 'Patient finds appropriate treatment with community support',
        status: 'Failed',
        lastTested: new Date('2024-03-13T11:15:00Z'),
        testDuration: 45,
        automationLevel: 'Semi-Automated'
      },
      {
        stepId: 'step_005',
        stepName: 'Treatment Pass Creation & Milestone Planning',
        description: 'Create treatment pass NFT and establish healing milestones',
        category: 'Treatment',
        requiredComponents: ['Treatment Pass NFT', 'Milestone Escrow', 'Community Witness System', 'Traditional Ceremony Integration'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'Community witness involvement',
          'Collective healing goals',
          'Traditional ceremony respect',
          'Shared accountability'
        ],
        culturalConsiderations: [
          'Ceremonial milestone recognition',
          'Community celebration customs',
          'Traditional healing timelines',
          'Collective decision making'
        ],
        expectedOutcome: 'Treatment pass created with appropriate community involvement',
        status: 'Not Started',
        lastTested: null,
        testDuration: 40,
        automationLevel: 'Manual'
      },
      {
        stepId: 'step_006',
        stepName: 'Active Treatment & Community Support',
        description: 'Patient undergoes treatment with ongoing community support',
        category: 'Treatment',
        requiredComponents: ['Recovery Logger', 'Community Check-ins', 'Provider Verification', 'Traditional Healing Integration'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'Continuous community support',
          'Shared healing journey',
          'Collective encouragement',
          'Traditional wisdom integration'
        ],
        culturalConsiderations: [
          'Traditional healing practice integration',
          'Community support customs',
          'Privacy in collective care',
          'Elder guidance incorporation'
        ],
        expectedOutcome: 'Patient receives treatment with strong community support',
        status: 'Not Started',
        lastTested: null,
        testDuration: 60,
        automationLevel: 'Manual'
      },
      {
        stepId: 'step_007',
        stepName: 'Recovery Documentation & Community Sharing',
        description: 'Document recovery progress and share with community appropriately',
        category: 'Recovery',
        requiredComponents: ['Recovery Logger', 'IPFS Storage', 'Community Sharing Controls', 'Traditional Knowledge Documentation'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'Community learning from healing',
          'Shared knowledge creation',
          'Collective wisdom building',
          'Traditional knowledge preservation'
        ],
        culturalConsiderations: [
          'Traditional knowledge protection',
          'Community sharing customs',
          'Privacy vs. collective learning',
          'Elder approval for knowledge sharing'
        ],
        expectedOutcome: 'Recovery appropriately documented and shared for community benefit',
        status: 'Not Started',
        lastTested: null,
        testDuration: 30,
        automationLevel: 'Semi-Automated'
      },
      {
        stepId: 'step_008',
        stepName: 'Treatment Completion & Community Celebration',
        description: 'Complete treatment journey with community recognition and celebration',
        category: 'Completion',
        requiredComponents: ['Milestone Completion', 'LIVES Token Rewards', 'Community Recognition', 'Traditional Celebration'],
        testScenarios: [],
        ubuntuPhilosophyElements: [
          'Community celebration of healing',
          'Collective achievement recognition',
          'Shared success acknowledgment',
          'Traditional completion ceremonies'
        ],
        culturalConsiderations: [
          'Traditional completion ceremonies',
          'Community celebration customs',
          'Recognition of all contributors',
          'Cultural gratitude expressions'
        ],
        expectedOutcome: 'Treatment completed with appropriate community celebration and recognition',
        status: 'Not Started',
        lastTested: null,
        testDuration: 20,
        automationLevel: 'Manual'
      }
    ];

    const mockTestExecutions: TestExecution[] = [
      {
        executionId: 'exec_001',
        testSuite: 'Complete Patient Journey - Amara Persona',
        startTime: new Date('2024-03-15T08:00:00Z'),
        endTime: new Date('2024-03-15T12:30:00Z'),
        status: 'Completed',
        totalScenarios: 12,
        passedScenarios: 9,
        failedScenarios: 2,
        blockedScenarios: 1,
        overallScore: 75,
        culturalComplianceScore: 85,
        communityImpactScore: 78,
        performanceMetrics: {
          averageLoadTime: 2.3,
          averageResponseTime: 0.8,
          errorRate: 0.05,
          userSatisfactionScore: 4.2
        },
        keyFindings: [
          'Strong cultural integration in onboarding process',
          'Traditional healing options well-presented',
          'Community connection features highly valued',
          'Mobile experience needs optimization',
          'Language switching functionality works well'
        ],
        recommendations: [
          'Improve mobile responsive design for treatment discovery',
          'Add more traditional healing practitioner verification steps',
          'Enhance community notification system',
          'Implement offline capability for limited internet access'
        ],
        ubuntuPhilosophyAlignment: 8
      },
      {
        executionId: 'exec_002',
        testSuite: 'Cross-Cultural Testing - Multiple Personas',
        startTime: new Date('2024-03-14T09:00:00Z'),
        endTime: new Date('2024-03-14T17:45:00Z'),
        status: 'Completed',
        totalScenarios: 24,
        passedScenarios: 18,
        failedScenarios: 4,
        blockedScenarios: 2,
        overallScore: 78,
        culturalComplianceScore: 82,
        communityImpactScore: 74,
        performanceMetrics: {
          averageLoadTime: 2.1,
          averageResponseTime: 0.9,
          errorRate: 0.08,
          userSatisfactionScore: 4.0
        },
        keyFindings: [
          'Cultural adaptation varies significantly across regions',
          'Elder involvement features highly appreciated',
          'Traditional healing integration successful',
          'Community support mechanisms effective',
          'Language localization needs improvement'
        ],
        recommendations: [
          'Develop region-specific cultural adaptations',
          'Improve elder engagement workflows',
          'Add more traditional healing categories',
          'Enhance community support notification system'
        ],
        ubuntuPhilosophyAlignment: 9
      }
    ];

    const mockUserFeedback: UserFeedback[] = [
      {
        feedbackId: 'feedback_001',
        userPersonaId: 'persona_001',
        journeyStep: 'Platform Discovery & First Impression',
        rating: 5,
        feedback: 'The Ubuntu philosophy explanation made me feel like this platform truly understands our community values. The traditional healing respect was immediately apparent.',
        culturalAppropriatenessRating: 5,
        easeOfUse: 4,
        communityConnectionFeeling: 5,
        traditionalHealingRespect: 5,
        suggestions: ['Add more Kikuyu language content', 'Include more traditional symbols'],
        timestamp: new Date('2024-03-15T10:15:00Z'),
        language: 'Swahili',
        deviceUsed: 'Mobile'
      },
      {
        feedbackId: 'feedback_002',
        userPersonaId: 'persona_003',
        journeyStep: 'Health Assessment & Traditional Integration',
        rating: 4,
        feedback: 'Good integration of traditional healing practices. The platform respects our ancestral knowledge while connecting with modern medicine.',
        culturalAppropriatenessRating: 5,
        easeOfUse: 3,
        communityConnectionFeeling: 4,
        traditionalHealingRespect: 5,
        suggestions: ['Larger text for elderly users', 'Voice input option', 'More traditional healing categories'],
        timestamp: new Date('2024-03-14T14:45:00Z'),
        language: 'Ilocano',
        deviceUsed: 'Mobile'
      },
      {
        feedbackId: 'feedback_003',
        userPersonaId: 'persona_002',
        journeyStep: 'Treatment Discovery & Community Sponsorship',
        rating: 3,
        feedback: 'Community sponsorship concept is excellent, but the interface could be more intuitive. Love the collective healing approach.',
        culturalAppropriatenessRating: 4,
        easeOfUse: 3,
        communityConnectionFeeling: 5,
        traditionalHealingRespect: 4,
        suggestions: ['Simplify sponsorship matching process', 'Add community impact visualizations', 'Improve mobile layout'],
        timestamp: new Date('2024-03-13T16:20:00Z'),
        language: 'Portuguese',
        deviceUsed: 'Desktop'
      }
    ];

    setTimeout(() => {
      setJourneySteps(mockJourneySteps);
      setTestExecutions(mockTestExecutions);
      setUserPersonas(mockPersonas);
      setUserFeedback(mockUserFeedback);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRunTest = (stepId: string) => {
    setRunningTest(stepId);
    
    // Simulate test execution
    setTimeout(() => {
      setJourneySteps(steps =>
        steps.map(step =>
          step.stepId === stepId
            ? {
                ...step,
                status: Math.random() > 0.7 ? 'Failed' : 'Passed',
                lastTested: new Date()
              }
            : step
        )
      );
      setRunningTest(null);
    }, 3000);
  };

  const handleRunFullSuite = () => {
    setRunningTest('full_suite');
    
    // Simulate full test suite execution
    setTimeout(() => {
      const newExecution: TestExecution = {
        executionId: `exec_${Date.now()}`,
        testSuite: 'Complete Patient Journey - All Personas',
        startTime: new Date(),
        status: 'Running',
        totalScenarios: journeySteps.length * userPersonas.length,
        passedScenarios: 0,
        failedScenarios: 0,
        blockedScenarios: 0,
        overallScore: 0,
        culturalComplianceScore: 0,
        communityImpactScore: 0,
        performanceMetrics: {
          averageLoadTime: 0,
          averageResponseTime: 0,
          errorRate: 0,
          userSatisfactionScore: 0
        },
        keyFindings: [],
        recommendations: [],
        ubuntuPhilosophyAlignment: 0
      };

      setTestExecutions(prev => [newExecution, ...prev]);
      setRunningTest(null);
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'text-green-600 bg-green-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Running': return 'text-blue-600 bg-blue-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Not Started': return 'text-gray-600 bg-gray-100';
      case 'Blocked': return 'text-orange-600 bg-orange-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Onboarding': return 'text-blue-600 bg-blue-100';
      case 'Discovery': return 'text-purple-600 bg-purple-100';
      case 'Matching': return 'text-green-600 bg-green-100';
      case 'Treatment': return 'text-orange-600 bg-orange-100';
      case 'Recovery': return 'text-teal-600 bg-teal-100';
      case 'Community': return 'text-pink-600 bg-pink-100';
      case 'Completion': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAutomationColor = (level: string) => {
    switch (level) {
      case 'Fully Automated': return 'text-green-600 bg-green-100';
      case 'Semi-Automated': return 'text-yellow-600 bg-yellow-100';
      case 'Manual': return 'text-red-600 bg-red-100';
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
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Journey Testing Framework</h1>
            <p className="text-indigo-100 mb-2">Ubuntu Health End-to-End User Experience Validation</p>
            <p className="text-sm text-indigo-200">
              "I am because we are" - Testing every step of the healing journey with cultural sensitivity and community focus
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{journeySteps.filter(s => s.status === 'Passed').length}/{journeySteps.length}</div>
            <div className="text-indigo-100">Steps Passed</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Test Execution Controls</h3>
          <div className="flex space-x-3">
            <button
              onClick={handleRunFullSuite}
              disabled={runningTest !== null}
              className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors disabled:bg-gray-400"
            >
              {runningTest === 'full_suite' ? 'Running Full Suite...' : '🚀 Run Full Journey Test'}
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
              📊 Generate Report
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors">
              🌍 Cultural Validation
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Journey Steps</p>
              <p className="text-2xl font-bold text-gray-900">{journeySteps.length}</p>
            </div>
            <div className="text-green-500 text-2xl">🛤️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Personas</p>
              <p className="text-2xl font-bold text-gray-900">{userPersonas.length}</p>
            </div>
            <div className="text-blue-500 text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Test Executions</p>
              <p className="text-2xl font-bold text-gray-900">{testExecutions.length}</p>
            </div>
            <div className="text-purple-500 text-2xl">🧪</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{userFeedback.length}</p>
            </div>
            <div className="text-orange-500 text-2xl">💬</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'journey', label: 'Journey Steps', icon: '🛤️' },
              { key: 'executions', label: 'Test Executions', icon: '🧪' },
              { key: 'personas', label: 'User Personas', icon: '👥' },
              { key: 'feedback', label: 'User Feedback', icon: '💬' },
              { key: 'analytics', label: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
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
          {/* Journey Steps Tab */}
          {activeTab === 'journey' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Patient Journey Test Steps</h3>

              <div className="space-y-4">
                {journeySteps.map((step, index) => (
                  <div key={step.stepId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-sm font-medium">
                            Step {index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(step.category)}`}>
                            {step.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAutomationColor(step.automationLevel)}`}>
                            {step.automationLevel}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{step.stepName}</h4>
                        <p className="text-gray-700 mb-3">{step.description}</p>
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Expected Outcome:</strong> {step.expectedOutcome}
                        </div>
                        {step.lastTested && (
                          <div className="text-sm text-gray-500">
                            Last tested: {step.lastTested.toLocaleString()} • Duration: {step.testDuration} minutes
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRunTest(step.stepId)}
                          disabled={runningTest === step.stepId}
                          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors text-sm disabled:bg-gray-400"
                        >
                          {runningTest === step.stepId ? 'Testing...' : 'Run Test'}
                        </button>
                        <button
                          onClick={() => setSelectedStep(step)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm border"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Ubuntu Philosophy Elements */}
                    <div className="bg-orange-50 p-4 rounded mb-4">
                      <h5 className="font-medium text-orange-900 mb-2">Ubuntu Philosophy Elements</h5>
                      <div className="flex flex-wrap gap-2">
                        {step.ubuntuPhilosophyElements.map((element, idx) => (
                          <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Cultural Considerations */}
                    <div className="bg-purple-50 p-4 rounded mb-4">
                      <h5 className="font-medium text-purple-900 mb-2">Cultural Considerations</h5>
                      <div className="flex flex-wrap gap-2">
                        {step.culturalConsiderations.map((consideration, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                            {consideration}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Required Components */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Required Components ({step.requiredComponents.length}):</h5>
                      <div className="flex flex-wrap gap-2">
                        {step.requiredComponents.map((component, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {component}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Executions Tab */}
          {activeTab === 'executions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Test Execution History</h3>

              <div className="space-y-4">
                {testExecutions.map((execution) => (
                  <div key={execution.executionId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{execution.testSuite}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                            {execution.status}
                          </span>
                          <span>Started: {execution.startTime.toLocaleString()}</span>
                          {execution.endTime && <span>Completed: {execution.endTime.toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{execution.overallScore}%</div>
                        <div className="text-sm text-gray-500">Overall Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-sm text-green-800 mb-1">Passed</div>
                        <div className="text-2xl font-bold text-green-900">{execution.passedScenarios}</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-sm text-red-800 mb-1">Failed</div>
                        <div className="text-2xl font-bold text-red-900">{execution.failedScenarios}</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <div className="text-sm text-orange-800 mb-1">Blocked</div>
                        <div className="text-2xl font-bold text-orange-900">{execution.blockedScenarios}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-blue-800 mb-1">Total</div>
                        <div className="text-2xl font-bold text-blue-900">{execution.totalScenarios}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="text-sm text-purple-800 mb-1">Cultural Compliance</div>
                        <div className="text-xl font-bold text-purple-900">{execution.culturalComplianceScore}%</div>
                      </div>
                      <div className="bg-teal-50 p-3 rounded">
                        <div className="text-sm text-teal-800 mb-1">Community Impact</div>
                        <div className="text-xl font-bold text-teal-900">{execution.communityImpactScore}%</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <div className="text-sm text-orange-800 mb-1">Ubuntu Philosophy</div>
                        <div className="text-xl font-bold text-orange-900">{execution.ubuntuPhilosophyAlignment}/10</div>
                      </div>
                    </div>

                    {execution.keyFindings.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-2">Key Findings:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {execution.keyFindings.map((finding, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2"></span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {execution.recommendations.length > 0 && (
                      <div className="bg-yellow-50 p-4 rounded">
                        <h5 className="font-medium text-yellow-900 mb-2">Recommendations:</h5>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          {execution.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2"></span>
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Personas Tab */}
          {activeTab === 'personas' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">User Testing Personas</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userPersonas.map((persona) => (
                  <div key={persona.personaId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{persona.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {persona.age} years old • {persona.location}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {persona.culturalBackground}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                            {persona.techSavviness} Tech
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                            {persona.traditionalHealingExperience} Traditional
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Health Condition:</span>
                        <span className="ml-2 text-gray-600">{persona.healthCondition}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Languages:</span>
                        <span className="ml-2 text-gray-600">{persona.languagePreferences.join(', ')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Community Connections:</span>
                        <span className="ml-2 text-gray-600">{persona.communityConnections}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Internet Access:</span>
                        <span className="ml-2 text-gray-600">{persona.internetAccess}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Devices:</span>
                        <span className="ml-2 text-gray-600">{persona.deviceTypes.join(', ')}</span>
                      </div>
                      {persona.disabilities && (
                        <div>
                          <span className="font-medium text-gray-700">Accessibility Needs:</span>
                          <span className="ml-2 text-gray-600">{persona.disabilities.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-orange-50 rounded">
                      <p className="text-sm text-orange-800">
                        <strong>Testing Focus:</strong> This persona helps validate cultural appropriateness, 
                        accessibility, and community-centered features for {persona.culturalBackground} users.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">User Feedback & Insights</h3>

              <div className="space-y-4">
                {userFeedback.map((feedback) => (
                  <div key={feedback.feedbackId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {userPersonas.find(p => p.personaId === feedback.userPersonaId)?.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">Journey Step: {feedback.journeyStep}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">Overall Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-500">({feedback.rating}/5)</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{feedback.timestamp.toLocaleString()}</div>
                        <div>{feedback.language} • {feedback.deviceUsed}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 italic">"{feedback.feedback}"</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Cultural Appropriateness</div>
                        <div className="text-lg font-bold text-purple-600">{feedback.culturalAppropriatenessRating}/5</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Ease of Use</div>
                        <div className="text-lg font-bold text-blue-600">{feedback.easeOfUse}/5</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Community Connection</div>
                        <div className="text-lg font-bold text-green-600">{feedback.communityConnectionFeeling}/5</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Traditional Healing Respect</div>
                        <div className="text-lg font-bold text-orange-600">{feedback.traditionalHealingRespect}/5</div>
                      </div>
                    </div>

                    {feedback.suggestions.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded">
                        <h5 className="font-medium text-blue-900 mb-2">Suggestions for Improvement:</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {feedback.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 mt-2"></span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Testing Analytics & Insights</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Journey Step Success Rates */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Journey Step Success Rates</h4>
                  <div className="space-y-3">
                    {journeySteps.map((step, index) => {
                      const successRate = step.status === 'Passed' ? 100 : step.status === 'Failed' ? 0 : 50;
                      return (
                        <div key={step.stepId}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Step {index + 1}: {step.stepName}</span>
                            <span className="text-sm text-gray-600">{successRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                successRate === 100 ? 'bg-green-500' : successRate === 0 ? 'bg-red-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cultural Compliance Metrics */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Cultural Compliance Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Cultural Appropriateness:</span>
                      <span className="font-bold text-purple-600">
                        {(userFeedback.reduce((sum, f) => sum + f.culturalAppropriatenessRating, 0) / userFeedback.length).toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Traditional Healing Respect:</span>
                      <span className="font-bold text-orange-600">
                        {(userFeedback.reduce((sum, f) => sum + f.traditionalHealingRespect, 0) / userFeedback.length).toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Community Connection Feeling:</span>
                      <span className="font-bold text-green-600">
                        {(userFeedback.reduce((sum, f) => sum + f.communityConnectionFeeling, 0) / userFeedback.length).toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ubuntu Philosophy Alignment:</span>
                      <span className="font-bold text-indigo-600">
                        {(testExecutions.reduce((sum, e) => sum + e.ubuntuPhilosophyAlignment, 0) / testExecutions.length).toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Device & Accessibility Analytics */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Device & Accessibility Insights</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Most Used Device:</span>
                      <span className="font-medium ml-2">Mobile (75%)</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Accessibility Needs:</span>
                      <span className="font-medium ml-2">25% of users</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Limited Internet Access:</span>
                      <span className="font-medium ml-2">50% of users</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Multi-language Requirement:</span>
                      <span className="font-medium ml-2">100% of users</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations Summary */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Priority Recommendations</h4>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded">
                      <div className="font-medium text-red-800 mb-1">High Priority</div>
                      <p className="text-sm text-red-700">Improve mobile responsive design for treatment discovery</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded">
                      <div className="font-medium text-yellow-800 mb-1">Medium Priority</div>
                      <p className="text-sm text-yellow-700">Add more traditional healing practitioner verification steps</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="font-medium text-green-800 mb-1">Low Priority</div>
                      <p className="text-sm text-green-700">Enhance community notification system</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubuntu Philosophy Success Metrics */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
                <h4 className="font-semibold text-orange-900 mb-4">Ubuntu Philosophy Integration Success</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
                    <div className="text-sm text-orange-800">Community Connection</div>
                    <div className="text-xs text-orange-700">Users feel part of a healing community</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">88%</div>
                    <div className="text-sm text-orange-800">Cultural Respect</div>
                    <div className="text-xs text-orange-700">Traditional knowledge appropriately honored</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
                    <div className="text-sm text-orange-800">Collective Healing</div>
                    <div className="text-xs text-orange-700">"I am because we are" philosophy embraced</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientJourneyTesting;
