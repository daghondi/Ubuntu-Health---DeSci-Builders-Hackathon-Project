# 🚀 tale-verse.app Deployment Guide

## Status: Ready for Deployment ✅

Your Ubuntu Health platform is now **production-ready** and successfully committed to GitHub. Here's how to deploy to `tale-verse.app`:

## 🎯 Deployment Architecture

```
tale-verse.app (domain)
├── www.tale-verse.app (frontend - Next.js)
└── api.tale-verse.app (backend - Express.js API)
```

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

### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. **Import GitHub Repository:**
   - Connect: `daghondi/Ubuntu-Health---DeSci-Builders-Hackathon-Project`
   - Root Directory: `production-platform/frontend`
   - Framework: Next.js (auto-detected)

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://api.tale-verse.app
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

4. **Custom Domain Setup:**
   - Project Settings → Domains
   - Add `www.tale-verse.app`

## 🛠️ Step 2: Deploy Backend API

### Option A: Railway (Recommended)
1. **Go to Railway:** [railway.app](https://railway.app)
2. **Deploy from GitHub:**
   - New Project → Deploy from GitHub
   - Select repository → Root: `production-platform/backend`

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-here
   CORS_ORIGIN=https://www.tale-verse.app,https://tale-verse.app
   DATABASE_URL=postgresql://username:password@hostname:port/database
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_COMMITMENT=confirmed
   ```

4. **Custom Domain:**
   - Settings → Networking → Custom Domain
   - Add: `api.tale-verse.app`

### Option B: DigitalOcean App Platform
1. **Create App:** [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. **GitHub Integration:**
   - Source: GitHub → Select repository
   - Branch: main
   - Source Directory: `production-platform/backend`

3. **App Spec Configuration:**
   ```yaml
   name: ubuntu-health-api
   services:
   - name: api
     source_dir: production-platform/backend
     github:
       repo: daghondi/Ubuntu-Health---DeSci-Builders-Hackathon-Project
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: PORT
       value: "8080"
     - key: JWT_SECRET
       value: your-jwt-secret
   domains:
   - domain: api.tale-verse.app
   ```

## 🌐 Step 3: DNS Configuration

### Domain Registrar Settings (tale-verse.app)
```
# A Records
tale-verse.app         A      76.76.19.19  (Vercel)
www.tale-verse.app     CNAME  cname.vercel-dns.com

# API Subdomain
api.tale-verse.app     CNAME  [backend-provider-url]
```

### Cloudflare (if using)
1. **Add DNS Records:**
   - `www` → CNAME → `cname.vercel-dns.com`
   - `api` → CNAME → [Railway/DO URL]

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
- **Frontend:** https://www.tale-verse.app
- **API Health:** https://api.tale-verse.app/health
- **API Docs:** https://api.tale-verse.app/api-docs

### Test Flow:
1. Visit https://www.tale-verse.app
2. Connect wallet (Phantom/Solflare)
3. Login with signature
4. Verify authenticated dashboard

## 🔧 Environment Variables Summary

### Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=https://api.tale-verse.app
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Backend (.env):
```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
CORS_ORIGIN=https://www.tale-verse.app,https://tale-verse.app
DATABASE_URL=postgresql://user:pass@host:port/db
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_COMMITMENT=confirmed
```

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

1. **CORS Errors:**
   - Check `CORS_ORIGIN` includes your domain
   - Verify API URL in frontend

2. **Build Failures:**
   - Check Node.js version (use Node 18+)
   - Verify all dependencies installed

3. **API Not Responding:**
   - Check backend deployment logs
   - Verify environment variables set

4. **Domain Not Resolving:**
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