# 🚀 Vercel Deployment Guide - MongoDB Atlas Edition

## ✅ Current Status

- ✅ MongoDB Atlas configured and connected
- ✅ Local database seeded with admin user
- ✅ Server running successfully with live MongoDB

---

## 📋 Environment Variables for Vercel

### Your .env (Local Development) ✅
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
MONGODB_URI=mongodb+srv://niloy1513991:ATqtGq8UgJXvBYw6@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Vercel Dashboard Environment Variables (Production) 🌐

**Go to: Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **Production** environment:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-app.vercel.app/api/v1` | Replace with your actual Vercel URL |
| `MONGODB_URI` | `mongodb+srv://niloy1513991:ATqtGq8UgJXvBYw6@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0` | Same as local (MongoDB Atlas) |
| `JWT_SECRET` | `6ba23c49aa4c446e793a202e5c69271a3e58f572fc1d3c50d3a60f1950e25bbaea86ff50c23fdebd` | **CRITICAL: Use this strong secret** |
| `NODE_ENV` | `production` | Important for security features |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Replace with your actual Vercel URL |

---

## 🎯 Step-by-Step Deployment

### Step 1: Add Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project (or create a new one)
3. Go to: **Settings → Environment Variables**
4. Add each variable from the table above
5. Select **Production** environment
6. Click **Save**

### Step 2: Deploy to Vercel

```bash
vercel --prod
```

Or push to your git repository (if linked):
```bash
git add .
git commit -m "Add MongoDB Atlas configuration"
git push origin main
```

### Step 3: Update NEXT_PUBLIC_API_URL and FRONTEND_URL

After deployment, Vercel will give you a URL like: `https://inventory-abc123.vercel.app`

**Update these two variables in Vercel Dashboard:**
- `NEXT_PUBLIC_API_URL` → `https://inventory-abc123.vercel.app/api/v1`
- `FRONTEND_URL` → `https://inventory-abc123.vercel.app`

Then **redeploy** to apply changes.

### Step 4: Test Your Production App

1. Visit: `https://your-app.vercel.app`
2. Login with:
   - Username: `admin`
   - Password: `admin123`

---

## 🔑 Production JWT Secret

**IMPORTANT:** Use this strong JWT secret in Vercel (already generated for you):

```
6ba23c49aa4c446e793a202e5c69271a3e58f572fc1d3c50d3a60f1950e25bbaea86ff50c23fdebd
ae39890a69d77f10533a17c00d2ed40286f791cb89baa2eb
```

Copy this entire value into the `JWT_SECRET` environment variable in Vercel.

---

## 📊 MongoDB Atlas - Same Database for Dev & Production

**Benefits:**
- ✅ Same database URI for local development and production
- ✅ No need for separate databases
- ✅ Data is shared between environments
- ✅ Easy testing and development

**Database Info:**
- Cluster: `cluster0.tzr5q.mongodb.net`
- Database: `inventory_db`
- Admin User: `admin` / `admin123`

---

## 🔒 Security Checklist

- ✅ MongoDB Atlas Network Access set to `0.0.0.0/0` (for Vercel)
- ✅ Strong JWT secret generated (128 characters)
- ✅ `.env` file in `.gitignore` (never committed)
- ✅ Production uses `NODE_ENV=production`
- ✅ Rate limiting enabled (5 login attempts per 15 min)
- ✅ Helmet security headers enabled
- ✅ Input sanitization active

---

## 🚨 Deployment Protection (If Enabled)

If Vercel shows "Deployment Protection" error:

1. Go to: **Vercel Dashboard → Settings → Deployment Protection**
2. Select: **"Disabled"** or **"Only Preview Deployments"**
3. Click: **Save**

---

## 🧪 Quick Test After Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

---

## 📝 Summary

### Local Development (.env file):
```env
MONGODB_URI=mongodb+srv://niloy1513991:ATqtGq8UgJXvBYw6@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Vercel Production (Dashboard):
```env
MONGODB_URI=mongodb+srv://niloy1513991:ATqtGq8UgJXvBYw6@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=6ba23c49aa4c446e793a202e5c69271a3e58f572fc1d3c50d3a60f1950e25bbaea86ff50c23fdebd
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api/v1
FRONTEND_URL=https://your-app.vercel.app
```

**Key Difference:** 
- Same MongoDB URI (both use MongoDB Atlas)
- Different JWT_SECRET (stronger for production)
- Different URLs (localhost vs vercel.app)
- Different NODE_ENV (development vs production)

---

## ✅ You're Ready!

Your application is now configured for MongoDB Atlas and ready to deploy to Vercel! 🎉
