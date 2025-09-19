import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// FHIR/HL7 Integration Manager for Ubuntu Health Platform
// Enables seamless integration with Electronic Health Records while preserving Ubuntu philosophy

interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
    security?: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  identifier?: {
    use?: string;
    type?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
    system: string;
    value: string;
  }[];
  status?: string;
  category?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
}

interface UbuntuPatient extends FHIRResource {
  resourceType: 'Patient';
  name: {
    use: string;
    family: string;
    given: string[];
    prefix?: string[];
  }[];
  telecom?: {
    system: string;
    value: string;
    use?: string;
  }[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: {
    use?: string;
    type?: string;
    text?: string;
    line?: string[];
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }[];
  maritalStatus?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  contact?: {
    relationship: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    }[];
    name: {
      family: string;
      given: string[];
    };
    telecom: {
      system: string;
      value: string;
    }[];
  }[];
  communication?: {
    language: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
    preferred?: boolean;
  }[];
  // Ubuntu Health specific extensions
  extension?: {
    url: string;
    valueString?: string;
    valueBoolean?: boolean;
    valueCodeableConcept?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
  }[];
  ubuntuHealthProfile?: {
    communityMembership: boolean;
    traditionalHealingPreferences: string[];
    culturalBackground: string;
    languagePreferences: string[];
    communityElders: string[];
    healingCircleParticipation: boolean;
    collectiveCareConsent: boolean;
  };
}

interface UbuntuObservation extends FHIRResource {
  resourceType: 'Observation';
  subject: {
    reference: string;
  };
  code: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
    text?: string;
  };
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  valueString?: string;
  valueBoolean?: boolean;
  valueCodeableConcept?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  effectiveDateTime?: string;
  effectivePeriod?: {
    start?: string;
    end?: string;
  };
  performer?: {
    reference: string;
    display?: string;
  }[];
  note?: {
    text: string;
    time?: string;
    authorReference?: {
      reference: string;
    };
  }[];
  // Ubuntu Health specific observations
  traditionalHealingContext?: {
    healingMethod: string;
    elderSupervision: boolean;
    communityWitnesses: string[];
    culturalSignificance: string;
    ceremonialContext?: string;
  };
  communityWellnessIndicators?: {
    socialSupport: number; // 1-10 scale
    communityIntegration: number;
    culturalConnection: number;
    collectiveHealing: boolean;
  };
}

interface UbuntuEncounter extends FHIRResource {
  resourceType: 'Encounter';
  subject: {
    reference: string;
  };
  class: {
    system: string;
    code: string;
    display: string;
  };
  type?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
  period?: {
    start?: string;
    end?: string;
  };
  reasonCode?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
  participant?: {
    type?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    }[];
    individual?: {
      reference: string;
      display?: string;
    };
  }[];
  location?: {
    location: {
      reference: string;
      display?: string;
    };
    status?: string;
    period?: {
      start?: string;
      end?: string;
    };
  }[];
  // Ubuntu Health specific encounter data
  ubuntuHealingContext?: {
    healingCircleSession: boolean;
    elderParticipation: boolean;
    communitySupport: boolean;
    traditionalMethods: string[];
    modernMedicalIntegration: boolean;
    culturalCeremony: boolean;
    collectiveHealingGoals: string[];
  };
}

interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
  timestamp?: string;
  total?: number;
  entry?: {
    fullUrl?: string;
    resource?: FHIRResource;
    search?: {
      mode?: string;
      score?: number;
    };
    request?: {
      method: string;
      url: string;
    };
    response?: {
      status: string;
      location?: string;
      etag?: string;
    };
  }[];
}

interface EHRIntegration {
  integrationId: string;
  ehrSystemName: string;
  ehrSystemType: 'Epic' | 'Cerner' | 'Allscripts' | 'athenahealth' | 'NextGen' | 'OpenEMR' | 'Other';
  fhirVersion: 'R4' | 'R5' | 'STU3';
  baseUrl: string;
  authenticationMethod: 'OAuth2' | 'API Key' | 'Certificate' | 'Smart on FHIR';
  status: 'Active' | 'Inactive' | 'Testing' | 'Error';
  lastSync: Date;
  syncFrequency: 'Real-time' | 'Hourly' | 'Daily' | 'Weekly' | 'Manual';
  supportedResources: string[];
  ubuntuExtensionsEnabled: boolean;
  dataPrivacyLevel: 'Standard' | 'Enhanced' | 'Community Governed';
  culturalDataHandling: 'Respectful' | 'Elder Approved' | 'Community Consent';
}

interface DataMappingRule {
  ruleId: string;
  sourceSystem: string;
  sourceField: string;
  targetFHIRResource: string;
  targetFHIRElement: string;
  transformationLogic?: string;
  validationRules: string[];
  ubuntuCulturalContext?: {
    requiresElderReview: boolean;
    culturallySignificant: boolean;
    communityConsentRequired: boolean;
    traditionalEquivalent?: string;
  };
  mappingType: 'Direct' | 'Transformation' | 'Lookup' | 'Calculation' | 'Cultural Adaptation';
  active: boolean;
}

interface SyncOperation {
  operationId: string;
  ehrIntegrationId: string;
  operationType: 'Import' | 'Export' | 'Bidirectional';
  resourceTypes: string[];
  startTime: Date;
  endTime?: Date;
  status: 'Running' | 'Completed' | 'Failed' | 'Paused';
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: {
    errorId: string;
    errorType: string;
    errorMessage: string;
    resourceId?: string;
    timestamp: Date;
  }[];
  ubuntuValidation: {
    culturalReviewPassed: number;
    elderApprovalRequired: number;
    communityConsentVerified: number;
    traditionalContextPreserved: number;
  };
}

const FHIRIntegrationManager: React.FC = () => {
  const [ehrIntegrations, setEhrIntegrations] = useState<EHRIntegration[]>([]);
  const [dataMappingRules, setDataMappingRules] = useState<DataMappingRule[]>([]);
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>([]);
  const [fhirResources, setFhirResources] = useState<FHIRResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'integrations' | 'mapping' | 'sync' | 'resources' | 'ubuntu'>('integrations');
  const [selectedIntegration, setSelectedIntegration] = useState<EHRIntegration | null>(null);
  const [showNewIntegrationForm, setShowNewIntegrationForm] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<FHIRResource | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockIntegrations: EHRIntegration[] = [
      {
        integrationId: 'ehr_epic_001',
        ehrSystemName: 'Kenyatta National Hospital Epic',
        ehrSystemType: 'Epic',
        fhirVersion: 'R4',
        baseUrl: 'https://fhir.knh.go.ke/fhir/R4',
        authenticationMethod: 'Smart on FHIR',
        status: 'Active',
        lastSync: new Date('2024-03-15T10:30:00Z'),
        syncFrequency: 'Hourly',
        supportedResources: ['Patient', 'Encounter', 'Observation', 'Condition', 'Procedure', 'MedicationStatement'],
        ubuntuExtensionsEnabled: true,
        dataPrivacyLevel: 'Community Governed',
        culturalDataHandling: 'Elder Approved'
      },
      {
        integrationId: 'ehr_openmr_002',
        ehrSystemName: 'Ubuntu Community Health Centers',
        ehrSystemType: 'OpenEMR',
        fhirVersion: 'R4',
        baseUrl: 'https://fhir.ubuntuhealth.org/fhir/R4',
        authenticationMethod: 'OAuth2',
        status: 'Active',
        lastSync: new Date('2024-03-15T09:15:00Z'),
        syncFrequency: 'Real-time',
        supportedResources: ['Patient', 'Encounter', 'Observation', 'Condition', 'Procedure', 'MedicationStatement', 'CarePlan'],
        ubuntuExtensionsEnabled: true,
        dataPrivacyLevel: 'Enhanced',
        culturalDataHandling: 'Community Consent'
      },
      {
        integrationId: 'ehr_cerner_003',
        ehrSystemName: 'Hospital São Paulo - Cerner',
        ehrSystemType: 'Cerner',
        fhirVersion: 'R4',
        baseUrl: 'https://fhir.hsp.br/fhir/R4',
        authenticationMethod: 'Certificate',
        status: 'Testing',
        lastSync: new Date('2024-03-14T16:45:00Z'),
        syncFrequency: 'Daily',
        supportedResources: ['Patient', 'Encounter', 'Observation', 'Condition'],
        ubuntuExtensionsEnabled: false,
        dataPrivacyLevel: 'Standard',
        culturalDataHandling: 'Respectful'
      }
    ];

    const mockMappingRules: DataMappingRule[] = [
      {
        ruleId: 'mapping_001',
        sourceSystem: 'Epic',
        sourceField: 'patient.demographics.tribal_affiliation',
        targetFHIRResource: 'Patient',
        targetFHIRElement: 'extension[ubuntu-cultural-background]',
        transformationLogic: 'Map tribal affiliation to Ubuntu cultural background extension',
        validationRules: ['Required for community members', 'Must be verified by Elder Council'],
        ubuntuCulturalContext: {
          requiresElderReview: true,
          culturallySignificant: true,
          communityConsentRequired: true,
          traditionalEquivalent: 'Ancestral lineage'
        },
        mappingType: 'Cultural Adaptation',
        active: true
      },
      {
        ruleId: 'mapping_002',
        sourceSystem: 'OpenEMR',
        sourceField: 'encounter.healing_circle_session',
        targetFHIRResource: 'Encounter',
        targetFHIRElement: 'extension[ubuntu-healing-context].healingCircleSession',
        transformationLogic: 'Direct boolean mapping for healing circle participation',
        validationRules: ['Must include Elder participant reference', 'Community consent verified'],
        ubuntuCulturalContext: {
          requiresElderReview: true,
          culturallySignificant: true,
          communityConsentRequired: true,
          traditionalEquivalent: 'Collective healing ceremony'
        },
        mappingType: 'Direct',
        active: true
      },
      {
        ruleId: 'mapping_003',
        sourceSystem: 'Cerner',
        sourceField: 'observation.traditional_medicine_usage',
        targetFHIRResource: 'Observation',
        targetFHIRElement: 'extension[traditional-healing-context]',
        transformationLogic: 'Transform traditional medicine usage to FHIR observation with cultural context',
        validationRules: ['Validate against known traditional medicines', 'Elder supervision documented'],
        ubuntuCulturalContext: {
          requiresElderReview: true,
          culturallySignificant: true,
          communityConsentRequired: false,
          traditionalEquivalent: 'Indigenous healing practice'
        },
        mappingType: 'Transformation',
        active: true
      }
    ];

    const mockSyncOperations: SyncOperation[] = [
      {
        operationId: 'sync_001',
        ehrIntegrationId: 'ehr_epic_001',
        operationType: 'Import',
        resourceTypes: ['Patient', 'Encounter', 'Observation'],
        startTime: new Date('2024-03-15T10:00:00Z'),
        endTime: new Date('2024-03-15T10:25:00Z'),
        status: 'Completed',
        recordsProcessed: 1247,
        recordsSuccessful: 1189,
        recordsFailed: 58,
        errors: [
          {
            errorId: 'err_001',
            errorType: 'Cultural Validation',
            errorMessage: 'Traditional healing context missing Elder approval',
            resourceId: 'Patient/12345',
            timestamp: new Date('2024-03-15T10:15:00Z')
          },
          {
            errorId: 'err_002',
            errorType: 'Data Privacy',
            errorMessage: 'Community consent not verified for cultural data',
            resourceId: 'Observation/67890',
            timestamp: new Date('2024-03-15T10:18:00Z')
          }
        ],
        ubuntuValidation: {
          culturalReviewPassed: 892,
          elderApprovalRequired: 156,
          communityConsentVerified: 1034,
          traditionalContextPreserved: 678
        }
      },
      {
        operationId: 'sync_002',
        ehrIntegrationId: 'ehr_openmr_002',
        operationType: 'Bidirectional',
        resourceTypes: ['Patient', 'Encounter', 'Observation', 'CarePlan'],
        startTime: new Date('2024-03-15T09:00:00Z'),
        status: 'Running',
        recordsProcessed: 423,
        recordsSuccessful: 401,
        recordsFailed: 22,
        errors: [],
        ubuntuValidation: {
          culturalReviewPassed: 387,
          elderApprovalRequired: 45,
          communityConsentVerified: 423,
          traditionalContextPreserved: 234
        }
      }
    ];

    const mockFhirResources: FHIRResource[] = [
      {
        resourceType: 'Patient',
        id: 'ubuntu-patient-001',
        meta: {
          versionId: '1',
          lastUpdated: '2024-03-15T10:30:00Z',
          profile: ['http://hl7.org/fhir/StructureDefinition/Patient', 'https://ubuntuhealth.org/fhir/StructureDefinition/UbuntuPatient'],
          security: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality',
              code: 'R',
              display: 'Restricted'
            }
          ]
        },
        identifier: [
          {
            use: 'usual',
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MR',
                  display: 'Medical Record Number'
                }
              ]
            },
            system: 'https://ubuntuhealth.org/patient-id',
            value: 'UH-2024-001'
          }
        ],
        status: 'active'
      },
      {
        resourceType: 'Observation',
        id: 'ubuntu-obs-001',
        meta: {
          lastUpdated: '2024-03-15T11:00:00Z',
          profile: ['https://ubuntuhealth.org/fhir/StructureDefinition/UbuntuObservation']
        },
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'social-history',
                display: 'Social History'
              }
            ]
          }
        ]
      }
    ];

    setTimeout(() => {
      setEhrIntegrations(mockIntegrations);
      setDataMappingRules(mockMappingRules);
      setSyncOperations(mockSyncOperations);
      setFhirResources(mockFhirResources);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStartSync = (integrationId: string) => {
    const newSyncOperation: SyncOperation = {
      operationId: `sync_${Date.now()}`,
      ehrIntegrationId: integrationId,
      operationType: 'Import',
      resourceTypes: ['Patient', 'Encounter', 'Observation'],
      startTime: new Date(),
      status: 'Running',
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: [],
      ubuntuValidation: {
        culturalReviewPassed: 0,
        elderApprovalRequired: 0,
        communityConsentVerified: 0,
        traditionalContextPreserved: 0
      }
    };

    setSyncOperations(prev => [newSyncOperation, ...prev]);
  };

  const handleToggleIntegration = (integrationId: string) => {
    setEhrIntegrations(integrations =>
      integrations.map(integration =>
        integration.integrationId === integrationId
          ? {
              ...integration,
              status: integration.status === 'Active' ? 'Inactive' : 'Active'
            }
          : integration
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Running': return 'text-blue-600 bg-blue-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Testing': return 'text-yellow-600 bg-yellow-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      case 'Error': return 'text-red-600 bg-red-100';
      case 'Paused': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'Community Governed': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'Enhanced': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'Standard': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getCulturalHandlingColor = (handling: string) => {
    switch (handling) {
      case 'Elder Approved': return 'text-orange-600 bg-orange-100';
      case 'Community Consent': return 'text-purple-600 bg-purple-100';
      case 'Respectful': return 'text-blue-600 bg-blue-100';
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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">FHIR/HL7 Integration Manager</h1>
            <p className="text-blue-100 mb-2">Ubuntu Health Healthcare Interoperability Platform</p>
            <p className="text-sm text-blue-200">
              "I am because we are" - Connecting healthcare systems while preserving cultural knowledge and community values
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{ehrIntegrations.filter(i => i.status === 'Active').length}</div>
            <div className="text-blue-100">Active Integrations</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">EHR Systems</p>
              <p className="text-2xl font-bold text-gray-900">{ehrIntegrations.length}</p>
            </div>
            <div className="text-green-500 text-2xl">🏥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">FHIR Resources</p>
              <p className="text-2xl font-bold text-gray-900">{fhirResources.length}</p>
            </div>
            <div className="text-blue-500 text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Mappings</p>
              <p className="text-2xl font-bold text-gray-900">{dataMappingRules.filter(r => r.active).length}</p>
            </div>
            <div className="text-purple-500 text-2xl">🔄</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cultural Validations</p>
              <p className="text-2xl font-bold text-gray-900">
                {syncOperations.reduce((sum, op) => sum + op.ubuntuValidation.culturalReviewPassed, 0)}
              </p>
            </div>
            <div className="text-orange-500 text-2xl">🌍</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'integrations', label: 'EHR Integrations', icon: '🏥' },
              { key: 'mapping', label: 'Data Mapping', icon: '🔄' },
              { key: 'sync', label: 'Sync Operations', icon: '⚡' },
              { key: 'resources', label: 'FHIR Resources', icon: '📋' },
              { key: 'ubuntu', label: 'Ubuntu Extensions', icon: '🌍' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
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
          {/* EHR Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Healthcare System Integrations</h3>
                <button
                  onClick={() => setShowNewIntegrationForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  + Add Integration
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ehrIntegrations.map((integration) => (
                  <div key={integration.integrationId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{integration.ehrSystemName}</h4>
                        <p className="text-sm text-gray-600 mb-2">{integration.ehrSystemType} • FHIR {integration.fhirVersion}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {integration.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrivacyLevelColor(integration.dataPrivacyLevel)}`}>
                            {integration.dataPrivacyLevel}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Last Sync: {integration.lastSync.toLocaleString()}</div>
                          <div>Frequency: {integration.syncFrequency}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleIntegration(integration.integrationId)}
                          className={`px-3 py-1 rounded text-sm ${
                            integration.status === 'Active'
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {integration.status === 'Active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded mb-4">
                      <h5 className="font-medium text-orange-900 mb-2">Ubuntu Cultural Integration</h5>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Cultural Data Handling:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getCulturalHandlingColor(integration.culturalDataHandling)}`}>
                          {integration.culturalDataHandling}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Ubuntu Extensions:</span>
                        <span className={`${integration.ubuntuExtensionsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                          {integration.ubuntuExtensionsEnabled ? '✓ Enabled' : '✗ Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Supported Resources ({integration.supportedResources.length}):</h5>
                      <div className="flex flex-wrap gap-1">
                        {integration.supportedResources.slice(0, 6).map((resource, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {resource}
                          </span>
                        ))}
                        {integration.supportedResources.length > 6 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{integration.supportedResources.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleStartSync(integration.integrationId)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
                        disabled={integration.status !== 'Active'}
                      >
                        Start Sync
                      </button>
                      <button
                        onClick={() => setSelectedIntegration(integration)}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm border"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Mapping Tab */}
          {activeTab === 'mapping' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Data Mapping Rules</h3>
                <button
                  onClick={() => setShowMappingModal(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
                >
                  + Add Mapping Rule
                </button>
              </div>

              <div className="space-y-4">
                {dataMappingRules.map((rule) => (
                  <div key={rule.ruleId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {rule.sourceSystem} → FHIR {rule.targetFHIRResource}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Source Field:</span>
                            <span className="font-mono ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                              {rule.sourceField}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Target Element:</span>
                            <span className="font-mono ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                              {rule.targetFHIRElement}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{rule.transformationLogic}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.mappingType === 'Cultural Adaptation' ? 'bg-orange-100 text-orange-600' :
                          rule.mappingType === 'Transformation' ? 'bg-purple-100 text-purple-600' :
                          rule.mappingType === 'Direct' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {rule.mappingType}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {rule.ubuntuCulturalContext && (
                      <div className="bg-orange-50 p-4 rounded mb-4">
                        <h5 className="font-medium text-orange-900 mb-2">Ubuntu Cultural Context</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Elder Review:</span>
                            <span className={`ml-2 ${rule.ubuntuCulturalContext.requiresElderReview ? 'text-green-600' : 'text-gray-500'}`}>
                              {rule.ubuntuCulturalContext.requiresElderReview ? '✓ Required' : '✗ Not Required'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Culturally Significant:</span>
                            <span className={`ml-2 ${rule.ubuntuCulturalContext.culturallySignificant ? 'text-green-600' : 'text-gray-500'}`}>
                              {rule.ubuntuCulturalContext.culturallySignificant ? '✓ Yes' : '✗ No'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Community Consent:</span>
                            <span className={`ml-2 ${rule.ubuntuCulturalContext.communityConsentRequired ? 'text-green-600' : 'text-gray-500'}`}>
                              {rule.ubuntuCulturalContext.communityConsentRequired ? '✓ Required' : '✗ Not Required'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Traditional Equivalent:</span>
                            <span className="ml-2 text-orange-600 font-medium">
                              {rule.ubuntuCulturalContext.traditionalEquivalent || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Validation Rules:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {rule.validationRules.map((validation, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {validation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync Operations Tab */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Data Synchronization Operations</h3>

              <div className="space-y-4">
                {syncOperations.map((operation) => (
                  <div key={operation.operationId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Sync Operation #{operation.operationId}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {ehrIntegrations.find(i => i.integrationId === operation.ehrIntegrationId)?.ehrSystemName}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                            {operation.status}
                          </span>
                          <span className="text-gray-600">Type: {operation.operationType}</span>
                          <span className="text-gray-600">Started: {operation.startTime.toLocaleString()}</span>
                          {operation.endTime && (
                            <span className="text-gray-600">Completed: {operation.endTime.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-blue-800 mb-1">Records Processed</div>
                        <div className="text-2xl font-bold text-blue-900">{operation.recordsProcessed}</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-sm text-green-800 mb-1">Successful</div>
                        <div className="text-2xl font-bold text-green-900">{operation.recordsSuccessful}</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-sm text-red-800 mb-1">Failed</div>
                        <div className="text-2xl font-bold text-red-900">{operation.recordsFailed}</div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded mb-4">
                      <h5 className="font-medium text-orange-900 mb-2">Ubuntu Cultural Validation</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Cultural Review Passed:</span>
                          <span className="font-bold ml-2 text-green-600">{operation.ubuntuValidation.culturalReviewPassed}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Elder Approval Required:</span>
                          <span className="font-bold ml-2 text-orange-600">{operation.ubuntuValidation.elderApprovalRequired}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Community Consent Verified:</span>
                          <span className="font-bold ml-2 text-purple-600">{operation.ubuntuValidation.communityConsentVerified}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Traditional Context Preserved:</span>
                          <span className="font-bold ml-2 text-blue-600">{operation.ubuntuValidation.traditionalContextPreserved}</span>
                        </div>
                      </div>
                    </div>

                    {operation.errors.length > 0 && (
                      <div className="bg-red-50 p-4 rounded">
                        <h5 className="font-medium text-red-900 mb-2">Sync Errors ({operation.errors.length})</h5>
                        <div className="space-y-2">
                          {operation.errors.slice(0, 3).map((error) => (
                            <div key={error.errorId} className="text-sm">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-red-800">{error.errorType}</span>
                                <span className="text-xs text-red-600">{error.timestamp.toLocaleString()}</span>
                              </div>
                              <p className="text-red-700">{error.errorMessage}</p>
                              {error.resourceId && (
                                <p className="text-xs text-red-600">Resource: {error.resourceId}</p>
                              )}
                            </div>
                          ))}
                          {operation.errors.length > 3 && (
                            <p className="text-sm text-red-600">... and {operation.errors.length - 3} more errors</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FHIR Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">FHIR Resources</h3>

              <div className="space-y-4">
                {fhirResources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {resource.resourceType}/{resource.id}
                        </h4>
                        {resource.meta && (
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Version: {resource.meta.versionId}</div>
                            <div>Last Updated: {resource.meta.lastUpdated}</div>
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status || 'active')}`}>
                        {resource.status || 'active'}
                      </span>
                    </div>

                    {resource.meta?.profile && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-2">Profiles:</h5>
                        <div className="space-y-1">
                          {resource.meta.profile.map((profile, index) => (
                            <div key={index} className="text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                profile.includes('ubuntu') ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {profile.split('/').pop()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resource.meta?.security && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-2">Security Labels:</h5>
                        <div className="flex flex-wrap gap-2">
                          {resource.meta.security.map((security, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                              {security.display}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedResource(resource)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm border">
                        Export
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ubuntu Extensions Tab */}
          {activeTab === 'ubuntu' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Ubuntu Health FHIR Extensions</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cultural Extensions */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Cultural & Traditional Healing Extensions</h4>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-3 rounded">
                      <h5 className="font-medium text-orange-900 mb-2">ubuntu-cultural-background</h5>
                      <p className="text-sm text-orange-800 mb-2">
                        Captures patient's cultural background and tribal affiliation with Elder Council approval.
                      </p>
                      <div className="text-xs text-orange-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/ubuntu-cultural-background
                      </div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded">
                      <h5 className="font-medium text-orange-900 mb-2">traditional-healing-context</h5>
                      <p className="text-sm text-orange-800 mb-2">
                        Documents traditional healing practices, methods, and ceremonial context.
                      </p>
                      <div className="text-xs text-orange-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/traditional-healing-context
                      </div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded">
                      <h5 className="font-medium text-orange-900 mb-2">community-wellness-indicators</h5>
                      <p className="text-sm text-orange-800 mb-2">
                        Measures social support, community integration, and collective healing participation.
                      </p>
                      <div className="text-xs text-orange-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/community-wellness-indicators
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community Extensions */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Community & Governance Extensions</h4>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-3 rounded">
                      <h5 className="font-medium text-purple-900 mb-2">ubuntu-healing-context</h5>
                      <p className="text-sm text-purple-800 mb-2">
                        Tracks healing circle sessions, Elder participation, and community support mechanisms.
                      </p>
                      <div className="text-xs text-purple-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/ubuntu-healing-context
                      </div>
                    </div>

                    <div className="bg-purple-50 p-3 rounded">
                      <h5 className="font-medium text-purple-900 mb-2">community-consent</h5>
                      <p className="text-sm text-purple-800 mb-2">
                        Captures community-level consent for data sharing and research participation.
                      </p>
                      <div className="text-xs text-purple-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/community-consent
                      </div>
                    </div>

                    <div className="bg-purple-50 p-3 rounded">
                      <h5 className="font-medium text-purple-900 mb-2">elder-approval</h5>
                      <p className="text-sm text-purple-800 mb-2">
                        Documents Elder Council review and approval for culturally significant healthcare decisions.
                      </p>
                      <div className="text-xs text-purple-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/elder-approval
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy Extensions */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Privacy & Security Extensions</h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <h5 className="font-medium text-blue-900 mb-2">privacy-level</h5>
                      <p className="text-sm text-blue-800 mb-2">
                        Specifies data privacy requirements: Standard, Enhanced, or Community Governed.
                      </p>
                      <div className="text-xs text-blue-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/privacy-level
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <h5 className="font-medium text-blue-900 mb-2">blockchain-proof</h5>
                      <p className="text-sm text-blue-800 mb-2">
                        Links FHIR resources to blockchain proofs for integrity verification.
                      </p>
                      <div className="text-xs text-blue-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/blockchain-proof
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <h5 className="font-medium text-blue-900 mb-2">community-compensation</h5>
                      <p className="text-sm text-blue-800 mb-2">
                        Tracks LIVES token compensation for community data contribution.
                      </p>
                      <div className="text-xs text-blue-700">
                        <strong>URL:</strong> https://ubuntuhealth.org/fhir/StructureDefinition/community-compensation
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integration Stats */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Extension Usage Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cultural Background Extensions:</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Traditional Healing Contexts:</span>
                      <span className="font-semibold">892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Community Consents:</span>
                      <span className="font-semibold">2,156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Elder Approvals:</span>
                      <span className="font-semibold">456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Blockchain Proofs:</span>
                      <span className="font-semibold">3,401</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded">
                    <p className="text-sm text-green-800">
                      <strong>Ubuntu Philosophy Integration:</strong> All extensions are designed to preserve 
                      cultural knowledge while enabling modern healthcare interoperability.
                    </p>
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

export default FHIRIntegrationManager;
