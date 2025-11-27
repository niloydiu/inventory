# Inventory Management System

A modern, full-featured inventory management system built with Next.js 16 and Express.js backend with PostgreSQL.

## ✨ Features

- 📊 **Dashboard** - Real-time overview with statistics and recent items
- 📦 **Inventory Management** - Complete CRUD operations for items
- 🐄 **Livestock Tracking** - Specialized management for livestock
- 🌾 **Feed Management** - Track and manage animal feed inventory
- 📍 **Location Management** - Organize items by location
- 👥 **Assignment Tracking** - Track who has what items
- 🔧 **Maintenance Logs** - Keep records of maintenance activities
- 📅 **Reservations** - Reserve items for future use
- ✅ **Approval System** - Workflow approval for operations
- 📈 **Reporting** - Generate detailed reports
- 👤 **User Management** - Role-based access control
- 🔍 **Audit Logs** - Track all system changes
- ⚙️ **Settings** - Customizable system configuration

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS
- shadcn/ui (Radix UI components)
- Recharts for data visualization

**Backend:**
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- bcrypt for password hashing
- Role-based access control

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 7.0+

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/niloydiu/inventory-management-system.git
cd inventory-management-system
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up MongoDB:**
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"
```

For other platforms, see [MONGODB_SETUP.md](MONGODB_SETUP.md)

4. **Configure environment variables:**

Create `.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
MONGODB_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

5. **Seed the database:**
```bash
npm run db:seed
```

This creates the default admin user:
- **Username:** admin
- **Password:** admin123

6. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser:**
```
http://localhost:3000
```

### Default Login Credentials

```
Username: admin
Password: admin123
Email: admin@inventory.com
```

## How to Run (Local Development)

Follow these short steps to run the full application (frontend + backend) locally.

Prerequisites
- Node.js 18+
- PostgreSQL (running locally)

1) Install dependencies

```bash
npm install
```

2) Create the database and run schema

```bash
# create database
createdb inventory_db

# apply schema
psql -d inventory_db -f server/config/db-schema.sql
```

3) Create or update `.env` in project root (example values)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
DATABASE_URL=postgresql://<db_user>@localhost:5432/inventory_db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4) Start the integrated server (Next.js + Express API)

```bash
npm run dev
```

Notes and alternative modes
- Start only Next.js frontend:

```bash
npm run dev:next
```

- Start only API server (standalone):

```bash
npm run dev:api
```

Production build

```bash
npm run build
npm start
```

API quick tests (curl)

```bash
# Health
curl http://localhost:3000/health

# Login (get token)
curl -X POST http://localhost:3000/api/v1/auth/login \
	-H "Content-Type: application/json" \
	-d '{"username":"admin","password":"admin123"}'

# Use returned token for protected endpoints:
# curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/v1/items
```

Troubleshooting
- If the server fails to start due to a DB connection error, confirm PostgreSQL is running and `DATABASE_URL` in `.env` is correct.
- If `next dev` reports a lock error, ensure no other Next.js dev process is running and remove `.next` then restart.
- Logs for the integrated server appear in the terminal where you run `npm run dev`.

Important files
- `server/` — Express backend (routes, controllers, middleware)
- `server/config/db-schema.sql` — DB schema and default admin
- `server.js` — integration entry (Next.js + Express)
- `server/index.js` — standalone API server

Where to go next
- Open `http://localhost:3000`, login with the admin account, and explore the dashboard and inventory pages.

If you want I can also add a one-line convenience script or update package.json scripts further.

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Detailed backend setup
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference
- **[API_ARCHITECTURE.md](./API_ARCHITECTURE.md)** - Architecture overview

## Project Structure

```
inventory/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── assignments/
│   │   ├── inventory/
│   │   ├── livestock/
│   │   ├── feeds/
│   │   └── ...
│   ├── api/                 # API routes
│   ├── layout.js            # Root layout
│   └── page.jsx             # Landing page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/
│   ├── inventory/
│   └── ...
├── lib/                     # Utility functions
│   ├── auth-context.js      # Authentication context
│   ├── utils.js             # Helper functions
│   └── data/                # Mock data
└── middleware.js            # Next.js middleware for auth

```

## Features Overview

### Dashboard
- Statistics cards showing total items, low stock alerts, assignments, and categories
- Recent items list
- Category distribution chart

### Inventory Management
- View all inventory items with search and filters
- Add new items with detailed information
- Edit existing items
- View item details
- Track stock levels and locations

### Authentication
- Secure login and registration
- JWT-based authentication
- Protected routes with middleware
- Role-based access control

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file with the following:

```env
JWT_SECRET=your-jwt-secret-key
```

## License

MIT

## Author

Built by [niloydiu](https://github.com/niloydiu)
