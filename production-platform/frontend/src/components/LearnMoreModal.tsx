'use client';

import React from 'react';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: {
    overview: string;
    features: string[];
    benefits: string[];
    howItWorks: {
      step: string;
      description: string;
    }[];
    additionalInfo?: string;
  };
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({
  isOpen,
  onClose,
  title,
  content
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            title="Close modal"
            aria-label="Close learn more modal"
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-emerald-100">Learn more about this feature</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Overview
            </h3>
            <p className="text-gray-700 leading-relaxed">{content.overview}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Benefits
            </h3>
            <div className="space-y-3">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border border-emerald-200 rounded-lg bg-emerald-50">
                  <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              How It Works
            </h3>
            <div className="space-y-4">
              {content.howItWorks.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    {index < content.howItWorks.length - 1 && (
                      <div className="w-px h-12 bg-gray-300 ml-5 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">{step.step}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          {content.additionalInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Additional Information
              </h3>
              <p className="text-blue-800">{content.additionalInfo}</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};