# 🚀 Manual Backend Deployment Guide - tale-verse.app

## Status: Ready for Deployment ✅

Your backend API is ready to deploy to Railway with custom domain `api.tale-verse.app`.

## 🎯 Quick Deploy Options

### Option 1: Railway Dashboard (Recommended - 5 minutes)

1. **Go to Railway:** https://railway.app
2. **New Project → Deploy from GitHub:**
   - Repository: `daghondi/Ubuntu-Health---DeSci-Builders-Hackathon-Project`
   - Root Directory: `production-platform/backend`
   - Branch: `main`

3. **Environment Variables (Required):**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-here
   CORS_ORIGIN=https://www.tale-verse.app,https://tale-verse.app
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_COMMITMENT=confirmed
   ```

4. **Deploy:**
   - Railway will auto-detect Node.js
   - Build command: `npm install && npm run build` (if build fails, use `npm start`)
   - Start command: `npm start`

5. **Custom Domain:**
   - Settings → Networking → Custom Domain
   - Add: `api.tale-verse.app`
   - Railway will provide CNAME record to add to your DNS

### Option 2: Railway CLI (Advanced)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   cd production-platform/backend
   railway project create ubuntu-health-api
   railway up
   ```

3. **Set Environment Variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   railway variables set JWT_SECRET="your-secret-key"
   railway variables set CORS_ORIGIN="https://www.tale-verse.app,https://tale-verse.app"
   ```

## 🌐 DNS Configuration After Backend Deploy

### 1. Get Railway Domain
After deployment, Railway will give you a domain like:
- `ubuntu-health-api-production-abc123.up.railway.app`

### 2. Add DNS Record
In your domain registrar (where you bought tale-verse.app):
```
Type: CNAME
Name: api
Value: ubuntu-health-api-production-abc123.up.railway.app
TTL: 300
```

Or if Railway provides a custom domain setup, add:
```
Type: CNAME  
Name: api.tale-verse.app
Value: [Railway's CNAME target]
```

## ✅ Verification After Deploy

### Test Backend Health:
1. **Railway URL:** `https://ubuntu-health-api-production-abc123.up.railway.app/health`
2. **Custom Domain:** `https://api.tale-verse.app/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-09-21T...",
  "version": "1.0.0",
  "environment": "production"
}
```

### Test API Endpoints:
- **API Docs:** `https://api.tale-verse.app/api-docs`
- **Auth Login:** `POST https://api.tale-verse.app/api/v1/auth/login`

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Set start command to `npm start` (skip build for now)
   - Check Node.js version in Railway settings (use Node 18+)

2. **Environment Variables:**
   - Make sure JWT_SECRET is at least 32 characters
   - CORS_ORIGIN must include your frontend domain

3. **Port Issues:**
   - Railway auto-assigns port - don't hardcode PORT in code
   - Use `process.env.PORT || 3001`

4. **Domain Not Working:**
   - DNS propagation takes 5-60 minutes
   - Check DNS with: `nslookup api.tale-verse.app`

## 🎉 Next Steps After Backend Deploy

1. **Update Frontend:**
   - Verify `NEXT_PUBLIC_API_URL=https://api.tale-verse.app` in Vercel
   - Redeploy frontend if needed

2. **Test Full Flow:**
   - Visit `https://www.tale-verse.app`
   - Connect wallet → Login → Verify API calls work

3. **Monitor:**
   - Railway dashboard shows logs and metrics
   - Set up Railway alerts for downtime

---

**Ready to deploy?** Use Option 1 (Railway Dashboard) for easiest deployment! 🚀

Your backend will be live at `api.tale-verse.app` in under 10 minutes.