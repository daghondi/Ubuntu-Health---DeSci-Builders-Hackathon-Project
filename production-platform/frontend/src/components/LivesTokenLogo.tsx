'use client';

import React from 'react';
import Image from 'next/image';

interface LivesTokenLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const LivesTokenLogo: React.FC<LivesTokenLogoProps> = ({ 
  size = 32, 
  className = '', 
  showText = true 
}) => {
  // Determine size class based on size prop
  const sizeClass = size <= 24 ? 'w-6 h-6' : size <= 32 ? 'w-8 h-8' : size <= 48 ? 'w-12 h-12' : 'w-16 h-16';
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex-shrink-0 lives-token-base ${sizeClass}`}>
        <div className="lives-token-pattern">
          <div className="lives-token-block-main" />
          <div className="lives-token-block-1" />
          <div className="lives-token-block-2" />
          <div className="lives-token-block-3" />
        </div>
      </div>
      {showText && (
        <span className="ml-2 font-semibold text-gray-800">$LIVES</span>
      )}
    </div>
  );
};

export default LivesTokenLogo;