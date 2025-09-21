# tale-verse.app DNS Configuration Guide

## 🌐 DNS Records for tale-verse.app Domain

### Current Vercel Deployment
- **Production URL**: https://ubuntu-health-frontend-d5yz9n686-ghondi-claudes-projects.vercel.app
- **Target Domain**: www.tale-verse.app

### Required DNS Records

#### At Your Domain Registrar (tale-verse.app)
```dns
# Primary domain redirect
tale-verse.app         A      76.76.19.19

# Main application
www.tale-verse.app     CNAME  cname.vercel-dns.com

# Optional: Redirect root to www
tale-verse.app         CNAME  www.tale-verse.app
```

### Step-by-Step DNS Configuration

#### 1. Access Your Domain Registrar
- Login to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
- Navigate to DNS Management for tale-verse.app

#### 2. Add DNS Records
```bash
# Record Type: CNAME
# Name/Host: www
# Value/Target: cname.vercel-dns.com
# TTL: 300 (5 minutes) or Auto

# Record Type: A (if supported) or CNAME
# Name/Host: @ (root domain)
# Value/Target: 76.76.19.19 (Vercel IP) or www.tale-verse.app
# TTL: 300 (5 minutes) or Auto
```

#### 3. Verify DNS Propagation
```bash
# Check DNS propagation (may take 24-48 hours)
nslookup www.tale-verse.app
nslookup tale-verse.app

# Online tools:
# - https://whatsmydns.net/
# - https://dnschecker.org/
```

### Vercel Domain Configuration

#### 1. Add Custom Domain in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `ubuntu-health-frontend`
3. Go to Settings → Domains
4. Add domain: `www.tale-verse.app`
5. Add domain: `tale-verse.app` (optional, for redirects)

#### 2. Verify Domain Ownership
Vercel will automatically verify domain ownership once DNS records are configured.

### SSL Certificate
- ✅ Vercel automatically provisions SSL certificates
- ✅ HTTPS will be enforced automatically
- ✅ HTTP redirects to HTTPS

### Expected Timeline
- **DNS Propagation**: 5 minutes to 48 hours
- **SSL Certificate**: 5-10 minutes after DNS verification
- **Full Activation**: Usually within 1-2 hours

### Troubleshooting

#### Common Issues
1. **Domain not resolving**
   - Check DNS records are correct
   - Wait for DNS propagation (up to 48 hours)
   - Use online DNS checker tools

2. **SSL Certificate issues**
   - Wait for DNS to fully propagate first
   - Vercel will auto-provision SSL once DNS is verified

3. **API endpoints not working**
   - All API endpoints are now at www.tale-verse.app/api/*
   - No separate api.tale-verse.app needed

### Testing After Configuration

#### 1. Basic Connectivity
```bash
# Test domain resolution
ping www.tale-verse.app

# Test HTTPS
curl -I https://www.tale-verse.app
```

#### 2. API Endpoints
```bash
# Health check
curl https://www.tale-verse.app/api/health

# API documentation
curl https://www.tale-verse.app/api/api-docs
```

#### 3. Frontend Application
- Visit: https://www.tale-verse.app
- Test Solana wallet connection
- Verify authentication flow

### Current Status
- ✅ Vercel deployment: LIVE
- ⏳ DNS configuration: IN PROGRESS
- ⏳ Custom domain: PENDING DNS
- ⏳ SSL certificate: PENDING DNS

### Next Steps
1. Configure DNS records at your registrar
2. Add custom domain in Vercel dashboard  
3. Wait for DNS propagation
4. Test full application functionality
5. Update any hardcoded URLs to use new domain

---

**Need help?** Contact your domain registrar's support for DNS configuration assistance.