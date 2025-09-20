'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check backend health
    fetch('http://localhost:3001/health')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="ubuntu-gradient text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Ubuntu Health</h1>
              <p className="text-xl opacity-90">Production Platform Preview</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Status</div>
              <div className={`text-lg font-semibold ${backendStatus ? 'text-green-200' : 'text-red-200'}`}>
                {loading ? 'Checking...' : backendStatus ? '🟢 Backend Online' : '🔴 Backend Offline'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Architecture Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Production Platform Architecture
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Backend */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Backend API</h3>
                  <p className="text-gray-600">Express.js + TypeScript</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ RESTful API endpoints</li>
                <li>✅ PostgreSQL + Prisma ORM</li>
                <li>✅ JWT authentication</li>
                <li>✅ Rate limiting & security</li>
                <li>✅ Email/SMS notifications</li>
              </ul>
            </div>

            {/* Frontend */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🖥️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Frontend App</h3>
                  <p className="text-gray-600">Next.js 14 + React</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Modern React with TypeScript</li>
                <li>✅ Tailwind CSS styling</li>
                <li>✅ Solana wallet integration</li>
                <li>✅ Mobile-responsive design</li>
                <li>✅ Real-time updates</li>
              </ul>
            </div>

            {/* Blockchain */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⛓️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Smart Contracts</h3>
                  <p className="text-gray-600">Rust + Solana</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Treatment sponsorship escrow</li>
                <li>✅ Data contribution rewards</li>
                <li>✅ DAO governance system</li>
                <li>✅ NFT treatment passes</li>
                <li>✅ $LIVES token integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Preview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            API Endpoints Preview
          </h2>
          
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm overflow-x-auto">
            <div className="mb-4">
              <span className="text-yellow-400">GET</span> /health
              <div className="ml-4 text-gray-400">→ Backend health check</div>
            </div>
            <div className="mb-4">
              <span className="text-blue-400">POST</span> /api/v1/auth/login
              <div className="ml-4 text-gray-400">→ Wallet authentication</div>
            </div>
            <div className="mb-4">
              <span className="text-yellow-400">GET</span> /api/v1/patients
              <div className="ml-4 text-gray-400">→ Patient management</div>
            </div>
            <div className="mb-4">
              <span className="text-yellow-400">GET</span> /api/v1/sponsors
              <div className="ml-4 text-gray-400">→ Sponsor discovery</div>
            </div>
            <div className="mb-4">
              <span className="text-yellow-400">GET</span> /api/v1/treatments
              <div className="ml-4 text-gray-400">→ Treatment requests & milestones</div>
            </div>
            <div>
              <span className="text-yellow-400">GET</span> /api/v1/blockchain/balance/:wallet
              <div className="ml-4 text-gray-400">→ Wallet balance & tokens</div>
            </div>
          </div>
        </section>

        {/* Sample Data Preview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Sample Treatment Request
          </h2>
          
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Sarah Chen - CAR-T Therapy</h3>
                <p className="text-gray-600">Houston, TX • High Priority</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">$400,000</div>
                <div className="text-sm text-gray-500">Target Amount</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Funding Progress</span>
                <span>$75,000 / $400,000 (18.75%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '18.75%'}}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700">Treatment Milestones</div>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    <span>Initial Consultation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-500 mr-2">🔄</span>
                    <span>Pre-treatment Testing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-400 mr-2">⏳</span>
                    <span>Cell Collection</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-400 mr-2">⏳</span>
                    <span>Treatment Administration</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Sponsors</div>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>Healthcare DAO - $50,000</li>
                  <li>Medical Research Fund - $25,000</li>
                  <li>+ seeking additional funding</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Development Status */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Development Status
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">✅ Completed</h3>
              <ul className="space-y-2 text-green-700">
                <li>• Production backend API architecture</li>
                <li>• Next.js frontend application scaffold</li>
                <li>• Database schema design (15+ tables)</li>
                <li>• Smart contract integration layer</li>
                <li>• Security middleware & authentication</li>
                <li>• Email/SMS notification system</li>
                <li>• Development environment setup</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">🚧 In Progress</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Smart contract deployment to devnet</li>
                <li>• Core API endpoint implementations</li>
                <li>• Frontend component development</li>
                <li>• Patient onboarding flow</li>
                <li>• Sponsor discovery interface</li>
                <li>• Milestone tracking system</li>
                <li>• Real-time notification integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Network State Positioning */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Network State Healthcare Infrastructure
            </h2>
            <p className="text-lg text-gray-700 text-center mb-6">
              Ubuntu Health serves as foundational healthcare infrastructure that Network States and 
              decentralized communities can use to coordinate advanced medical treatments for their citizens.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <h4 className="font-semibold text-gray-800">Global Coordination</h4>
                <p className="text-sm text-gray-600">Citizens access treatments worldwide</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h4 className="font-semibold text-gray-800">Community Funding</h4>
                <p className="text-sm text-gray-600">Pool resources for expensive procedures</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔬</div>
                <h4 className="font-semibold text-gray-800">Research Advancement</h4>
                <p className="text-sm text-gray-600">Contribute data to accelerate medical progress</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Launch Production Development
            </h2>
            <p className="text-gray-600 mb-6">
              The foundational architecture is complete. Next steps: deploy smart contracts, 
              implement core API endpoints, and build user interfaces.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="http://localhost:3001/health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Backend API
              </a>
              <a 
                href="http://localhost:3001/api-docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                API Documentation
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ubuntu Health</h3>
          <p className="text-gray-400">
            Healthcare infrastructure for Network States and decentralized communities
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Production Platform Preview • September 2025
          </p>
        </div>
      </footer>
    </div>
  );
}