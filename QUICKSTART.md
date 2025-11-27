# 🚀 Quick Start Guide

## Your Express.js Backend is Ready!

The backend has been successfully integrated into your Next.js application with PostgreSQL database.

## ✅ What's Been Set Up

1. **Express.js API Server** - Full REST API with all endpoints
2. **PostgreSQL Database** - Database schema with tables created
3. **Authentication** - JWT-based auth with bcrypt password hashing
4. **Role-Based Access Control** - Admin, Manager, Employee roles
5. **Audit Logging** - Automatic logging of all actions
6. **Integrated Server** - Next.js and Express running together

## 🎯 Getting Started

### Option 1: Integrated Server (Recommended)
```bash
npm run dev
```
This starts both Next.js and the API on `http://localhost:3000`

### Option 2: Separate Servers
```bash
# Terminal 1 - Next.js frontend
npm run dev:next

# Terminal 2 - API backend
npm run dev:api
```

## 🔑 Default Login Credentials

```
Username: admin
Password: admin123
Email: admin@inventory.com
Role: admin
```

## 📡 API Endpoints

Your API is available at: `http://localhost:3000/api/v1`

### Test the API:
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Available Endpoints:

**Authentication**
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

**Items** (Inventory)
- `GET /api/v1/items` - Get all items
- `GET /api/v1/items/:id` - Get item by ID
- `POST /api/v1/items` - Create item
- `PUT /api/v1/items/:id` - Update item
- `DELETE /api/v1/items/:id` - Delete item
- `GET /api/v1/items/categories` - Get categories
- `GET /api/v1/items/low-stock` - Get low stock items
- `POST /api/v1/items/bulk` - Bulk create

**Assignments**
- `GET /api/v1/assignments` - Get all
- `POST /api/v1/assignments` - Create assignment
- `PATCH /api/v1/assignments/:id/return` - Return item

**Livestock**
- `GET /api/v1/livestock` - Get all
- `GET /api/v1/livestock/:id` - Get by ID
- `POST /api/v1/livestock` - Create
- `PUT /api/v1/livestock/:id` - Update
- `DELETE /api/v1/livestock/:id` - Delete

**Feeds**
- `GET /api/v1/feeds` - Get all
- `GET /api/v1/feeds/:id` - Get by ID
- `POST /api/v1/feeds` - Create
- `PUT /api/v1/feeds/:id` - Update
- `DELETE /api/v1/feeds/:id` - Delete

**Users**
- `GET /api/v1/users` - Get all (Admin/Manager only)
- `GET /api/v1/users/:id` - Get by ID
- `PUT /api/v1/users/:id` - Update (Admin only)
- `DELETE /api/v1/users/:id` - Delete (Admin only)

**Dashboard**
- `GET /api/v1/dashboard/stats` - Get statistics

**Audit Logs**
- `GET /api/v1/audit-logs` - Get logs (Admin/Manager)
- `GET /api/v1/audit-logs/stats` - Get stats (Admin/Manager)

## 🗂️ Project Structure

```
inventory/
├── server/                    # Express.js Backend
│   ├── config/
│   │   ├── database.js        # PostgreSQL connection
│   │   └── db-schema.sql      # Database schema
│   ├── controllers/           # Business logic
│   │   ├── auth.controller.js
│   │   ├── items.controller.js
│   │   ├── assignments.controller.js
│   │   ├── livestock.controller.js
│   │   ├── feeds.controller.js
│   │   ├── users.controller.js
│   │   ├── dashboard.controller.js
│   │   └── audit.controller.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── audit.js           # Audit logging
│   ├── routes/                # API routes
│   ├── app.js                 # Express app
│   └── index.js               # Standalone server
├── server.js                  # Next.js + Express integration
├── app/                       # Next.js frontend
├── components/                # React components
└── lib/                       # Utilities
```

## 🔧 Configuration

### Environment Variables (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
DATABASE_URL=postgresql://niloy@localhost:5432/inventory_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📊 Database Management

### View Tables:
```bash
psql inventory_db -c "\dt"
```

### Query Data:
```bash
# View all users
psql inventory_db -c "SELECT id, username, email, role FROM users;"

# View all items
psql inventory_db -c "SELECT * FROM items;"
```

### Reset Database:
```bash
dropdb inventory_db
createdb inventory_db
psql -d inventory_db -f server/config/db-schema.sql
```

## 🧪 Testing the API

### Using curl:
```bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.data.access_token')

# Get all items
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/items

# Create an item
curl -X POST http://localhost:3000/api/v1/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "category": "Software",
    "quantity": 10,
    "description": "Test item"
  }'
```

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Automatic audit logging
- ✅ Protected routes
- ✅ CORS configured

## 🛠️ Available Scripts

```bash
npm run dev          # Start integrated server (Next.js + API)
npm run dev:next     # Start only Next.js
npm run dev:api      # Start only API server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 📝 Next Steps

1. ✅ Backend is set up and running
2. ✅ Database is initialized
3. ✅ Default admin user created
4. 🎯 Start the server: `npm run dev`
5. 🌐 Open browser: `http://localhost:3000`
6. 🔑 Login with admin credentials
7. 🚀 Start using the application!

## 🐛 Troubleshooting

### Database Connection Error
- Check if PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Server Won't Start
- Check Node.js version: `node --version` (should be 18+)
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📚 Documentation

- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Detailed setup guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) - Architecture details

## 🎉 You're All Set!

Your inventory management system now has a fully functional backend API integrated with Next.js. Happy coding! 🚀
