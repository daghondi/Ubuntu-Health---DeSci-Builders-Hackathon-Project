import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Streamlined interfaces for Ubuntu Health patient onboarding
interface Patient {
  walletAddress: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  medicalInfo: {
    bloodType?: string;
    allergies: string[];
    chronicConditions: string[];
    currentMedications: string[];
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
    };
  };
  preferences: {
    preferredLanguage: string;
    communicationMethod: 'email' | 'sms' | 'both';
    shareDataForResearch: boolean;
    ubuntuHealthMember: boolean;
  };
}

interface TreatmentRequest {
  id: string;
  patientId: string;
  basicInfo: {
    title: string;
    category: string;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    estimatedCost: number;
    estimatedDuration: number; // in days
  };
  medicalDetails: {
    symptoms: string[];
    diagnosis?: string;
    recommendedTreatment: string;
    requiredSpecialist?: string;
    additionalTests?: string[];
  };
  milestones: TreatmentMilestone[];
  documents: TreatmentDocument[];
  sponsorshipInfo: {
    fundingNeeded: number;
    selfFunding: number;
    sponsorshipRequired: number;
    allowPartialSponsorship: boolean;
    sponsorshipMessage?: string;
  };
  submissionDate: Date;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'active' | 'completed';
}

interface TreatmentMilestone {
  id: number;
  title: string;
  description: string;
  estimatedCost: number;
  estimatedDuration: number;
  requirements: string[];
  verificationRequired: boolean;
}

interface TreatmentDocument {
  id: string;
  type: 'medical_record' | 'prescription' | 'test_result' | 'insurance' | 'identification' | 'other';
  filename: string;
  uploadDate: Date;
  required: boolean;
  ipfsHash?: string;
}

const PatientOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patient, setPatient] = useState<Partial<Patient>>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: new Date(),
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    medicalInfo: {
      allergies: [],
      chronicConditions: [],
      currentMedications: []
    },
    preferences: {
      preferredLanguage: 'English',
      communicationMethod: 'email',
      shareDataForResearch: false,
      ubuntuHealthMember: false
    }
  });

  const [treatmentRequest, setTreatmentRequest] = useState<Partial<TreatmentRequest>>({
    basicInfo: {
      title: '',
      category: '',
      description: '',
      urgency: 'medium',
      estimatedCost: 0,
      estimatedDuration: 0
    },
    medicalDetails: {
      symptoms: [],
      recommendedTreatment: '',
      additionalTests: []
    },
    milestones: [],
    documents: [],
    sponsorshipInfo: {
      fundingNeeded: 0,
      selfFunding: 0,
      sponsorshipRequired: 0,
      allowPartialSponsorship: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [allergiesInput, setAllergiesInput] = useState('');
  const [conditionsInput, setConditionsInput] = useState('');
  const [medicationsInput, setMedicationsInput] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');

  const steps = [
    { number: 1, title: 'Personal Information', description: 'Basic contact and personal details' },
    { number: 2, title: 'Medical History', description: 'Medical background and health information' },
    { number: 3, title: 'Treatment Request', description: 'Details about needed treatment' },
    { number: 4, title: 'Treatment Plan', description: 'Milestones and timeline setup' },
    { number: 5, title: 'Funding & Sponsorship', description: 'Payment and sponsorship preferences' },
    { number: 6, title: 'Review & Submit', description: 'Final review and submission' }
  ];

  const treatmentCategories = [
    'Cardiovascular',
    'Oncology',
    'Orthopedics',
    'Diabetes Management',
    'Mental Health',
    'Pediatrics',
    'General Medicine',
    'Emergency Care',
    'Chronic Disease Management',
    'Rehabilitation',
    'Other'
  ];

  const handlePersonalInfoUpdate = (field: string, value: any) => {
    setPatient(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        [field]: value
      }
    }));
  };

  const handleEmergencyContactUpdate = (field: string, value: string) => {
    setPatient(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        emergencyContact: {
          ...prev.personalInfo!.emergencyContact,
          [field]: value
        }
      }
    }));
  };

  const handleMedicalInfoUpdate = (field: string, value: any) => {
    setPatient(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo!,
        [field]: value
      }
    }));
  };

  const handleTreatmentBasicInfoUpdate = (field: string, value: any) => {
    setTreatmentRequest(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo!,
        [field]: value
      }
    }));
  };

  const handleTreatmentMedicalUpdate = (field: string, value: any) => {
    setTreatmentRequest(prev => ({
      ...prev,
      medicalDetails: {
        ...prev.medicalDetails!,
        [field]: value
      }
    }));
  };

  const addMilestone = () => {
    const newMilestone: TreatmentMilestone = {
      id: (treatmentRequest.milestones?.length || 0) + 1,
      title: '',
      description: '',
      estimatedCost: 0,
      estimatedDuration: 0,
      requirements: [],
      verificationRequired: true
    };

    setTreatmentRequest(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMilestone]
    }));
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    setTreatmentRequest(prev => ({
      ...prev,
      milestones: prev.milestones?.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const removeMilestone = (index: number) => {
    setTreatmentRequest(prev => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index)
    }));
  };

  const calculateTotalCost = () => {
    return treatmentRequest.milestones?.reduce((total, milestone) => total + milestone.estimatedCost, 0) || 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      alert('Treatment request submitted successfully! You will be notified once it\'s reviewed and approved.');
      // Reset form or redirect
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return patient.personalInfo?.firstName && 
               patient.personalInfo?.lastName && 
               patient.personalInfo?.email;
      case 2:
        return true; // Medical info is optional
      case 3:
        return treatmentRequest.basicInfo?.title && 
               treatmentRequest.basicInfo?.category && 
               treatmentRequest.basicInfo?.description;
      case 4:
        return treatmentRequest.milestones && treatmentRequest.milestones.length > 0;
      case 5:
        return true; // Funding info auto-calculated
      default:
        return true;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Treatment Request</h1>
        <p className="text-teal-100">Ubuntu Health Platform - Community-Centered Healthcare</p>
        <p className="text-sm text-teal-200 mt-2">
          Connect with verified providers and community sponsors for your healthcare needs
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-teal-500 border-teal-500 text-white' 
                  : currentStep === step.number 
                    ? 'border-teal-500 text-teal-500' 
                    : 'border-gray-300 text-gray-300'
              }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 w-16 mx-2 ${
                  currentStep > step.number ? 'bg-teal-500' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep - 1].title}</h2>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={patient.personalInfo?.firstName || ''}
                  onChange={(e) => handlePersonalInfoUpdate('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={patient.personalInfo?.lastName || ''}
                  onChange={(e) => handlePersonalInfoUpdate('lastName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={patient.personalInfo?.email || ''}
                  onChange={(e) => handlePersonalInfoUpdate('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={patient.personalInfo?.phone || ''}
                  onChange={(e) => handlePersonalInfoUpdate('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={patient.personalInfo?.dateOfBirth?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handlePersonalInfoUpdate('dateOfBirth', new Date(e.target.value))}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    value={patient.personalInfo?.emergencyContact?.name || ''}
                    onChange={(e) => handleEmergencyContactUpdate('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    value={patient.personalInfo?.emergencyContact?.relationship || ''}
                    onChange={(e) => handleEmergencyContactUpdate('relationship', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    value={patient.personalInfo?.emergencyContact?.phone || ''}
                    onChange={(e) => handleEmergencyContactUpdate('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Medical History */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={patient.medicalInfo?.bloodType || ''}
                  onChange={(e) => handleMedicalInfoUpdate('bloodType', e.target.value)}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies (comma-separated)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={allergiesInput}
                onChange={(e) => {
                  setAllergiesInput(e.target.value);
                  handleMedicalInfoUpdate('allergies', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean));
                }}
                placeholder="e.g., Penicillin, Shellfish, Latex"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions (comma-separated)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={conditionsInput}
                onChange={(e) => {
                  setConditionsInput(e.target.value);
                  handleMedicalInfoUpdate('chronicConditions', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean));
                }}
                placeholder="e.g., Diabetes, Hypertension, Asthma"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications (comma-separated)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={medicationsInput}
                onChange={(e) => {
                  setMedicationsInput(e.target.value);
                  handleMedicalInfoUpdate('currentMedications', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean));
                }}
                placeholder="e.g., Metformin 500mg, Lisinopril 10mg"
              />
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id="ubuntuMember"
                  checked={patient.preferences?.ubuntuHealthMember || false}
                  onChange={(e) => setPatient(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences!,
                      ubuntuHealthMember: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="ubuntuMember" className="text-sm font-medium text-teal-900">
                  Join Ubuntu Health Community
                </label>
              </div>
              <p className="text-xs text-teal-700">
                As an Ubuntu Health member, you'll get priority verification, exclusive community support, 
                and contribute to our mission of "I am because we are" in healthcare.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Treatment Request */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Title *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={treatmentRequest.basicInfo?.title || ''}
                onChange={(e) => handleTreatmentBasicInfoUpdate('title', e.target.value)}
                placeholder="e.g., Heart Surgery for Maria, Diabetes Management Program"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Category *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={treatmentRequest.basicInfo?.category || ''}
                  onChange={(e) => handleTreatmentBasicInfoUpdate('category', e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {treatmentCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={treatmentRequest.basicInfo?.urgency || 'medium'}
                  onChange={(e) => handleTreatmentBasicInfoUpdate('urgency', e.target.value)}
                >
                  <option value="low">Low - Can wait several weeks</option>
                  <option value="medium">Medium - Should be addressed soon</option>
                  <option value="high">High - Needs attention within days</option>
                  <option value="emergency">Emergency - Immediate attention needed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Description *</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={treatmentRequest.basicInfo?.description || ''}
                onChange={(e) => handleTreatmentBasicInfoUpdate('description', e.target.value)}
                placeholder="Describe your condition, symptoms, and the treatment you need..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Symptoms (comma-separated)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={symptomsInput}
                onChange={(e) => {
                  setSymptomsInput(e.target.value);
                  handleTreatmentMedicalUpdate('symptoms', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean));
                }}
                placeholder="e.g., Chest pain, Shortness of breath, Fatigue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Treatment (if known)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={treatmentRequest.medicalDetails?.recommendedTreatment || ''}
                onChange={(e) => handleTreatmentMedicalUpdate('recommendedTreatment', e.target.value)}
                placeholder="e.g., Valve replacement surgery, Physical therapy"
              />
            </div>
          </div>
        )}

        {/* Step 4: Treatment Plan (Milestones) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Treatment Milestones</h3>
                <p className="text-gray-600 text-sm">Break down your treatment into manageable steps</p>
              </div>
              <button
                onClick={addMilestone}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
              >
                + Add Milestone
              </button>
            </div>

            {treatmentRequest.milestones?.map((milestone, index) => (
              <div key={milestone.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-900">Milestone {index + 1}</h4>
                  <button
                    onClick={() => removeMilestone(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      placeholder="e.g., Pre-operative assessment, Surgery, Recovery"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost ($)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      value={milestone.estimatedCost}
                      onChange={(e) => updateMilestone(index, 'estimatedCost', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      placeholder="Describe what this milestone involves..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      value={milestone.estimatedDuration}
                      onChange={(e) => updateMilestone(index, 'estimatedDuration', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`verification-${index}`}
                      checked={milestone.verificationRequired}
                      onChange={(e) => updateMilestone(index, 'verificationRequired', e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2"
                    />
                    <label htmlFor={`verification-${index}`} className="text-sm text-gray-700">
                      Requires provider verification
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {treatmentRequest.milestones?.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">No milestones added yet</p>
                <button
                  onClick={addMilestone}
                  className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Add Your First Milestone
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Funding & Sponsorship */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Treatment Cost Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">${calculateTotalCost().toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Estimated Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{treatmentRequest.milestones?.length || 0}</div>
                  <div className="text-sm text-gray-600">Milestones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {treatmentRequest.milestones?.reduce((total, m) => total + m.estimatedDuration, 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Self-Funding Amount ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  value={treatmentRequest.sponsorshipInfo?.selfFunding || 0}
                  onChange={(e) => {
                    const selfFunding = parseFloat(e.target.value) || 0;
                    const totalCost = calculateTotalCost();
                    setTreatmentRequest(prev => ({
                      ...prev,
                      sponsorshipInfo: {
                        ...prev.sponsorshipInfo!,
                        selfFunding,
                        sponsorshipRequired: Math.max(0, totalCost - selfFunding),
                        fundingNeeded: totalCost
                      }
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sponsorship Needed ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  value={treatmentRequest.sponsorshipInfo?.sponsorshipRequired || 0}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="partialSponsorship"
                checked={treatmentRequest.sponsorshipInfo?.allowPartialSponsorship || false}
                onChange={(e) => setTreatmentRequest(prev => ({
                  ...prev,
                  sponsorshipInfo: {
                    ...prev.sponsorshipInfo!,
                    allowPartialSponsorship: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="partialSponsorship" className="text-sm text-gray-700">
                Allow partial sponsorship (sponsors can fund individual milestones)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message to Potential Sponsors</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={treatmentRequest.sponsorshipInfo?.sponsorshipMessage || ''}
                onChange={(e) => setTreatmentRequest(prev => ({
                  ...prev,
                  sponsorshipInfo: {
                    ...prev.sponsorshipInfo!,
                    sponsorshipMessage: e.target.value
                  }
                }))}
                placeholder="Share your story and why this treatment is important to you..."
              />
            </div>
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review Your Treatment Request</h3>
            
            {/* Personal Info Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <p>{patient.personalInfo?.firstName} {patient.personalInfo?.lastName}</p>
              <p>{patient.personalInfo?.email}</p>
              {patient.preferences?.ubuntuHealthMember && (
                <p className="text-teal-600 font-medium">✓ Ubuntu Health Member</p>
              )}
            </div>

            {/* Treatment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Treatment Request</h4>
              <p className="font-medium">{treatmentRequest.basicInfo?.title}</p>
              <p className="text-gray-600">{treatmentRequest.basicInfo?.category}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getUrgencyColor(treatmentRequest.basicInfo?.urgency || 'medium')}`}>
                {treatmentRequest.basicInfo?.urgency} urgency
              </span>
              <p className="mt-2">{treatmentRequest.basicInfo?.description}</p>
            </div>

            {/* Milestones Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Treatment Milestones ({treatmentRequest.milestones?.length})</h4>
              {treatmentRequest.milestones?.map((milestone, index) => (
                <div key={milestone.id} className="border-l-4 border-teal-500 pl-3 mb-2">
                  <p className="font-medium">{milestone.title}</p>
                  <p className="text-sm text-gray-600">${milestone.estimatedCost.toLocaleString()} • {milestone.estimatedDuration} days</p>
                </div>
              ))}
            </div>

            {/* Funding Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Funding Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">${calculateTotalCost().toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Cost</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">${treatmentRequest.sponsorshipInfo?.selfFunding?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Self-Funding</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-teal-600">${treatmentRequest.sponsorshipInfo?.sponsorshipRequired?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Sponsorship Needed</p>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-teal-800 text-sm">
                By submitting this request, you agree to the Ubuntu Health terms of service and privacy policy. 
                Your treatment request will be reviewed by our team and made available to verified healthcare 
                providers and potential sponsors in our community.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-md font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </span>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`px-6 py-2 rounded-md font-medium ${
                isStepValid(currentStep)
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !isStepValid(currentStep)}
              className={`px-8 py-2 rounded-md font-medium ${
                loading || !isStepValid(currentStep)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;
