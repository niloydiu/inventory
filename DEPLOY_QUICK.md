# Quick Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] MongoDB Atlas cluster created (free tier)
- [ ] Database user created in Atlas
- [ ] Network access configured (0.0.0.0/0)
- [ ] MongoDB connection string obtained
- [ ] Vercel account created
- [ ] Git repository initialized (optional but recommended)

---

## 🚀 Quick Deploy Commands

### 1. Install Vercel CLI (if not installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

Or use the helper script:
```bash
./deploy-vercel.sh
```

---

## 🔐 Environment Variables to Add in Vercel

After deployment, add these in **Vercel Dashboard → Settings → Environment Variables**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db?retryWrites=true&w=majority
JWT_SECRET=your-secure-random-string-here
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api/v1
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Important:** 
- Replace `username`, `password`, `cluster` with your MongoDB Atlas credentials
- Replace `your-app` with your actual Vercel deployment URL
- Use a strong random string for JWT_SECRET

---

## 🌱 Seed Production Database

After adding environment variables and redeploying:

```bash
npm run db:seed:production "mongodb+srv://username:password@cluster.mongodb.net/inventory_db"
```

Or directly:
```bash
node seed-production.js "your-mongodb-atlas-uri"
```

This creates the admin user:
- Username: `admin`
- Password: `admin123`

---

## 🧪 Test Your Deployment

1. Visit: `https://your-app.vercel.app`
2. Login with admin/admin123
3. Test API: `https://your-app.vercel.app/health`

---

## 🔄 Update After Deployment

If you need to update `NEXT_PUBLIC_API_URL` after deployment:

1. Get your Vercel URL from deployment output
2. Update environment variable in Vercel dashboard
3. Redeploy:
   ```bash
   vercel --prod
   ```

---

## 📚 Full Documentation

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete guide.

---

## ⚡ One-Line Deploy (if everything is set up)

```bash
vercel --prod && npm run db:seed:production "YOUR_MONGODB_URI"
```

---

## 🆘 Common Issues

### Issue: API routes return 404
**Solution:** Check that `vercel.json` exists and environment variables are set

### Issue: Database connection fails
**Solution:** 
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check connection string format
- Ensure password is URL-encoded

### Issue: Environment variables not working
**Solution:** 
- Redeploy after adding environment variables
- Check that all 5 variables are added
- Verify variables are set for "Production" environment

---

## 💡 Tips

1. **Test locally first**: Run `npm run build` to ensure no build errors
2. **Use MongoDB Atlas free tier**: Perfect for small projects
3. **Enable Git integration**: Auto-deploy on push
4. **Monitor logs**: Use `vercel logs` or Vercel dashboard
5. **Custom domain**: Add in Vercel dashboard → Settings → Domains

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Project Issues: Check Vercel function logs in dashboard
