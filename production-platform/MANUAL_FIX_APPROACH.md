# 🔧 Alternative Approach: Update Environment Variables via Dashboard

Since the CLI is having issues linking to the specific ubuntu-health-atlas project, let me guide you through a manual approach:

## 🎯 Quick Manual Fix

### Step 1: Add Environment Variables via Dashboard
1. **Go to**: https://vercel.com/ghondi-claudes-projects/ubuntu-health-atlas
2. **Settings → Environment Variables**
3. **Add these variables** (if missing):

```
NEXT_PUBLIC_API_URL=https://www.tale-verse.app
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_APP_NAME=Ubuntu Health
JWT_SECRET=your-secure-jwt-secret-here
```

### Step 2: Redeploy from CLI
After adding the environment variables, I'll redeploy the ubuntu-health-atlas project:

```powershell
# Force redeploy the ubuntu-health-atlas project
vercel --prod --force --scope ghondi-claudes-projects
```

## 🔍 Alternative: Transfer Domain to Frontend Project

Since the "frontend" project is deploying successfully with the latest code, we could:

1. **Remove domain** from ubuntu-health-atlas
2. **Add domain** to frontend project
3. **Frontend project** already has the correct code

Let me try this approach...