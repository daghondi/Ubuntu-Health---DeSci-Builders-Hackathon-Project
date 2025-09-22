'use client';

import React, { useState, useEffect } from 'react';
import { LivesTokenLogo } from '../components/LivesTokenLogo';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { PatientTestimonials } from '../components/PatientTestimonials';
import { SponsorshipRequests } from '../components/SponsorshipRequests';

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check backend health with updated URL
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Backend not available:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/logos/ubuntu-health-header.svg" 
                alt="Ubuntu Health" 
                className="h-10"
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Stories</a>
                <a href="#sponsors" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
                <a href="/research" className="text-gray-600 hover:text-gray-900 transition-colors">Research</a>
                <a href="/research-api" className="text-gray-600 hover:text-gray-900 transition-colors">API</a>
              </nav>
              <WalletConnectButton size="sm" variant="outline" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="biotech-hero relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-emerald-900/90"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className={`px-4 py-2 rounded-full border ${backendStatus ? 'border-emerald-400 bg-emerald-400/10' : 'border-red-400 bg-red-400/10'}`}>
                <span className={`text-sm font-medium ${backendStatus ? 'text-emerald-400' : 'text-red-400'}`}>
                  {loading ? 'System Initializing...' : backendStatus ? '🟢 Platform Online' : '🔴 System Offline'}
                </span>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ubuntu <span className="text-gradient">Health</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Decentralized healthcare infrastructure for Network States and global communities. 
              Build, coordinate, and scale advanced medical treatments through blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="biotech-gradient px-8 py-4 rounded-lg text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-xl">
                Launch Platform
              </button>
              <button className="border border-slate-400 px-8 py-4 rounded-lg text-slate-300 font-semibold text-lg hover:bg-slate-800/50 transition-colors duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIVES Token Showcase */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <LivesTokenLogo size={80} showText={false} />
              <div className="ml-6 text-left">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">$LIVES Token</h2>
                <p className="text-xl text-gray-600">The heartbeat of Ubuntu Health ecosystem</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <LivesTokenLogo size={48} showText={false} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Earn Through Data</h3>
                <p className="text-gray-600 text-sm">Contribute anonymized health data and earn 300-2000 LIVES tokens monthly</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <LivesTokenLogo size={48} showText={false} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Fund Treatments</h3>
                <p className="text-gray-600 text-sm">Sponsor life-saving treatments and support patients in need worldwide</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <LivesTokenLogo size={48} showText={false} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Research</h3>
                <p className="text-gray-600 text-sm">Use LIVES tokens to access privacy-preserving research APIs and data</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/research"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <LivesTokenLogo size={20} showText={false} />
                Start Earning LIVES
              </a>
              <a 
                href="/sponsorship"
                className="inline-flex items-center gap-2 px-6 py-3 border border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <LivesTokenLogo size={20} showText={false} />
                Sponsor a Patient
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Testimonials Section */}
      <PatientTestimonials />

      {/* Sponsorship Requests Section */}
      <SponsorshipRequests />

      {/* Main Content */}
      <main className="relative">
        {/* Platform Architecture */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Healthcare Infrastructure <span className="text-gradient">for the Future</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A complete biotech platform enabling Network States to coordinate advanced medical treatments, 
                fund research, and revolutionize healthcare delivery.
              </p>
            </div>
          
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Decentralized Care */}
              <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 biotech-gradient rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Decentralized Care</h3>
                <p className="text-slate-600 mb-6">
                  Patient-owned health systems with AI-powered diagnostics and blockchain-secured medical records.
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Solana wallet integration
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    JWT authentication system
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Real-time health monitoring
                  </li>
                </ul>
              </div>

              {/* Treatment Coordination */}
              <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 biotech-gradient rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🧬</span>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Treatment Coordination</h3>
                  <p className="text-gray-600">AI-powered patient matching & resource optimization</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                    Smart patient-hospital matching
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                    Real-time resource tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                    Cross-border coordination
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                    Treatment outcome analytics
                  </li>
                </ul>
              </div>
            </div>

            {/* Smart Contracts */}
            <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 biotech-gradient rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">⛓️</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Contracts</h3>
                <p className="text-gray-600">Decentralized healthcare financing on Solana</p>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                  Treatment sponsorship escrow
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                  Data contribution rewards
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                  DAO governance system
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                  NFT treatment passes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-biotech-green rounded-full mr-3"></div>
                  <LivesTokenLogo size={16} showText={true} className="inline" />
                  <span className="ml-1">token integration</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Preview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Privacy-Preserving Research APIs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Token-gated access to anonymized health data protected by zero-knowledge proofs and Ubuntu community governance
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-8">
            <div className="bg-gray-900 text-biotech-green rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <div className="mb-4 flex items-center">
                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                <code>/api/research/treatment-outcomes</code>
                <div className="ml-4 text-gray-400 text-xs">→ ZK-proof verified treatment data</div>
              </div>
              <div className="mb-4 flex items-center">
                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                <code>/api/research/biomarkers</code>
                <div className="ml-4 text-gray-400 text-xs">→ Anonymized lab results & genetic data</div>
              </div>
              <div className="mb-4 flex items-center">
                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                <code>/api/research/traditional-healing</code>
                <div className="ml-4 text-gray-400 text-xs">→ Cultural practices & integration outcomes</div>
              </div>
              <div className="flex items-center">
                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs mr-3">GET</span>
                <code>/api/research/lifestyle-correlation</code>
                <div className="ml-4 text-gray-400 text-xs">→ Ubuntu community health patterns</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <a 
                href="/research-api" 
                className="biotech-gradient px-6 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-transform duration-200"
              >
                Explore Research APIs
              </a>
              <div className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold">
                � Privacy-First • 🏛️ Community-Governed • 💰 Token-Gated
              </div>
            </div>
          </div>
        </section>

        {/* Sample Treatment Request */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Live Treatment Request
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how patients connect with sponsors through our platform
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Sarah Chen - CAR-T Therapy</h3>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2">📍</span>
                  Houston, TX • High Priority
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-biotech-green">$400,000</div>
                <div className="text-sm text-gray-500">Target Amount</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Funding Progress</span>
                <span className="font-medium">$75,000 / $400,000 (18.75%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-biotech-green h-3 rounded-full progress-bar-18 transition-all duration-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Treatment Milestones
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center p-2 rounded-lg bg-green-50">
                    <span className="text-green-500 mr-3">✅</span>
                    <span>Initial Consultation</span>
                  </li>
                  <li className="flex items-center p-2 rounded-lg bg-yellow-50">
                    <span className="text-yellow-500 mr-3">🔄</span>
                    <span>Pre-treatment Testing</span>
                  </li>
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <span className="text-gray-400 mr-3">⏳</span>
                    <span>Cell Collection</span>
                  </li>
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <span className="text-gray-400 mr-3">⏳</span>
                    <span>Treatment Administration</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Active Sponsors
                </div>
                <ul className="space-y-2">
                  <li className="p-2 rounded-lg bg-biotech-green bg-opacity-10 border border-biotech-green border-opacity-20">
                    <div className="font-medium text-gray-800">Healthcare DAO</div>
                    <div className="text-biotech-green font-semibold">$50,000</div>
                  </li>
                  <li className="p-2 rounded-lg bg-biotech-green bg-opacity-10 border border-biotech-green border-opacity-20">
                    <div className="font-medium text-gray-800">Medical Research Fund</div>
                    <div className="text-biotech-green font-semibold">$25,000</div>
                  </li>
                  <li className="p-2 rounded-lg bg-gray-100 border border-dashed border-gray-300 text-center text-gray-500">
                    + seeking additional funding
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Impact & Innovation */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Platform Impact & Innovation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Revolutionizing healthcare research through privacy-preserving data sharing and Ubuntu philosophy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card rounded-2xl p-8 text-center border-l-4 border-biotech-green">
              <div className="w-16 h-16 bg-biotech-green text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">5</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">DeSci Tracks</h3>
              <p className="text-gray-600">Comprehensive integration of all hackathon focus areas in a unified platform</p>
            </div>
            
            <div className="glass-card rounded-2xl p-8 text-center border-l-4 border-purple-500">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold">ZKP</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Privacy-First</h3>
              <p className="text-gray-600">Zero-knowledge proofs and differential privacy protect patient data</p>
            </div>
            
            <div className="glass-card rounded-2xl p-8 text-center border-l-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Data Categories</h3>
              <p className="text-gray-600">Treatment outcomes, biomarkers, lifestyle, and traditional healing</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 border-l-4 border-yellow-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-500 text-white rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">★</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Unique Innovations</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Ubuntu Philosophy Integration:</strong> Community-governed health decisions with cultural wisdom
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>LIVES Token Economy:</strong> Incentivized research participation with privacy protection
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Traditional Medicine Bridge:</strong> Scientific validation of cultural healing practices
                  </div>
                </li>
              </ul>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Differential Privacy:</strong> Mathematical guarantees for individual data protection
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Research Data Marketplace:</strong> 300-2000 LIVES tokens per contribution category
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Live Platform:</strong> Fully deployed at tale-verse.app with interactive features
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research Data Contribution */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Advance Medical Research & Earn LIVES Tokens
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your anonymized health data to accelerate medical breakthroughs worldwide. 
              Protected by zero-knowledge proofs and Ubuntu community governance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🧬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Contribution</h3>
              <p className="text-gray-600 mb-4">
                Contribute anonymized treatment outcomes, biomarkers, and wellness data to help researchers 
                develop better treatments for future patients.
              </p>
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold">
                <LivesTokenLogo size={20} showText={false} />
                <span>300-750 LIVES/month</span>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy Protected</h3>
              <p className="text-gray-600 mb-4">
                Your data is protected by zero-knowledge proofs. Researchers get insights without ever 
                seeing your personal information or identity.
              </p>
              <div className="text-purple-600 font-semibold">100% Anonymous</div>
            </div>
            
            <div className="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Ubuntu Governance</h3>
              <p className="text-gray-600 mb-4">
                Ubuntu community approves all research partnerships. Traditional healing knowledge 
                is preserved and integrated with modern medicine.
              </p>
              <div className="text-orange-600 font-semibold">Community Controlled</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="/research"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-xl">🧬</span>
              Start Contributing to Research
              <LivesTokenLogo size={20} showText={false} />
            </a>
          </div>
        </section>

        {/* Network State Positioning */}
        <section className="mb-16">
          <div className="glass-card rounded-2xl p-12 biotech-hero">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Network State Healthcare Infrastructure
              </h2>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                Ubuntu Health serves as foundational healthcare infrastructure that Network States and 
                decentralized communities can use to coordinate advanced medical treatments for their citizens.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 biotech-gradient rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌍</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Global Coordination</h4>
                <p className="text-sm text-gray-300">Citizens access treatments worldwide through decentralized networks</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 biotech-gradient rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Community Funding</h4>
                <p className="text-sm text-gray-300">Pool resources for expensive procedures using blockchain technology</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 biotech-gradient rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔬</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Research Advancement</h4>
                <p className="text-sm text-gray-300">Contribute anonymized data to accelerate medical breakthroughs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="glass-card rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Live Platform Ready for Development
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              The foundational architecture is deployed and operational. All API endpoints are live 
              and ready for integration with the frontend and smart contracts.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <a 
                href="https://tale-verse.app/api/health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-biotech-green text-white px-8 py-4 rounded-xl hover:bg-biotech-green-dark transition-colors font-medium flex items-center justify-center"
              >
                <span className="mr-2">🔗</span>
                View Live API
              </a>
              <a 
                href="https://tale-verse.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
              >
                <span className="mr-2">🚀</span>
                Open Platform
              </a>
            </div>
            <div className="text-sm text-gray-500">
              <p>All 12 API endpoints are functional and tested ✓</p>
              <p>Custom domain configured with SSL ✓</p>
              <p>Production deployment on Vercel ✓</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <img 
              src="/logos/ubuntu-health-header.svg" 
              alt="Ubuntu Health" 
              className="h-12 mx-auto"
            />
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-4">
            Healthcare infrastructure for Network States and decentralized communities
          </p>
          <p className="text-sm text-gray-500">
            Production Platform Preview • September 2025
          </p>
        </div>
      </footer>
    </div>
  );
}