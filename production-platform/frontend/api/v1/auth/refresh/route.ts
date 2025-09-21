import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Refresh token required' 
        },
        { status: 400 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-minimum-32-characters-ubuntu-health-2025';
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtSecret) as any;

    if (decoded.type !== 'refresh') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid refresh token' 
        },
        { status: 401 }
      );
    }

    // Create new access token
    const currentTime = Math.floor(Date.now() / 1000);
    const newToken = jwt.sign(
      { 
        walletAddress: decoded.walletAddress,
        iat: currentTime,
        exp: currentTime + (24 * 60 * 60) // 24 hours
      },
      jwtSecret
    );

    return NextResponse.json({
      success: true,
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Invalid refresh token' 
      },
      { status: 401 }
    );
  }
}