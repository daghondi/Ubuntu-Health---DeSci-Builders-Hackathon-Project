import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { RecoveryLogger } from './components/RecoveryLogger';
import { TreatmentRequestBrowser } from './components/TreatmentRequestBrowser';
import { SponsorDashboard } from './components/SponsorDashboard';
import ResearchDataContribution from './components/ResearchDataContribution';
import ResearchAPIAccess from './components/ResearchAPIAccess';
import './App.css';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  // Setup Solana wallet connection
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              {/* Navigation Header */}
              <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <Link to="/" className="flex items-center space-x-2">
                        <div className="text-2xl">❤️</div>
                        <span className="text-xl font-bold text-gray-900">Ubuntu Health</span>
                        <span className="text-sm text-orange-600 font-medium">Healing Atlas</span>
                      </Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <Link 
                        to="/browse" 
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Browse Treatments
                      </Link>
                      <Link 
                        to="/recovery" 
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Recovery Logger
                      </Link>
                      <Link 
                        to="/sponsor" 
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Sponsor Dashboard
                      </Link>
                      <Link 
                        to="/research" 
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Research Data
                      </Link>
                      <Link 
                        to="/research-api" 
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        API Access
                      </Link>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Connect Wallet
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Main Content */}
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<TreatmentRequestBrowser />} />
                  <Route path="/recovery" element={<RecoveryLogger />} />
                  <Route path="/sponsor" element={<SponsorDashboard />} />
                  <Route path="/research" element={<ResearchDataContribution />} />
                  <Route path="/research-api" element={<ResearchAPIAccess />} />
                </Routes>
              </main>

              {/* Footer */}
              <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="text-2xl">❤️</div>
                        <span className="text-xl font-bold text-gray-900">Ubuntu Health</span>
                        <span className="text-sm text-orange-600 font-medium">Healing Atlas</span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Empowering healthcare through Ubuntu philosophy - connecting patients, sponsors, 
                        and communities in the journey of healing. "I am because we are."
                      </p>
                      <div className="flex space-x-4">
                        <span className="text-2xl">🌍</span>
                        <span className="text-2xl">🔥</span>
                        <span className="text-2xl">🌿</span>
                        <span className="text-2xl">👥</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                        For Patients
                      </h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Create Treatment Request</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Recovery Logger</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Community Support</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Traditional Healing</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                        For Sponsors
                      </h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Browse Treatments</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Sponsor Dashboard</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Impact Tracking</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Community Recognition</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                        Research & Data
                      </h3>
                      <ul className="space-y-2">
                        <li><Link to="/research" className="text-gray-600 hover:text-gray-900">Contribute Data</Link></li>
                        <li><Link to="/research-api" className="text-gray-600 hover:text-gray-900">API Access</Link></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Protection</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-gray-900">Earn LIVES Tokens</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm">
                        © 2025 Ubuntu Health - Healing Atlas. Built with Ubuntu philosophy and decentralized technology.
                      </p>
                      <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Ubuntu Community</span>
                          🔥
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Traditional Healing</span>
                          🌿
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Global Network</span>
                          🌍
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// HomePage Component
const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ubuntu Health
              <span className="block text-3xl md:text-4xl text-orange-600 font-medium">
                Healing Atlas
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connecting hearts, healing communities. Sponsor treatment journeys, 
              log recovery stories, and embody Ubuntu philosophy - "I am because we are."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/browse"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sponsor a Treatment
              </Link>
              <Link 
                to="/recovery"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Log Your Recovery
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Healing Atlas Core Features
          </h2>
          <p className="text-xl text-gray-600">
            Restored from the original Healing Atlas vision with Ubuntu philosophy integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Healthcare Sponsorship */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthcare Sponsorship</h3>
            <p className="text-gray-600 mb-4">
              NFT Treatment Passes with milestone-based funding. Sponsors support patients 
              through verified healthcare providers with community validation.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Milestone-based fund release</li>
              <li>• Healthcare provider verification</li>
              <li>• Community endorsement system</li>
              <li>• Elder council approval</li>
            </ul>
          </div>

          {/* Recovery Documentation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Recovery Documentation</h3>
            <p className="text-gray-600 mb-4">
              Cryptographically timestamped recovery logging with multimedia support. 
              Document your healing journey with privacy and integrity.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• IPFS/Arweave storage</li>
              <li>• Cryptographic timestamping</li>
              <li>• Interactive journey visualization</li>
              <li>• Community witness validation</li>
            </ul>
          </div>

          {/* Traditional Healing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Traditional Healing Integration</h3>
            <p className="text-gray-600 mb-4">
              Blend modern healthcare with Ubuntu traditional healing practices. 
              Elder council guidance with cultural sensitivity and wisdom.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Traditional healer credentials</li>
              <li>• Cultural protocol observance</li>
              <li>• Elder wisdom integration</li>
              <li>• Holistic healing approach</li>
            </ul>
          </div>

          {/* Community Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ubuntu Community Support</h3>
            <p className="text-gray-600 mb-4">
              Diaspora network connections, community validation, and shared humanity 
              in every healing journey. Ubuntu philosophy in action.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Global diaspora network</li>
              <li>• Community consensus mechanisms</li>
              <li>• Shared humanity principles</li>
              <li>• Cultural sensitivity validation</li>
            </ul>
          </div>

          {/* Research Data */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🔬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy-Preserving Research</h3>
            <p className="text-gray-600 mb-4">
              Share your anonymized health data to advance medical research and earn $LIVES tokens. 
              Zero-knowledge proofs ensure complete privacy protection.
            </p>
            <ul className="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Earn 300-2000 LIVES tokens per contribution</li>
              <li>• Zero-knowledge proof anonymization</li>
              <li>• Ubuntu community governance oversight</li>
              <li>• Support global medical advancement</li>
            </ul>
            <div className="flex space-x-3">
              <Link 
                to="/research" 
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Contribute Data
              </Link>
              <Link 
                to="/research-api" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                API Access
              </Link>
            </div>
          </div>

          {/* Healthcare Provider Integration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthcare Provider Integration</h3>
            <p className="text-gray-600 mb-4">
              Medical professional verification system with FHIR/HL7 integration. 
              Seamless healthcare data exchange and milestone verification.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Provider credential verification</li>
              <li>• FHIR/HL7 data integration</li>
              <li>• Electronic health records</li>
              <li>• Milestone verification system</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ubuntu Philosophy Section */}
      <div className="bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ubuntu Philosophy in Healthcare
            </h2>
            <p className="text-xl text-gray-600">
              "I am because we are" - The foundation of our healing community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Shared Humanity in Healing
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Community-Centered Care</h4>
                    <p className="text-gray-600">
                      Every treatment journey is supported by the entire Ubuntu community, 
                      with elders providing wisdom and guidance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🌿</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Traditional Wisdom Integration</h4>
                    <p className="text-gray-600">
                      Blend ancestral healing knowledge with modern medicine, 
                      respecting cultural protocols and elder guidance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Global Ubuntu Network</h4>
                    <p className="text-gray-600">
                      Connect diaspora communities worldwide, enabling remote support 
                      and cultural connection in healing journeys.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <blockquote className="text-lg text-gray-800 mb-4">
                "Ubuntu speaks particularly about the fact that you can't exist as a 
                human being in isolation. We think of ourselves far too frequently as 
                just individuals, separated from one another, when you are connected 
                and what you do affects the whole world."
              </blockquote>
              <cite className="text-gray-600">
                — Archbishop Desmond Tutu
              </cite>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Ubuntu Health Values</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Compassion</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Community</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Wisdom</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Healing</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Humanity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Community Impact
          </h2>
          <p className="text-xl text-gray-600">
            Ubuntu Health community making a difference in healthcare accessibility
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600">Active Treatments</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">8</div>
            <div className="text-gray-600">Completed Recoveries</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">150+</div>
            <div className="text-gray-600">Community Sponsors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">25</div>
            <div className="text-gray-600">Elder Council Members</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Ubuntu Health Community
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're seeking healing, wanting to sponsor, or contributing wisdom, 
            the Ubuntu community welcomes you with open arms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
              Connect Wallet & Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Learn More About Ubuntu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
