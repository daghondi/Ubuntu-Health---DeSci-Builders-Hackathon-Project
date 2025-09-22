'use client';

import React, { useState } from 'react';
import { LivesTokenLogo } from './LivesTokenLogo';
import { DonationModal } from './DonationModal';
import { PatientDetailModal } from './PatientDetailModal';

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

const sponsorshipRequests: SponsorshipRequest[] = [
  {
    id: '1',
    patientName: 'Maria Santos',
    age: 7,
    condition: 'Congenital Heart Defect',
    treatmentNeeded: 'Open Heart Surgery',
    targetAmount: 25000,
    raisedAmount: 18500,
    daysLeft: 12,
    urgency: 'critical',
    patientImage: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400&h=400&fit=crop&crop=face',
    location: 'Philippines',
    hospital: 'Philippine Heart Center',
    story: 'Maria is a bright 7-year-old who loves to draw. She needs urgent heart surgery to repair a congenital defect. Her family has exhausted all local resources.',
    verified: true
  },
  {
    id: '2',
    patientName: 'Ahmed Al-Rashid',
    age: 34,
    condition: 'Leukemia',
    treatmentNeeded: 'Bone Marrow Transplant',
    targetAmount: 85000,
    raisedAmount: 12300,
    daysLeft: 45,
    urgency: 'high',
    patientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    location: 'Jordan',
    hospital: 'King Hussein Cancer Center',
    story: 'Ahmed is a father of three and a teacher. He was diagnosed with leukemia and needs a bone marrow transplant to survive.',
    verified: true
  },
  {
    id: '3',
    patientName: 'Grace Okafor',
    age: 28,
    condition: 'Kidney Failure',
    treatmentNeeded: 'Kidney Transplant',
    targetAmount: 45000,
    raisedAmount: 8700,
    daysLeft: 30,
    urgency: 'high',
    patientImage: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face',
    location: 'Nigeria',
    hospital: 'Lagos University Teaching Hospital',
    story: 'Grace is a nurse who has dedicated her life to helping others. Now she needs help to get a kidney transplant to continue her work.',
    verified: true
  },
  {
    id: '4',
    patientName: 'Carlos Mendoza',
    age: 45,
    condition: 'Spinal Cord Injury',
    treatmentNeeded: 'Stem Cell Therapy',
    targetAmount: 65000,
    raisedAmount: 23400,
    daysLeft: 60,
    urgency: 'medium',
    patientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    location: 'Colombia',
    hospital: 'Fundación Santa Fe de Bogotá',
    story: 'Carlos was paralyzed in an accident. Experimental stem cell therapy could help him walk again and return to his family.',
    verified: true
  }
];

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

export function SponsorshipRequests() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<SponsorshipRequest | null>(null);
  const [isPatientDetailModalOpen, setIsPatientDetailModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<SponsorshipRequest | null>(null);

  const handleDonateClick = (patient: SponsorshipRequest) => {
    setSelectedPatient(patient);
    setIsDonationModalOpen(true);
  };

  const handlePatientClick = (patient: SponsorshipRequest) => {
    setSelectedPatientForDetails(patient);
    setIsPatientDetailModalOpen(true);
  };

  const handleShare = (patient: SponsorshipRequest, platform: string) => {
    // Analytics tracking could be added here
    console.log(`Shared ${patient.patientName}'s request on ${platform}`);
  };

  return (
    <section id="sponsors" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Urgent Treatment Requests
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real patients needing immediate support. Every LIVES token donated directly funds life-saving treatments.
          </p>
        </div>

        {/* Main Featured Request */}
        <div className="mb-12">
          <div 
            onClick={() => handlePatientClick(sponsorshipRequests[0])}
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-red-300"
          >
            <div className="flex items-start gap-6">
              <div className="relative flex-shrink-0">
                <img
                  src={sponsorshipRequests[0].patientImage}
                  alt={sponsorshipRequests[0].patientName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                    URGENT
                  </span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {sponsorshipRequests[0].patientName}, {sponsorshipRequests[0].age}
                    </h3>
                    <p className="text-lg text-red-600 font-semibold mb-1">{sponsorshipRequests[0].condition}</p>
                    <p className="text-gray-600">{sponsorshipRequests[0].location} • {sponsorshipRequests[0].hospital}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Days left</p>
                    <p className="text-3xl font-bold text-red-600">{sponsorshipRequests[0].daysLeft}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{sponsorshipRequests[0].story}</p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{sponsorshipRequests[0].raisedAmount.toLocaleString()} LIVES raised</span>
                    <span>{sponsorshipRequests[0].targetAmount.toLocaleString()} LIVES goal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full transition-all duration-300 ${getProgressColor((sponsorshipRequests[0].raisedAmount / sponsorshipRequests[0].targetAmount) * 100)} w-3/4`} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round((sponsorshipRequests[0].raisedAmount / sponsorshipRequests[0].targetAmount) * 100)}% funded
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDonateClick(sponsorshipRequests[0]);
                    }}
                    className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <LivesTokenLogo size={20} showText={false} />
                    Donate LIVES Now
                  </button>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Click anywhere to view full details
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Requests - Stacked Layout */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Other Urgent Requests</h3>
          
          {sponsorshipRequests.slice(1).map((request) => {
            const progressPercentage = (request.raisedAmount / request.targetAmount) * 100;
            
            return (
              <div
                key={request.id}
                onClick={() => handlePatientClick(request)}
                className="bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Patient Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative flex-shrink-0">
                      <img
                        src={request.patientImage}
                        alt={request.patientName}
                        className="w-20 h-20 rounded-full object-cover border-3 border-gray-200 shadow-md"
                      />
                      {request.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                            {request.patientName}, {request.age}
                          </h4>
                          <p className="text-emerald-600 font-semibold mb-1">{request.condition}</p>
                          <p className="text-gray-600 text-sm mb-2">{request.location} • {request.hospital}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-500">Days left</p>
                          <p className="text-2xl font-bold text-gray-900">{request.daysLeft}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mt-3 mb-4">{request.story}</p>
                      
                      {/* Mini Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{request.raisedAmount.toLocaleString()} LIVES</span>
                          <span>{request.targetAmount.toLocaleString()} LIVES</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)} ${progressPercentage > 75 ? 'w-3/4' : progressPercentage > 50 ? 'w-1/2' : progressPercentage > 25 ? 'w-1/4' : 'w-1/12'}`} />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {Math.round(progressPercentage)}% funded
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDonateClick(request);
                          }}
                          className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <LivesTokenLogo size={16} showText={false} />
                          Donate
                        </button>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Click card for details & sharing
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => {
              // Enhanced functionality - could navigate to dedicated page or show expanded view
              const message = `🏥 Browse All Treatment Requests
              
🌍 Discover more patients in need across the Ubuntu Health global community:

• 250+ active treatment requests worldwide
• Urgent cases requiring immediate support  
• Rare disease treatments needing funding
• Success stories you can help create

🤝 Your support makes healing possible!

Ready to explore all sponsorship opportunities?`;
              
              if (confirm(message)) {
                // In a real implementation, this would navigate to a dedicated page
                // For now, we'll use social sharing to spread awareness
                const shareMessage = "🌍 Join me in supporting patients worldwide through Ubuntu Health! Decentralized healthcare funding that saves lives. Every contribution matters! 🏥💚 #UbuntuHealth #DecentralizedHealthcare";
                const shareUrl = encodeURIComponent(window.location.origin);
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${shareUrl}`, '_blank', 'width=600,height=400');
              }
            }}
            className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-95"
          >
            View All Sponsorship Requests →
          </button>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        patientName={selectedPatient?.patientName}
        treatmentType={selectedPatient?.condition}
        targetAmount={selectedPatient?.targetAmount}
        currentAmount={selectedPatient?.raisedAmount}
      />
    </section>
  );
}