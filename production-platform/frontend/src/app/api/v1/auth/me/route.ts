import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-minimum-32-characters-ubuntu-health-2025';
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Access token required or invalid' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        walletAddress: (user as any).walletAddress,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('User info error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}