'use client';

import React, { useState } from 'react';
import { useInfinitaWallet } from './InfinitaWalletProvider';

interface TreatmentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TreatmentRequestModal: React.FC<TreatmentRequestModalProps> = ({
  isOpen,
  onClose
}) => {
  const { wallet, connect } = useInfinitaWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    
    // Medical Information
    condition: '',
    treatmentType: '',
    urgency: 'medium',
    currentTreatments: '',
    medicalHistory: '',
    
    // Treatment Details
    estimatedCost: '',
    preferredFacility: '',
    timeline: '',
    
    // Supporting Documents
    medicalRecords: null as File | null,
    doctorReferral: null as File | null,
    insuranceInfo: null as File | null,
    
    // Personal Story
    personalStory: '',
    whyImportant: '',
    communitySupport: ''
  });

  const treatmentTypes = [
    'CAR-T Cell Therapy',
    'Gene Therapy',
    'Immunotherapy',
    'Stem Cell Therapy',
    'Experimental Drug Treatment',
    'Advanced Surgical Procedure',
    'Precision Medicine',
    'Longevity Treatment',
    'Other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Non-urgent, preventive care', color: 'text-green-600' },
    { value: 'medium', label: 'Medium - Important but not emergency', color: 'text-yellow-600' },
    { value: 'high', label: 'High - Urgent medical need', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical - Life-threatening condition', color: 'text-red-600' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    if (!wallet.connected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert(`Thank you ${formData.fullName}! Your treatment request has been submitted to the Ubuntu Health community. You'll receive updates via email and on the platform.`);
      
      // Reset form
      setFormData({
        fullName: '', email: '', phone: '', dateOfBirth: '', location: '',
        condition: '', treatmentType: '', urgency: 'medium', currentTreatments: '', medicalHistory: '',
        estimatedCost: '', preferredFacility: '', timeline: '',
        medicalRecords: null, doctorReferral: null, insuranceInfo: null,
        personalStory: '', whyImportant: '', communitySupport: ''
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Request Treatment Support
              </h2>
              <p className="text-gray-600">Connect with the Ubuntu Health community for advanced medical treatment funding</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Personal Info</span>
              <span>Medical Details</span>
              <span>Treatment Plan</span>
              <span>Your Story</span>
            </div>
          </div>

          {/* Wallet Connection Check */}
          {!wallet.connected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="text-yellow-800 font-medium">Connect Your Wallet</p>
                  <p className="text-sm text-yellow-700">You need to connect your Infinita wallet to submit a treatment request</p>
                </div>
                <button 
                  onClick={connect}
                  className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (City, Country) *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Houston, TX, USA"
                />
              </div>
            </div>
          )}

          {/* Step 2: Medical Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Condition *
                </label>
                <textarea
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Describe your medical condition and diagnosis"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Type *
                  </label>
                  <select
                    value={formData.treatmentType}
                    onChange={(e) => handleInputChange('treatmentType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select treatment type</option>
                    {treatmentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Treatments
                </label>
                <textarea
                  value={formData.currentTreatments}
                  onChange={(e) => handleInputChange('currentTreatments', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="List any current treatments, medications, or therapies"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History
                </label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Brief medical history relevant to your condition"
                />
              </div>
            </div>
          )}

          {/* Step 3: Treatment Plan */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Treatment Plan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 400000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Timeline
                  </label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 6 months, ASAP"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Medical Facility
                </label>
                <input
                  type="text"
                  value={formData.preferredFacility}
                  onChange={(e) => handleInputChange('preferredFacility', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., MD Anderson Cancer Center, Mayo Clinic"
                />
              </div>
              
              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Records
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange('medicalRecords', e.target.files)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Referral
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange('doctorReferral', e.target.files)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Information
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange('insuranceInfo', e.target.files)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Personal Story */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Story</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Story *
                </label>
                <textarea
                  value={formData.personalStory}
                  onChange={(e) => handleInputChange('personalStory', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Share your story with the Ubuntu Health community. What led to your condition? How has it affected your life?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why This Treatment is Important *
                </label>
                <textarea
                  value={formData.whyImportant}
                  onChange={(e) => handleInputChange('whyImportant', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Explain why this treatment is crucial for you and how it will impact your life"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Support & Family
                </label>
                <textarea
                  value={formData.communitySupport}
                  onChange={(e) => handleInputChange('communitySupport', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Tell us about your family, community support system, and how they're involved in your healing journey"
                />
              </div>
              
              {/* Ubuntu Philosophy */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🫂</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-800 mb-1">Ubuntu Health Philosophy</h4>
                    <p className="text-sm text-emerald-700">
                      "I am because we are" - Your healing journey will be supported by a global community 
                      that believes in collective care and shared wisdom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-3">
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={!wallet.connected}
                  className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !wallet.connected || !formData.fullName || !formData.email}
                  className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Submit Treatment Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentRequestModal;