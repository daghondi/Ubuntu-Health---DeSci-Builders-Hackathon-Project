import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiDocs = {
      title: 'Ubuntu Health API',
      version: '1.0.0',
      description: 'Decentralized healthcare platform API - Vercel Functions',
      platform: 'Vercel Functions',
      baseUrl: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'https://tale-verse.app',
      endpoints: {
        health: {
          url: '/api/health',
          method: 'GET',
          description: 'Health check endpoint',
          response: 'Server status and information'
        },
        authentication: {
          login: {
            url: '/api/v1/auth/login',
            method: 'POST',
            description: 'Authenticate with Solana wallet signature',
            body: {
              publicKey: 'string - Solana wallet public key',
              signature: 'string - Signed message signature',
              message: 'string - Message that was signed'
            }
          },
          refresh: {
            url: '/api/v1/auth/refresh',
            method: 'POST',
            description: 'Refresh JWT access token',
            body: {
              refreshToken: 'string - Valid refresh token'
            }
          },
          me: {
            url: '/api/v1/auth/me',
            method: 'GET',
            description: 'Get current authenticated user info',
            headers: {
              Authorization: 'Bearer <access_token>'
            }
          }
        },
        data: {
          patients: '/api/v1/patients - Get patients data (authenticated)',
          sponsors: '/api/v1/sponsors - Get sponsors data (authenticated)',
          treatments: '/api/v1/treatments - Get treatments data (authenticated)',
          sponsorships: '/api/v1/sponsorships - Get sponsorships data (authenticated)',
          research: '/api/v1/research - Get research data (authenticated)',
          governance: '/api/v1/governance - Get governance data (authenticated)'
        }
      },
      authentication: {
        type: 'JWT Bearer Token',
        description: 'Include token in Authorization header: Bearer <token>',
        login_flow: [
          '1. User connects Solana wallet',
          '2. User signs authentication message',
          '3. POST to /api/v1/auth/login with signature',
          '4. Receive JWT tokens',
          '5. Use access token in Authorization header',
          '6. Refresh token when access token expires'
        ]
      },
      solana: {
        network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
        rpc: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
      },
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(apiDocs, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('API docs error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load API documentation',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}