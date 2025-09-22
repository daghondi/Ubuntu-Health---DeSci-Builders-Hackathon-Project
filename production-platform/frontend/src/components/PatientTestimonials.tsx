'use client';

import React, { useState } from 'react';
import { LivesTokenLogo } from './LivesTokenLogo';
import { DonationModal } from './DonationModal';
import { TreatmentRequestModal } from './TreatmentRequestModal';
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

interface Testimonial {
  id: string;
  name: string;
  condition: string;
  story: string;
  profileImage: string;
  location: string;
  treatmentCost: string;
  livesReceived: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    condition: 'Rare Genetic Disorder',
    story: 'Thanks to Ubuntu Health, I found a treatment that wasn\'t available in my country. The community raised $45,000 in LIVES tokens for my gene therapy. Today, I\'m symptom-free and living my best life.',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=400&h=400&fit=crop&crop=face',
    location: 'Kenya',
    treatmentCost: '$45,000',
    livesReceived: '45,000 LIVES',
    verified: true
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    condition: 'Advanced Cancer Treatment',
    story: 'When traditional treatments failed, Ubuntu Health connected me with experimental immunotherapy. The global community contributed 78,000 LIVES tokens. I\'m now in complete remission.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    location: 'Brazil',
    treatmentCost: '$78,000',
    livesReceived: '78,000 LIVES',
    verified: true
  },
  {
    id: '3',
    name: 'Amira Hassan',
    condition: 'Pediatric Heart Surgery',
    story: 'My daughter needed urgent heart surgery that we couldn\'t afford. Ubuntu Health community raised funds in just 3 days. She\'s now a healthy 8-year-old who loves to dance.',
    profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
    location: 'Egypt',
    treatmentCost: '$32,000',
    livesReceived: '32,000 LIVES',
    verified: true
  }
];

export const PatientTestimonials: React.FC = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<SponsorshipRequest | null>(null);
  const [showPatientDetailModal, setShowPatientDetailModal] = useState(false);

  const handlePatientClick = (testimonial: Testimonial) => {
    // Convert testimonial to patient format expected by PatientDetailModal
    const patientData = {
      id: testimonial.id,
      patientName: testimonial.name,
      age: 35, // Default age since testimonials don't have age
      condition: testimonial.condition,
      treatmentNeeded: testimonial.condition,
      targetAmount: parseInt(testimonial.treatmentCost.replace(/[^\d]/g, '')),
      raisedAmount: parseInt(testimonial.livesReceived.replace(/[^\d]/g, '')),
      daysLeft: 0, // Completed testimonial
      urgency: 'low' as const, // Success story, no urgency
      patientImage: testimonial.profileImage,
      location: testimonial.location,
      hospital: 'Ubuntu Health Network',
      story: testimonial.story,
      verified: testimonial.verified
    };
    
    setSelectedPatient(patientData);
    setShowPatientDetailModal(true);
  };

  const handleDonate = (patient: SponsorshipRequest) => {
    // For testimonials, this would show a message about the patient already being helped
    alert(`${patient.patientName} has already received successful treatment through Ubuntu Health! Consider supporting other patients in need.`);
  };

  const handleShare = (patient: SponsorshipRequest, platform: string) => {
    const successMessage = `🎉 Success story: ${patient.patientName} from ${patient.location} received life-saving treatment through Ubuntu Health! The community raised ${patient.raisedAmount} LIVES tokens for ${patient.condition}. This is the power of decentralized healthcare! 🌍💚 #UbuntuHealth #DecentralizedHealthcare #LIVES`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(successMessage)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(successMessage)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(successMessage)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(successMessage)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(successMessage)}`
    };

    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <LivesTokenLogo size={48} showText={false} />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Real Patients, Real Lives Saved
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every day, Ubuntu Health connects patients with life-saving treatments through our decentralized healthcare network powered by LIVES tokens.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              onClick={() => handlePatientClick(testimonial)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:border-emerald-300 hover:scale-[1.02]"
            >
              {/* Patient Profile Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.profileImage}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full object-cover border-3 border-emerald-200 shadow-lg"
                    />
                    {testimonial.verified && (
                      <div className="absolute -top-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                    <p className="text-emerald-600 font-medium">{testimonial.condition}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  "{testimonial.story}"
                </p>
                
                {/* Treatment Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Treatment Cost</p>
                    <p className="font-semibold text-gray-900">{testimonial.treatmentCost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Community Support</p>
                    <p className="font-semibold text-emerald-600">{testimonial.livesReceived}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar - Similar to Infinita.city's stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">2,847</div>
              <div className="text-gray-600 font-medium">Patients Helped</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">156</div>
              <div className="text-gray-600 font-medium">Countries Reached</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">$12.3M</div>
              <div className="text-gray-600 font-medium">Treatments Funded</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">98.7%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">Ready to help save lives or get the treatment you need?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsTreatmentModalOpen(true)}
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Request Treatment Support
            </button>
            <button 
              onClick={() => setIsDonationModalOpen(true)}
              className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Donate LIVES Tokens
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
      
      <TreatmentRequestModal
        isOpen={isTreatmentModalOpen}
        onClose={() => setIsTreatmentModalOpen(false)}
      />
      
      {selectedPatient && (
        <PatientDetailModal
          isOpen={showPatientDetailModal}
          onClose={() => setShowPatientDetailModal(false)}
          patient={selectedPatient}
          onDonate={handleDonate}
          onShare={handleShare}
        />
      )}
    </section>
  );
}