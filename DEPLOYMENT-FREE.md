# Free Forever Deployment Guide

This guide uses completely free services with no trial periods or credit cards required.

## Architecture
- **Frontend**: Vercel (free forever)
- **Backend**: Render.com (free forever, with cold starts)
- **Database**: Supabase (free forever, 500MB)

## Step 1: Set Up Supabase Database (Free Forever)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project (choose a region close to you)
3. Once created, go to Settings → Database
4. Copy the connection string (URI)
5. Save this for later use

### Load Your Database Schema

In Supabase SQL Editor, run:
```sql
-- First, create the schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Then run the contents of backend/src/db/schema.sql
```

Then run the seed data from `backend/src/db/load-roadmap-data.sql`

## Step 2: Deploy Backend to Render.com

1. Go to [Render.com](https://render.com) and sign up (no credit card needed)
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select your repository
4. Configure:
   - **Name**: developer-roadmap-api
   - **Root Directory**: Leave blank
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `cd backend && npm start`

5. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: Generate a secure random string
   - `JWT_EXPIRES_IN`: 7d
   - `NODE_ENV`: production
   - `PORT`: 3000

6. Click "Create Web Service"

**Note**: Free Render services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click "Import Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Before deploying, update `frontend/vercel.json`:
   - Replace `https://developer-roadmap-api.onrender.com` with your actual Render URL

6. Click "Deploy"

## Step 4: Update CORS Settings

After deployment, update your backend environment variables on Render:
- `FRONTEND_URL`: Your Vercel URL (e.g., https://your-app.vercel.app)

## Step 5: Initialize Database

You can run the seed script by:

1. In Render dashboard, go to your service
2. Click "Shell" tab
3. Run: `cd backend && npm run seed:roadmap -- --force`

Or use Supabase SQL editor to run the SQL directly.

## Access Your App

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-app.onrender.com
- **Database**: Supabase Dashboard

## Default Login
- Email: developer@example.com
- Password: password123

## Important Notes

### Free Tier Limitations

**Render.com**:
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month (enough for one service 24/7)

**Supabase**:
- 500MB database storage
- 2GB bandwidth
- 50MB file storage

**Vercel**:
- 100GB bandwidth
- Unlimited static requests
- 10 second function timeout

### Keeping Your App Active

To prevent Render from sleeping:
1. Use a service like [UptimeRobot](https://uptimerobot.com) (free)
2. Set it to ping your backend health endpoint every 10 minutes
3. URL to monitor: `https://your-app.onrender.com/health`

## Alternative: All-in-One on Render

If you prefer everything on Render:

1. Update `backend/src/index.ts` to serve frontend files
2. Build frontend during Render build process
3. Use Render's PostgreSQL (90-day free, needs renewal)

## Troubleshooting

### Backend Not Responding
- Check Render logs
- Ensure DATABASE_URL is correct
- Wait 30 seconds if service was sleeping

### CORS Errors
- Verify FRONTEND_URL in backend env vars
- Check that frontend is using correct API URL

### Database Connection Failed
- Verify Supabase connection string
- Ensure Prisma schema is generated
- Check connection pool settings