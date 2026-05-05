# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying your CRM Service Template to Vercel with Supabase.

## Prerequisites

- ✅ GitHub account and repository
- ✅ Supabase project set up
- ✅ Database schema imported
- ✅ Environment variables configured

## Quick Deployment Checklist

Run this command to verify everything is ready:

```bash
npm run prepare:vercel
```

This will check:
- ✅ Required files exist
- ✅ Dependencies are installed
- ✅ Configuration is correct

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: CRM Service Template"

# Create GitHub repository and push
git remote add origin https://github.com/your-username/crm-service.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with your GitHub account

2. **Import Repository**
   - Click "Import Git Repository"
   - Search for your repository: `your-username/crm-service`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: `Other`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm install` (auto-detected)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables

In the Vercel deployment screen, add these environment variables:

#### Required Variables
```
NODE_ENV=production
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key-here
JWT_SECRET=your-production-jwt-secret-here
```

#### Optional Variables
```
PORT=3000
GITHUB_TOKEN=your-github-token
GITHUB_ORG=crm-platform
```

### Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be available at: `https://your-project.vercel.app`

## Post-Deployment Verification

### Test Health Check

```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "CRM Service is running",
  "timestamp": "2026-05-04T...",
  "environment": "production"
}
```

### Test Database Connection

```bash
curl https://your-project.vercel.app/api/db-status
```

Expected response:
```json
{
  "status": "OK",
  "database": "supabase",
  "message": "Connected to supabase database"
}
```

### Test API Endpoints

1. **Register a user:**
```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

2. **Login:**
```bash
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

This returns a JWT token. Use it for authenticated requests:

```bash
TOKEN="your-jwt-token-here"

# Get leads
curl -H "Authorization: Bearer $TOKEN" \
     https://your-project.vercel.app/api/leads
```

## Troubleshooting

### Build Failures

#### Issue: "Cannot find module"
```
❌ Error: Cannot find module '@supabase/supabase-js'
```

**Solution:**
- Check if dependency is in `package.json`
- Run `npm install` locally first
- Verify Vercel build logs

#### Issue: "Environment variable not set"
```
❌ Error: Missing SUPABASE_URL or SUPABASE_KEY
```

**Solution:**
- Check Vercel environment variables
- Ensure variables are set for "Production" environment
- Redeploy after adding variables

### Runtime Errors

#### Issue: Database Connection Failed
```
❌ Supabase connection error: Invalid API key
```

**Solution:**
- Verify `SUPABASE_URL` and `SUPABASE_KEY`
- Check Supabase project is active
- Confirm API key has correct permissions

#### Issue: CORS Errors
```
❌ Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- CORS is already configured in the app
- Check if you're using the correct Vercel URL
- Verify request headers

### Performance Issues

#### Issue: Cold Start Delays
- **Solution**: Vercel serverless functions have cold starts (normal)
- **Optimization**: Keep functions under 30 seconds
- **Monitoring**: Check Vercel function logs

#### Issue: Memory Limits
- **Current**: 1024MB configured
- **Solution**: Monitor usage in Vercel dashboard
- **Upgrade**: Increase memory if needed

## Environment Variables Management

### Adding New Variables

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable
4. **Redeploy** for changes to take effect

### Variable Types

- **Plaintext**: For simple values
- **Secret**: For sensitive data (auto-encrypted)
- **System**: For Vercel-provided variables

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatic

## Monitoring & Analytics

### Vercel Analytics

1. Go to **Settings** → **Analytics**
2. Enable Web Analytics
3. View real-time metrics

### Logs & Debugging

1. **Function Logs**: View in Vercel dashboard
2. **Build Logs**: Check deployment history
3. **Real-time Logs**: Use `vercel logs` CLI

```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs your-project.vercel.app
```

## Scaling Considerations

### Rate Limits

- Vercel has generous free tier limits
- Monitor usage in dashboard
- Upgrade plan if needed

### Database Scaling

- Supabase handles scaling automatically
- Monitor database performance
- Consider connection pooling for high traffic

## Backup & Recovery

### Database Backups

- Supabase provides automatic backups
- Export data regularly if needed
- Use sync endpoints for data migration

### Code Deployment

- Every push to main triggers deployment
- Previous deployments are kept
- Rollback to previous versions if needed

## Security Best Practices

### Environment Variables
- ✅ Never commit secrets to code
- ✅ Use Vercel's encrypted environment variables
- ✅ Rotate keys regularly

### API Security
- ✅ JWT tokens for authentication
- ✅ HTTPS enabled by default
- ✅ CORS properly configured

### Database Security
- ✅ Supabase RLS (Row Level Security) enabled
- ✅ API keys with minimal permissions
- ✅ Regular security updates

## Cost Optimization

### Vercel Pricing
- **Free Tier**: 100GB bandwidth, 3000 hours/month
- **Pro**: $20/month for higher limits
- **Enterprise**: Custom pricing

### Supabase Pricing
- **Free**: 500MB database, 50MB file storage
- **Pro**: $25/month for 8GB database
- **Team**: $599/month for larger teams

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Community**: https://vercel.com/discord
- **Supabase Community**: https://supabase.com/discord

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all endpoints
3. ✅ Set up monitoring
4. ✅ Configure custom domain (optional)
5. ✅ Set up CI/CD (already configured)

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Health check passes
- [ ] API endpoints tested
- [ ] Database connection verified
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

**🎉 Your CRM Service is now live on Vercel!**