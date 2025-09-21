#!/bin/bash
# Railway Deployment Script for Ubuntu Health Backend

echo "🚀 Deploying Ubuntu Health Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "Please login to Railway if prompted..."
railway login

# Initialize Railway project
cd production-platform/backend
railway project create ubuntu-health-api

# Set environment variables
echo "Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-here"
railway variables set CORS_ORIGIN="https://www.tale-verse.app,https://tale-verse.app"
railway variables set SOLANA_RPC_URL="https://api.devnet.solana.com"
railway variables set SOLANA_COMMITMENT="confirmed"

# Deploy
echo "Deploying to Railway..."
railway up

echo "✅ Backend deployed! Check Railway dashboard for domain setup."
echo "Next: Add custom domain 'api.tale-verse.app' in Railway dashboard"