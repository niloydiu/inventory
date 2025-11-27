# 🚀 Quick Deployment Guide - Security Hardened

## Pre-Deployment Checklist

### 1. Install Dependencies (Already Done)
```bash
npm install express-rate-limit helmet express-validator
```

### 2. Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these for **Production**:

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | Your MongoDB Atlas URI | `mongodb+srv://user:pass@cluster.net/inventory_db` |
| `JWT_SECRET` | 32+ char random string | `your-secure-random-jwt-secret-32chars-minimum` |
| `FRONTEND_URL` | Your Vercel domain | `https://inventory-app.vercel.app` |
| `NODE_ENV` | `production` | `production` |

**Generate strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Disable Deployment Protection

1. Go to: **Vercel Dashboard → Settings → Deployment Protection**
2. Select: **"Disabled"** or **"Only Preview Deployments"**
3. Click: **Save**

### 4. Deploy
```bash
vercel --prod
```

### 5. Seed Production Database
```bash
node seed-production.js "YOUR_MONGODB_ATLAS_URI_HERE"
```

### 6. Test Production
```bash
# Health check
curl https://your-app.vercel.app/health

# Login test
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Security Features Enabled

✅ **Rate Limiting** - 5 login attempts per 15 min
✅ **NoSQL Injection Protection** - Sanitizes all inputs
✅ **XSS Protection** - Helmet security headers
✅ **CORS** - Configured for your domain
✅ **Input Validation** - All endpoints validated
✅ **Atomic Transactions** - Prevents race conditions
✅ **httpOnly Cookies** - XSS-resistant auth
✅ **Database Indexes** - Optimized performance
✅ **Pagination** - Handles large datasets
✅ **JWT Validation** - Strong secret required

---

## Common Issues & Solutions

### Issue: "JWT_SECRET environment variable is not set"
**Solution**: Add JWT_SECRET to Vercel environment variables

### Issue: "MongoDB connection error"
**Solution**: 
- Check MongoDB Atlas IP whitelist (should include `0.0.0.0/0`)
- Verify connection string is correct
- Ensure password is URL-encoded

### Issue: "Too many requests"
**Solution**: This is rate limiting working. Wait 15 minutes or adjust limits in `server/app.js`

### Issue: "Invalid id format"
**Solution**: This is ObjectId validation working. Ensure you're passing valid MongoDB ObjectIds

---

## Monitoring

After deployment, monitor:

1. **Rate limit hits** - Check server logs
2. **Failed login attempts** - Audit logs table
3. **Response times** - Vercel Analytics
4. **Error rates** - Check runtime logs

---

## Default Admin Account

**Username**: `admin`
**Password**: `admin123`

⚠️ **IMPORTANT**: Change this password immediately after first login!

---

## Support

Application is now production-ready with all critical security fixes applied.

For issues, check:
- [SECURITY_FIXES_APPLIED.md](SECURITY_FIXES_APPLIED.md) - Full details
- Server logs in Vercel dashboard
- MongoDB Atlas logs

**Status**: ✅ **READY FOR PRODUCTION**
