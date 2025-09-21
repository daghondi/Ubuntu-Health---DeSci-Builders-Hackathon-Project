# 🚀 tale-verse.app Deployment Guide

## Status: Ready for Deployment ✅

Your Ubuntu Health platform is now **production-ready** and successfully committed to GitHub. Here's how to deploy to `tale-verse.app`:

## 🎯 Deployment Architecture ✅ UPDATED

```
tale-verse.app (domain)
├── www.tale-verse.app (UNIFIED - Next.js + API Routes)
└── [NO SEPARATE BACKEND NEEDED]
```

**✅ BACKEND CONVERTED:** Express.js backend has been successfully converted to Vercel Functions (Next.js API routes). No separate backend deployment needed!

## 📝 Step 1: Deploy Frontend to Vercel

### Option A: Vercel CLI (Recommended)
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from GitHub:**
   ```bash
   cd production-platform/frontend
   vercel --prod
   ```

4. **Configure Custom Domain:**
   - In Vercel dashboard → Project Settings → Domains
   - Add: `www.tale-verse.app`
   - Point DNS: `CNAME www -> cname.vercel-dns.com`

### Option B: Vercel Dashboard (Recommended) ✅ FIXED

1. Go to [vercel.com](https://vercel.com)
2. **Import GitHub Repository:**
   - Connect: `daghondi/Ubuntu-Health---DeSci-Builders-Hackathon-Project`
   - **IMPORTANT**: Leave Root Directory empty 
   - Framework: Next.js (auto-detected)
   - The `vercel.json` file will automatically handle the correct build paths

3. **Environment Variables (Updated for Vercel Functions):**
   ```env
   NEXT_PUBLIC_API_URL=/api
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   JWT_SECRET=ubuntu_health_super_secret_jwt_key_2024_production_ready
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   API_VERSION=v1
   NODE_ENV=production
   ```

4. **Deploy Settings (Auto-configured via vercel.json):**
   - ✅ Build Command: `cd production-platform/frontend && npm run build`
   - ✅ Output Directory: `production-platform/frontend/.next`
   - ✅ Install Command: `cd production-platform/frontend && npm install`

5. **Custom Domain Setup:**
   - Project Settings → Domains
   - Add `www.tale-verse.app`

## ✅ Step 2: Backend Already Integrated!

**🎉 NO SEPARATE BACKEND NEEDED!** 

The Express.js backend has been successfully converted to **Vercel Functions** (Next.js API routes). All API endpoints are now part of the unified Next.js deployment:

### Available API Endpoints (Built-in):
- `GET /api/health` - Health check
- `GET /api/api-docs` - API documentation  
- `POST /api/v1/auth/login` - Solana wallet authentication
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/me` - User information
- `GET /api/v1/patients` - Patient data with filtering
- `GET /api/v1/sponsors` - Sponsor data with filtering
- `GET /api/v1/treatments` - Treatment protocols
- `GET /api/v1/sponsorships` - Sponsorship tracking
- `GET /api/v1/research` - Research studies
- `GET /api/v1/governance` - DAO governance proposals

### Benefits:
- ✅ **Cost**: No separate backend hosting needed
- ✅ **Performance**: Edge functions with global distribution
- ✅ **Maintenance**: Single deployment pipeline
- ✅ **Scaling**: Automatic serverless scaling

## 🌐 Step 3: DNS Configuration

### Domain Registrar Settings (tale-verse.app)
```dns
# Updated for Unified Vercel Deployment
tale-verse.app         A      76.76.19.19  (Vercel)
www.tale-verse.app     CNAME  cname.vercel-dns.com

# NO SEPARATE API SUBDOMAIN NEEDED
# All API endpoints are served from www.tale-verse.app/api/*
```

### Cloudflare (if using)
1. **Add DNS Records:**
   - `www` → CNAME → `cname.vercel-dns.com`
   - ~~`api` → No longer needed~~

2. **SSL/TLS Settings:**
   - Mode: Full (strict)
   - Always Use HTTPS: On

## 🚀 Step 4: Quick Deploy Commands

### Deploy Everything (Run in order):

```bash
# 1. Deploy Frontend to Vercel
cd production-platform/frontend
vercel --prod

# 2. Get backend URL from Railway/DO
# 3. Update frontend env vars with API URL
vercel env add NEXT_PUBLIC_API_URL

# 4. Redeploy frontend with updated API URL
vercel --prod
```

## ✅ Step 5: Verification

### Test URLs:
- **Frontend:** <https://www.tale-verse.app>
- **API Health:** <https://www.tale-verse.app/api/health>
- **API Docs:** <https://www.tale-verse.app/api/api-docs>

### Test Flow:
1. Visit https://www.tale-verse.app
2. Connect wallet (Phantom/Solflare)
3. Login with signature
4. Verify authenticated dashboard

## 🔧 Environment Variables Summary

### Unified Next.js App (.env.local):
```env
# Frontend Configuration
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Vercel Functions (API) Configuration
JWT_SECRET=ubuntu_health_super_secret_jwt_key_2024_production_ready
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
API_VERSION=v1
NODE_ENV=production
```

### ~~Backend (.env): NO LONGER NEEDED~~
Backend has been converted to Vercel Functions - all configuration is in the single Next.js app.

## 🚨 Production Checklist

- [x] Frontend build successful ✅
- [x] Backend API routes working ✅
- [x] JWT authentication implemented ✅
- [x] Solana wallet integration ✅
- [x] GitHub repository updated ✅
- [ ] Vercel deployment configured
- [ ] Backend deployment configured
- [ ] DNS records updated
- [ ] SSL certificates active
- [ ] Environment variables set
- [ ] Domain pointing correctly

## 🆘 Troubleshooting

### Common Issues:

1. **Vercel Build Errors (FIXED ✅):**
   - ✅ Fixed: "Couldn't find any pages or app directory" 
   - ✅ Fixed: Missing environment variables in next.config.js
   - ✅ Fixed: Wrong root directory configuration
   - Solution: Updated vercel.json with correct build paths

2. **CORS Errors:**
   - Check `CORS_ORIGIN` includes your domain
   - Verify API URL in frontend

3. **Build Failures:**
   - Check Node.js version (use Node 18+)
   - Verify all dependencies installed

4. **API Not Responding:**
   - Check backend deployment logs
   - Verify environment variables set

5. **Domain Not Resolving:**
   - DNS propagation takes 24-48 hours
   - Use `nslookup` to verify DNS records

## 🎉 Next Steps After Deployment

1. **Monitor with:**
   - Vercel Analytics
   - Railway/DO monitoring dashboards

2. **Scale with:**
   - PostgreSQL database (Railway/Supabase)
   - Redis for sessions (Railway/Upstash)
   - CDN for assets (Cloudflare)

---

**Ready to deploy?** Start with Step 1 above! 🚀

Your production platform is now live-ready with:
- ✅ Complete authentication system
- ✅ Solana wallet integration  
- ✅ Production build optimization
- ✅ Deployment configurations
- ✅ Environment templates
- ✅ Health check endpoints