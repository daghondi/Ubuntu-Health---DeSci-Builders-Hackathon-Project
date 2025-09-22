# Ubuntu Health Production Backend - Railway Deployment Guide

## 🚀 Deploy to Railway

Railway is perfect for hosting our Node.js backend with automatic deployments from GitHub.

### Step 1: Prepare for Railway Deployment

1. **Install Railway CLI** (if not already installed):
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

### Step 2: Deploy Backend

1. **Navigate to backend directory**:
```bash
cd production-platform/backend
```

2. **Initialize Railway project**:
```bash
railway init
```

3. **Deploy to Railway**:
```bash
railway up
```

### Step 3: Configure Environment Variables

Set these environment variables in Railway dashboard:

```
NODE_ENV=production
PORT=3001
CORS_ORIGINS=https://frontend-dv6ndpb3m-ghondi-claudes-projects.vercel.app,https://ubuntuhealth.io
```

### Step 4: Custom Start Command

In Railway, set the start command to:
```
node server.js
```

## 🌐 Production API Endpoints

Once deployed, the API will be available at:
- Health Check: `https://your-railway-app.railway.app/api/health`
- API Docs: `https://your-railway-app.railway.app/api/api-docs`
- Test: `https://your-railway-app.railway.app/api/test`

## 📋 API Endpoints Available

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Patients
- `GET /api/v1/patients` - List all patients
- `POST /api/v1/patients` - Create patient profile
- `GET /api/v1/patients/:id` - Get patient details

### Sponsorships
- `GET /api/v1/sponsorships` - List sponsorships
- `POST /api/v1/sponsorships` - Create sponsorship

### Research
- `GET /api/v1/research` - List research studies

## 🔧 Quick Deploy Commands

```bash
# From project root
cd production-platform/backend

# Deploy to Railway
railway login
railway init
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
```

## ✅ Post-Deployment

1. **Test the API**: Visit `/api/health` endpoint
2. **Update frontend environment**: Set `NEXT_PUBLIC_API_URL` to Railway URL
3. **Update CORS**: Add Railway URL to CORS origins
4. **Monitor logs**: Use `railway logs` to monitor

The backend is now production-ready with mock data for demonstration purposes!