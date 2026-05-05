# Supabase Configuration

This directory contains configuration files for Supabase database integration.

## Files

- `schema.sql` - Database schema definition for PostgreSQL
  - Creates tables: users, customers, leads, interactions
  - Sets up indexes for performance
  - Enables Row Level Security (RLS)

## Setup Instructions

### 1. Import Schema

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy the entire content of `schema.sql`
5. Paste into the SQL editor
6. Click **Run**

### 2. Configure Environment Variables

After schema import, set these environment variables:

```env
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

### 3. Verify Connection

Test the connection by starting the application:

```bash
npm install
npm start
```

You should see: "Supabase Connected"

## Database Schema

### Users Table
- `id` - UUID primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (default: 'user')
- `created_at`, `updated_at` - Timestamps

### Customers Table
- `id` - UUID primary key
- `name` - Customer name
- `email` - Unique email
- `phone` - Contact phone
- `company` - Company name
- `address_*` - Address fields
- `notes` - Customer notes
- `created_at`, `updated_at` - Timestamps

### Leads Table
- `id` - UUID primary key
- `name` - Lead name
- `email` - Unique email
- `phone` - Contact phone
- `company` - Company name
- `position` - Job position
- `source` - Lead source (email, phone, website, referral, social, other)
- `status` - Lead status (new, contacted, qualified, converted, lost)
- `assigned_to` - Foreign key to users table
- `notes` - Lead notes
- `created_at`, `updated_at` - Timestamps

### Interactions Table
- `id` - UUID primary key
- `customer_id` - Foreign key to customers
- `type` - Interaction type (call, email, meeting, note)
- `description` - Interaction details
- `date` - Interaction date
- `user_id` - Foreign key to users
- `notes` - Additional notes
- `created_at` - Timestamp

## Indexes

Performance indexes are created on:
- `leads.status`
- `leads.assigned_to`
- `interactions.customer_id`
- `interactions.user_id`
- `customers.email`
- `users.email`

## Row Level Security (RLS)

RLS is enabled on all tables. Configure policies in Supabase dashboard as needed for your application logic.

## Troubleshooting

### Connection Errors
- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Check that the Supabase project is active
- Ensure network connectivity

### Schema Import Errors
- Verify PostgreSQL syntax is correct
- Check for duplicate table names
- Ensure proper role permissions

## Support

- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/