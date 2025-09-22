'use client';

import React from 'react';
import Image from 'next/image';
import { LivesTokenLogo } from './LivesTokenLogo';

interface SponsorshipRequest {
  id: string;
  patientName: string;
  age: number;
  condition: string;
  treatmentNeeded: string;
  targetAmount: number;
  raisedAmount: number;
  daysLeft: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  patientImage: string;
  location: string;
  hospital: string;
  story: string;
  verified: boolean;
}

interface PatientDetailModalProps {
  patient: SponsorshipRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onDonate: (patient: SponsorshipRequest) => void;
  onShare: (patient: SponsorshipRequest, platform: string) => void;
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-green-100 text-green-800 border-green-200';
  }
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 50) return 'bg-blue-500';
  if (percentage >= 25) return 'bg-yellow-500';
  return 'bg-orange-500';
};

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onDonate,
  onShare
}) => {
  if (!isOpen || !patient) return null;

  const progressPercentage = Math.round((patient.raisedAmount / patient.targetAmount) * 100);

  // Generate detailed medical information (simulated)
  const getMedicalDetails = (condition: string) => {
    const details = {
      'Congenital Heart Defect': {
        diagnosis: 'Tetralogy of Fallot with severe pulmonary stenosis',
        symptoms: ['Cyanosis (blue skin)', 'Shortness of breath', 'Fatigue during activity', 'Poor weight gain'],
        treatment: 'Complete intracardiac repair with patch closure of VSD and pulmonary valve reconstruction',
        prognosis: '95% success rate with excellent long-term outcomes',
        timeline: 'Surgery scheduled within 2 weeks, recovery 4-6 weeks'
      },
      'Leukemia': {
        diagnosis: 'Acute Lymphoblastic Leukemia (ALL) - High Risk',
        symptoms: ['Severe fatigue', 'Frequent infections', 'Easy bruising', 'Bone pain'],
        treatment: 'Allogeneic bone marrow transplant from matched donor',
        prognosis: '85% five-year survival rate with transplant',
        timeline: 'Pre-transplant conditioning 2 weeks, recovery 3-6 months'
      },
      'Kidney Failure': {
        diagnosis: 'End-Stage Renal Disease (ESRD) - Stage 5',
        symptoms: ['Severe swelling', 'Nausea and vomiting', 'Fatigue', 'Shortness of breath'],
        treatment: 'Living donor kidney transplant with immunosuppressive therapy',
        prognosis: '95% one-year, 85% five-year graft survival',
        timeline: 'Surgery within 4 weeks, recovery 2-3 months'
      },
      'Spinal Cord Injury': {
        diagnosis: 'Complete T12 spinal cord injury with paraplegia',
        symptoms: ['Complete loss of leg movement', 'Loss of sensation', 'Bladder dysfunction'],
        treatment: 'Autologous mesenchymal stem cell transplantation',
        prognosis: '60% chance of significant improvement in motor function',
        timeline: 'Cell harvesting 1 week, transplant procedure, recovery 6-12 months'
      }
    };
    return details[condition as keyof typeof details] || details['Congenital Heart Defect'];
  };

  const medicalInfo = getMedicalDetails(patient.condition);

  const shareOnPlatform = (platform: string) => {
    const baseUrl = 'https://tale-verse.app';
    const text = `🚨 URGENT: Help save ${patient.patientName}'s life! 
    
${patient.patientName}, ${patient.age} years old, needs ${patient.treatmentNeeded} for ${patient.condition}.

💰 Goal: ${patient.targetAmount.toLocaleString()} LIVES tokens
📈 Raised: ${patient.raisedAmount.toLocaleString()} LIVES (${progressPercentage}%)
⏰ Time left: ${patient.daysLeft} days

Every contribution matters! Join the Ubuntu Health community in making healthcare accessible to all.

#UbuntuHealth #SaveLives #Healthcare #Crypto #DeSci`;

    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(`${baseUrl}/patient/${patient.id}`);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    onShare(patient, platform);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
          <button
            onClick={onClose}
            title="Close modal"
            aria-label="Close patient details modal"
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Patient Photo */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <Image
                src={patient.patientImage}
                alt={patient.patientName}
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg"
              />
              {patient.verified && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Patient Info */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {patient.patientName}, {patient.age}
                    </h1>
                    <p className="text-xl text-red-600 font-semibold mb-1">{patient.condition}</p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <span>📍</span>
                      {patient.location} • {patient.hospital}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(patient.urgency)}`}>
                    {patient.urgency.toUpperCase()} PRIORITY
                  </div>
                </div>

                {/* Story */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient's Story</h3>
                  <p className="text-gray-700 leading-relaxed">{patient.story}</p>
                </div>

                {/* Medical Details */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Diagnosis</h4>
                      <p className="text-gray-700 text-sm mb-4">{medicalInfo.diagnosis}</p>
                      
                      <h4 className="font-semibold text-gray-800 mb-2">Symptoms</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        {medicalInfo.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Treatment Plan</h4>
                      <p className="text-gray-700 text-sm mb-4">{medicalInfo.treatment}</p>
                      
                      <h4 className="font-semibold text-gray-800 mb-2">Prognosis</h4>
                      <p className="text-green-700 text-sm font-medium mb-4">{medicalInfo.prognosis}</p>
                      
                      <h4 className="font-semibold text-gray-800 mb-2">Timeline</h4>
                      <p className="text-gray-700 text-sm">{medicalInfo.timeline}</p>
                    </div>
                  </div>
                </div>

                {/* Social Sharing */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Request</h3>
                  <p className="text-gray-600 mb-4">Help spread the word and increase chances of reaching the funding goal</p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => shareOnPlatform('twitter')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter
                    </button>
                    
                    <button
                      onClick={() => shareOnPlatform('facebook')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    
                    <button
                      onClick={() => shareOnPlatform('linkedin')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    
                    <button
                      onClick={() => shareOnPlatform('whatsapp')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Funding Progress */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 sticky top-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">{patient.daysLeft} days left</div>
                  <div className="text-gray-600">Time remaining</div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{progressPercentage}% funded</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
                      data-progress={Math.min(progressPercentage, 100)}
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raised</span>
                    <div className="flex items-center gap-1">
                      <LivesTokenLogo size={16} showText={false} />
                      <span className="font-semibold">{patient.raisedAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal</span>
                    <div className="flex items-center gap-1">
                      <LivesTokenLogo size={16} showText={false} />
                      <span className="font-semibold">{patient.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-gray-600">Still needed</span>
                    <div className="flex items-center gap-1">
                      <LivesTokenLogo size={16} showText={false} />
                      <span className="font-bold text-red-600">{(patient.targetAmount - patient.raisedAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDonate(patient)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mb-4"
                >
                  <LivesTokenLogo size={20} showText={false} />
                  Donate Now
                </button>

                <div className="text-xs text-gray-500 text-center">
                  Secure donation powered by Ubuntu Health blockchain technology
                </div>
              </div>

              {/* Hospital Verification */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold text-green-800">Verified Request</span>
                </div>
                <p className="text-green-700 text-sm">
                  This request has been verified by {patient.hospital} and our medical team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};