'use client';

import React from 'react';
import { useInfinitaWallet } from './InfinitaWalletProvider';
import { LivesTokenLogo } from './LivesTokenLogo';
import { useAuth } from '../hooks/useAuth';

interface WalletConnectButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  const { wallet, connect, disconnect } = useInfinitaWallet();
  const { isAuthenticated, user, login, logout, loading: authLoading, error: authError } = useAuth();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-biotech-green hover:bg-biotech-green-dark text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-biotech-green text-biotech-green hover:bg-biotech-green hover:text-white'
  };

  const handleClick = async () => {
    if (isAuthenticated) {
      logout();
      disconnect();
    } else if (wallet.connected) {
      await login();
    } else {
      await connect();
    }
  };

  // Show authenticated state
  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="glass-card rounded-xl px-4 py-2 flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Authenticated:</span>
            <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {user.walletAddress?.slice(0, 4)}...{user.walletAddress?.slice(-4)}
            </code>
          </div>
          <LivesTokenLogo size={20} showText={false} />
        </div>
        <button
          onClick={handleClick}
          className={`${sizeClasses[size]} ${variantClasses.secondary} rounded-xl font-medium transition-all duration-200 flex items-center`}
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Show wallet connected but not authenticated
  if (wallet.connected) {
    return (
      <div className={`${className}`}>
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {authError}
          </div>
        )}
        <button
          onClick={handleClick}
          disabled={authLoading}
          className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
            authLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {authLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-sm">🔐</span>
              </div>
              <span>Sign In</span>
              <LivesTokenLogo size={20} showText={false} />
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {wallet.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {wallet.error}
          {wallet.error.includes('not found') && (
            <div className="mt-2">
              <a 
                href="https://wallet.infinita.city/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-800 underline hover:text-red-900"
              >
                Install Infinita Wallet →
              </a>
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={handleClick}
        disabled={wallet.connecting}
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
          wallet.connecting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
      >
        {wallet.connecting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
              <span className="text-sm">🏦</span>
            </div>
            <span>Connect Infinita Wallet</span>
            <LivesTokenLogo size={20} showText={false} />
          </>
        )}
      </button>
    </div>
  );
};

export default WalletConnectButton;