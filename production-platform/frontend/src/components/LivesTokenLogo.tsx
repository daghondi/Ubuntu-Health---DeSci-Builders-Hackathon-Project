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
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex-shrink-0">
        <Image
          src="/assets/tokens/lives-token-logo.webp"
          alt="LIVES Token"
          width={size}
          height={size}
          className="rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: 'contain'
          }}
        />
      </div>
      {showText && (
        <span className="ml-2 font-semibold text-gray-800">$LIVES</span>
      )}
    </div>
  );
};

export default LivesTokenLogo;