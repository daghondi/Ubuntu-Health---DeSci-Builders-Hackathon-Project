'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LivesTokenLogo } from './LivesTokenLogo';
import '../styles/demo-tour.css';

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'scroll' | 'highlight';
  actionTarget?: string;
  voiceoverText: string;
  duration: number; // seconds
}

interface DemoTourProps {
  isActive: boolean;
  onComplete: () => void;
  onClose: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '🌍 Welcome to Ubuntu Health',
    description: 'The world\'s first decentralized healthcare funding platform powered by blockchain technology and the Ubuntu philosophy of "I am because we are."',
    targetSelector: '.biotech-hero',
    position: 'bottom',
    voiceoverText: 'Welcome to Ubuntu Health, where revolutionary blockchain technology meets compassionate healthcare funding. Our platform embodies the Ubuntu philosophy - I am because we are - connecting patients worldwide with life-saving treatments.',
    duration: 6
  },
  {
    id: 'launch-platform',
    title: '🚀 Launch Platform',
    description: 'Click here to explore live patient funding requests and see the platform in action.',
    targetSelector: 'button:contains("Launch Platform")',
    position: 'top',
    action: 'click',
    actionTarget: '#sponsors',
    voiceoverText: 'Let\'s start by launching the platform to see real patients who need immediate medical support.',
    duration: 3
  },
  {
    id: 'patient-stories',
    title: '❤️ Real Patient Stories',
    description: 'These are real patients with verified medical conditions who need immediate funding for life-saving treatments.',
    targetSelector: '#testimonials',
    position: 'bottom',
    action: 'scroll',
    voiceoverText: 'Here you can see powerful testimonials from patients whose lives have been transformed through our decentralized funding network.',
    duration: 5
  },
  {
    id: 'urgent-requests',
    title: '🚨 Urgent Treatment Requests',
    description: 'Critical cases requiring immediate community support. Every LIVES token donated directly funds treatments.',
    targetSelector: '#sponsors',
    position: 'top',
    voiceoverText: 'This section shows urgent treatment requests. Notice how each patient has a verified profile, clear funding goals, and transparent progress tracking.',
    duration: 6
  },
  {
    id: 'patient-detail',
    title: '👤 Patient Profiles',
    description: 'Click on any patient to see detailed medical information, verification status, and funding progress.',
    targetSelector: '.cursor-pointer[data-patient]',
    position: 'right',
    action: 'click',
    voiceoverText: 'Each patient profile contains comprehensive medical information, hospital verification, and real-time funding progress. Our enhanced patient images make their stories more personal and impactful.',
    duration: 7
  },
  {
    id: 'lives-token',
    title: '💎 LIVES Token Economy',
    description: 'Our native LIVES tokens power the entire ecosystem - from funding treatments to rewarding data contributions.',
    targetSelector: '.biotech-gradient',
    position: 'bottom',
    voiceoverText: 'The LIVES token is the heart of our ecosystem. Sponsors use LIVES tokens to fund treatments, patients receive support, and researchers access anonymized health data.',
    duration: 6
  },
  {
    id: 'share-earn',
    title: '📊 Share & Earn Feature',
    description: 'Patients and community members can contribute anonymized health data and earn LIVES tokens monthly.',
    targetSelector: '[data-feature="share-earn"]',
    position: 'left',
    action: 'click',
    voiceoverText: 'Our Share and Earn feature allows individuals to contribute valuable health data while maintaining complete privacy, earning 300 to 2000 LIVES tokens monthly.',
    duration: 5
  },
  {
    id: 'research-api',
    title: '🔬 Research Integration',
    description: 'Healthcare researchers and institutions can access privacy-preserving health data through our tokenized API.',
    targetSelector: '[href="/research-api"]',
    position: 'bottom',
    action: 'click',
    voiceoverText: 'Researchers access our comprehensive API for privacy-preserving health insights, accelerating medical breakthroughs while protecting patient data.',
    duration: 5
  },
  {
    id: 'wallet-connect',
    title: '🔗 Blockchain Integration',
    description: 'Connect your wallet to participate in funding, governance, and the LIVES token economy.',
    targetSelector: '[data-testid="wallet-connect"]',
    position: 'left',
    voiceoverText: 'Users connect their crypto wallets to participate fully in the ecosystem - funding patients, earning tokens, and participating in decentralized governance.',
    duration: 4
  },
  {
    id: 'social-sharing',
    title: '📢 Social Impact',
    description: 'Share patient stories across social platforms to expand our global healing network.',
    targetSelector: '[data-social-share]',
    position: 'top',
    voiceoverText: 'Our integrated social sharing helps spread awareness, connecting more sponsors with patients in need across Twitter, Facebook, LinkedIn, and WhatsApp.',
    duration: 4
  },
  {
    id: 'success-metrics',
    title: '📈 Global Impact',
    description: 'Track real-time metrics showing lives saved, treatments funded, and communities connected worldwide.',
    targetSelector: '.glass-card',
    position: 'bottom',
    voiceoverText: 'These metrics show our real-world impact: thousands of lives saved, millions in treatments funded, and a growing global community united in healing.',
    duration: 5
  },
  {
    id: 'conclusion',
    title: '🌟 Join the Revolution',
    description: 'Ubuntu Health is transforming healthcare funding through blockchain technology, community solidarity, and the power of human connection.',
    targetSelector: '.biotech-hero',
    position: 'bottom',
    voiceoverText: 'Ubuntu Health represents the future of healthcare - decentralized, transparent, and driven by our shared humanity. Together, we\'re building a world where no one faces medical challenges alone.',
    duration: 7
  }
];

export const DemoTour: React.FC<DemoTourProps> = ({ isActive, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Text-to-speech functionality
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a pleasant voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Calculate tooltip position based on target element
  const updateTooltipPosition = (targetSelector: string, position: string) => {
    try {
      let element: HTMLElement | null = null;
      
      // Handle special selectors
      if (targetSelector.includes(':contains')) {
        const text = targetSelector.match(/\("([^"]+)"\)/)?.[1];
        if (text) {
          const elements = Array.from(document.querySelectorAll('button'));
          element = elements.find(el => el.textContent?.includes(text)) as HTMLElement;
        }
      } else {
        element = document.querySelector(targetSelector) as HTMLElement;
      }

      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let x = rect.left + scrollLeft;
        let y = rect.top + scrollTop;

        // Adjust position based on desired tooltip placement
        switch (position) {
          case 'top':
            x += rect.width / 2;
            y -= 10;
            break;
          case 'bottom':
            x += rect.width / 2;
            y += rect.height + 10;
            break;
          case 'left':
            x -= 10;
            y += rect.height / 2;
            break;
          case 'right':
            x += rect.width + 10;
            y += rect.height / 2;
            break;
        }

        setTooltipPosition({ x, y });
        
        // Highlight the element
        element.style.boxShadow = '0 0 20px 5px rgba(16, 185, 129, 0.6)';
        element.style.zIndex = '1000';
        element.style.position = 'relative';
        setHighlightedElement(element);

        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.warn('Could not find target element:', targetSelector);
    }
  };

  // Clear highlighting
  const clearHighlight = () => {
    if (highlightedElement) {
      highlightedElement.style.boxShadow = '';
      highlightedElement.style.zIndex = '';
      setHighlightedElement(null);
    }
  };

  // Handle step actions
  const executeStepAction = (step: TourStep) => {
    if (step.action === 'scroll' && step.actionTarget) {
      const target = document.querySelector(step.actionTarget);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (step.action === 'click' && step.actionTarget) {
      const target = document.querySelector(step.actionTarget);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Start/stop tour
  const startTour = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const stopTour = () => {
    setIsPlaying(false);
    clearHighlight();
    stopSpeech();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Navigate steps
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      stopTour();
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle step changes
  useEffect(() => {
    if (isActive && isPlaying) {
      const step = tourSteps[currentStep];
      
      clearHighlight();
      updateTooltipPosition(step.targetSelector, step.position);
      executeStepAction(step);
      
      // Start voiceover
      speak(step.voiceoverText);

      // Auto-advance after duration
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setTimeout(() => {
        nextStep();
      }, step.duration * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentStep, isActive, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTour();
    };
  }, []);

  if (!isActive) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Demo Overlay */}
      <div className="demo-tour-overlay" />
      
      {/* Tour Tooltip */}
      <div 
        className="demo-tour-tooltip"
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <LivesTokenLogo size={24} showText={false} />
            <h3 className="text-lg font-bold text-gray-900">{currentTourStep.title}</h3>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {currentTourStep.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {tourSteps.length}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              
              <button
                onClick={isPlaying ? stopTour : startTour}
                className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              <button
                onClick={nextStep}
                className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="demo-tour-progress">
          <div 
            className="demo-tour-progress-bar"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tour Controls Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <LivesTokenLogo size={20} showText={false} />
            <span className="text-sm font-medium text-gray-700">Demo Tour</span>
            
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600"
              title="Close Demo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Audio Control */}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => speechRef.current && speechSynthesis.speaking ? stopSpeech() : speak(currentTourStep.voiceoverText)}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              {speechSynthesis.speaking ? '🔇 Mute' : '🔊 Audio'}
            </button>
            
            <div className="text-xs text-gray-500">
              Voice: {speechSynthesis.speaking ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoTour;