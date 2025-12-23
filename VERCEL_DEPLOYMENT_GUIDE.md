# Vercel Deployment Guide - Step by Step

This guide will help you deploy your Inventory Management System to Vercel.

## 📋 Prerequisites

- MongoDB Atlas database (you already have this!)
- Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

---

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI

Open your terminal and run:

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser and ask you to authenticate. Choose your preferred method (GitHub, GitLab, Bitbucket, or Email).

### Step 3: Initial Deployment Setup

Navigate to your project directory and run:

```bash
vercel
```

**Important answers during setup:**

1. **Set up and deploy?** → Yes
2. **Which scope?** → Choose your account/team
3. **Link to existing project?** → No (first time)
4. **What's your project's name?** → inventory-management (or any name you prefer)
5. **In which directory is your code located?** → ./ (press Enter)
6. **Want to modify settings?** → No (our vercel.json is already configured)

Vercel will now deploy to a preview URL. **Don't worry if it doesn't work yet** - we need to add environment variables first!

### Step 4: Add Environment Variables

#### Option A: Using Vercel Dashboard (Easier)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (one by one):

| Variable Name         | Value                                                                                                                              | Environment                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `MONGODB_URI`         | `mongodb+srv://niloy1513991:ATqtGq8UgJXvBYw6@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0` | Production, Preview, Development |
| `JWT_SECRET`          | `your-super-secret-jwt-key-change-this-in-production`                                                                              | Production, Preview, Development |
| `NODE_ENV`            | `production`                                                                                                                       | Production                       |
| `NEXT_PUBLIC_API_URL` | (Leave empty for now, we'll update after deployment)                                                                               | Production, Preview, Development |
| `FRONTEND_URL`        | (Leave empty for now, we'll update after deployment)                                                                               | Production, Preview, Development |

#### Option B: Using Vercel CLI (Advanced)

```bash
# Add environment variables
vercel env add MONGODB_URI
# Paste your MongoDB URI when prompted

vercel env add JWT_SECRET
# Paste your JWT secret when prompted

vercel env add NODE_ENV
# Type: production

vercel env add NEXT_PUBLIC_API_URL
# Leave empty for now

vercel env add FRONTEND_URL
# Leave empty for now
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

After deployment completes, Vercel will give you a production URL like:

```
https://inventory-management-xxxx.vercel.app
```

**Copy this URL!** We need it for the next step.

### Step 6: Update API URLs

Now that we have the production URL, let's update the environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update these variables:

| Variable Name         | Value                                    |
| --------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://your-project.vercel.app/api/v1` |
| `FRONTEND_URL`        | `https://your-project.vercel.app`        |

Replace `your-project.vercel.app` with your actual Vercel URL!

3. **Redeploy** to apply changes:

```bash
vercel --prod
```

### Step 7: Seed Production Database (Optional)

If your MongoDB database is empty, you can seed it:

```bash
node seed-production.js "YOUR_MONGODB_URI"
```

Or use the dedicated script:

```bash
npm run db:seed:production
```

### Step 8: Test Your Deployment

Visit your Vercel URL: `https://your-project.vercel.app`

#### Test Checklist:

- [ ] **Homepage loads** (should redirect to login)
- [ ] **Login works** (use: admin / admin123)
- [ ] **Dashboard loads** with data
- [ ] **Inventory page** shows items
- [ ] **Create new item** works
- [ ] **API calls** work (check Network tab in browser DevTools)

---

## 🔧 Common Issues & Solutions

### Issue 1: API calls fail with CORS errors

**Solution:**

- Make sure `FRONTEND_URL` environment variable includes your Vercel URL
- Redeploy after updating environment variables

### Issue 2: "Cannot connect to database"

**Solution:**

- Check that `MONGODB_URI` is correct in Vercel environment variables
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0) in Network Access
- Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

### Issue 3: Functions timeout (504 error)

**Solution:**

- Upgrade to Vercel Pro plan (increases timeout from 10s to 60s)
- Or optimize your API endpoints to respond faster

### Issue 4: "Module not found" errors

**Solution:**

- Make sure all dependencies are in `package.json` (not just devDependencies)
- Run `vercel --prod` again to rebuild

### Issue 5: Environment variables not updating

**Solution:**

- After changing environment variables, you MUST redeploy:
  ```bash
  vercel --prod
  ```

---

## 🎯 Quick Deployment Script

I've created a script to automate the deployment. Run:

```bash
./quick-deploy-vercel.sh
```

This will:

1. ✅ Check if Vercel CLI is installed
2. ✅ Build your Next.js app
3. ✅ Deploy to Vercel
4. ✅ Show you the deployment URL

---

## 📝 After Deployment

### Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update environment variables with new domain

### MongoDB Atlas IP Whitelist

Vercel uses dynamic IPs, so you need to allow all IPs in MongoDB Atlas:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Monitor Your App

- **Vercel Dashboard**: View logs, analytics, and deployment history
- **Runtime Logs**: `vercel logs your-project-url --follow`

---

## 🆘 Need Help?

If you get stuck at any step:

1. **Check Vercel logs**:

   ```bash
   vercel logs --follow
   ```

2. **Check MongoDB connection**: Make sure Network Access allows all IPs

3. **Verify environment variables**: Dashboard → Project → Settings → Environment Variables

4. **Redeploy after changes**:
   ```bash
   vercel --prod
   ```

---

## 🎉 Success!

Once everything works, you'll have:

- ✅ Live inventory management system
- ✅ Automatic HTTPS
- ✅ Global CDN for fast loading
- ✅ Automatic deployments on git push (if connected to GitHub)
- ✅ Preview deployments for branches

**Production URL**: `https://your-project.vercel.app`

---

## 📊 Vercel Limits (Free Plan)

- 100 GB bandwidth/month
- 100 serverless function executions/day
- 10 second function timeout
- Unlimited websites

**Tip**: If you exceed limits, upgrade to Vercel Pro ($20/month) for:

- 1 TB bandwidth/month
- 60 second function timeout
- Better analytics
