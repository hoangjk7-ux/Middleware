# Quick Start Guide - Supabase Connection

This guide will help you set up and test your Supabase connection quickly.

## Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Log in or create an account
3. Create a new project or select an existing one
4. Go to **Project Settings** → **API**
5. Copy:
   - **Project URL** (SUPABASE_URL)
   - **Public API Key** (SUPABASE_KEY)

## Step 2: Update Environment Variables

### Option A: Local Development

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update the values with your Supabase credentials:

```env
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key-here
```

### Option B: Production (Vercel)

In your Vercel project settings:

```
Environment Variables:
- DATABASE_TYPE = supabase
- SUPABASE_URL = https://your-project.supabase.co
- SUPABASE_KEY = your-anon-public-key-here
```

## Step 3: Setup Database Schema

### For Supabase Cloud Project:

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy the entire content from `supabase/schema.sql`
4. Paste into the editor
5. Click **Run** to execute

### For Local Development with Supabase (Optional):

```bash
psql -h your-project.supabase.co -U postgres -d postgres < supabase/schema.sql
```

## Step 4: Test the Connection

### Test with npm script:

```bash
npm run test:db
```

This will:
- ✅ Check authentication
- ✅ Query the users table
- ✅ Verify all tables are accessible
- ✅ Report connection status

### Manual Test:

Start the server:

```bash
npm run dev
```

In another terminal, test the endpoints:

```bash
# Check database status
curl http://localhost:3000/api/db-status

# Health check
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "database": "supabase",
  "message": "Connected to supabase database"
}
```

## Step 5: Test API Endpoints

### Register a user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

This will return a JWT token. Use it for authenticated requests:

```bash
TOKEN="your-jwt-token-here"

# Get all leads
curl http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### Connection Failed: "Missing SUPABASE_URL or SUPABASE_KEY"

**Solution**: Check that `.env` or `.env.local` has both variables set correctly.

```bash
# Check your environment variables
echo $SUPABASE_URL
echo $SUPABASE_KEY
```

### CORS Errors

**Solution**: Ensure CORS middleware is enabled (already configured in server.js)

### Database Queries Failing

**Solution**: 
1. Verify schema is imported: `npm run test:db`
2. Check user has proper permissions in Supabase
3. Verify Row Level Security (RLS) policies if enabled

### 401 Unauthorized on API Endpoints

**Solution**: Make sure you're including the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/leads
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_TYPE` | Yes | Set to `supabase` for Supabase |
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_KEY` | Yes | Your Supabase public API key |
| `JWT_SECRET` | Yes | Secret for JWT token signing |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment: development/production |

## Useful Supabase Links

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Reference](https://www.postgresql.org/docs/current/)
- [REST API Documentation](https://supabase.com/docs/guides/api)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Next Steps

1. ✅ Test connection with `npm run test:db`
2. ✅ Register and login to verify authentication
3. ✅ Create leads and customers using API
4. ✅ Deploy to Vercel (see DEPLOYMENT.md)

Need help? Check the full [DEPLOYMENT.md](../DEPLOYMENT.md) guide or Supabase documentation.