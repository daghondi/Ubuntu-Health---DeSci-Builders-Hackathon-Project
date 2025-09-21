import { useState, useEffect } from 'react';
import { useInfinitaWallet } from '../components/InfinitaWalletProvider';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    walletAddress: string;
    userType: string;
    isVerified: boolean;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const { wallet, signMessage } = useInfinitaWallet();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAuthState(prev => ({
        ...prev,
        token,
        isAuthenticated: true,
        loading: true
      }));
      
      // Verify token with backend
      fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAuthState(prev => ({
            ...prev,
            user: data.user,
            loading: false,
            error: null
          }));
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            token: null,
            loading: false,
            error: 'Session expired'
          }));
        }
      })
      .catch(err => {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('auth_token');
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          token: null,
          loading: false,
          error: 'Authentication failed'
        }));
      });
    }
  }, []);

  const login = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setAuthState(prev => ({
        ...prev,
        error: 'Please connect your Infinita wallet first'
      }));
      return false;
    }

    setAuthState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      // Create auth challenge message
      const timestamp = Date.now();
      const message = `Sign this message to authenticate with Ubuntu Health.\n\nWallet: ${wallet.publicKey}\nTimestamp: ${timestamp}`;
      
      // Sign the message
      const signature = await signMessage(message);
      if (!signature) {
        throw new Error('Failed to sign authentication message');
      }

      // Send to backend for verification
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicKey: wallet.publicKey,
          signature,
          message
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('auth_token', data.token);
        
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          token: data.token,
          loading: false,
          error: null
        });
        
        return true;
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
  };

  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: null
    }));
  };

  return {
    ...authState,
    login,
    logout,
    clearError,
    isWalletConnected: wallet.connected
  };
};

export default useAuth;