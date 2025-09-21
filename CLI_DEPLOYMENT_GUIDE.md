# 🚀 Command-Line Deployment Guide for tale-verse.app

## ⚡ One-Command Deployment

Deploy your entire Ubuntu Health platform to tale-verse.app with just one command!

### PowerShell (Windows):
```powershell
.\deploy-to-tale-verse.ps1
```

### Bash (Linux/Mac):
```bash
chmod +x deploy-to-tale-verse.sh
./deploy-to-tale-verse.sh
```

## 📋 What the Script Does

1. **Installs CLI Tools:**
   - Vercel CLI for frontend deployment
   - Railway CLI for backend deployment

2. **Deploys Frontend to Vercel:**
   - Builds and deploys your Next.js app
   - Sets up environment variables
   - Configures custom domain: `www.tale-verse.app`

3. **Deploys Backend to Railway:**
   - Deploys your Express.js API
   - Sets up environment variables
   - Configures for custom domain: `api.tale-verse.app`

4. **Provides Next Steps:**
   - DNS configuration instructions
   - Verification URLs
   - Testing guide

## 🔧 Prerequisites

- **Node.js 18+** installed
- **Git** repository access
- **Vercel account** (free)
- **Railway account** (free)
- **Domain access** to tale-verse.app DNS settings

## ⚡ Quick Start

1. **Clone and navigate to your project:**
   ```bash
   cd "Ubuntu Health - DeSci Builders Hackathon Project/Ubuntu-Health---DeSci-Builders-Hackathon-Project"
   ```

2. **Run deployment script:**
   ```powershell
   .\deploy-to-tale-verse.ps1
   ```

3. **Follow prompts to login to:**
   - Vercel (browser will open)
   - Railway (browser will open)

4. **Wait for deployment** (2-5 minutes)

5. **Configure DNS** (manual step):
   - Add CNAME: `www.tale-verse.app` → `cname.vercel-dns.com`
   - Add CNAME: `api.tale-verse.app` → [Railway domain from dashboard]

6. **Verify deployment:**
   ```powershell
   .\verify-deployment.ps1
   ```

## 🌐 DNS Configuration

After running the script, you'll need to add these DNS records in your domain registrar:

```dns
# Frontend (Vercel)
www.tale-verse.app    CNAME    cname.vercel-dns.com

# Backend (Railway) - Get exact domain from Railway dashboard
api.tale-verse.app    CNAME    ubuntu-health-api-production-abc123.up.railway.app
```

## ✅ Verification

Your platform will be live at:
- **Frontend:** https://www.tale-verse.app
- **Backend Health:** https://api.tale-verse.app/health
- **API Docs:** https://api.tale-verse.app/api-docs

Test the full flow:
1. Visit frontend → Connect wallet → Login → Verify authentication

## 🛠️ Troubleshooting

### Common Issues:

1. **"Command not found: vercel/railway"**
   - Script will auto-install CLIs
   - Restart terminal after installation

2. **Login prompts**
   - Browser windows will open for authentication
   - Login with GitHub accounts

3. **Domain not working**
   - DNS propagation takes 5-60 minutes
   - Verify DNS records are correct

4. **Backend connection errors**
   - Check Railway deployment logs
   - Ensure custom domain is added in Railway dashboard

### Manual Steps:

If automatic domain setup fails:

1. **Vercel Dashboard:**
   - Go to project → Settings → Domains
   - Add: `www.tale-verse.app`

2. **Railway Dashboard:**
   - Go to project → Settings → Networking
   - Add: `api.tale-verse.app`

## 🎉 Success!

Once DNS propagates (5-60 minutes), your Ubuntu Health platform will be fully live at:

🌐 **https://www.tale-verse.app** 

Complete with:
- ✅ Solana wallet authentication
- ✅ JWT session management  
- ✅ Production-optimized builds
- ✅ SSL certificates
- ✅ Custom domain setup
- ✅ Health monitoring endpoints

**Total deployment time: ~5 minutes + DNS propagation** 🚀