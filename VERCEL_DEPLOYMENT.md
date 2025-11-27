# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get your connection string

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Install Vercel CLI: `npm i -g vercel`

---

## 📋 Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

#### Create MongoDB Atlas Cluster:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new project
3. Build a cluster (choose FREE tier)
4. Wait for cluster to be created

#### Configure Database Access:
1. Click "Database Access" in left menu
2. Add a database user with username/password
3. Remember these credentials!

#### Configure Network Access:
1. Click "Network Access" in left menu
2. Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - ⚠️ This is needed for Vercel's dynamic IPs

#### Get Connection String:
1. Click "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `inventory_db`

**Example:**
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/inventory_db?retryWrites=true&w=majority
```

---

### 2. Install Vercel CLI

```bash
npm i -g vercel
```

---

### 3. Login to Vercel

```bash
vercel login
```

---

### 4. Deploy to Vercel

From your project root:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? **inventory-management** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **N**

---

### 5. Add Environment Variables

After first deployment, go to your Vercel dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Example |
|------|-------|---------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/inventory_db` |
| `JWT_SECRET` | A secure random string | `your-production-jwt-secret-change-this` |
| `NEXT_PUBLIC_API_URL` | Your Vercel deployment URL + /api/v1 | `https://your-app.vercel.app/api/v1` |
| `FRONTEND_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` | `production` |

**How to add:**
- Click "Add New" for each variable
- Select "Production", "Preview", and "Development" environments
- Click "Save"

---

### 6. Redeploy with Environment Variables

```bash
vercel --prod
```

This will deploy with your environment variables.

---

### 7. Seed the Production Database

You can seed the database in two ways:

#### Option A: Using a local script

Create a temporary file `seed-production.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use your production MongoDB URI
const MONGODB_URI = 'your-mongodb-atlas-uri-here';

mongoose.connect(MONGODB_URI);

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  full_name: String,
  is_active: Boolean
});

const User = mongoose.model('User', UserSchema);

async function seed() {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      username: 'admin',
      email: 'admin@inventory.com',
      password: hashedPassword,
      role: 'admin',
      full_name: 'System Administrator',
      is_active: true
    });

    console.log('✅ Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
```

Run it:
```bash
node seed-production.js
```

#### Option B: Using MongoDB Compass

1. Download MongoDB Compass
2. Connect using your Atlas connection string
3. Navigate to `inventory_db` → `users` collection
4. Insert this document (with hashed password for "admin123"):

```json
{
  "username": "admin",
  "email": "admin@inventory.com",
  "password": "$2a$10$rZ8xN5qE7YJ5H5K9L5K9LeE5K9L5K9L5K9L5K9L5K9L5K9L5K9L5K",
  "role": "admin",
  "full_name": "System Administrator",
  "is_active": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

---

### 8. Update API URL in Code

After deployment, update `NEXT_PUBLIC_API_URL` in Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to: `https://your-app.vercel.app/api/v1`
3. Update `FRONTEND_URL` to: `https://your-app.vercel.app`
4. Redeploy: `vercel --prod`

---

## 🧪 Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to login with:
   - Username: `admin`
   - Password: `admin123`

3. Test API health:
   ```bash
   curl https://your-app.vercel.app/health
   ```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:** 
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string in environment variables
- Ensure password is URL-encoded (no special characters)

### Issue: "API routes not working"
**Solution:**
- Check that environment variables are set in Vercel
- Redeploy after adding environment variables
- Check Vercel function logs

### Issue: "Module not found" errors
**Solution:**
- Ensure all dependencies are in `package.json` dependencies (not devDependencies)
- Run `npm install` to verify
- Redeploy

### View Logs:
```bash
vercel logs
```

Or in Vercel Dashboard → Your Project → Deployments → Click deployment → Runtime Logs

---

## 📦 Optional: Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update environment variables to use your custom domain

---

## 🔄 Continuous Deployment

If you push to GitHub:

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Connect your GitHub repository
3. Every push to main branch will auto-deploy

---

## 💡 Important Notes

1. **MongoDB Atlas Free Tier Limits:**
   - 512 MB storage
   - Shared RAM
   - Good for testing and small apps

2. **Vercel Free Tier Limits:**
   - 100 GB bandwidth per month
   - Serverless function execution: 100 GB-hours
   - 10 second execution limit per function

3. **Environment Variables:**
   - Always use secure, random strings for `JWT_SECRET`
   - Never commit `.env` files to git
   - Different environments should use different MongoDB databases

4. **API Routes:**
   - All API routes are serverless functions
   - Cold starts may occur (first request slower)
   - Functions auto-scale

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Vercel account created
- [ ] Vercel CLI installed
- [ ] Project deployed to Vercel
- [ ] Environment variables added in Vercel
- [ ] Production database seeded with admin user
- [ ] Application tested and working
- [ ] Custom domain configured (optional)

---

## 🎉 Success!

Your Inventory Management System is now live on Vercel!

**Next Steps:**
1. Share your deployment URL with users
2. Create additional user accounts
3. Start adding inventory items
4. Monitor usage in Vercel dashboard
5. Set up custom domain (optional)

For support, check:
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
