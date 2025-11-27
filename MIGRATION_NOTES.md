# Migration from External API to Local Backend

## Overview

Your application previously used an external API at `https://inv-api.tutorsplan.com/api/v1`. Now it uses a local Express.js backend at `http://localhost:3000/api/v1`.

## What Changed

### 1. Environment Variable
**Before:**
```env
NEXT_PUBLIC_API_URL=https://inv-api.tutorsplan.com/api/v1
```

**After:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 2. Server Architecture
**Before:**
- Next.js frontend on port 3000
- External API on remote server

**After:**
- Integrated server on port 3000
- Next.js + Express.js running together
- PostgreSQL database locally

## No Code Changes Required!

✅ Your frontend code remains unchanged!
✅ All API calls in `lib/api-client.js` work the same way
✅ All endpoints remain at `/api/v1/*`
✅ Authentication still uses Bearer tokens

## Verification Steps

### 1. Check Environment
```bash
cat .env
# Should show: NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 2. Test Login
Open browser to `http://localhost:3000` and login:
- Username: `admin`
- Password: `admin123`

### 3. Test API Directly
```bash
# Get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use token to get items
curl http://localhost:3000/api/v1/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Features Now Available Locally

All existing API functionality:
- ✅ Authentication (login, register, refresh)
- ✅ Items/Inventory (CRUD, categories, low stock)
- ✅ Assignments (create, return)
- ✅ Livestock management
- ✅ Feed management
- ✅ User management
- ✅ Dashboard statistics
- ✅ Audit logs

## Development Workflow

### Starting the App
```bash
npm run dev
```
This starts both Next.js and the API server.

### Viewing Logs
Check terminal output for:
- API requests
- Database queries
- Authentication attempts
- Errors

### Database Access
```bash
# Connect to database
psql inventory_db

# View tables
\dt

# Query data
SELECT * FROM items;
SELECT * FROM users;
SELECT * FROM assignments;
```

## Benefits of Local Backend

1. **Faster Development** - No network latency
2. **Full Control** - Modify backend as needed
3. **Easier Debugging** - See logs in real-time
4. **No Internet Required** - Work offline
5. **Data Privacy** - Data stays local

## Troubleshooting

### Frontend Can't Connect to API
1. Check server is running: `npm run dev`
2. Verify .env has correct URL
3. Check browser console for CORS errors

### Database Connection Error
1. Ensure PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in .env
3. Verify database exists: `psql -l`

### Login Not Working
1. Check admin user exists:
   ```bash
   psql inventory_db -c "SELECT * FROM users WHERE username='admin';"
   ```
2. Reset password if needed:
   ```bash
   # Generate new hash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(console.log);"
   
   # Update in database
   psql inventory_db -c "UPDATE users SET password_hash = 'NEW_HASH' WHERE username='admin';"
   ```

## Production Deployment

When deploying to production:

1. Update DATABASE_URL to production database
2. Change JWT_SECRET to a secure random string
3. Set NODE_ENV=production
4. Use environment-specific API URLs
5. Enable CORS only for your production domain

Example production .env:
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api/v1
DATABASE_URL=postgresql://user:pass@prod-host:5432/inventory_db
JWT_SECRET=<generate-secure-random-string>
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## Support Files

- [QUICKSTART.md](./QUICKSTART.md) - Quick reference
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Detailed setup
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - What was created
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

## Summary

✅ Backend is integrated and working
✅ No frontend code changes needed
✅ All features working locally
✅ Ready for development

Your application is now completely self-contained with its own database and API server!
