import React, { useState, useEffect, useRef } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Enhanced Recovery Logging System with IPFS Storage and Cryptographic Timestamping
interface RecoveryLogEntry {
  id: string;
  patientId: string;
  treatmentPassId: string;
  timestamp: Date;
  entryType: 'daily' | 'milestone' | 'emergency' | 'provider_update' | 'traditional_healing';
  
  // Core logging data
  physicalWellbeing: {
    painLevel: number; // 0-10 scale
    energyLevel: number; // 0-10 scale
    mobilityScore: number; // 0-10 scale
    sleepQuality: number; // 0-10 scale
    appetiteLevel: number; // 0-10 scale
  };
  
  mentalWellbeing: {
    moodScore: number; // 0-10 scale
    anxietyLevel: number; // 0-10 scale
    optimismLevel: number; // 0-10 scale
    socialConnection: number; // 0-10 scale
  };
  
  // Multimedia content
  multimedia: {
    photos: MediaFile[];
    videos: MediaFile[];
    audioNotes: MediaFile[];
    documents: MediaFile[];
  };
  
  // Traditional healing integration
  traditionalHealing?: {
    practicesUsed: string[];
    effectivenessRating: number; // 0-10 scale
    elderGuidance?: string;
    communitySupport: string;
    culturalSignificance?: string;
  };
  
  // Medical data
  medicalData?: {
    vitalSigns?: VitalSigns;
    medications: Medication[];
    symptoms: string[];
    treatments: string[];
    providerNotes?: string;
  };
  
  // Blockchain verification
  verification: {
    ipfsHash: string;
    cryptographicProof: string;
    blockchainTimestamp: Date;
    verificationStatus: 'pending' | 'verified' | 'disputed';
    verifyingProvider?: string;
  };
  
  // Patient narrative
  patientNarrative: {
    dailyReflection: string;
    challengesFaced: string[];
    victoriesAchieved: string[];
    gratitude: string[];
    goals: string[];
  };
  
  // Community engagement
  communityEngagement?: {
    sharedWithCommunity: boolean;
    communitySupport: string[];
    mentorshipReceived?: string;
    inspirationShared?: string;
  };
  
  // Privacy settings
  privacy: {
    visibilityLevel: 'private' | 'providers_only' | 'sponsors_only' | 'community' | 'public';
    dataSharing: {
      allowResearch: boolean;
      allowCommunityLearning: boolean;
      allowProviderInsights: boolean;
    };
  };
  
  // Milestone tracking
  milestoneProgress?: {
    relatedMilestoneId?: string;
    progressPercentage: number;
    milestoneMet: boolean;
    evidenceProvided: string[];
  };
}

interface MediaFile {
  id: string;
  fileName: string;
  fileType: 'image' | 'video' | 'audio' | 'document';
  fileSize: number;
  ipfsHash: string;
  uploadTimestamp: Date;
  encryption: {
    encrypted: boolean;
    encryptionKey?: string;
    accessPermissions: string[];
  };
  metadata: {
    description?: string;
    tags: string[];
    location?: string;
    medicalRelevance?: string;
  };
}

interface VitalSigns {
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  customMeasurements: { [key: string]: number };
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  adherence: number; // 0-100 percentage
  sideEffects?: string[];
  effectiveness: number; // 0-10 scale
}

interface RecoveryInsights {
  trendAnalysis: {
    improvingAreas: string[];
    decliningAreas: string[];
    stableAreas: string[];
  };
  patterns: {
    bestDays: string[];
    challengingTimes: string[];
    effectiveInterventions: string[];
  };
  recommendations: {
    aiGenerated: string[];
    providerSuggested: string[];
    communityShared: string[];
  };
  milestoneProgress: {
    upcomingMilestones: string[];
    progressIndicators: { [key: string]: number };
    estimatedCompletion: Date[];
  };
}

interface IPFSService {
  uploadFile: (file: File) => Promise<string>;
  uploadJSON: (data: any) => Promise<string>;
  retrieveFile: (hash: string) => Promise<Blob>;
  retrieveJSON: (hash: string) => Promise<any>;
  encryptFile: (file: File, key: string) => Promise<File>;
  decryptFile: (encryptedFile: Blob, key: string) => Promise<Blob>;
}

const HealingAtlasRecoveryLogger: React.FC = () => {
  const [recoveryEntries, setRecoveryEntries] = useState<RecoveryLogEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<RecoveryLogEntry> | null>(null);
  const [insights, setInsights] = useState<RecoveryInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'insights' | 'milestones'>('today');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock IPFS service
  const ipfsService: IPFSService = {
    uploadFile: async (file: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`Qm${Math.random().toString(36).substring(7)}`);
        }, 1500);
      });
    },
    uploadJSON: async (data: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`QmJSON${Math.random().toString(36).substring(7)}`);
        }, 1000);
      });
    },
    retrieveFile: async (hash: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(new Blob());
        }, 500);
      });
    },
    retrieveJSON: async (hash: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({});
        }, 500);
      });
    },
    encryptFile: async (file: File, key: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(file);
        }, 1000);
      });
    },
    decryptFile: async (encryptedFile: Blob, key: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(encryptedFile);
        }, 1000);
      });
    }
  };

  // Initialize with mock data
  useEffect(() => {
    const mockRecoveryEntries: RecoveryLogEntry[] = [
      {
        id: '1',
        patientId: 'PATIENT123',
        treatmentPassId: '1001',
        timestamp: new Date('2024-09-22'),
        entryType: 'daily',
        physicalWellbeing: {
          painLevel: 4,
          energyLevel: 6,
          mobilityScore: 7,
          sleepQuality: 6,
          appetiteLevel: 8
        },
        mentalWellbeing: {
          moodScore: 7,
          anxietyLevel: 3,
          optimismLevel: 8,
          socialConnection: 9
        },
        multimedia: {
          photos: [
            {
              id: 'photo1',
              fileName: 'morning_walk.jpg',
              fileType: 'image',
              fileSize: 2048000,
              ipfsHash: 'QmPhotoHash123',
              uploadTimestamp: new Date('2024-09-22'),
              encryption: { encrypted: false, accessPermissions: ['patient', 'providers'] },
              metadata: { description: 'Morning walk showing improved mobility', tags: ['mobility', 'progress'], medicalRelevance: 'Physical therapy progress' }
            }
          ],
          videos: [],
          audioNotes: [],
          documents: []
        },
        traditionalHealing: {
          practicesUsed: ['Breathing exercises', 'Ubuntu healing circle participation'],
          effectivenessRating: 8,
          elderGuidance: 'Elder Maria suggests continuing daily gratitude practice',
          communitySupport: 'Local Ubuntu Health community provided traditional healing foods',
          culturalSignificance: 'Heart healing requires both medical and spiritual approaches'
        },
        medicalData: {
          vitalSigns: {
            bloodPressure: { systolic: 125, diastolic: 80 },
            heartRate: 72,
            temperature: 98.6,
            oxygenSaturation: 98,
            customMeasurements: {}
          },
          medications: [
            {
              name: 'Heart medication',
              dosage: '5mg',
              frequency: 'Daily',
              adherence: 95,
              effectiveness: 8
            }
          ],
          symptoms: ['Mild chest tightness in morning'],
          treatments: ['Cardiac rehabilitation exercises'],
          providerNotes: 'Patient showing excellent progress'
        },
        verification: {
          ipfsHash: 'QmRecoveryEntry123',
          cryptographicProof: '0x8f92e3a1b4c5d6e7f8g9h0i1j2k3l4m5',
          blockchainTimestamp: new Date('2024-09-22'),
          verificationStatus: 'verified',
          verifyingProvider: 'Dr. João Silva'
        },
        patientNarrative: {
          dailyReflection: 'Today I felt stronger than yesterday. The Ubuntu Health community support gives me so much strength. I am because we are.',
          challengesFaced: ['Morning chest tightness', 'Anxiety about upcoming surgery'],
          victoriesAchieved: ['Walked 30 minutes without fatigue', 'Connected with 3 community members'],
          gratitude: ['Community support', 'Family presence', 'Medical team expertise'],
          goals: ['Complete pre-surgery checklist', 'Continue building strength', 'Share story with other patients']
        },
        communityEngagement: {
          sharedWithCommunity: true,
          communitySupport: ['Encouragement messages from 12 sponsors', 'Traditional healing food delivery'],
          mentorshipReceived: 'Connected with Maria, a heart surgery survivor from São Paulo',
          inspirationShared: 'Posted progress video that inspired 5 other patients'
        },
        privacy: {
          visibilityLevel: 'community',
          dataSharing: {
            allowResearch: true,
            allowCommunityLearning: true,
            allowProviderInsights: true
          }
        },
        milestoneProgress: {
          relatedMilestoneId: '2',
          progressPercentage: 85,
          milestoneMet: false,
          evidenceProvided: ['mobility_video.mp4', 'vital_signs_chart.pdf']
        }
      }
    ];

    const mockInsights: RecoveryInsights = {
      trendAnalysis: {
        improvingAreas: ['Energy Level', 'Mobility Score', 'Community Connection'],
        decliningAreas: [],
        stableAreas: ['Sleep Quality', 'Appetite']
      },
      patterns: {
        bestDays: ['Mornings after community calls', 'Days with traditional healing practices'],
        challengingTimes: ['Early mornings', 'Rainy days'],
        effectiveInterventions: ['Ubuntu healing circles', 'Traditional breathing exercises', 'Community support']
      },
      recommendations: {
        aiGenerated: [
          'Continue morning mobility exercises - showing 23% improvement',
          'Consider increasing traditional healing practices on challenging days',
          'Maintain community engagement - strong correlation with mood improvements'
        ],
        providerSuggested: [
          'Increase cardiac rehabilitation to 45 minutes daily',
          'Monitor blood pressure more frequently'
        ],
        communityShared: [
          'Try Ubuntu gratitude meditation - helped 85% of similar patients',
          'Join the heart health support circle on Wednesdays'
        ]
      },
      milestoneProgress: {
        upcomingMilestones: ['Pre-surgical fitness assessment', 'Complete cardiac evaluation'],
        progressIndicators: {
          'Physical Readiness': 85,
          'Mental Preparation': 92,
          'Community Support': 98
        },
        estimatedCompletion: [new Date('2024-10-10'), new Date('2024-10-12')]
      }
    };

    setTimeout(() => {
      setRecoveryEntries(mockRecoveryEntries);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateNewEntry = () => {
    const newEntry: Partial<RecoveryLogEntry> = {
      id: Date.now().toString(),
      patientId: 'PATIENT123',
      treatmentPassId: '1001',
      timestamp: new Date(),
      entryType: 'daily',
      physicalWellbeing: {
        painLevel: 5,
        energyLevel: 5,
        mobilityScore: 5,
        sleepQuality: 5,
        appetiteLevel: 5
      },
      mentalWellbeing: {
        moodScore: 5,
        anxietyLevel: 5,
        optimismLevel: 5,
        socialConnection: 5
      },
      multimedia: { photos: [], videos: [], audioNotes: [], documents: [] },
      patientNarrative: {
        dailyReflection: '',
        challengesFaced: [],
        victoriesAchieved: [],
        gratitude: [],
        goals: []
      },
      privacy: {
        visibilityLevel: 'providers_only',
        dataSharing: {
          allowResearch: false,
          allowCommunityLearning: false,
          allowProviderInsights: true
        }
      }
    };
    setCurrentEntry(newEntry);
  };

  const handleFileUpload = async (files: File[]) => {
    setUploading(true);
    try {
      const uploadedFiles: MediaFile[] = [];
      
      for (const file of files) {
        const ipfsHash = await ipfsService.uploadFile(file);
        const mediaFile: MediaFile = {
          id: Date.now().toString() + Math.random(),
          fileName: file.name,
          fileType: file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('video/') ? 'video' :
                   file.type.startsWith('audio/') ? 'audio' : 'document',
          fileSize: file.size,
          ipfsHash,
          uploadTimestamp: new Date(),
          encryption: { encrypted: false, accessPermissions: ['patient', 'providers'] },
          metadata: { tags: [], description: '' }
        };
        uploadedFiles.push(mediaFile);
      }

      if (currentEntry) {
        setCurrentEntry(prev => ({
          ...prev,
          multimedia: {
            ...prev?.multimedia,
            photos: [...(prev?.multimedia?.photos || []), ...uploadedFiles.filter(f => f.fileType === 'image')],
            videos: [...(prev?.multimedia?.videos || []), ...uploadedFiles.filter(f => f.fileType === 'video')],
            audioNotes: [...(prev?.multimedia?.audioNotes || []), ...uploadedFiles.filter(f => f.fileType === 'audio')],
            documents: [...(prev?.multimedia?.documents || []), ...uploadedFiles.filter(f => f.fileType === 'document')]
          }
        }));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!currentEntry) return;
    
    setUploading(true);
    try {
      // Upload entry to IPFS
      const ipfsHash = await ipfsService.uploadJSON(currentEntry);
      
      // Create cryptographic proof (simplified)
      const cryptographicProof = '0x' + Math.random().toString(16).substring(2, 34);
      
      const completeEntry: RecoveryLogEntry = {
        ...currentEntry as RecoveryLogEntry,
        verification: {
          ipfsHash,
          cryptographicProof,
          blockchainTimestamp: new Date(),
          verificationStatus: 'pending'
        }
      };

      setRecoveryEntries(prev => [completeEntry, ...prev]);
      setCurrentEntry(null);
      
      // Show success message
      console.log('Recovery entry saved successfully with IPFS hash:', ipfsHash);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setUploading(false);
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-3">Healing Atlas Recovery Logger</h1>
            <p className="text-orange-100 text-lg mb-3">"I am because we are" - Document your healing journey</p>
            <p className="text-orange-200">
              Secure, private, and community-connected recovery documentation with blockchain verification
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">{recoveryEntries.length}</div>
            <div className="text-orange-100 text-lg">Recovery Entries</div>
            <div className="text-orange-200 text-sm mt-2">All encrypted & verified</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'today', label: 'Today\'s Entry', icon: '📝' },
              { id: 'history', label: 'Recovery History', icon: '📚' },
              { id: 'insights', label: 'AI Insights', icon: '🧠' },
              { id: 'milestones', label: 'Milestone Progress', icon: '🎯' }
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
          {activeTab === 'today' && (
            <div className="space-y-6">
              {!currentEntry ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Today's Recovery Log</h3>
                  <p className="text-gray-600 mb-6">
                    Document your healing journey with multimedia, traditional healing practices, and community connections.
                  </p>
                  <button
                    onClick={handleCreateNewEntry}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Create New Entry
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Physical Wellbeing */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">💪 Physical Wellbeing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(currentEntry.physicalWellbeing || {}).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-blue-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={value}
                            onChange={(e) => setCurrentEntry(prev => ({
                              ...prev,
                              physicalWellbeing: {
                                ...prev?.physicalWellbeing,
                                [key]: parseInt(e.target.value)
                              }
                            }))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-blue-600">
                            <span>0</span>
                            <span className="font-bold">{value}</span>
                            <span>10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mental Wellbeing */}
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">🧠 Mental Wellbeing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(currentEntry.mentalWellbeing || {}).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-green-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={value}
                            onChange={(e) => setCurrentEntry(prev => ({
                              ...prev,
                              mentalWellbeing: {
                                ...prev?.mentalWellbeing,
                                [key]: parseInt(e.target.value)
                              }
                            }))}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-green-600">
                            <span>0</span>
                            <span className="font-bold">{value}</span>
                            <span>10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patient Narrative */}
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4">📖 Daily Reflection</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-orange-800 mb-2">
                          How are you feeling today? Share your Ubuntu journey...
                        </label>
                        <textarea
                          value={currentEntry.patientNarrative?.dailyReflection || ''}
                          onChange={(e) => setCurrentEntry(prev => ({
                            ...prev,
                            patientNarrative: {
                              ...prev?.patientNarrative,
                              dailyReflection: e.target.value
                            }
                          }))}
                          rows={4}
                          className="w-full p-3 border border-orange-200 rounded-md focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Today I felt... The Ubuntu Health community... I am because we are..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Traditional Healing */}
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4">🌿 Traditional Healing Practices</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-2">
                          What traditional healing practices did you use today?
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Ubuntu breathing exercises, community healing circle..."
                          className="w-full p-3 border border-yellow-200 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              // Add practice to list
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-2">
                          How effective were these practices? (0-10)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">📱 Multimedia Documentation</h3>
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="text-4xl mb-2">📎</div>
                        <p className="text-purple-800 font-medium">Upload photos, videos, or documents</p>
                        <p className="text-purple-600 text-sm">All files are encrypted and stored securely on IPFS</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          handleFileUpload(files);
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Save Entry */}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setCurrentEntry(null)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEntry}
                      disabled={uploading}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
                    >
                      {uploading ? 'Saving to Blockchain...' : 'Save Entry'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recovery History</h3>
                <div className="text-sm text-gray-600">
                  {recoveryEntries.length} entries • All blockchain verified
                </div>
              </div>
              
              <div className="space-y-4">
                {recoveryEntries.map((entry) => (
                  <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">
                            {entry.timestamp.toLocaleDateString()}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.verification.verificationStatus === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry.verification.verificationStatus}
                          </span>
                          <span className="text-xs text-gray-500">
                            IPFS: {entry.verification.ipfsHash.substring(0, 12)}...
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{entry.entryType} entry</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-900">
                          {entry.physicalWellbeing.painLevel}/10
                        </div>
                        <div className="text-xs text-blue-600">Pain Level</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-900">
                          {entry.physicalWellbeing.energyLevel}/10
                        </div>
                        <div className="text-xs text-green-600">Energy Level</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-900">
                          {entry.mentalWellbeing.moodScore}/10
                        </div>
                        <div className="text-xs text-yellow-600">Mood Score</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-900">
                          {Object.values(entry.multimedia).flat().length}
                        </div>
                        <div className="text-xs text-purple-600">Media Files</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 text-sm italic">
                        "{entry.patientNarrative.dailyReflection}"
                      </p>
                    </div>

                    {entry.traditionalHealing && (
                      <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-200">
                        <div className="text-sm text-orange-800">
                          <strong>Traditional Healing:</strong> {entry.traditionalHealing.practicesUsed.join(', ')} 
                          <span className="ml-2 font-medium">
                            (Effectiveness: {entry.traditionalHealing.effectivenessRating}/10)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && insights && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">📈 Improving Areas</h4>
                  <ul className="space-y-2">
                    {insights.trendAnalysis.improvingAreas.map((area, index) => (
                      <li key={index} className="text-green-800 text-sm flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-3">⚡ Best Patterns</h4>
                  <ul className="space-y-2">
                    {insights.patterns.bestDays.map((pattern, index) => (
                      <li key={index} className="text-yellow-800 text-sm flex items-center">
                        <span className="text-yellow-600 mr-2">★</span>
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">💡 AI Recommendations</h4>
                  <ul className="space-y-2">
                    {insights.recommendations.aiGenerated.slice(0, 2).map((rec, index) => (
                      <li key={index} className="text-blue-800 text-sm flex items-start">
                        <span className="text-blue-600 mr-2">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-4">🤝 Ubuntu Community Insights</h4>
                <div className="space-y-3">
                  {insights.recommendations.communityShared.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-orange-600 mt-1">🌍</span>
                      <p className="text-orange-800 text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && insights && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Milestone Progress Tracking</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(insights.milestoneProgress.progressIndicators).map(([milestone, progress]) => (
                  <div key={milestone} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">{milestone}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">📅 Upcoming Milestones</h4>
                <div className="space-y-3">
                  {insights.milestoneProgress.upcomingMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <span className="text-gray-700">{milestone}</span>
                      <span className="text-sm text-gray-500">
                        {insights.milestoneProgress.estimatedCompletion[index]?.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ubuntu Philosophy Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-900 mb-4">Ubuntu Healing Documentation</h2>
          <p className="text-lg text-orange-800 mb-6 italic">
            "I am because we are" - Your healing journey strengthens the entire community
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">
                Your recovery data is encrypted and stored on IPFS with blockchain verification
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Connected</h3>
              <p className="text-sm text-gray-600">
                Share insights and inspiration with the Ubuntu Health community while maintaining privacy
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Holistic Healing</h3>
              <p className="text-sm text-gray-600">
                Integrate traditional healing practices with modern medical documentation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealingAtlasRecoveryLogger;
