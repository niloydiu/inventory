# Deployment Guide - Separate Express.js & Next.js

এই গাইড আপনাকে দেখাবে কিভাবে Express.js API (port 6210) এবং Next.js Frontend (port 6211) আলাদা আলাদা deploy করতে হবে।

## 📋 Prerequisites

- Node.js installed
- PM2 installed globally: `npm install -g pm2`
- MongoDB connection string
- Server access (SSH)

## 🚀 Deployment Steps

### 1. Server এ Repository Clone করুন

```bash
git clone <your-repo-url>
cd inventory
```

### 2. Dependencies Install করুন

```bash
npm install
```

### 3. Environment Variables Setup করুন

`.env` file তৈরি করুন:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory

# API Configuration
API_PORT=6210
NODE_ENV=production

# Frontend Configuration
FRONTEND_PORT=6211
FRONTEND_URL=http://localhost:6211,http://your-domain.com:6211
NEXT_PUBLIC_API_URL=http://localhost:6210/api/v1

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**Important:** 
- `FRONTEND_URL` এ আপনার actual domain/IP add করুন
- `NEXT_PUBLIC_API_URL` এ server এর IP বা domain add করুন (localhost না হলে)

### 4. Next.js Build করুন

```bash
npm run build
```

### 5. PM2 দিয়ে Deploy করুন

#### Option A: Ecosystem File ব্যবহার করে (Recommended)

```bash
# Both apps start করবে
pm2 start ecosystem.config.js

# PM2 save করুন (server restart হলে auto start হবে)
pm2 save

# PM2 startup script setup করুন
pm2 startup
```

#### Option B: আলাদা আলাদা Start করুন

```bash
# API start করুন
pm2 start npm --name "inventory-api" -- run start:api

# Frontend start করুন
pm2 start npm --name "inventory-frontend" -- run start:frontend

# Save করুন
pm2 save
```

### 6. PM2 Commands

```bash
# Status check
pm2 status

# Logs দেখুন
pm2 logs

# Specific app এর logs
pm2 logs inventory-api
pm2 logs inventory-frontend

# Restart
pm2 restart ecosystem.config.js
# বা
pm2 restart inventory-api
pm2 restart inventory-frontend

# Stop
pm2 stop ecosystem.config.js

# Delete
pm2 delete ecosystem.config.js

# Monitor
pm2 monit
```

## 🔧 Port Configuration

- **Express.js API**: Port `6210`
- **Next.js Frontend**: Port `6211`

## 🌐 Nginx Configuration (Optional)

যদি Nginx reverse proxy ব্যবহার করতে চান:

```nginx
# API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:6210;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend Server
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:6211;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Check which process is using the port
lsof -i :6210
lsof -i :6211

# Kill the process if needed
kill -9 <PID>
```

### PM2 Apps Not Starting

```bash
# Check PM2 logs
pm2 logs

# Check if ports are available
netstat -tulpn | grep 6210
netstat -tulpn | grep 6211
```

### CORS Errors

`.env` file এ `FRONTEND_URL` সঠিকভাবে set করা আছে কিনা check করুন:

```env
FRONTEND_URL=http://localhost:6211,http://your-domain.com:6211
```

### API Connection Issues

Frontend থেকে API connect করতে পারছে না? Check করুন:

1. `NEXT_PUBLIC_API_URL` environment variable সঠিক আছে কিনা
2. API server running আছে কিনা: `pm2 status`
3. Firewall rules port 6210 allow করছে কিনা

## 📝 Update করার সময়

```bash
# Code pull করুন
git pull

# Dependencies update করুন
npm install

# Rebuild করুন
npm run build

# PM2 restart করুন
pm2 restart ecosystem.config.js
```

## 🎯 Quick Start Commands

```bash
# Full deployment
git clone <repo> && cd inventory
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## ⚠️ Default branch note

The repository default branch has been renamed to `main`. If you previously used `master` in local workflows, update your local branch and upstream to track `origin/main`.

Common commands to fix your local clone (run from the repo root):

PowerShell (Windows):
```powershell
# Fetch latest remote refs
git fetch origin --prune

# If you don't have a local `main` yet, create it to track the remote:
git checkout -b main origin/main

# If you have a local `master` and want to rename it to `main`:
# (switch to master first if needed)
git switch master
git branch -m master main

# Ensure `main` tracks origin/main
git fetch origin
git branch --set-upstream-to=origin/main main
git remote set-head origin main

# Pull updates from the new default branch
git pull
```

POSIX Shell (Linux / macOS):
```bash
# Fetch latest remote refs
git fetch origin --prune

# Create local main if it doesn't exist
git checkout -b main origin/main

# Rename local master to main (if you have master)
# git branch -m master main

# Set upstream and update remote HEAD
git branch --set-upstream-to=origin/main main
git remote set-head origin main

# Pull
git pull
```

Notes:
- `git branch -m` renames your local branch only; run `git push -u origin main` if you want to push a newly renamed local branch to the remote.
- `git remote set-head origin main` updates the local information about the remote default branch.
- Coordinate with collaborators before renaming shared branches.

## 📞 Support

যদি কোনো সমস্যা হয়, PM2 logs check করুন:
```bash
pm2 logs --lines 100
```

