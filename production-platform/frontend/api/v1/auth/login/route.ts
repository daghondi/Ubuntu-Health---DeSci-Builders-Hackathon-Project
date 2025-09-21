import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

// Verify Solana signature
function verifySolanaSignature(publicKey: string, signature: string, message: string): boolean {
  try {
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);
    
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicKey, signature, message } = body;

    // Validate required fields
    if (!publicKey || !signature || !message) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required fields: publicKey, signature, message' 
        },
        { status: 400 }
      );
    }

    // Verify Solana signature
    const isValidSignature = verifySolanaSignature(publicKey, signature, message);
    
    if (!isValidSignature) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid signature' 
        },
        { status: 401 }
      );
    }

    // Create JWT tokens
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-minimum-32-characters-ubuntu-health-2025';
    const currentTime = Math.floor(Date.now() / 1000);

    const token = jwt.sign(
      { 
        walletAddress: publicKey,
        iat: currentTime,
        exp: currentTime + (24 * 60 * 60) // 24 hours
      },
      jwtSecret
    );

    const refreshToken = jwt.sign(
      { 
        walletAddress: publicKey,
        type: 'refresh',
        iat: currentTime,
        exp: currentTime + (7 * 24 * 60 * 60) // 7 days
      },
      jwtSecret
    );

    return NextResponse.json({
      success: true,
      token,
      refreshToken,
      user: {
        walletAddress: publicKey,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}