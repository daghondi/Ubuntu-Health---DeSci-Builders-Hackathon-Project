#!/bin/bash
# 🚀 One-Click Deployment Script for tale-verse.app
# This script deploys both frontend and backend with custom domains

set -e  # Exit on any error

JWT_SECRET=${1:-"your-super-secret-jwt-key-minimum-32-characters-ubuntu-health-2025"}

echo "🚀 Deploying Ubuntu Health to tale-verse.app..."
echo "================================================="

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check if in correct directory
if [ ! -f "production-platform/frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "Expected to find: production-platform/frontend/package.json"
    exit 1
fi

# Install CLIs if needed
echo "📦 Installing deployment tools..."

# Install Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Install Railway CLI
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Prerequisites ready!"

# =====================================
# STEP 1: DEPLOY FRONTEND TO VERCEL
# =====================================

echo ""
echo "🎨 STEP 1: Deploying Frontend to Vercel..."
echo "============================================="

# Login to Vercel
echo "🔐 Please login to Vercel if prompted..."
vercel login

# Deploy frontend
cd production-platform/frontend
echo "🚀 Deploying frontend..."

# Set environment variables for Vercel
echo "🔧 Setting environment variables..."
vercel env add NEXT_PUBLIC_API_URL "https://api.tale-verse.app" production || true
vercel env add NEXT_PUBLIC_SOLANA_NETWORK "devnet" production || true
vercel env add NEXT_PUBLIC_SOLANA_RPC_URL "https://api.devnet.solana.com" production || true

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod --yes

# Add custom domain
echo "🌐 Adding custom domain..."
vercel domains add www.tale-verse.app || true

echo "✅ Frontend deployed to Vercel!"
cd ../..

# =====================================
# STEP 2: DEPLOY BACKEND TO RAILWAY
# =====================================

echo ""
echo "🛠️ STEP 2: Deploying Backend to Railway..."
echo "=========================================="

# Login to Railway
echo "🔐 Please login to Railway if prompted..."
railway login

# Deploy backend
cd production-platform/backend
echo "🚀 Deploying backend..."

# Initialize Railway project
railway project create ubuntu-health-api || true

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set NODE_ENV="production"
railway variables set PORT="3001"
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set CORS_ORIGIN="https://www.tale-verse.app,https://tale-verse.app"
railway variables set SOLANA_RPC_URL="https://api.devnet.solana.com"
railway variables set SOLANA_COMMITMENT="confirmed"

# Deploy
echo "🚀 Deploying to Railway..."
railway up --detach

# Add custom domain info
echo "🌐 Adding custom domain..."
echo "⚠️  Manual step: Add 'api.tale-verse.app' domain in Railway dashboard"
echo "    Go to: https://railway.app → Your Project → Settings → Networking → Custom Domain"

echo "✅ Backend deployed to Railway!"
cd ../..

# =====================================
# STEP 3: VERIFICATION & NEXT STEPS
# =====================================

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================"

echo ""
echo "📋 Your Deployed URLs:"
echo "Frontend: https://www.tale-verse.app"
echo "Backend:  https://api.tale-verse.app (after domain setup)"

echo ""
echo "🌐 DNS Configuration Needed:"
echo "1. Add CNAME record: www.tale-verse.app → cname.vercel-dns.com"
echo "2. Add CNAME record: api.tale-verse.app → [Railway domain from dashboard]"

echo ""
echo "✅ Test Your Deployment:"
echo "1. Visit: https://www.tale-verse.app"
echo "2. Connect wallet (Phantom/Solflare)"
echo "3. Login and verify authentication works"

echo ""
echo "🚀 Your Ubuntu Health platform is now LIVE!"
echo "================================================"