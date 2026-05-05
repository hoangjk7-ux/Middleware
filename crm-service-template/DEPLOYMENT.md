# Deployment Guide

This guide covers deploying the CRM Service Template to Vercel with Supabase as the database.

## Prerequisites

- Vercel account (https://vercel.com)
- Supabase account (https://supabase.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## Part 1: Setup Supabase Database

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project details:
   - Name: `crm-service`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for the project to initialize

### 2. Import Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the entire content from `supabase/schema.sql`
4. Paste it into the SQL editor
5. Click **Run**

### 3. Get Connection Details

In the Supabase dashboard:
1. Go to **Project Settings** → **Database**
2. Copy the connection string and note:
   - `SUPABASE_URL`: Project URL (under "API")
   - `SUPABASE_KEY`: anon public key (under "API")
   - Database credentials for direct access

## Part 2: Deploy to Vercel

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CRM Service Template"
git branch -M main
git remote add origin https://github.com/your-username/crm-service.git
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Enter your repository URL: `https://github.com/your-username/crm-service.git`
4. Click **Import**

### 3. Configure Environment Variables

In the Vercel deployment screen, add environment variables:

```
NODE_ENV=production
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
JWT_SECRET=your-strong-secret-key-here
```

### 4. Configure Build Settings

- **Framework Preset**: Other
- **Build Command**: `npm install`
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### 5. Deploy

Click **Deploy** and wait for the deployment to complete.

## Part 3: Update Application Configuration

### 1. Update server.js for Vercel

Since Vercel uses serverless functions, modify `server.js`:

```javascript
// Add this line near the top for Vercel compatibility
if (!process.env.VERCEL) {
  dotenv.config();
}
```

### 2. Install Supabase Dependency

Add to `package.json`:

```bash
npm install @supabase/supabase-js
```

### 3. Update database connection

In `app/config/database.js`, use the multi-db configuration:

```javascript
const { connectDB } = require('./multi-db');
module.exports = connectDB;
```

## Part 4: Testing Deployment

### 1. Check Health Endpoint

```bash
curl https://your-vercel-app.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "CRM Service is running"
}
```

### 2. Test API Endpoints

Register a user:
```bash
curl -X POST https://your-vercel-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Login:
```bash
curl -X POST https://your-vercel-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### 1. Database Connection Issues

- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Check Supabase project is running
- Verify database schema is imported

### 2. Build Failures

- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify `package-lock.json` exists

### 3. Runtime Errors

- Check Vercel function logs
- Verify environment variables are set
- Test API endpoints with curl or Postman

## Production Best Practices

1. **Security**
   - Use strong JWT_SECRET
   - Enable RLS in Supabase
   - Use environment variables for secrets

2. **Performance**
   - Enable caching headers
   - Use database indexes (already in schema.sql)
   - Monitor API response times

3. **Monitoring**
   - Set up error logging
   - Monitor database performance
   - Track API usage

4. **Backups**
   - Enable Supabase automatic backups
   - Regular database exports

## Environment Variables Reference

```
NODE_ENV              - Application environment (development/production)
PORT                  - Server port (ignored on Vercel)
DATABASE_TYPE         - Database type (mongodb/supabase)
SUPABASE_URL          - Supabase project URL
SUPABASE_KEY          - Supabase public key
JWT_SECRET            - JWT signing secret
GITHUB_TOKEN          - GitHub API token (optional)
GITHUB_ORG            - GitHub organization (optional)
```

## Support

For issues:
- Vercel docs: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs
- Repository issues: [Create an issue on GitHub]