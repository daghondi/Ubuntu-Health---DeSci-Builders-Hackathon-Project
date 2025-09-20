# Ubuntu Health - Production Deployment Guide

## Deployment to tale-verse.app

### Prerequisites
- Domain: https://www.tale-verse.app/
- Hosting service (Vercel, Netlify, DigitalOcean, AWS, etc.)
- PostgreSQL database (for production)
- Environment variables configured

### Frontend Deployment (Next.js)

1. **Vercel Deployment** (Recommended for Next.js):
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from frontend directory
   cd production-platform/frontend
   vercel --prod
   ```

2. **Environment Variables for Frontend**:
   ```env
   NEXT_PUBLIC_API_URL=https://api.tale-verse.app
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_APP_NAME=Ubuntu Health
   ```

### Backend Deployment (Express.js + TypeScript)

1. **Build Process**:
   ```bash
   cd production-platform/backend
   npm run build
   npm start
   ```

2. **Environment Variables for Backend**:
   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://username:password@host:port/ubuntu_health
   JWT_SECRET=your-super-secure-production-jwt-secret
   JWT_REFRESH_SECRET=your-production-refresh-secret
   SOLANA_RPC_URL=https://api.devnet.solana.com
   CORS_ORIGIN=https://www.tale-verse.app
   ```

3. **Docker Deployment** (Optional):
   ```dockerfile
   # Backend Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["npm", "start"]
   ```

### Database Setup

1. **PostgreSQL Production Schema**:
   - Use the full PostgreSQL schema (not SQLite)
   - Run migrations: `npx prisma migrate deploy`
   - Generate client: `npx prisma generate`

2. **Database Providers**:
   - **Supabase**: Free PostgreSQL with built-in auth
   - **PlanetScale**: Serverless MySQL (alternative)
   - **Railway**: Simple PostgreSQL hosting
   - **Neon**: Serverless PostgreSQL

### DNS Configuration

For `tale-verse.app` domain:

1. **Frontend**: `www.tale-verse.app` → Vercel/Netlify
2. **Backend API**: `api.tale-verse.app` → Your backend server
3. **CDN**: `cdn.tale-verse.app` → Static assets (optional)

### SSL/TLS
- Automatic SSL through hosting providers
- Let's Encrypt for custom servers
- Cloudflare for additional security layer

### Monitoring & Analytics
- **Frontend**: Vercel Analytics, Google Analytics
- **Backend**: Winston logging, error tracking (Sentry)
- **Performance**: New Relic, DataDog

### Deployment Commands

```bash
# Frontend (Vercel)
cd production-platform/frontend
vercel --prod --scope your-team

# Backend (Railway/DigitalOcean)
git push railway main
# or
docker build -t ubuntu-health-backend .
docker run -p 3001:3001 ubuntu-health-backend

# Database Migration
npx prisma migrate deploy
npx prisma db seed
```

### Post-Deployment Checklist

- [ ] Frontend loads at https://www.tale-verse.app
- [ ] Backend API responds at https://api.tale-verse.app
- [ ] Database connections working
- [ ] JWT authentication functional
- [ ] Solana wallet integration working
- [ ] CORS configured correctly
- [ ] SSL certificates active
- [ ] Error monitoring active
- [ ] Performance monitoring active

### Scaling Considerations

1. **Database**: Read replicas, connection pooling
2. **Backend**: Load balancer, multiple instances
3. **Frontend**: CDN, edge caching
4. **Monitoring**: Uptime monitoring, alerting

Would you like me to help you with any specific deployment step or platform?