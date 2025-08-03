# Deployment Guide

This guide will walk you through deploying the Developer Roadmap application to Railway.app - a single platform that hosts everything (backend, frontend, and PostgreSQL database).

## Prerequisites

1. Create a free account at [Railway.app](https://railway.app)
2. Install Railway CLI (optional but recommended):
   ```bash
   npm install -g @railway/cli
   ```

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub
First, create a new repository on GitHub and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/developer-roadmap.git
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to [Railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select your repository
5. Railway will automatically detect the monorepo structure

### Step 3: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL instance

### Step 4: Configure Environment Variables

Click on your backend service and add these environment variables:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app.up.railway.app
PORT=3000
```

The `DATABASE_URL` will be automatically set by Railway when you add PostgreSQL.

### Step 5: Configure Build Settings

Railway should automatically detect the configuration from `nixpacks.toml`, but you can verify:

1. **Root Directory**: `/` (keep as root)
2. **Build Command**: Auto-detected from nixpacks.toml
3. **Start Command**: Auto-detected from nixpacks.toml

### Step 6: Deploy and Seed Database

1. Railway will automatically deploy your app
2. Once deployed, you'll need to seed the database. You can do this by:
   - Using Railway's CLI: `railway run npm run seed`
   - Or via the Railway web console, run: `cd backend && npm run seed:roadmap -- --force`

## Option 2: Deploy via Railway CLI

If you prefer using the CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize new project
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-super-secret-jwt-key
railway variables set JWT_EXPIRES_IN=7d
railway variables set PORT=3000

# Seed the database
railway run npm run seed
```

## Post-Deployment

### Access Your App

Once deployed, Railway will provide you with a URL like:
- `https://your-app-name.up.railway.app`

### Default Login Credentials

The seeded data includes a default user:
- **Email**: developer@example.com
- **Password**: password123

⚠️ **Important**: Change this password immediately after first login!

### Monitor Your App

1. Check logs in Railway dashboard
2. Monitor database connections
3. Set up health checks at `/health` endpoint

## Troubleshooting

### Build Failures

If the build fails, check:
1. All dependencies are in `package.json` (not devDependencies for production deps)
2. TypeScript builds successfully locally: `npm run build`
3. Prisma generates correctly: `npm run prisma:generate`

### Database Connection Issues

1. Ensure `DATABASE_URL` is set correctly (Railway sets this automatically)
2. Check that Prisma migrations ran successfully
3. Verify the database is seeded with `npm run seed`

### Frontend Not Loading

1. Ensure the backend is serving static files in production
2. Check that the frontend build completes successfully
3. Verify API proxy settings are correct

## Free Tier Limits

Railway's free tier includes:
- $5 of usage per month
- 500 hours of compute
- 1GB RAM per service
- 1GB PostgreSQL database

This should be sufficient for personal use and testing.

## Alternative Platforms

If you prefer other platforms:

1. **Render.com**
   - Similar setup process
   - Free PostgreSQL (90 days)
   - Free web services (with sleep)

2. **Fly.io**
   - More control but requires credit card
   - Better performance
   - Includes free PostgreSQL

3. **Vercel + Supabase**
   - Deploy frontend to Vercel
   - Use Supabase for PostgreSQL
   - Deploy backend separately

## Security Checklist

Before going live:
- [ ] Change default user password
- [ ] Update JWT_SECRET to a secure value
- [ ] Enable HTTPS (automatic on Railway)
- [ ] Review CORS settings
- [ ] Set up monitoring/alerts
- [ ] Regular backups of database