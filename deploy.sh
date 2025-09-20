#!/bin/bash

# Ubuntu Health Deployment Script
# This script helps deploy the Ubuntu Health platform to tale-verse.app

set -e

echo "🚀 Ubuntu Health Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -d "production-platform" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to deploy frontend
deploy_frontend() {
    echo "📦 Deploying Frontend to Vercel..."
    cd production-platform/frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing frontend dependencies..."
        npm install
    fi
    
    # Build for production
    echo "🔨 Building frontend..."
    npm run build
    
    # Deploy to Vercel (requires Vercel CLI)
    if command -v vercel &> /dev/null; then
        echo "🚀 Deploying to Vercel..."
        vercel --prod --confirm
    else
        echo "⚠️  Vercel CLI not found. Please install: npm i -g vercel"
        echo "📋 Manual deployment steps:"
        echo "   1. Install Vercel CLI: npm i -g vercel"
        echo "   2. Run: vercel login"
        echo "   3. Run: vercel --prod"
    fi
    
    cd ../..
}

# Function to prepare backend
prepare_backend() {
    echo "⚙️  Preparing Backend for deployment..."
    cd production-platform/backend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing backend dependencies..."
        npm install
    fi
    
    # Build TypeScript
    echo "🔨 Building backend..."
    npm run build
    
    echo "✅ Backend prepared for deployment"
    echo "📋 Next steps for backend deployment:"
    echo "   1. Choose hosting platform (Railway, DigitalOcean, AWS, etc.)"
    echo "   2. Set up PostgreSQL database"
    echo "   3. Configure environment variables"
    echo "   4. Deploy using platform-specific method"
    
    cd ../..
}

# Function to show deployment info
show_deployment_info() {
    echo ""
    echo "🌐 Deployment Information"
    echo "========================"
    echo "Frontend URL: https://www.tale-verse.app"
    echo "Backend API: https://api.tale-verse.app"
    echo ""
    echo "📋 Required Environment Variables:"
    echo "Frontend (.env.local):"
    echo "  NEXT_PUBLIC_API_URL=https://api.tale-verse.app"
    echo "  NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com"
    echo ""
    echo "Backend (.env):"
    echo "  NODE_ENV=production"
    echo "  DATABASE_URL=postgresql://..."
    echo "  JWT_SECRET=your-secure-secret"
    echo "  CORS_ORIGIN=https://www.tale-verse.app"
    echo ""
    echo "📚 Full deployment guide: DEPLOYMENT_GUIDE.md"
}

# Main deployment flow
case ${1:-"all"} in
    "frontend")
        deploy_frontend
        ;;
    "backend")
        prepare_backend
        ;;
    "info")
        show_deployment_info
        ;;
    "all"|*)
        echo "🔄 Full deployment preparation..."
        deploy_frontend
        prepare_backend
        show_deployment_info
        ;;
esac

echo ""
echo "✅ Deployment script completed!"
echo "🎯 Ready to deploy to tale-verse.app"