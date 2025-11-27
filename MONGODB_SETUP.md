# MongoDB Setup Guide

## Overview

Your application now uses MongoDB instead of PostgreSQL. This guide will help you set up and run the application with MongoDB.

## Prerequisites

### Install MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

**Start MongoDB:**
```bash
brew services start mongodb-community@7.0
```

**Verify MongoDB is running:**
```bash
mongosh
# In MongoDB shell, type: exit
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
Download from: https://www.mongodb.com/try/download/community

## Setup Instructions

### 1. Ensure MongoDB is Running

```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"
```

### 2. Configure Environment Variables

The `.env` file has been updated with MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/inventory_db
```

### 3. Seed the Database

Create the default admin user:

```bash
npm run db:seed
```

This will create:
- **Username:** admin
- **Password:** admin123
- **Email:** admin@inventory.com
- **Role:** admin

### 4. Start the Application

```bash
npm run dev
```

The server will:
- Connect to MongoDB automatically
- Start on http://localhost:3000
- API available at http://localhost:3000/api/v1

## Database Structure

### Collections

MongoDB uses collections instead of tables:

- **users** - User accounts
- **items** - Inventory items
- **assignments** - Item assignments to users
- **livestock** - Livestock records
- **feeds** - Feed inventory
- **auditlogs** - Audit trail logs

### Key Differences from PostgreSQL

1. **Auto-incrementing IDs:** MongoDB uses `_id` with ObjectId instead of sequential integers
2. **Schema:** Uses Mongoose schemas for validation (defined in `server/models/`)
3. **Relationships:** Uses references (ObjectId) and `.populate()` for joins
4. **Queries:** Uses MongoDB query language instead of SQL

## MongoDB Shell Commands

### Access Database
```bash
mongosh
use inventory_db
```

### View Collections
```javascript
show collections
```

### Query Users
```javascript
db.users.find().pretty()
```

### Count Documents
```javascript
db.items.countDocuments()
```

### Find Specific User
```javascript
db.users.findOne({ username: "admin" })
```

### Delete All Data (⚠️ Careful!)
```javascript
db.users.deleteMany({})
db.items.deleteMany({})
// etc...
```

### Drop Database (⚠️ Very Careful!)
```javascript
db.dropDatabase()
```

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Make sure MongoDB is running
brew services start mongodb-community@7.0

# Or on Ubuntu/Debian
sudo systemctl start mongod
```

### Port Already in Use

**Error:** `Error: Address already in use`

**Solution:**
```bash
# Find and kill process on port 27017
lsof -i :27017
kill -9 <PID>

# Restart MongoDB
brew services restart mongodb-community@7.0
```

### Database Not Created

MongoDB creates databases and collections automatically when you first write data. Run the seed script:
```bash
npm run db:seed
```

## Migration Notes

### What Changed

1. **Database:** PostgreSQL → MongoDB
2. **Driver:** pg → mongoose
3. **Schema:** SQL schema → Mongoose models
4. **Queries:** SQL → MongoDB query language
5. **IDs:** Sequential integers → ObjectIds

### What Stayed the Same

- ✅ All API endpoints remain identical
- ✅ Frontend code unchanged
- ✅ Authentication flow unchanged
- ✅ Response formats unchanged
- ✅ All features work the same

## Production Deployment

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory_db?retryWrites=true&w=majority
   ```

### Environment Variables

For production, set:
```env
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
```

## Backup and Restore

### Backup
```bash
mongodump --db inventory_db --out ./backup
```

### Restore
```bash
mongorestore --db inventory_db ./backup/inventory_db
```

## Default Credentials

After running `npm run db:seed`:

```
Username: admin
Password: admin123
Email: admin@inventory.com
```

**⚠️ Important:** Change the admin password in production!

## Useful MongoDB Commands

```javascript
// Count all items
db.items.countDocuments()

// Find low stock items
db.items.find({ $expr: { $lte: ["$quantity", "$low_stock_threshold"] } })

// Find active assignments
db.assignments.find({ status: "assigned" })

// Get all users with role admin
db.users.find({ role: "admin" })

// Update user role
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "manager" } }
)
```

## Support

For MongoDB documentation: https://docs.mongodb.com/
For Mongoose documentation: https://mongoosejs.com/docs/
