'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Wallet state interface
interface WalletState {
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  error: string | null;
}

// Wallet context interface
interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string | null>;
}

// Create wallet context
const WalletContext = createContext<WalletContextType | null>(null);

// Infinita Wallet Provider Component
export const InfinitaWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    connecting: false,
    error: null
  });

  // Check if Infinita wallet is available
  const isInfinitaWalletAvailable = () => {
    return typeof window !== 'undefined' && window.infinitaWallet;
  };

  // Connect to Infinita wallet
  const connect = async () => {
    if (!isInfinitaWalletAvailable()) {
      setWallet(prev => ({
        ...prev,
        error: 'Infinita Wallet not found. Please install it from https://wallet.infinita.city/'
      }));
      return;
    }

    setWallet(prev => ({ ...prev, connecting: true, error: null }));

    try {
      // For now, we'll use the standard Solana wallet connection approach
      // This will need to be updated based on Infinita wallet's actual API
      const response = await window.infinitaWallet!.connect();
      
      setWallet({
        connected: true,
        publicKey: response.publicKey.toString(),
        connecting: false,
        error: null
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setWallet({
        connected: false,
        publicKey: null,
        connecting: false,
        error: 'Failed to connect to Infinita Wallet'
      });
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    if (isInfinitaWalletAvailable()) {
      window.infinitaWallet!.disconnect?.();
    }
    
    setWallet({
      connected: false,
      publicKey: null,
      connecting: false,
      error: null
    });
  };

  // Sign message with wallet
  const signMessage = async (message: string): Promise<string | null> => {
    if (!isInfinitaWalletAvailable() || !wallet.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await window.infinitaWallet!.signMessage(encodedMessage);
      return signedMessage.signature;
    } catch (error) {
      console.error('Message signing failed:', error);
      return null;
    }
  };

  // Check wallet connection on mount
  useEffect(() => {
    if (isInfinitaWalletAvailable()) {
      const wallet = window.infinitaWallet!;
      
      wallet.on('connect', (publicKey: any) => {
        setWallet(prev => ({
          ...prev,
          connected: true,
          publicKey: publicKey.toString()
        }));
      });

      wallet.on('disconnect', () => {
        setWallet(prev => ({
          ...prev,
          connected: false,
          publicKey: null
        }));
      });

      // Check if already connected
      if (wallet.isConnected) {
        setWallet(prev => ({
          ...prev,
          connected: true,
          publicKey: wallet.publicKey?.toString() || null
        }));
      }
    }
  }, []);

  const contextValue: WalletContextType = {
    wallet,
    connect,
    disconnect,
    signMessage
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use wallet context
export const useInfinitaWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useInfinitaWallet must be used within InfinitaWalletProvider');
  }
  return context;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    infinitaWallet?: {
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => void;
      signMessage: (message: Uint8Array) => Promise<{ signature: string }>;
      isConnected: boolean;
      publicKey?: { toString: () => string };
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}

export default InfinitaWalletProvider;