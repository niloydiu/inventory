# 🌐 MongoDB Atlas Setup - Live Database

## ✅ Configuration Complete

Your project has been configured to use **MongoDB Atlas** (cloud database) instead of local MongoDB.

---

## 🔐 IMPORTANT: Set Your Database Password

**Step 1:** Open `.env` file and replace `<db_password>` with your actual MongoDB Atlas password:

```env
MONGODB_URI=mongodb+srv://niloy1513991:YOUR_ACTUAL_PASSWORD@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0
```

**Example:**
```env
# If your password is "MySecurePass123"
MONGODB_URI=mongodb+srv://niloy1513991:MySecurePass123@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🚀 Quick Start

### 1. Set Your Password in .env
Edit `/Users/niloy/programming/webdev/inventory/.env` and replace `<db_password>` with your actual password.

### 2. Seed the Live Database
```bash
npm run db:seed
```

This will create:
- Admin user (username: `admin`, password: `admin123`)
- Sample inventory items
- Sample data for testing

### 3. Start the Application
```bash
npm run dev
```

### 4. Login
- URL: http://localhost:3000
- Username: `admin`
- Password: `admin123`

---

## 🔍 Verify Connection

Check if the server connects to MongoDB Atlas:

```bash
# The server logs should show:
# ✅ MongoDB connected: cluster0.tzr5q.mongodb.net
```

---

## 🌐 MongoDB Atlas Dashboard

Access your database at: https://cloud.mongodb.com/

- **Cluster:** Cluster0
- **Database:** inventory_db
- **Collections:** users, items, assignments, livestock, feeds, auditlogs

---

## ⚙️ What Changed

### Before (Local MongoDB):
```env
MONGODB_URI=mongodb://localhost:27017/inventory_db
```

### After (MongoDB Atlas - Live):
```env
MONGODB_URI=mongodb+srv://niloy1513991:<db_password>@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🔒 Security Notes

1. **Never commit your password** - `.env` file is already in `.gitignore`
2. **Use a strong password** - At least 12 characters with mixed case, numbers, and symbols
3. **Network Access** - Make sure `0.0.0.0/0` is added in MongoDB Atlas Network Access (for Vercel deployment)

---

## 📝 For Production (Vercel)

When deploying to Vercel, add the same MongoDB URI in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

```
MONGODB_URI=mongodb+srv://niloy1513991:YOUR_PASSWORD@cluster0.tzr5q.mongodb.net/inventory_db?retryWrites=true&w=majority&appName=Cluster0
```

---

## ✅ Benefits of MongoDB Atlas

- ✨ **Always Online** - No need to run MongoDB locally
- 🌍 **Accessible Anywhere** - Works from any location
- 🔄 **Auto Backups** - Your data is automatically backed up
- 🚀 **Production Ready** - Same database for dev and production
- 💰 **Free Tier** - 512MB storage free forever

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
- Check your password in `.env` file
- Make sure there are no spaces around the password
- Special characters in password should be URL-encoded (e.g., `@` becomes `%40`)

### Error: "Connection timeout"
- Check Network Access in MongoDB Atlas dashboard
- Make sure `0.0.0.0/0` is allowed
- Check your internet connection

### Error: "Database not found"
- Database will be created automatically on first connection
- Just run `npm run db:seed` to initialize it

---

## 🎉 Next Steps

1. ✅ Replace `<db_password>` in `.env`
2. ✅ Run `npm run db:seed`
3. ✅ Run `npm run dev`
4. ✅ Login and test the application

Your application is now using MongoDB Atlas! 🚀
