# CRM Service Template

This is a template for building a Customer Relationship Management (CRM) service using Node.js and Express.js.

## Features

- User authentication with JWT
- Customer management (CRUD operations)
- Interaction tracking (calls, emails, meetings, notes)
- **Multi-database support**: MongoDB or Supabase PostgreSQL
- Middleware for authentication
- Basic testing setup
- Docker support
- CI/CD with GitHub Actions
- Vercel-ready deployment

## Project Structure

```
crm-service-template/
├── app/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   ├── Customer.js
│   │   ├── Interaction.js
│   │   └── Lead.js
│   ├── services/
│   │   ├── LeadService.js
│   │   └── GitHubService.php
│   └── tests/
├── routes/
│   ├── auth.js
│   ├── customers.js
│   ├── interactions.js
│   └── leads.js
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci.yml
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Installation

### Quick Start with MongoDB (Local)

1. Clone or copy this template
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` and configure:
   ```env
   DATABASE_TYPE=mongodb
   MONGODB_URI=mongodb://localhost:27017/crm-db
   JWT_SECRET=dev-secret
   ```
4. Start MongoDB (locally or use a cloud service)
5. Run `npm run dev` to start the server

### Quick Start with Supabase (Production-Ready)

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed Supabase setup instructions.

**Quick steps:**
1. Create a Supabase project at https://supabase.com
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase credentials
4. Run `npm run test:db` to verify connection
5. Run `npm run dev` to start the server

## Running with Docker

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. The service will be available at `http://localhost:3000`

## Deployment

### Deploy to Vercel + Supabase

For production deployment with Vercel and Supabase, see the comprehensive guides:

- **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** - Complete Vercel deployment guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - General deployment instructions
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Database setup

**Quick Deploy:**
1. Push code to GitHub
2. Import to Vercel at https://vercel.com/new
3. Set environment variables
4. Deploy!

**Pre-deployment check:**
```bash
npm run prepare:vercel
```

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

## API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /api/db-status` - Check database status and type

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Customers
- `GET /api/customers` - Get all customers (requires auth)
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Interactions
- `GET /api/interactions` - Get all interactions
- `GET /api/interactions/customer/:customerId` - Get interactions for a customer
- `POST /api/interactions` - Create new interaction
- `PUT /api/interactions/:id` - Update interaction
- `DELETE /api/interactions/:id` - Delete interaction

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `GET /api/leads/status/:status` - Get leads by status (new, contacted, qualified, converted, lost)
- `GET /api/leads/assigned/:userId` - Get leads assigned to a user
- `GET /api/leads/stats/overview` - Get lead statistics
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `PATCH /api/leads/:id/assign/:userId` - Assign lead to user
- `PATCH /api/leads/:id/convert/:customerId` - Convert lead to customer
- `DELETE /api/leads/:id` - Delete lead

## Data Synchronization

The CRM Service supports **data synchronization** between MongoDB and Supabase databases.

### Sync Commands

```bash
# Check synchronization status
npm run sync:status

# Sync all data from MongoDB to Supabase
npm run sync:mongo-to-supabase

# Sync all data from Supabase to MongoDB
npm run sync:supabase-to-mongo
```

### Sync API Endpoints

- `GET /api/sync/status` - Get synchronization status (requires auth)
- `POST /api/sync/mongo-to-supabase` - Sync all data from MongoDB to Supabase
- `POST /api/sync/supabase-to-mongo` - Sync all data from Supabase to MongoDB
- `POST /api/sync/:collection/mongo-to-supabase` - Sync specific collection (users, customers, leads, interactions)

See [DATA_SYNC.md](DATA_SYNC.md) for comprehensive synchronization guide.

## Development
- `npm start` - Start production server

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## License

ISC