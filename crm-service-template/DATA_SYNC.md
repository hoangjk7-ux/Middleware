# Data Synchronization Guide

This guide explains how to synchronize data between MongoDB and Supabase databases in your CRM Service Template.

## Overview

The CRM Service Template supports **dual database architecture** with automatic data synchronization between:

- **MongoDB** (Local development, flexible schema)
- **Supabase** (Production-ready, PostgreSQL with real-time features)

## Prerequisites

1. **MongoDB connection** (local or cloud)
2. **Supabase project** with schema imported
3. **Environment variables** configured for both databases

## Quick Setup

### 1. Configure Environment Variables

Create `.env.local` with both database connections:

```env
# Application
NODE_ENV=development

# MongoDB (source database)
MONGODB_URI=mongodb://localhost:27017/crm-db

# Supabase (target database)
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key

# Authentication
JWT_SECRET=dev-secret-key
```

### 2. Import Supabase Schema

Run the SQL schema in your Supabase project:

```sql
-- Copy entire content from supabase/schema.sql
-- Paste into Supabase SQL Editor and execute
```

### 3. Test Connections

```bash
# Test database connections
npm run test:db

# Check sync status
npm run sync:status
```

## Synchronization Methods

### Method 1: Command Line Scripts

#### Check Status
```bash
npm run sync:status
```

Output example:
```
📈 Synchronization Status:
==================================================
Collection      MongoDB    Supabase   Difference
--------------------------------------------------
users           5          0          5
customers       12         0          12
leads           8          0          8
interactions    25         0          25
```

#### Sync All Data
```bash
# MongoDB → Supabase
npm run sync:mongo-to-supabase

# Supabase → MongoDB
npm run sync:supabase-to-mongo
```

### Method 2: API Endpoints

#### Get Sync Status
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/sync/status
```

#### Sync All Data
```bash
# MongoDB → Supabase
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/sync/mongo-to-supabase

# Supabase → MongoDB
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/sync/supabase-to-mongo
```

#### Sync Specific Collection
```bash
# Sync only users
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/sync/users/mongo-to-supabase

# Sync only customers
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/sync/customers/mongo-to-supabase
```

## Data Mapping

### Users Table
| MongoDB Field | Supabase Field | Type | Notes |
|---------------|----------------|------|-------|
| username | username | VARCHAR | Required, unique |
| email | email | VARCHAR | Required, unique |
| password | password | VARCHAR | Required |
| role | role | VARCHAR | Default: 'user' |

### Customers Table
| MongoDB Field | Supabase Field | Type | Notes |
|---------------|----------------|------|-------|
| name | name | VARCHAR | Required |
| email | email | VARCHAR | Required, unique |
| phone | phone | VARCHAR | Optional |
| address.street | address_street | VARCHAR | Optional |
| address.city | address_city | VARCHAR | Optional |
| address.state | address_state | VARCHAR | Optional |
| address.zipCode | address_zip_code | VARCHAR | Optional |
| address.country | address_country | VARCHAR | Optional |
| company | company | VARCHAR | Optional |
| notes | notes | TEXT | Optional |

### Leads Table
| MongoDB Field | Supabase Field | Type | Notes |
|---------------|----------------|------|-------|
| name | name | VARCHAR | Required |
| email | email | VARCHAR | Required, unique |
| phone | phone | VARCHAR | Optional |
| company | company | VARCHAR | Optional |
| position | position | VARCHAR | Optional |
| source | source | VARCHAR | Default: 'other' |
| status | status | VARCHAR | Default: 'new' |
| notes | notes | TEXT | Optional |
| assignedTo | assigned_to | UUID | Foreign key to users |

### Interactions Table
| MongoDB Field | Supabase Field | Type | Notes |
|---------------|----------------|------|-------|
| customer | customer_id | UUID | Required, foreign key |
| type | type | VARCHAR | Required |
| description | description | TEXT | Required |
| date | date | TIMESTAMP | Default: current timestamp |
| user | user_id | UUID | Foreign key to users |
| notes | notes | TEXT | Optional |

## Sync Process Details

### MongoDB → Supabase Sync

1. **Connect** to both databases
2. **Fetch** all documents from MongoDB collections
3. **Transform** data to match Supabase schema
4. **Insert** data into Supabase tables
5. **Report** success/error counts

### Supabase → MongoDB Sync

1. **Connect** to both databases
2. **Query** all records from Supabase tables
3. **Transform** data to match MongoDB schema
4. **Upsert** (update or insert) documents in MongoDB
5. **Report** success/error counts

## Error Handling

### Common Issues

#### 1. Connection Failures
```
❌ Supabase connection error: Missing SUPABASE_URL or SUPABASE_KEY
```
**Solution**: Check environment variables

#### 2. Schema Mismatches
```
❌ Failed to sync user email@example.com: duplicate key value
```
**Solution**: Ensure Supabase schema matches MongoDB data types

#### 3. Foreign Key Constraints
```
❌ Failed to sync lead: invalid assigned_to reference
```
**Solution**: Sync users before leads, customers before interactions

### Recommended Sync Order

For MongoDB → Supabase:
1. Users
2. Customers
3. Leads
4. Interactions

For Supabase → MongoDB:
1. Users
2. Customers
3. Leads
4. Interactions

## Production Deployment

### Vercel + Supabase

1. **Set environment variables** in Vercel:
   ```
   DATABASE_TYPE=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-public-key
   JWT_SECRET=your-production-secret
   ```

2. **Deploy** to Vercel

3. **Run initial sync** if migrating from MongoDB:
   ```bash
   # Locally or via API
   npm run sync:mongo-to-supabase
   ```

### Monitoring Sync Status

Add to your monitoring:

```javascript
// Check sync status periodically
const status = await fetch('/api/sync/status', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await status.json();
console.log('Sync status:', data);
```

## Troubleshooting

### Debug Mode

Enable detailed logging:

```bash
DEBUG=sync:* npm run sync:mongo-to-supabase
```

### Manual Data Verification

Check data integrity:

```javascript
// MongoDB
db.users.count()
db.customers.count()

// Supabase (via API)
const { count } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true });
```

### Rollback Strategy

If sync fails:

1. **Stop the application**
2. **Backup current data**
3. **Fix the issue**
4. **Retry sync**
5. **Verify data integrity**

## Performance Considerations

### Large Datasets

For datasets > 10,000 records:

1. **Batch processing** (implemented)
2. **Progress monitoring**
3. **Error recovery**
4. **Rate limiting**

### Memory Usage

Monitor memory usage during sync:

```bash
# Check memory usage
node --max-old-space-size=4096 scripts/sync-data.js mongo-to-supabase
```

## Security Notes

- **Never sync sensitive data** without encryption
- **Use HTTPS** for all API calls
- **Validate data** before sync
- **Audit sync operations**
- **Backup before major syncs**

## Support

For issues:
- Check [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for connection issues
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Test with `npm run test:db` first