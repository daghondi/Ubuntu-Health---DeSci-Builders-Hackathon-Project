'use client';

import React, { useState } from 'react';
import { useInfinitaWallet } from './InfinitaWalletProvider';
import { LivesTokenLogo } from './LivesTokenLogo';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  treatmentType?: string;
  targetAmount?: number;
  currentAmount?: number;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  patientName = "Global Treatment Fund",
  treatmentType = "Various Advanced Treatments",
  targetAmount = 500000,
  currentAmount = 125000
}) => {
  const { wallet, connect } = useInfinitaWallet();
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [donationMessage, setDonationMessage] = useState('');

  const progressPercentage = (currentAmount / targetAmount) * 100;

  const handleDonation = async () => {
    if (!wallet.connected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate donation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully donated ${donationAmount} LIVES tokens to ${patientName}! Your contribution will help save lives.`);
      setDonationAmount('');
      setDonationMessage('');
      onClose();
    } catch (error) {
      alert('Donation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 5000, 10000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <LivesTokenLogo size={24} showText={false} />
                Donate LIVES Tokens
              </h2>
              <p className="text-gray-600">Support advanced medical treatments</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Patient/Treatment Info */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{patientName}</h3>
                <p className="text-sm text-gray-600">{treatmentType}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">
                  ${targetAmount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Target</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>${currentAmount.toLocaleString()} raised ({progressPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          {!wallet.connected ? (
            <div className="text-center mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium mb-2">Connect Your Wallet</p>
                <p className="text-sm text-yellow-700">You need to connect your Infinita wallet to donate LIVES tokens</p>
              </div>
              <button 
                onClick={connect}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Infinita Wallet
              </button>
            </div>
          ) : (
            <>
              {/* Connected Wallet Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Wallet Connected</span>
                </div>
                <p className="text-xs text-green-700 mt-1">{wallet.publicKey?.slice(0, 8)}...{wallet.publicKey?.slice(-8)}</p>
              </div>

              {/* Quick Donation Amounts */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Select (LIVES tokens)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        donationAmount === amount.toString()
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount (LIVES tokens)
                </label>
                <div className="relative">
                  <LivesTokenLogo size={20} showText={false} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Optional Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional Message
                </label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  placeholder="Send words of encouragement (optional)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Donation Button */}
              <button
                onClick={handleDonation}
                disabled={isLoading || !donationAmount || parseFloat(donationAmount) <= 0}
                className="w-full px-6 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Donation...
                  </>
                ) : (
                  <>
                    <LivesTokenLogo size={20} showText={false} />
                    Donate {donationAmount && `${parseFloat(donationAmount).toLocaleString()} LIVES tokens`}
                  </>
                )}
              </button>
            </>
          )}

          {/* Info Footer */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Donations are processed through smart contracts</p>
              <p>• Funds are released based on verified treatment milestones</p>
              <p>• All transactions are recorded on the blockchain for transparency</p>
              <p>• You'll receive impact updates as treatment progresses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;