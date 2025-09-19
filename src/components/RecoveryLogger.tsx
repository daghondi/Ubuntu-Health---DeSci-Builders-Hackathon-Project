import React, { useState, useEffect, useRef } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Streamlined interfaces for Ubuntu Health recovery documentation
interface RecoveryEntry {
  id: string;
  treatmentPassId: number;
  entryDate: Date;
  entryType: 'milestone' | 'symptom' | 'medication' | 'appointment' | 'progress' | 'general';
  title: string;
  description: string;
  severity?: 1 | 2 | 3 | 4 | 5; // For symptoms
  mood?: 1 | 2 | 3 | 4 | 5; // Overall mood/wellbeing
  painLevel?: 1 | 2 | 3 | 4 | 5; // Pain assessment
  attachments: RecoveryAttachment[];
  verifiedByProvider: boolean;
  ubuntuHealthVerified: boolean;
  shared: boolean; // Whether shared with sponsors/research
  tags: string[];
  location?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    oxygenSaturation?: number;
  };
}

interface RecoveryAttachment {
  id: string;
  type: 'image' | 'document' | 'video' | 'audio';
  filename: string;
  size: number;
  uploadDate: Date;
  ipfsHash?: string;
  thumbnailUrl?: string;
  description?: string;
}

interface TreatmentPlan {
  treatmentPassId: number;
  patientName: string;
  treatmentTitle: string;
  diagnosis: string;
  startDate: Date;
  estimatedEndDate: Date;
  milestones: TreatmentMilestone[];
  medications: Medication[];
  appointments: Appointment[];
  restrictions: string[];
  instructions: string[];
  emergencyContacts: EmergencyContact[];
}

interface TreatmentMilestone {
  id: number;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
  verificationRequired: boolean;
  sponsored: boolean;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  instructions: string;
  sideEffects?: string[];
}

interface Appointment {
  id: string;
  date: Date;
  type: string;
  provider: string;
  location: string;
  notes?: string;
  completed: boolean;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

const RecoveryLogger: React.FC = () => {
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [recoveryEntries, setRecoveryEntries] = useState<RecoveryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RecoveryEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New entry form state
  const [newEntryType, setNewEntryType] = useState<RecoveryEntry['entryType']>('general');
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryDescription, setNewEntryDescription] = useState('');
  const [newEntrySeverity, setNewEntrySeverity] = useState<number>(3);
  const [newEntryMood, setNewEntryMood] = useState<number>(3);
  const [newEntryPainLevel, setNewEntryPainLevel] = useState<number>(3);
  const [newEntryTags, setNewEntryTags] = useState<string>('');
  const [newEntryShared, setNewEntryShared] = useState(false);
  const [newEntryVitals, setNewEntryVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    oxygenSaturation: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockTreatmentPlan: TreatmentPlan = {
      treatmentPassId: 1,
      patientName: 'Maria Santos',
      treatmentTitle: 'Heart Surgery Recovery Program',
      diagnosis: 'Mitral Valve Replacement',
      startDate: new Date('2024-01-15'),
      estimatedEndDate: new Date('2024-04-15'),
      milestones: [
        {
          id: 1,
          title: 'Pre-operative Assessment',
          description: 'Complete all required tests and evaluations before surgery',
          targetDate: new Date('2024-01-20'),
          completed: true,
          completedDate: new Date('2024-01-18'),
          verificationRequired: true,
          sponsored: true
        },
        {
          id: 2,
          title: 'Surgery',
          description: 'Mitral valve replacement surgery',
          targetDate: new Date('2024-02-01'),
          completed: true,
          completedDate: new Date('2024-02-01'),
          verificationRequired: true,
          sponsored: true
        },
        {
          id: 3,
          title: 'Initial Recovery',
          description: 'Hospital recovery and initial healing (2-3 weeks)',
          targetDate: new Date('2024-02-22'),
          completed: false,
          verificationRequired: true,
          sponsored: false
        },
        {
          id: 4,
          title: 'Cardiac Rehabilitation',
          description: 'Complete cardiac rehabilitation program',
          targetDate: new Date('2024-04-01'),
          completed: false,
          verificationRequired: true,
          sponsored: false
        }
      ],
      medications: [
        {
          name: 'Warfarin',
          dosage: '5mg',
          frequency: 'Once daily',
          startDate: new Date('2024-02-01'),
          instructions: 'Take with food. Monitor INR levels weekly.',
          sideEffects: ['Bleeding', 'Bruising', 'Nausea']
        },
        {
          name: 'Metoprolol',
          dosage: '25mg',
          frequency: 'Twice daily',
          startDate: new Date('2024-02-01'),
          instructions: 'Take at same time each day. Do not stop suddenly.',
          sideEffects: ['Fatigue', 'Dizziness', 'Cold hands/feet']
        }
      ],
      appointments: [
        {
          id: '1',
          date: new Date('2024-02-08'),
          type: 'Follow-up',
          provider: 'Dr. Silva - Cardiology',
          location: 'Hospital São Paulo',
          completed: true,
          notes: 'Healing well, no complications'
        },
        {
          id: '2',
          date: new Date('2024-02-15'),
          type: 'INR Check',
          provider: 'Lab Services',
          location: 'Hospital São Paulo',
          completed: false
        }
      ],
      restrictions: [
        'No lifting over 10 pounds for 6 weeks',
        'No driving for 2 weeks',
        'Avoid crowds for 2 weeks to prevent infection',
        'No swimming until cleared by doctor'
      ],
      instructions: [
        'Take all medications as prescribed',
        'Monitor surgical site for signs of infection',
        'Walk daily as tolerated, gradually increasing distance',
        'Follow up with cardiology as scheduled',
        'Call immediately if experiencing chest pain, difficulty breathing, or fever'
      ],
      emergencyContacts: [
        {
          name: 'Dr. Silva',
          relationship: 'Cardiologist',
          phone: '+55 11 9999-9999',
          email: 'silva@hospitalsaopaulo.com.br'
        },
        {
          name: 'João Santos',
          relationship: 'Husband',
          phone: '+55 11 8888-8888'
        }
      ]
    };

    const mockRecoveryEntries: RecoveryEntry[] = [
      {
        id: '1',
        treatmentPassId: 1,
        entryDate: new Date('2024-02-10'),
        entryType: 'progress',
        title: 'Day 9 Post-Surgery',
        description: 'Feeling much better today. Walked around the block twice. Surgical site looks good with no redness or swelling. Pain level is manageable.',
        painLevel: 2,
        mood: 4,
        attachments: [],
        verifiedByProvider: false,
        ubuntuHealthVerified: true,
        shared: true,
        tags: ['walking', 'surgical-site', 'pain-management'],
        location: 'São Paulo, Brazil'
      },
      {
        id: '2',
        treatmentPassId: 1,
        entryDate: new Date('2024-02-08'),
        entryType: 'appointment',
        title: 'Follow-up with Dr. Silva',
        description: 'Great news! Dr. Silva says the surgery was successful and I\'m healing ahead of schedule. He\'s pleased with my progress and cleared me for light walking.',
        mood: 5,
        attachments: [],
        verifiedByProvider: true,
        ubuntuHealthVerified: true,
        shared: true,
        tags: ['follow-up', 'good-news', 'cleared-for-walking'],
        location: 'Hospital São Paulo'
      },
      {
        id: '3',
        treatmentPassId: 1,
        entryDate: new Date('2024-02-05'),
        entryType: 'symptom',
        title: 'Mild Chest Discomfort',
        description: 'Experiencing some mild chest discomfort today. Not sure if it\'s normal post-surgery pain or something to be concerned about. Will monitor closely.',
        severity: 2,
        painLevel: 3,
        mood: 3,
        attachments: [],
        verifiedByProvider: false,
        ubuntuHealthVerified: true,
        shared: false,
        tags: ['chest-pain', 'post-surgery', 'monitoring'],
        location: 'São Paulo, Brazil'
      },
      {
        id: '4',
        treatmentPassId: 1,
        entryDate: new Date('2024-02-03'),
        entryType: 'milestone',
        title: 'Discharged from Hospital',
        description: 'Today I was discharged from the hospital! Surgery went perfectly and I\'m ready to continue recovery at home. Feeling grateful for all the support.',
        mood: 5,
        attachments: [],
        verifiedByProvider: true,
        ubuntuHealthVerified: true,
        shared: true,
        tags: ['discharge', 'milestone', 'grateful', 'home-recovery'],
        location: 'Hospital São Paulo'
      }
    ];

    setTimeout(() => {
      setTreatmentPlan(mockTreatmentPlan);
      setRecoveryEntries(mockRecoveryEntries);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search entries
  const filteredEntries = recoveryEntries
    .filter(entry => {
      if (filterType !== 'all' && entry.entryType !== filterType) return false;
      if (searchTerm && !entry.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !entry.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.entryDate.getTime() - a.entryDate.getTime());

  const handleNewEntry = () => {
    if (!newEntryTitle.trim() || !newEntryDescription.trim()) return;

    const newEntry: RecoveryEntry = {
      id: Date.now().toString(),
      treatmentPassId: treatmentPlan?.treatmentPassId || 1,
      entryDate: new Date(),
      entryType: newEntryType,
      title: newEntryTitle,
      description: newEntryDescription,
      severity: ['symptom'].includes(newEntryType) ? (newEntrySeverity as 1 | 2 | 3 | 4 | 5) : undefined,
      mood: newEntryMood as 1 | 2 | 3 | 4 | 5,
      painLevel: newEntryPainLevel as 1 | 2 | 3 | 4 | 5,
      attachments: [],
      verifiedByProvider: false,
      ubuntuHealthVerified: false,
      shared: newEntryShared,
      tags: newEntryTags.split(',').map(tag => tag.trim()).filter(Boolean),
      vitalSigns: Object.entries(newEntryVitals).reduce((acc, [key, value]) => {
        if (value) {
          if (key === 'bloodPressure') acc[key] = value;
          else acc[key as keyof typeof acc] = parseFloat(value) || undefined;
        }
        return acc;
      }, {} as any)
    };

    setRecoveryEntries([newEntry, ...recoveryEntries]);
    
    // Reset form
    setNewEntryTitle('');
    setNewEntryDescription('');
    setNewEntrySeverity(3);
    setNewEntryMood(3);
    setNewEntryPainLevel(3);
    setNewEntryTags('');
    setNewEntryShared(false);
    setNewEntryVitals({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      oxygenSaturation: ''
    });
    setShowNewEntry(false);
  };

  const getEntryTypeIcon = (type: RecoveryEntry['entryType']) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'symptom': return '⚠️';
      case 'medication': return '💊';
      case 'appointment': return '📅';
      case 'progress': return '📈';
      case 'general': return '📝';
      default: return '📋';
    }
  };

  const getEntryTypeColor = (type: RecoveryEntry['entryType']) => {
    switch (type) {
      case 'milestone': return 'bg-green-100 text-green-800';
      case 'symptom': return 'bg-red-100 text-red-800';
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'appointment': return 'bg-purple-100 text-purple-800';
      case 'progress': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-orange-600';
      case 4: return 'text-red-600';
      case 5: return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1: return '😰';
      case 2: return '😟';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😄';
      default: return '😐';
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

  if (!treatmentPlan) {
    return <div>Error loading treatment plan</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recovery Journal</h1>
            <p className="text-green-100 mb-2">{treatmentPlan.treatmentTitle}</p>
            <p className="text-sm text-green-200">
              Started: {treatmentPlan.startDate.toLocaleDateString()} • 
              Est. completion: {treatmentPlan.estimatedEndDate.toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{recoveryEntries.length}</div>
            <div className="text-green-100">Journal Entries</div>
          </div>
        </div>
      </div>

      {/* Treatment Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Treatment Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {treatmentPlan.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-4 rounded-lg border-2 ${
                milestone.completed 
                  ? 'border-green-500 bg-green-50' 
                  : milestone.sponsored 
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl ${milestone.completed ? '✅' : milestone.sponsored ? '🤝' : '⏳'}`}></span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  milestone.completed 
                    ? 'bg-green-100 text-green-800' 
                    : milestone.sponsored 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {milestone.completed ? 'Completed' : milestone.sponsored ? 'Sponsored' : 'Pending'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{milestone.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
              <p className="text-xs text-gray-500">
                Target: {milestone.targetDate.toLocaleDateString()}
                {milestone.completedDate && (
                  <span className="block">Completed: {milestone.completedDate.toLocaleDateString()}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Entries */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Recovery Journey</h2>
                <button
                  onClick={() => setShowNewEntry(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  + New Entry
                </button>
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="milestone">Milestones</option>
                  <option value="symptom">Symptoms</option>
                  <option value="medication">Medications</option>
                  <option value="appointment">Appointments</option>
                  <option value="progress">Progress</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Entries List */}
            <div className="divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getEntryTypeIcon(entry.entryType)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                        <p className="text-sm text-gray-600">
                          {entry.entryDate.toLocaleDateString()} at {entry.entryDate.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {entry.ubuntuHealthVerified && (
                        <span className="inline-block w-3 h-3 bg-orange-500 rounded-full" title="Ubuntu Health Verified"></span>
                      )}
                      {entry.verifiedByProvider && (
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full" title="Provider Verified"></span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEntryTypeColor(entry.entryType)}`}>
                        {entry.entryType}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 line-clamp-2">{entry.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      {entry.mood && (
                        <span className="flex items-center space-x-1">
                          <span>Mood:</span>
                          <span>{getMoodEmoji(entry.mood)}</span>
                        </span>
                      )}
                      {entry.painLevel && (
                        <span className={`flex items-center space-x-1 ${getSeverityColor(entry.painLevel)}`}>
                          <span>Pain:</span>
                          <span>{entry.painLevel}/5</span>
                        </span>
                      )}
                      {entry.severity && (
                        <span className={`flex items-center space-x-1 ${getSeverityColor(entry.severity)}`}>
                          <span>Severity:</span>
                          <span>{entry.severity}/5</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {entry.shared && (
                        <span className="text-xs text-green-600">📤 Shared</span>
                      )}
                      {entry.tags.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {entry.tags.slice(0, 2).join(', ')}
                          {entry.tags.length > 2 && '...'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Treatment Info Sidebar */}
        <div className="space-y-6">
          {/* Current Medications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Current Medications</h3>
            <div className="space-y-3">
              {treatmentPlan.medications.map((med, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900">{med.name}</div>
                  <div className="text-sm text-gray-600">{med.dosage} - {med.frequency}</div>
                  <div className="text-xs text-gray-500">{med.instructions}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
            <div className="space-y-3">
              {treatmentPlan.appointments
                .filter(apt => !apt.completed)
                .map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-purple-500 pl-3">
                    <div className="font-medium text-gray-900">{appointment.type}</div>
                    <div className="text-sm text-gray-600">{appointment.provider}</div>
                    <div className="text-xs text-gray-500">
                      {appointment.date.toLocaleDateString()} - {appointment.location}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {treatmentPlan.emergencyContacts.map((contact, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-3">
                  <div className="font-medium text-gray-900">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.relationship}</div>
                  <div className="text-xs text-gray-500">{contact.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Entry Modal */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Recovery Entry</h2>
                <button
                  onClick={() => setShowNewEntry(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Entry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={newEntryType}
                    onChange={(e) => setNewEntryType(e.target.value as RecoveryEntry['entryType'])}
                  >
                    <option value="general">General Update</option>
                    <option value="progress">Progress Report</option>
                    <option value="symptom">Symptom</option>
                    <option value="medication">Medication</option>
                    <option value="appointment">Appointment</option>
                    <option value="milestone">Milestone</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={newEntryTitle}
                    onChange={(e) => setNewEntryTitle(e.target.value)}
                    placeholder="Brief title for this entry..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={newEntryDescription}
                    onChange={(e) => setNewEntryDescription(e.target.value)}
                    placeholder="Describe your experience, symptoms, progress, or thoughts..."
                  />
                </div>

                {/* Severity (for symptoms) */}
                {newEntryType === 'symptom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity (1 = Mild, 5 = Severe)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      className="w-full"
                      value={newEntrySeverity}
                      onChange={(e) => setNewEntrySeverity(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Mild</span>
                      <span className="font-medium">{newEntrySeverity}</span>
                      <span>Severe</span>
                    </div>
                  </div>
                )}

                {/* Mood and Pain Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood {getMoodEmoji(newEntryMood)}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      className="w-full"
                      value={newEntryMood}
                      onChange={(e) => setNewEntryMood(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pain Level (1-5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      className="w-full"
                      value={newEntryPainLevel}
                      onChange={(e) => setNewEntryPainLevel(parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vital Signs (Optional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Blood Pressure"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={newEntryVitals.bloodPressure}
                      onChange={(e) => setNewEntryVitals(prev => ({ ...prev, bloodPressure: e.target.value }))}
                    />
                    <input
                      type="number"
                      placeholder="Heart Rate"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={newEntryVitals.heartRate}
                      onChange={(e) => setNewEntryVitals(prev => ({ ...prev, heartRate: e.target.value }))}
                    />
                    <input
                      type="number"
                      placeholder="Temperature (°C)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={newEntryVitals.temperature}
                      onChange={(e) => setNewEntryVitals(prev => ({ ...prev, temperature: e.target.value }))}
                    />
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={newEntryVitals.weight}
                      onChange={(e) => setNewEntryVitals(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={newEntryTags}
                    onChange={(e) => setNewEntryTags(e.target.value)}
                    placeholder="recovery, pain, medication, progress..."
                  />
                </div>

                {/* Share Settings */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="shareEntry"
                    checked={newEntryShared}
                    onChange={(e) => setNewEntryShared(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="shareEntry" className="text-sm text-gray-700">
                    Share with sponsors and research (anonymous)
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleNewEntry}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Save Entry
                  </button>
                  <button
                    onClick={() => setShowNewEntry(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors border"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getEntryTypeIcon(selectedEntry.entryType)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEntry.title}</h2>
                    <p className="text-gray-600">
                      {selectedEntry.entryDate.toLocaleDateString()} at {selectedEntry.entryDate.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 leading-relaxed">{selectedEntry.description}</p>
                </div>

                {/* Metrics */}
                {(selectedEntry.mood || selectedEntry.painLevel || selectedEntry.severity) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Assessment</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {selectedEntry.mood && (
                        <div className="text-center">
                          <div className="text-2xl mb-1">{getMoodEmoji(selectedEntry.mood)}</div>
                          <div className="text-gray-600">Mood: {selectedEntry.mood}/5</div>
                        </div>
                      )}
                      {selectedEntry.painLevel && (
                        <div className="text-center">
                          <div className="text-2xl mb-1">🩹</div>
                          <div className={`${getSeverityColor(selectedEntry.painLevel)}`}>Pain: {selectedEntry.painLevel}/5</div>
                        </div>
                      )}
                      {selectedEntry.severity && (
                        <div className="text-center">
                          <div className="text-2xl mb-1">⚠️</div>
                          <div className={`${getSeverityColor(selectedEntry.severity)}`}>Severity: {selectedEntry.severity}/5</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vital Signs */}
                {selectedEntry.vitalSigns && Object.keys(selectedEntry.vitalSigns).length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Vital Signs</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedEntry.vitalSigns.bloodPressure && (
                        <div>Blood Pressure: {selectedEntry.vitalSigns.bloodPressure}</div>
                      )}
                      {selectedEntry.vitalSigns.heartRate && (
                        <div>Heart Rate: {selectedEntry.vitalSigns.heartRate} bpm</div>
                      )}
                      {selectedEntry.vitalSigns.temperature && (
                        <div>Temperature: {selectedEntry.vitalSigns.temperature}°C</div>
                      )}
                      {selectedEntry.vitalSigns.weight && (
                        <div>Weight: {selectedEntry.vitalSigns.weight} kg</div>
                      )}
                      {selectedEntry.vitalSigns.oxygenSaturation && (
                        <div>O2 Sat: {selectedEntry.vitalSigns.oxygenSaturation}%</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedEntry.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    {selectedEntry.verifiedByProvider && (
                      <span className="flex items-center space-x-1 text-blue-600">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        <span>Provider Verified</span>
                      </span>
                    )}
                    {selectedEntry.ubuntuHealthVerified && (
                      <span className="flex items-center space-x-1 text-orange-600">
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                        <span>Ubuntu Health Verified</span>
                      </span>
                    )}
                  </div>
                  {selectedEntry.shared && (
                    <span className="text-green-600">📤 Shared with community</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecoveryLogger;
