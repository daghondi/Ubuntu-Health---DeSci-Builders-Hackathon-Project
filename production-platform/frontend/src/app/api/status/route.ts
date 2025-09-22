import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Ubuntu Health Production Platform',
    version: '1.0.0',
    features: {
      interactiveModals: true,
      socialSharing: true,
      patientDetailCards: true,
      learnMoreButtons: true,
      testimonialSharing: true
    },
    deployment: {
      platform: 'Vercel',
      environment: 'production',
      region: process.env.VERCEL_REGION || 'unknown'
    }
  });
}