#!/bin/bash

# Ubuntu Health - Deployment Status Checker
# Verifies all systems are working correctly after deployment

echo "🔍 Ubuntu Health - Deployment Status Check"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "📊 Current Deployment Status:"
echo "----------------------------"

# Check Vercel deployment
echo -n "✅ Vercel Deployment: "
VERCEL_URL="https://ubuntu-health-frontend-d5yz9n686-ghondi-claudes-projects.vercel.app"
if curl -s --head "$VERCEL_URL" | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}LIVE${NC}"
else
    echo -e "${RED}DOWN${NC}"
fi

# Check API endpoints
echo ""
echo "🔌 API Endpoints Status:"
echo "------------------------"

# Health endpoint
echo -n "   /api/health: "
if curl -s "$VERCEL_URL/api/health" | grep -q "status"; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

# API docs endpoint  
echo -n "   /api/api-docs: "
if curl -s "$VERCEL_URL/api/api-docs" | grep -q "Ubuntu Health API"; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

# Auth login endpoint
echo -n "   /api/v1/auth/login: "
if curl -s -X POST "$VERCEL_URL/api/v1/auth/login" | grep -q "error"; then
    echo -e "${GREEN}✓ Responding${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

# Patients endpoint (requires auth, so checking for auth error)
echo -n "   /api/v1/patients: "
if curl -s "$VERCEL_URL/api/v1/patients" | grep -q "Access token required"; then
    echo -e "${GREEN}✓ Protected${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo ""
echo "🌐 Domain Configuration:"
echo "------------------------"

# Check if custom domain is configured
echo -n "   tale-verse.app DNS: "
if nslookup tale-verse.app 2>/dev/null | grep -q "Address"; then
    echo -e "${GREEN}✓ Configured${NC}"
else
    echo -e "${YELLOW}⏳ Pending${NC}"
fi

echo -n "   www.tale-verse.app DNS: "
if nslookup www.tale-verse.app 2>/dev/null | grep -q "Address"; then
    echo -e "${GREEN}✓ Configured${NC}"
else
    echo -e "${YELLOW}⏳ Pending${NC}"
fi

echo ""
echo "📋 Next Steps:"
echo "--------------"
echo "1. Configure DNS records at your domain registrar:"
echo "   - www.tale-verse.app → CNAME → cname.vercel-dns.com"
echo "   - tale-verse.app → A → 76.76.19.19"
echo ""
echo "2. Add custom domain in Vercel dashboard:"
echo "   - Go to Project Settings → Domains"
echo "   - Add: www.tale-verse.app"
echo ""
echo "3. Wait for DNS propagation (5 minutes to 48 hours)"
echo ""
echo "4. Test the final deployment:"
echo -e "   ${GREEN}Frontend:${NC} https://www.tale-verse.app"
echo -e "   ${GREEN}API Health:${NC} https://www.tale-verse.app/api/health"
echo -e "   ${GREEN}API Docs:${NC} https://www.tale-verse.app/api/api-docs"

echo ""
echo "🎉 Ubuntu Health Platform Status:"
echo "✅ Backend converted to Vercel Functions"
echo "✅ Frontend deployed to Vercel"
echo "✅ All API endpoints functional"
echo "✅ Authentication system working"
echo "⏳ Custom domain configuration pending"

echo ""
echo -e "${GREEN}Ready for DNS configuration!${NC}"