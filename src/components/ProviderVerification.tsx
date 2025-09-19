import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Streamlined interfaces for Ubuntu Health provider verification
interface HealthcareProvider {
  id: string;
  walletAddress: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    nationality: string;
  };
  professionalInfo: {
    medicalLicenseNumber: string;
    licenseIssuingBody: string;
    licenseExpiryDate: Date;
    specializations: string[];
    yearsOfExperience: number;
    institutionAffiliation?: string;
    institutionAddress?: string;
    currentPosition?: string;
  };
  verification: {
    status: 'pending' | 'under-review' | 'verified' | 'rejected' | 'suspended';
    submissionDate: Date;
    lastUpdated: Date;
    ubuntuHealthVerified: boolean;
    verificationLevel: 'basic' | 'standard' | 'premium';
    approvedTreatmentCategories: string[];
    maxTreatmentValue: number;
    reviewNotes?: string;
    verifiedBy?: string;
    verificationDate?: Date;
  };
  documents: VerificationDocument[];
  reputation: {
    rating: number;
    totalReviews: number;
    completedTreatments: number;
    successRate: number;
    patientSatisfaction: number;
  };
  availability: {
    isActive: boolean;
    maxActiveTreatments: number;
    currentActiveTreatments: number;
    responseTime: string; // e.g., "< 24 hours"
    languages: string[];
  };
}

interface VerificationDocument {
  id: string;
  type: 'medical_license' | 'degree_certificate' | 'specialization_certificate' | 'identification' | 'institutional_affiliation' | 'other';
  filename: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  ipfsHash?: string;
  reviewNotes?: string;
  expiryDate?: Date;
}

interface VerificationAdmin {
  adminId: string;
  name: string;
  role: 'admin' | 'senior_reviewer' | 'reviewer';
  specialization?: string[];
}

const ProviderVerification: React.FC = () => {
  const [currentProvider, setCurrentProvider] = useState<HealthcareProvider | null>(null);
  const [allProviders, setAllProviders] = useState<HealthcareProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<HealthcareProvider | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Application form state
  const [applicationData, setApplicationData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: ''
    },
    professionalInfo: {
      medicalLicenseNumber: '',
      licenseIssuingBody: '',
      licenseExpiryDate: '',
      specializations: [] as string[],
      yearsOfExperience: 0,
      institutionAffiliation: '',
      institutionAddress: '',
      currentPosition: ''
    }
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockProviders: HealthcareProvider[] = [
      {
        id: '1',
        walletAddress: '7dHbWXmci3dT1nfxKYYjQ2HYHk5J6cP7N9SJF6qGUXHS',
        personalInfo: {
          firstName: 'Dr. Maria',
          lastName: 'Silva',
          email: 'maria.silva@hospitalsaopaulo.com.br',
          phone: '+55 11 9999-9999',
          dateOfBirth: new Date('1975-05-15'),
          nationality: 'Brazilian'
        },
        professionalInfo: {
          medicalLicenseNumber: 'CRM-SP-123456',
          licenseIssuingBody: 'Conselho Regional de Medicina - São Paulo',
          licenseExpiryDate: new Date('2025-12-31'),
          specializations: ['Cardiology', 'Internal Medicine'],
          yearsOfExperience: 15,
          institutionAffiliation: 'Hospital São Paulo',
          institutionAddress: 'São Paulo, SP, Brazil',
          currentPosition: 'Senior Cardiologist'
        },
        verification: {
          status: 'verified',
          submissionDate: new Date('2023-12-01'),
          lastUpdated: new Date('2024-01-15'),
          ubuntuHealthVerified: true,
          verificationLevel: 'premium',
          approvedTreatmentCategories: ['Cardiovascular', 'General Medicine'],
          maxTreatmentValue: 50000,
          verifiedBy: 'Ubuntu Health Verification Team',
          verificationDate: new Date('2024-01-15')
        },
        documents: [
          {
            id: '1',
            type: 'medical_license',
            filename: 'CRM_License.pdf',
            uploadDate: new Date('2023-12-01'),
            status: 'approved',
            ipfsHash: 'QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU'
          },
          {
            id: '2',
            type: 'degree_certificate',
            filename: 'Medical_Degree.pdf',
            uploadDate: new Date('2023-12-01'),
            status: 'approved',
            ipfsHash: 'QmZ8Zi5UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPV'
          }
        ],
        reputation: {
          rating: 4.8,
          totalReviews: 127,
          completedTreatments: 89,
          successRate: 94.3,
          patientSatisfaction: 4.9
        },
        availability: {
          isActive: true,
          maxActiveTreatments: 10,
          currentActiveTreatments: 3,
          responseTime: '< 12 hours',
          languages: ['Portuguese', 'English', 'Spanish']
        }
      },
      {
        id: '2',
        walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        personalInfo: {
          firstName: 'Dr. Ahmed',
          lastName: 'Hassan',
          email: 'ahmed.hassan@cairohospital.eg',
          phone: '+20 2 1234-5678',
          dateOfBirth: new Date('1982-03-22'),
          nationality: 'Egyptian'
        },
        professionalInfo: {
          medicalLicenseNumber: 'EMA-12345',
          licenseIssuingBody: 'Egyptian Medical Association',
          licenseExpiryDate: new Date('2026-06-30'),
          specializations: ['Oncology', 'Hematology'],
          yearsOfExperience: 12,
          institutionAffiliation: 'Cairo University Hospital',
          institutionAddress: 'Cairo, Egypt',
          currentPosition: 'Oncology Consultant'
        },
        verification: {
          status: 'under-review',
          submissionDate: new Date('2024-01-20'),
          lastUpdated: new Date('2024-01-25'),
          ubuntuHealthVerified: false,
          verificationLevel: 'standard',
          approvedTreatmentCategories: [],
          maxTreatmentValue: 0,
          reviewNotes: 'Pending final document review'
        },
        documents: [
          {
            id: '3',
            type: 'medical_license',
            filename: 'EMA_License.pdf',
            uploadDate: new Date('2024-01-20'),
            status: 'approved',
            ipfsHash: 'QmA1Bk2UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPW'
          },
          {
            id: '4',
            type: 'specialization_certificate',
            filename: 'Oncology_Certificate.pdf',
            uploadDate: new Date('2024-01-20'),
            status: 'pending',
            ipfsHash: 'QmB2Ck3UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPX'
          }
        ],
        reputation: {
          rating: 0,
          totalReviews: 0,
          completedTreatments: 0,
          successRate: 0,
          patientSatisfaction: 0
        },
        availability: {
          isActive: false,
          maxActiveTreatments: 0,
          currentActiveTreatments: 0,
          responseTime: 'N/A',
          languages: ['Arabic', 'English']
        }
      }
    ];

    // Simulate checking if current user is an admin or provider
    const mockCurrentProvider = mockProviders[0]; // Simulate logged-in provider
    const mockIsAdmin = true; // Simulate admin access

    setTimeout(() => {
      setAllProviders(mockProviders);
      setCurrentProvider(mockCurrentProvider);
      setIsAdmin(mockIsAdmin);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter providers based on status and search
  const filteredProviders = allProviders.filter(provider => {
    if (filterStatus !== 'all' && provider.verification.status !== filterStatus) return false;
    if (searchTerm && !provider.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !provider.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !provider.professionalInfo.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const handleApplicationSubmit = () => {
    if (!applicationData.personalInfo.firstName || !applicationData.personalInfo.email || 
        !applicationData.professionalInfo.medicalLicenseNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const newProvider: HealthcareProvider = {
      id: Date.now().toString(),
      walletAddress: '...',
      personalInfo: {
        ...applicationData.personalInfo,
        dateOfBirth: new Date(applicationData.personalInfo.dateOfBirth)
      },
      professionalInfo: {
        ...applicationData.professionalInfo,
        licenseExpiryDate: new Date(applicationData.professionalInfo.licenseExpiryDate)
      },
      verification: {
        status: 'pending',
        submissionDate: new Date(),
        lastUpdated: new Date(),
        ubuntuHealthVerified: false,
        verificationLevel: 'basic',
        approvedTreatmentCategories: [],
        maxTreatmentValue: 0
      },
      documents: [],
      reputation: {
        rating: 0,
        totalReviews: 0,
        completedTreatments: 0,
        successRate: 0,
        patientSatisfaction: 0
      },
      availability: {
        isActive: false,
        maxActiveTreatments: 0,
        currentActiveTreatments: 0,
        responseTime: 'N/A',
        languages: []
      }
    };

    setAllProviders([...allProviders, newProvider]);
    setShowApplicationForm(false);
    alert('Application submitted successfully! You will be notified once the review is complete.');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationLevelColor = (level: string) => {
    switch (level) {
      case 'premium': return 'text-purple-600';
      case 'standard': return 'text-blue-600';
      case 'basic': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleVerificationAction = (providerId: string, action: 'approve' | 'reject', notes?: string) => {
    setAllProviders(providers => 
      providers.map(provider => 
        provider.id === providerId
          ? {
              ...provider,
              verification: {
                ...provider.verification,
                status: action === 'approve' ? 'verified' : 'rejected',
                lastUpdated: new Date(),
                ubuntuHealthVerified: action === 'approve',
                verificationLevel: action === 'approve' ? 'standard' : provider.verification.verificationLevel,
                approvedTreatmentCategories: action === 'approve' ? provider.professionalInfo.specializations : [],
                maxTreatmentValue: action === 'approve' ? 25000 : 0,
                reviewNotes: notes,
                verifiedBy: action === 'approve' ? 'Ubuntu Health Admin' : undefined,
                verificationDate: action === 'approve' ? new Date() : undefined
              },
              availability: {
                ...provider.availability,
                isActive: action === 'approve',
                maxActiveTreatments: action === 'approve' ? 5 : 0
              }
            }
          : provider
      )
    );
    setSelectedProvider(null);
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Healthcare Provider Verification</h1>
            <p className="text-blue-100 mb-2">Ubuntu Health Platform - Ensuring Quality Healthcare</p>
            <p className="text-sm text-blue-200">
              Streamlined verification for qualified healthcare professionals
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{allProviders.filter(p => p.verification.status === 'verified').length}</div>
            <div className="text-blue-100">Verified Providers</div>
          </div>
        </div>
      </div>

      {/* Current Provider Dashboard */}
      {currentProvider && !isAdmin && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome, {currentProvider.personalInfo.firstName} {currentProvider.personalInfo.lastName}
              </h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(currentProvider.verification.status)}`}>
                  {currentProvider.verification.status.charAt(0).toUpperCase() + currentProvider.verification.status.slice(1)}
                </span>
                {currentProvider.verification.ubuntuHealthVerified && (
                  <span className="flex items-center space-x-1 text-orange-600">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span className="text-sm font-medium">Ubuntu Health Verified</span>
                  </span>
                )}
                <span className={`text-sm font-medium ${getVerificationLevelColor(currentProvider.verification.verificationLevel)}`}>
                  {currentProvider.verification.verificationLevel.charAt(0).toUpperCase() + currentProvider.verification.verificationLevel.slice(1)} Level
                </span>
              </div>
            </div>
            {currentProvider.verification.status === 'verified' && (
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{currentProvider.reputation.rating.toFixed(1)} ⭐</div>
                <div className="text-sm text-gray-600">{currentProvider.reputation.totalReviews} reviews</div>
              </div>
            )}
          </div>

          {/* Provider Stats */}
          {currentProvider.verification.status === 'verified' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentProvider.reputation.completedTreatments}</div>
                <div className="text-sm text-green-800">Completed Treatments</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentProvider.reputation.successRate}%</div>
                <div className="text-sm text-blue-800">Success Rate</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{currentProvider.availability.currentActiveTreatments}</div>
                <div className="text-sm text-purple-800">Active Treatments</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">${currentProvider.verification.maxTreatmentValue.toLocaleString()}</div>
                <div className="text-sm text-orange-800">Max Treatment Value</div>
              </div>
            </div>
          )}

          {/* Specializations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {currentProvider.professionalInfo.specializations.map((spec, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Approved Treatment Categories */}
          {currentProvider.verification.approvedTreatmentCategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Approved Treatment Categories</h3>
              <div className="flex flex-wrap gap-2">
                {currentProvider.verification.approvedTreatmentCategories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ✓ {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Provider Management</h2>
              <div className="flex items-center space-x-4">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
                <input
                  type="text"
                  placeholder="Search providers..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Providers List */}
          <div className="divide-y divide-gray-200">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {provider.personalInfo.firstName} {provider.personalInfo.lastName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(provider.verification.status)}`}>
                        {provider.verification.status.replace('-', ' ')}
                      </span>
                      {provider.verification.ubuntuHealthVerified && (
                        <span className="inline-block w-3 h-3 bg-orange-500 rounded-full" title="Ubuntu Health Verified"></span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{provider.professionalInfo.specializations.join(', ')}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>License: {provider.professionalInfo.medicalLicenseNumber}</span>
                      <span>•</span>
                      <span>{provider.professionalInfo.yearsOfExperience} years experience</span>
                      <span>•</span>
                      <span>Submitted: {provider.verification.submissionDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {provider.verification.status === 'verified' && (
                      <div className="text-lg font-bold text-gray-900">{provider.reputation.rating.toFixed(1)} ⭐</div>
                    )}
                    <div className="text-sm text-gray-600">{provider.verification.verificationLevel} level</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Provider Application Button */}
      {!currentProvider && !isAdmin && (
        <div className="text-center">
          <button
            onClick={() => setShowApplicationForm(true)}
            className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Apply to Become a Verified Provider
          </button>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Provider Verification Application</h2>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.personalInfo.firstName}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.personalInfo.lastName}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.personalInfo.email}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.personalInfo.phone}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.personalInfo.dateOfBirth}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.personalInfo.nationality}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, nationality: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Number *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.professionalInfo.medicalLicenseNumber}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          professionalInfo: { ...prev.professionalInfo, medicalLicenseNumber: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Issuing Body *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.professionalInfo.licenseIssuingBody}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          professionalInfo: { ...prev.professionalInfo, licenseIssuingBody: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.professionalInfo.licenseExpiryDate}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          professionalInfo: { ...prev.professionalInfo, licenseExpiryDate: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.professionalInfo.yearsOfExperience}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          professionalInfo: { ...prev.professionalInfo, yearsOfExperience: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Institution Affiliation</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.professionalInfo.institutionAffiliation}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          professionalInfo: { ...prev.professionalInfo, institutionAffiliation: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={applicationData.professionalInfo.currentPosition}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          professionalInfo: { ...prev.professionalInfo, currentPosition: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">
                      Please prepare the following documents for upload:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Medical License Certificate</li>
                      <li>Medical Degree Certificate</li>
                      <li>Specialization Certificates (if applicable)</li>
                      <li>Government-issued ID</li>
                      <li>Institutional Affiliation Letter (if applicable)</li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleApplicationSubmit}
                    className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    Submit Application
                  </button>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors border font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Detail Modal (Admin View) */}
      {selectedProvider && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProvider.personalInfo.firstName} {selectedProvider.personalInfo.lastName}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedProvider.verification.status)}`}>
                      {selectedProvider.verification.status.replace('-', ' ')}
                    </span>
                    {selectedProvider.verification.ubuntuHealthVerified && (
                      <span className="flex items-center space-x-1 text-orange-600">
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                        <span className="text-sm font-medium">Ubuntu Health Verified</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {selectedProvider.personalInfo.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedProvider.personalInfo.phone}</div>
                    <div><span className="font-medium">Nationality:</span> {selectedProvider.personalInfo.nationality}</div>
                    <div><span className="font-medium">Date of Birth:</span> {selectedProvider.personalInfo.dateOfBirth.toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Professional Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">License:</span> {selectedProvider.professionalInfo.medicalLicenseNumber}</div>
                    <div><span className="font-medium">Issuing Body:</span> {selectedProvider.professionalInfo.licenseIssuingBody}</div>
                    <div><span className="font-medium">Experience:</span> {selectedProvider.professionalInfo.yearsOfExperience} years</div>
                    <div><span className="font-medium">Institution:</span> {selectedProvider.professionalInfo.institutionAffiliation}</div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.professionalInfo.specializations.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Verification Documents</h3>
                <div className="space-y-2">
                  {selectedProvider.documents.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{doc.filename}</span>
                        <span className="text-sm text-gray-500 ml-2">({doc.type.replace('_', ' ')})</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Actions */}
              {selectedProvider.verification.status === 'pending' || selectedProvider.verification.status === 'under-review' ? (
                <div className="flex space-x-4 mt-6 pt-6 border-t">
                  <button
                    onClick={() => handleVerificationAction(selectedProvider.id, 'approve', 'Application approved after thorough review')}
                    className="flex-1 bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleVerificationAction(selectedProvider.id, 'reject', 'Application rejected due to incomplete documentation')}
                    className="flex-1 bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600 transition-colors font-medium"
                  >
                    Reject Application
                  </button>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-600 text-center">
                    This application has been {selectedProvider.verification.status}.
                    {selectedProvider.verification.reviewNotes && (
                      <span className="block mt-2 italic">"{selectedProvider.verification.reviewNotes}"</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderVerification;
