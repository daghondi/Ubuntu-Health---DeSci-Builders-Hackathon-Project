'use client';

import React, { useState } from 'react';
import { LivesTokenLogo } from './LivesTokenLogo';
import { DemoTour } from './DemoTour';

export const DemoModeToggle: React.FC = () => {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const startDemo = () => {
    setIsDemoActive(true);
    setShowDemoInfo(false);
  };

  const closeDemo = () => {
    setIsDemoActive(false);
  };

  const completeDemoTour = () => {
    setIsDemoActive(false);
    // Could show a completion message or redirect
    alert('🎉 Demo tour completed! Thank you for exploring Ubuntu Health.');
  };

  return (
    <>
      {/* Demo Mode Button */}
      <div className="fixed top-4 right-4 z-30">
        <div className="flex flex-col items-end gap-2">
          {/* Demo Info Popup */}
          {showDemoInfo && (
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
              <div className="flex items-start gap-3">
                <LivesTokenLogo size={24} showText={false} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">🎬 Interactive Demo Tour</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Experience Ubuntu Health through a guided tour with:
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1 mb-3">
                    <li>• 🎯 12 interactive steps</li>
                    <li>• 🔊 Professional voiceover</li>
                    <li>• ✨ Visual highlights & animations</li>
                    <li>• 📱 Mobile-responsive design</li>
                    <li>• ⏯️ Pause/play controls</li>
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={startDemo}
                      className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm font-medium rounded-md hover:from-emerald-700 hover:to-blue-700 transition-all duration-200"
                    >
                      🚀 Start Demo
                    </button>
                    <button
                      onClick={() => setShowDemoInfo(false)}
                      className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowDemoInfo(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                title="Close demo info"
                aria-label="Close demo information popup"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Demo Toggle Button */}
          <button
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="group bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
            title="Start Interactive Demo Tour"
          >
            <div className="w-5 h-5 relative">
              <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-ping"></div>
              <div className="relative w-5 h-5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <span className="hidden sm:inline">Demo Tour</span>
          </button>

          {/* Demo Mode Indicator */}
          {isDemoActive && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              DEMO MODE
            </div>
          )}
        </div>
      </div>

      {/* Demo Tour Component */}
      <DemoTour
        isActive={isDemoActive}
        onComplete={completeDemoTour}
        onClose={closeDemo}
      />

      {/* Demo Mode Styles - Add some special styling when demo is active */}
      {isDemoActive && (
        <style jsx global>{`
          [data-demo-highlight] {
            transition: all 0.3s ease;
          }
          
          [data-demo-highlight]:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      )}
    </>
  );
};

export default DemoModeToggle;