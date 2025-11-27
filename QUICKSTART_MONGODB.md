# 🚀 Quick Start - MongoDB Migration

Your Inventory Management System has been migrated from PostgreSQL to MongoDB!

## Quick Setup (3 Steps)

### Step 1: Install and Start MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Or use the automated script:**
```bash
./setup-mongodb.sh
```

### Step 2: Seed the Database

```bash
npm run db:seed
```

This creates the default admin user:
- Username: `admin`
- Password: `admin123`

### Step 3: Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## That's It! 🎉

Your application is now running with MongoDB. Everything works exactly the same as before.

## What Changed?

- ✅ Database: PostgreSQL → MongoDB
- ✅ Driver: pg → mongoose
- ❌ Frontend: No changes needed!
- ❌ API Endpoints: Still the same!

## Verify It's Working

```bash
# Check MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"

# View the database
mongosh
use inventory_db
db.users.find().pretty()
exit
```

## Need Help?

- **Full Setup Guide:** [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **Migration Details:** [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md)
- **MongoDB not installed?** Run `./setup-mongodb.sh`

## Troubleshooting

### MongoDB won't start?
```bash
brew services restart mongodb-community@7.0
```

### Can't connect?
Check if MongoDB is running:
```bash
brew services list | grep mongodb
```

### Admin user already exists?
That's fine! Just login with:
- Username: `admin`
- Password: `admin123`

---

**Ready to go!** 🚀 Your inventory system is now powered by MongoDB.
