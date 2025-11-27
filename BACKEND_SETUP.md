# Integrated Backend Setup Guide

## Overview

Your Next.js application now has an integrated Express.js backend with PostgreSQL database. The API runs alongside Next.js on the same server.

## Prerequisites

1. **PostgreSQL** - Install PostgreSQL database
   - macOS: `brew install postgresql@16`
   - Start service: `brew services start postgresql@16`

## Setup Instructions

### 1. Database Setup

Create the database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE inventory_db;

# Exit psql
\q
```

Or create it directly:
```bash
createdb inventory_db
```

### 2. Run Database Schema

Initialize the database schema:
```bash
psql -U postgres -d inventory_db -f server/config/db-schema.sql
```

Or manually:
```bash
psql -U postgres inventory_db < server/config/db-schema.sql
```

### 3. Configure Environment Variables

Update `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://localhost:5432/inventory_db
# Or with username/password:
# DATABASE_URL=postgresql://username:password@localhost:5432/inventory_db

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Start the Server

```bash
npm run dev
```

This starts both Next.js and the Express API on `http://localhost:3000`

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/api/v1/health

## Default Credentials

```
Username: admin
Password: admin123
Email: admin@inventory.com
```

## API Endpoints

All endpoints are now available at `/api/v1`:

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Items
- `GET /api/v1/items` - Get all items
- `GET /api/v1/items/:id` - Get item by ID
- `POST /api/v1/items` - Create item
- `PUT /api/v1/items/:id` - Update item
- `DELETE /api/v1/items/:id` - Delete item
- `GET /api/v1/items/categories` - Get categories
- `GET /api/v1/items/low-stock` - Get low stock items
- `POST /api/v1/items/bulk` - Bulk create items

### Assignments
- `GET /api/v1/assignments` - Get all assignments
- `POST /api/v1/assignments` - Create assignment
- `PATCH /api/v1/assignments/:id/return` - Return assignment

### Livestock
- `GET /api/v1/livestock` - Get all livestock
- `GET /api/v1/livestock/:id` - Get livestock by ID
- `POST /api/v1/livestock` - Create livestock
- `PUT /api/v1/livestock/:id` - Update livestock
- `DELETE /api/v1/livestock/:id` - Delete livestock

### Feeds
- `GET /api/v1/feeds` - Get all feeds
- `GET /api/v1/feeds/:id` - Get feed by ID
- `POST /api/v1/feeds` - Create feed
- `PUT /api/v1/feeds/:id` - Update feed
- `DELETE /api/v1/feeds/:id` - Delete feed

### Users
- `GET /api/v1/users` - Get all users (Admin/Manager)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user (Admin)
- `DELETE /api/v1/users/:id` - Delete user (Admin)

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Audit Logs
- `GET /api/v1/audit-logs` - Get audit logs (Admin/Manager)
- `GET /api/v1/audit-logs/stats` - Get audit statistics (Admin/Manager)

## Development Scripts

```bash
# Start integrated server (Next.js + API)
npm run dev

# Start only Next.js
npm run dev:next

# Start only API server
npm run dev:api

# Build for production
npm run build

# Start production server
npm start

# Setup database
npm run db:setup
```

## Troubleshooting

### Database Connection Issues

If you see "Database connection failed":

1. Ensure PostgreSQL is running:
   ```bash
   brew services list
   ```

2. Check if database exists:
   ```bash
   psql -U postgres -l
   ```

3. Update DATABASE_URL in `.env` with correct credentials

### Port Already in Use

If port 3000 is in use:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## Database Management

### View all tables:
```bash
psql -U postgres inventory_db -c "\dt"
```

### Query data:
```bash
psql -U postgres inventory_db -c "SELECT * FROM users;"
```

### Reset database:
```bash
# Drop and recreate
dropdb inventory_db
createdb inventory_db
psql -U postgres -d inventory_db -f server/config/db-schema.sql
```

## Architecture

```
/Users/niloy/programming/webdev/inventory/
├── server/                    # Express.js backend
│   ├── config/               # Database configuration
│   │   ├── database.js       # PostgreSQL connection
│   │   └── db-schema.sql     # Database schema
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth & audit middleware
│   ├── routes/              # API routes
│   ├── app.js               # Express app setup
│   └── index.js             # Standalone server
├── server.js                 # Next.js + Express integration
├── app/                      # Next.js frontend
├── components/               # React components
└── lib/                      # Utilities
```

## Security Notes

1. **Change JWT_SECRET** in production
2. **Use strong passwords** for database
3. **Enable SSL** for PostgreSQL in production
4. **Use environment variables** for all secrets
5. **Enable CORS** only for trusted origins

## Next Steps

1. ✅ Database is set up
2. ✅ API is running
3. Test the API with the health check endpoint
4. Login with default admin credentials
5. Start using the application!
