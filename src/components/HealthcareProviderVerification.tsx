import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Healthcare Provider Verification System for Ubuntu Health Platform
// Implements comprehensive credential validation and milestone verification

interface MedicalCredential {
  credentialId: string;
  credentialType: 'MedicalDegree' | 'Specialization' | 'BoardCertification' | 'License' | 'ContinuingEducation';
  issuingInstitution: string;
  credentialName: string;
  issueDate: Date;
  expirationDate?: Date;
  verificationStatus: 'Pending' | 'Verified' | 'Expired' | 'Revoked';
  credentialNumber: string;
  ubuntuHealthVerified: boolean;
  verificationDocuments: CredentialDocument[];
}

interface CredentialDocument {
  documentId: string;
  documentType: 'Certificate' | 'Transcript' | 'License' | 'Reference' | 'Portfolio';
  filename: string;
  ipfsHash: string;
  uploadDate: Date;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  verifiedBy?: string;
  verificationNotes?: string;
}

interface HealthcareProvider {
  providerId: string;
  wallet: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage?: string;
    languages: string[];
    bio: string;
  };
  professionalInfo: {
    medicalLicenseNumber: string;
    primarySpecialty: string;
    secondarySpecialties: string[];
    yearsOfExperience: number;
    currentInstitution: string;
    institutionAddress: string;
    professionalTitle: string;
  };
  credentials: MedicalCredential[];
  verificationHistory: VerificationRecord[];
  reputationScore: number;
  milestonesVerified: number;
  totalEarnings: number;
  ubuntuHealthStatus: 'Pending' | 'Verified' | 'Suspended' | 'Elite';
  joinedDate: Date;
  lastActiveDate: Date;
  availabilityStatus: 'Available' | 'Busy' | 'Offline' | 'Away';
  specializations: string[];
  treatmentCategories: string[];
}

interface VerificationRecord {
  recordId: string;
  treatmentPassId: number;
  milestoneId: number;
  patientId: string;
  verifiedAt: Date;
  verificationType: 'Milestone' | 'Treatment' | 'Outcome' | 'Recovery' | 'Complication';
  verificationData: {
    title: string;
    description: string;
    evidence?: string;
    additionalNotes?: string;
    cryptographicProof: string;
    blockchainTransactionId: string;
  };
  status: 'Completed' | 'Disputed' | 'Under Review';
  rewardAmount: number;
  patientFeedback?: {
    rating: number;
    comments: string;
    recommendToOthers: boolean;
  };
}

interface MilestoneVerificationRequest {
  requestId: string;
  treatmentPassId: number;
  milestoneId: number;
  patientWallet: string;
  providerId: string;
  milestoneDescription: string;
  requestedAt: Date;
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  verificationDeadline: Date;
  rewardAmount: number;
  requiredEvidence: string[];
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Declined' | 'Expired';
  patientNotes?: string;
  providerNotes?: string;
  verificationEvidence?: VerificationEvidence[];
}

interface VerificationEvidence {
  evidenceId: string;
  evidenceType: 'Medical Report' | 'Lab Results' | 'Imaging' | 'Prescription' | 'Treatment Notes' | 'Patient Photo' | 'Other';
  filename: string;
  ipfsHash: string;
  uploadedAt: Date;
  description: string;
  confidentialityLevel: 'Public' | 'Provider Only' | 'Patient Provider' | 'Encrypted';
  encryptionKey?: string;
}

const HealthcareProviderVerification: React.FC = () => {
  const [provider, setProvider] = useState<HealthcareProvider | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<MilestoneVerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'credentials' | 'verifications' | 'earnings' | 'profile'>('dashboard');
  const [selectedRequest, setSelectedRequest] = useState<MilestoneVerificationRequest | null>(null);
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  // New credential form state
  const [newCredential, setNewCredential] = useState<Partial<MedicalCredential>>({
    credentialType: 'MedicalDegree',
    verificationStatus: 'Pending',
    ubuntuHealthVerified: false,
    verificationDocuments: []
  });

  // Verification form state
  const [verificationForm, setVerificationForm] = useState({
    evidence: '',
    notes: '',
    status: 'Completed' as 'Completed' | 'Under Review',
    files: [] as File[]
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockProvider: HealthcareProvider = {
      providerId: 'prov_001',
      wallet: 'DrMaria123456789AbCdEfGhIjKlMnOpQrStUvWxYz',
      personalInfo: {
        firstName: 'Dr. Maria',
        lastName: 'Santos',
        email: 'maria.santos@hospitalsaopaulo.com.br',
        phone: '+55 11 9999-8888',
        languages: ['Portuguese', 'English', 'Spanish'],
        bio: 'Experienced cardiologist with 15 years of practice, specializing in valve replacement surgery. Committed to Ubuntu Health philosophy of community healing.'
      },
      professionalInfo: {
        medicalLicenseNumber: 'CRM-SP-123456',
        primarySpecialty: 'Cardiology',
        secondarySpecialties: ['Cardiac Surgery', 'Interventional Cardiology'],
        yearsOfExperience: 15,
        currentInstitution: 'Hospital São Paulo',
        institutionAddress: 'São Paulo, Brazil',
        professionalTitle: 'Senior Cardiologist'
      },
      credentials: [
        {
          credentialId: 'cred_001',
          credentialType: 'MedicalDegree',
          issuingInstitution: 'Universidade de São Paulo - Faculdade de Medicina',
          credentialName: 'Doctor of Medicine (MD)',
          issueDate: new Date('2008-12-15'),
          verificationStatus: 'Verified',
          credentialNumber: 'USP-MED-2008-1234',
          ubuntuHealthVerified: true,
          verificationDocuments: [
            {
              documentId: 'doc_001',
              documentType: 'Certificate',
              filename: 'MD_Certificate_MariaRSantos.pdf',
              ipfsHash: 'QmX7Y8Z9MariaCredentials...',
              uploadDate: new Date('2024-01-10'),
              verificationStatus: 'Verified',
              verifiedBy: 'Ubuntu Health Verification Team',
              verificationNotes: 'All documents authentic and verified with issuing institution'
            }
          ]
        },
        {
          credentialId: 'cred_002',
          credentialType: 'Specialization',
          issuingInstitution: 'Brazilian Society of Cardiology',
          credentialName: 'Cardiology Specialization',
          issueDate: new Date('2012-06-20'),
          verificationStatus: 'Verified',
          credentialNumber: 'SBC-CARD-2012-567',
          ubuntuHealthVerified: true,
          verificationDocuments: []
        },
        {
          credentialId: 'cred_003',
          credentialType: 'BoardCertification',
          issuingInstitution: 'Brazilian Board of Cardiac Surgery',
          credentialName: 'Board Certification in Cardiac Surgery',
          issueDate: new Date('2015-08-10'),
          expirationDate: new Date('2025-08-10'),
          verificationStatus: 'Verified',
          credentialNumber: 'BBCS-2015-789',
          ubuntuHealthVerified: true,
          verificationDocuments: []
        }
      ],
      verificationHistory: [
        {
          recordId: 'ver_001',
          treatmentPassId: 1,
          milestoneId: 1,
          patientId: 'patient_maria',
          verifiedAt: new Date('2024-01-28'),
          verificationType: 'Milestone',
          verificationData: {
            title: 'Pre-operative Assessment Completed',
            description: 'All required tests completed successfully. Patient cleared for surgery.',
            evidence: 'Blood work results, ECG, echocardiogram all within normal parameters',
            additionalNotes: 'Patient shows excellent pre-operative condition',
            cryptographicProof: 'proof_001',
            blockchainTransactionId: 'tx_001'
          },
          status: 'Completed',
          rewardAmount: 500,
          patientFeedback: {
            rating: 5,
            comments: 'Dr. Santos was thorough and compassionate. Explained everything clearly.',
            recommendToOthers: true
          }
        },
        {
          recordId: 'ver_002',
          treatmentPassId: 2,
          milestoneId: 2,
          patientId: 'patient_ahmed',
          verifiedAt: new Date('2024-01-24'),
          verificationType: 'Treatment',
          verificationData: {
            title: 'Cancer Staging Completed',
            description: 'Comprehensive staging assessment completed for lymphoma patient',
            evidence: 'CT scans, biopsy results, staging documentation',
            cryptographicProof: 'proof_002',
            blockchainTransactionId: 'tx_002'
          },
          status: 'Completed',
          rewardAmount: 750
        }
      ],
      reputationScore: 94,
      milestonesVerified: 23,
      totalEarnings: 12500,
      ubuntuHealthStatus: 'Elite',
      joinedDate: new Date('2023-11-15'),
      lastActiveDate: new Date('2024-02-10'),
      availabilityStatus: 'Available',
      specializations: ['Heart Surgery', 'Valve Replacement', 'Cardiac Rehabilitation'],
      treatmentCategories: ['Cardiovascular', 'Emergency Cardiac Care', 'Post-Surgical Care']
    };

    const mockRequests: MilestoneVerificationRequest[] = [
      {
        requestId: 'req_001',
        treatmentPassId: 3,
        milestoneId: 2,
        patientWallet: 'patient_elena_wallet',
        providerId: 'prov_001',
        milestoneDescription: 'Diabetes management equipment setup and insulin protocol establishment',
        requestedAt: new Date('2024-02-08'),
        urgencyLevel: 'Medium',
        verificationDeadline: new Date('2024-02-15'),
        rewardAmount: 400,
        requiredEvidence: ['Equipment setup photos', 'Blood glucose readings', 'Insulin administration protocol'],
        status: 'Pending',
        patientNotes: 'Need verification that glucose monitor is working correctly and insulin dosage is appropriate'
      },
      {
        requestId: 'req_002',
        treatmentPassId: 4,
        milestoneId: 1,
        patientWallet: 'patient_jose_wallet',
        providerId: 'prov_001',
        milestoneDescription: 'Post-surgical wound healing assessment',
        requestedAt: new Date('2024-02-09'),
        urgencyLevel: 'High',
        verificationDeadline: new Date('2024-02-12'),
        rewardAmount: 600,
        requiredEvidence: ['Wound photography', 'Healing assessment notes', 'Patient recovery metrics'],
        status: 'In Progress',
        patientNotes: 'Surgical site healing well, requesting confirmation for milestone completion',
        providerNotes: 'Will conduct assessment tomorrow morning'
      }
    ];

    setTimeout(() => {
      setProvider(mockProvider);
      setVerificationRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAcceptRequest = (requestId: string) => {
    setVerificationRequests(requests =>
      requests.map(req =>
        req.requestId === requestId
          ? { ...req, status: 'Accepted' }
          : req
      )
    );
  };

  const handleCompleteVerification = (requestId: string) => {
    if (!verificationForm.evidence.trim()) {
      alert('Please provide verification evidence');
      return;
    }

    setVerificationRequests(requests =>
      requests.map(req =>
        req.requestId === requestId
          ? {
              ...req,
              status: 'Completed',
              providerNotes: verificationForm.notes,
              verificationEvidence: [
                {
                  evidenceId: `evidence_${Date.now()}`,
                  evidenceType: 'Treatment Notes',
                  filename: 'verification_notes.txt',
                  ipfsHash: `QmVerification${Date.now()}`,
                  uploadedAt: new Date(),
                  description: verificationForm.evidence,
                  confidentialityLevel: 'Patient Provider'
                }
              ]
            }
          : req
      )
    );

    // Update provider stats
    if (provider) {
      setProvider({
        ...provider,
        milestonesVerified: provider.milestonesVerified + 1,
        totalEarnings: provider.totalEarnings + (selectedRequest?.rewardAmount || 0),
        reputationScore: Math.min(100, provider.reputationScore + 1)
      });
    }

    setVerificationForm({ evidence: '', notes: '', status: 'Completed', files: [] });
    setShowVerificationModal(false);
    setSelectedRequest(null);
  };

  const handleAddCredential = () => {
    if (!newCredential.credentialName || !newCredential.issuingInstitution) {
      alert('Please fill in all required fields');
      return;
    }

    const credential: MedicalCredential = {
      credentialId: `cred_${Date.now()}`,
      credentialType: newCredential.credentialType!,
      issuingInstitution: newCredential.issuingInstitution!,
      credentialName: newCredential.credentialName!,
      issueDate: newCredential.issueDate || new Date(),
      expirationDate: newCredential.expirationDate,
      verificationStatus: 'Pending',
      credentialNumber: newCredential.credentialNumber || '',
      ubuntuHealthVerified: false,
      verificationDocuments: []
    };

    if (provider) {
      setProvider({
        ...provider,
        credentials: [...provider.credentials, credential]
      });
    }

    setNewCredential({
      credentialType: 'MedicalDegree',
      verificationStatus: 'Pending',
      ubuntuHealthVerified: false,
      verificationDocuments: []
    });
    setShowCredentialForm(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Accepted': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-purple-600 bg-purple-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Declined': return 'text-red-600 bg-red-100';
      case 'Expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUbuntuStatusColor = (status: string) => {
    switch (status) {
      case 'Elite': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'Verified': return 'text-green-600 bg-green-100 border-green-300';
      case 'Pending': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Suspended': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return <div>Error loading provider data</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Healthcare Provider Dashboard</h1>
            <p className="text-blue-100 mb-2">
              {provider.personalInfo.firstName} {provider.personalInfo.lastName} - {provider.professionalInfo.professionalTitle}
            </p>
            <p className="text-sm text-blue-200">
              Ubuntu Health Philosophy: "I am because we are" - Community healing through verified care
            </p>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getUbuntuStatusColor(provider.ubuntuHealthStatus)}`}>
              {provider.ubuntuHealthStatus} Provider
            </div>
            <div className="text-2xl font-bold mt-2">{provider.reputationScore}/100</div>
            <div className="text-blue-100">Reputation Score</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Milestones Verified</p>
              <p className="text-2xl font-bold text-gray-900">{provider.milestonesVerified}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${provider.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="text-blue-500 text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900">{verificationRequests.filter(r => ['Pending', 'In Progress'].includes(r.status)).length}</p>
            </div>
            <div className="text-purple-500 text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Years Experience</p>
              <p className="text-2xl font-bold text-gray-900">{provider.professionalInfo.yearsOfExperience}</p>
            </div>
            <div className="text-orange-500 text-2xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { key: 'verifications', label: 'Verification Requests', icon: '📋' },
              { key: 'credentials', label: 'Credentials', icon: '🎓' },
              { key: 'earnings', label: 'Earnings', icon: '💰' },
              { key: 'profile', label: 'Profile', icon: '👤' }
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
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Verification Activity</h3>
                  <div className="space-y-3">
                    {provider.verificationHistory.slice(0, 3).map((record) => (
                      <div key={record.recordId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{record.verificationData.title}</h4>
                          <span className="text-sm text-green-600 font-semibold">+${record.rewardAmount}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{record.verificationData.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{record.verifiedAt.toLocaleDateString()}</span>
                          {record.patientFeedback && (
                            <span className="text-yellow-600">⭐ {record.patientFeedback.rating}/5</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Availability */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Availability & Status</h3>
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        provider.availabilityStatus === 'Available' ? 'bg-green-100 text-green-600' :
                        provider.availabilityStatus === 'Busy' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {provider.availabilityStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Active:</span>
                      <span className="text-sm">{provider.lastActiveDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ubuntu Health Member Since:</span>
                      <span className="text-sm">{provider.joinedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.specializations.map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Requests Tab */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Milestone Verification Requests</h3>
                <div className="text-sm text-gray-600">
                  {verificationRequests.filter(r => r.status === 'Pending').length} pending requests
                </div>
              </div>

              <div className="space-y-4">
                {verificationRequests.map((request) => (
                  <div key={request.requestId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Treatment Pass #{request.treatmentPassId} - Milestone {request.milestoneId}
                        </h4>
                        <p className="text-gray-600 mb-2">{request.milestoneDescription}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgencyLevel)}`}>
                            {request.urgencyLevel} Priority
                          </span>
                          <span className="text-gray-500">Deadline: {request.verificationDeadline.toLocaleDateString()}</span>
                          <span className="text-green-600 font-semibold">${request.rewardAmount} reward</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    {request.patientNotes && (
                      <div className="bg-gray-50 p-3 rounded mb-4">
                        <p className="text-sm"><strong>Patient Notes:</strong> {request.patientNotes}</p>
                      </div>
                    )}

                    {request.requiredEvidence.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Required Evidence:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {request.requiredEvidence.map((evidence, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      {request.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(request.requestId)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Accept Request
                          </button>
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors border">
                            Decline
                          </button>
                        </>
                      )}
                      {(request.status === 'Accepted' || request.status === 'In Progress') && (
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowVerificationModal(true);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                          Complete Verification
                        </button>
                      )}
                      {request.status === 'Completed' && (
                        <span className="text-green-600 font-medium">✅ Verification Complete</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credentials Tab */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Medical Credentials</h3>
                <button
                  onClick={() => setShowCredentialForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  + Add Credential
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {provider.credentials.map((credential) => (
                  <div key={credential.credentialId} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{credential.credentialName}</h4>
                        <p className="text-gray-600 text-sm">{credential.issuingInstitution}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {credential.ubuntuHealthVerified && (
                          <span className="w-4 h-4 bg-orange-500 rounded-full" title="Ubuntu Health Verified"></span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          credential.verificationStatus === 'Verified' ? 'bg-green-100 text-green-600' :
                          credential.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {credential.verificationStatus}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{credential.credentialType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issue Date:</span>
                        <span>{credential.issueDate.toLocaleDateString()}</span>
                      </div>
                      {credential.expirationDate && (
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span>{credential.expirationDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      {credential.credentialNumber && (
                        <div className="flex justify-between">
                          <span>Credential #:</span>
                          <span>{credential.credentialNumber}</span>
                        </div>
                      )}
                    </div>

                    {credential.verificationDocuments.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Documents ({credential.verificationDocuments.length})</p>
                        <div className="space-y-1">
                          {credential.verificationDocuments.map((doc) => (
                            <div key={doc.documentId} className="flex justify-between items-center text-xs">
                              <span className="truncate">{doc.filename}</span>
                              <span className={`px-1 py-0.5 rounded text-xs ${
                                doc.verificationStatus === 'Verified' ? 'bg-green-100 text-green-600' :
                                doc.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {doc.verificationStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Earnings Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Total Earnings</h4>
                  <p className="text-3xl font-bold text-green-600">${provider.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-green-700 mt-1">From {provider.milestonesVerified} verifications</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Average per Verification</h4>
                  <p className="text-3xl font-bold text-blue-600">
                    ${Math.round(provider.totalEarnings / provider.milestonesVerified).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">Competitive rate</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Ubuntu Health Bonus</h4>
                  <p className="text-3xl font-bold text-purple-600">15%</p>
                  <p className="text-sm text-purple-700 mt-1">Elite provider bonus</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Recent Earnings History</h4>
                <div className="space-y-3">
                  {provider.verificationHistory.map((record) => (
                    <div key={record.recordId} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.verificationData.title}</p>
                        <p className="text-sm text-gray-600">{record.verifiedAt.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+${record.rewardAmount}</p>
                        <p className="text-xs text-gray-500">Treatment #{record.treatmentPassId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Provider Profile</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Personal Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{provider.personalInfo.firstName} {provider.personalInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{provider.personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{provider.personalInfo.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Languages:</span>
                        <span>{provider.personalInfo.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Professional Bio</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{provider.personalInfo.bio}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Professional Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">License Number:</span>
                        <span className="font-medium">{provider.professionalInfo.medicalLicenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Primary Specialty:</span>
                        <span>{provider.professionalInfo.primarySpecialty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span>{provider.professionalInfo.yearsOfExperience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Institution:</span>
                        <span>{provider.professionalInfo.currentInstitution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span>{provider.professionalInfo.institutionAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Treatment Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.treatmentCategories.map((category, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Credential Modal */}
      {showCredentialForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Credential</h2>
                <button
                  onClick={() => setShowCredentialForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newCredential.credentialType}
                    onChange={(e) => setNewCredential({...newCredential, credentialType: e.target.value as any})}
                  >
                    <option value="MedicalDegree">Medical Degree</option>
                    <option value="Specialization">Specialization</option>
                    <option value="BoardCertification">Board Certification</option>
                    <option value="License">License</option>
                    <option value="ContinuingEducation">Continuing Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newCredential.credentialName || ''}
                    onChange={(e) => setNewCredential({...newCredential, credentialName: e.target.value})}
                    placeholder="e.g., Doctor of Medicine (MD)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Institution *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newCredential.issuingInstitution || ''}
                    onChange={(e) => setNewCredential({...newCredential, issuingInstitution: e.target.value})}
                    placeholder="e.g., University of São Paulo Medical School"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newCredential.credentialNumber || ''}
                    onChange={(e) => setNewCredential({...newCredential, credentialNumber: e.target.value})}
                    placeholder="License or certificate number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={newCredential.issueDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setNewCredential({...newCredential, issueDate: new Date(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date (Optional)</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={newCredential.expirationDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setNewCredential({...newCredential, expirationDate: e.target.value ? new Date(e.target.value) : undefined})}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleAddCredential}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Add Credential
                  </button>
                  <button
                    onClick={() => setShowCredentialForm(false)}
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

      {/* Verification Modal */}
      {showVerificationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Complete Milestone Verification</h2>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedRequest.milestoneDescription}</h3>
                  <p className="text-sm text-gray-600">Treatment Pass #{selectedRequest.treatmentPassId} - Milestone {selectedRequest.milestoneId}</p>
                  <p className="text-sm text-green-600 font-semibold mt-2">Reward: ${selectedRequest.rewardAmount}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Evidence *</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={verificationForm.evidence}
                    onChange={(e) => setVerificationForm({...verificationForm, evidence: e.target.value})}
                    placeholder="Describe the verification evidence, assessment results, or confirmation details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={verificationForm.notes}
                    onChange={(e) => setVerificationForm({...verificationForm, notes: e.target.value})}
                    placeholder="Any additional notes or recommendations for the patient..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={verificationForm.status}
                    onChange={(e) => setVerificationForm({...verificationForm, status: e.target.value as any})}
                  >
                    <option value="Completed">Completed Successfully</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleCompleteVerification(selectedRequest.requestId)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Submit Verification
                  </button>
                  <button
                    onClick={() => setShowVerificationModal(false)}
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
    </div>
  );
};

export default HealthcareProviderVerification;
