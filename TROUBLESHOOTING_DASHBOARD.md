# Dashboard Troubleshooting Guide

## Issue: Dashboard Stuck/Not Loading

### Quick Fix Steps:

#### Step 1: Login to the Application

1. Open your browser and go to: `http://localhost:3000/login`

2. Use the default admin credentials:

   - **Username:** `admin`
   - **Password:** `admin123`

3. Click "Login"

#### Step 2: If Login Page Doesn't Show

If you see a blank screen or loading forever, try these steps:

1. **Clear Browser Cache and Cookies:**

   - Press `Cmd + Shift + R` (macOS) or `Ctrl + Shift + R` (Windows/Linux)
   - Or clear all cookies for localhost

2. **Clear localStorage:**

   - Open Browser DevTools (F12 or Cmd+Option+I)
   - Go to Application/Storage tab
   - Clear localStorage items for localhost:3000

3. **Check Browser Console for Errors:**
   - Open Browser DevTools (F12)
   - Go to Console tab
   - Look for any error messages (red text)
   - Share these errors if you need more help

#### Step 3: Verify Server is Running

Make sure your development server is running:

```bash
# Stop any running server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

You should see:

```
🚀 Ready on http://localhost:3000
📊 API running on http://localhost:3000/api/v1
🏥 Health check: http://localhost:3000/health
✅ MongoDB Connected: cluster0-shard-00-01.tzr5q.mongodb.net
```

#### Step 4: Test API Endpoints

Open a new terminal and test if the API is working:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Should return: {"success":true,"message":"Server is running",...}
```

#### Step 5: Use Debug Page

Navigate to the debug page to see authentication status:

```
http://localhost:3000/debug
```

This will show you:

- Current authentication state
- Token status
- User information
- API connectivity

### Common Issues and Solutions:

#### Issue 1: "Stuck on Loading..."

**Cause:** Not logged in or invalid token
**Solution:**

1. Clear localStorage
2. Navigate to `/login`
3. Login with admin credentials

#### Issue 2: "Can't Click Sidebar Links"

**Cause:** CSS or JavaScript error
**Solution:**

1. Check browser console for errors
2. Try hard refresh (Cmd+Shift+R)
3. Clear browser cache

#### Issue 3: "Dashboard Shows Nothing"

**Cause:** No data in database or API error
**Solution:**

1. Seed the database: `npm run db:seed`
2. Check server logs in terminal
3. Look for error messages

#### Issue 4: "Cannot Move to Any Page"

**Cause:** Authentication redirecting you
**Solution:**

1. Make sure you're logged in
2. Check auth token exists in localStorage
3. Try logging out and back in

### Manual Database Seeding

If you need to reset and seed the database:

```bash
# Seed with sample data
npm run db:seed

# Or use realistic data
npm run db:seed:realistic
```

### Create a New Admin User

If you can't login with the default admin account:

```bash
# Use curl to create a new admin user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newadmin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Still Having Issues?

1. **Check Server Logs:**

   - Look at your terminal running `npm run dev`
   - Look for error messages or stack traces

2. **Check Browser Network Tab:**

   - Open DevTools > Network tab
   - Filter by "Fetch/XHR"
   - Look for failed API requests (red)
   - Check the response of failed requests

3. **Verify MongoDB Connection:**

   - Make sure you see "✅ MongoDB Connected" in server logs
   - Check your `.env` file has correct `MONGODB_URI`

4. **Check Environment Variables:**
   - Ensure `.env` file exists
   - Verify `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`

### Debug Checklist

- [ ] Server is running (`npm run dev`)
- [ ] MongoDB is connected (check server logs)
- [ ] Browser is at `http://localhost:3000/login`
- [ ] localStorage is clear
- [ ] Browser console shows no errors
- [ ] Can login with `admin` / `admin123`
- [ ] After login, redirected to `/dashboard`
- [ ] Sidebar is visible on the left
- [ ] Dashboard cards show data

### Next Steps After Fixing

Once you're logged in and on the dashboard:

1. **Verify Navigation Works:**

   - Click on "Inventory" in sidebar
   - Click on "Users" in sidebar
   - Verify you can navigate between pages

2. **Check Dashboard Data:**

   - You should see stat cards at the top
   - Charts should be visible
   - Recent items table should show

3. **If Still Blank:**
   - The database might be empty
   - Run: `npm run db:seed` to add sample data
   - Refresh the page

## Emergency Reset

If nothing works, do a complete reset:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Clear all node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Seed the database
npm run db:seed

# 4. Start fresh
npm run dev

# 5. Clear browser completely
# - Clear cache
# - Clear cookies
# - Clear localStorage
# - Hard refresh (Cmd+Shift+R)

# 6. Navigate to http://localhost:3000/login
# 7. Login with admin/admin123
```

## Contact/Support

If you're still stuck, provide:

1. Screenshot of browser console errors
2. Server terminal output
3. Network tab showing failed requests
4. What URL you're currently at
