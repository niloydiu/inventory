# Farm Inventory Management System

A comprehensive inventory management system built with Next.js 15, Node.js, Express, and MongoDB Atlas for modern farm operations.

## 🚀 Features

- **Inventory Management**: Track items, quantities, categories, and stock levels
- **Product Assignments**: Assign products to employees with tracking and acknowledgment
- **Purchase Orders**: Create and manage purchase orders with suppliers
- **Stock Transfers**: Transfer inventory between locations
- **Stock Movements**: Automatic tracking of all inventory changes
- **Livestock Management**: Track animals, health status, and feeding schedules
- **Feed Management**: Manage animal feed inventory and expiry dates
- **Maintenance Scheduling**: Track equipment maintenance
- **Reservations**: Reserve items for future use
- **Approvals**: Workflow for approvals and requests
- **Notifications**: Real-time notifications for important events
- **Reports & Analytics**: Comprehensive reporting with CSV export
- **Audit Logs**: Complete audit trail of all system actions
- **Multi-role Support**: Admin, Manager, and Employee roles with permissions
- **International Support**: Multi-currency, date formatting, number formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **MongoDB Atlas** account (or local MongoDB)
- **Git** (for cloning the repository)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/niloydiu/inventory.git
cd inventory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db?retryWrites=true&w=majority

# API Configuration (for backend)
API_PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important:**

- Replace `username:password` in MONGODB_URI with your MongoDB Atlas credentials
- Generate a strong JWT_SECRET (minimum 32 characters)
- Keep these credentials secure and never commit `.env` to version control

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string
6. Replace in `.env` file

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
# Seed with realistic sample data
node server/seed-realistic.js

# OR seed with basic sample data
node server/seed-sample.js
```

This creates:

- Admin user: `admin` / `admin123`
- Manager user: `manager` / `manager123`
- Employee user: `employee` / `employee123`
- Sample inventory items
- Sample suppliers, locations, and categories

## 🚀 Running the Application

### Development Mode

The application runs both frontend (Next.js) and backend (Express) on the same port (3000) using a proxy:

```bash
npm run dev
```

This starts:

- **Next.js** frontend on `http://localhost:3000`
- **Express API** on internal port 5000, proxied through Next.js
- **Hot reload** enabled for both frontend and backend

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Accessing the Application

1. Open your browser and navigate to: `http://localhost:3000`

2. Login with default credentials:

   - **Admin**: `admin` / `admin123`
   - **Manager**: `manager` / `manager123`
   - **Employee**: `employee` / `employee123`

3. You'll be redirected to the dashboard

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server (frontend + backend)

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run seed             # Seed database with sample data
npm run reset-admin      # Reset admin password

# Backend only
npm run server           # Start backend server only (port 5000)
```

## 📁 Project Structure

```
inventory/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── logout/
│   ├── (dashboard)/             # Dashboard pages
│   │   ├── dashboard/           # Main dashboard
│   │   ├── inventory/           # Inventory management
│   │   ├── product-assignments/ # Product assignments
│   │   ├── suppliers/           # Suppliers
│   │   ├── categories/          # Categories
│   │   ├── purchase-orders/     # Purchase orders
│   │   ├── stock-transfers/     # Stock transfers
│   │   ├── stock-movements/     # Stock movements
│   │   ├── maintenance/         # Maintenance
│   │   ├── reservations/        # Reservations
│   │   ├── approvals/           # Approvals
│   │   ├── notifications/       # Notifications
│   │   ├── livestock/           # Livestock
│   │   ├── feeds/               # Feeds
│   │   ├── locations/           # Locations
│   │   ├── users/               # User management
│   │   ├── reports/             # Reports
│   │   ├── audit-logs/          # Audit logs
│   │   └── settings/            # Settings
│   ├── layout.js                # Root layout
│   └── globals.css              # Global styles
│
├── server/                       # Express.js backend
│   ├── controllers/             # Route controllers
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── middleware/              # Custom middleware
│   ├── utils/                   # Utility functions
│   ├── config/                  # Configuration
│   ├── app.js                   # Express app
│   └── index.js                 # Server entry point
│
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   ├── dashboard/               # Dashboard components
│   ├── inventory/               # Inventory components
│   ├── layout/                  # Layout components
│   └── ...                      # Feature components
│
├── lib/                         # Utilities & helpers
│   ├── api-client.js           # API client wrapper
│   ├── api.js                  # API functions
│   ├── auth-context.js         # Auth context
│   ├── utils.js                # Utility functions
│   └── actions/                # Server actions
│
├── public/                      # Static files
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── next.config.mjs              # Next.js configuration
└── server.js                    # Server entry with proxy
```

## 🌐 API Endpoints

The API is available at `/api/v1/` and includes:

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Items (Inventory)

- `GET /api/v1/items` - Get all items (with pagination)
- `GET /api/v1/items/:id` - Get single item
- `POST /api/v1/items` - Create item
- `PUT /api/v1/items/:id` - Update item
- `DELETE /api/v1/items/:id` - Delete item

### Product Assignments

- `GET /api/v1/product-assignments` - List assignments
- `GET /api/v1/product-assignments/stats` - Get statistics
- `GET /api/v1/product-assignments/overdue` - Get overdue assignments
- `POST /api/v1/product-assignments` - Create assignment
- `POST /api/v1/product-assignments/:id/acknowledge` - Employee acknowledge
- `POST /api/v1/product-assignments/:id/return` - Return product
- `DELETE /api/v1/product-assignments/:id` - Delete assignment

### Suppliers

- `GET /api/v1/suppliers` - Get all suppliers
- `GET /api/v1/suppliers/stats` - Get stats
- `POST /api/v1/suppliers` - Create supplier
- `PUT /api/v1/suppliers/:id` - Update supplier
- `DELETE /api/v1/suppliers/:id` - Delete supplier

### Purchase Orders

- `GET /api/v1/purchase-orders` - List purchase orders
- `POST /api/v1/purchase-orders` - Create PO
- `POST /api/v1/purchase-orders/:id/approve` - Approve PO
- `POST /api/v1/purchase-orders/:id/receive` - Receive PO

### Stock Transfers

- `GET /api/v1/stock-transfers` - List transfers
- `POST /api/v1/stock-transfers` - Create transfer
- `POST /api/v1/stock-transfers/:id/approve` - Approve transfer
- `POST /api/v1/stock-transfers/:id/complete` - Complete transfer

### Reports

- `GET /api/v1/reports/low-stock` - Low stock report
- `GET /api/v1/reports/assigned-items` - Assigned items report
- `GET /api/v1/export/items` - Export items as CSV
- `GET /api/v1/export/assignments` - Export assignments as CSV

_See `USER_GUIDE.md` for detailed API usage and workflows._

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **CORS Configuration**: Secure cross-origin requests
- **NoSQL Injection Prevention**: Input sanitization
- **Helmet.js**: Security headers
- **Role-based Access Control**: Permission-based features

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
Error: MongoDB connection error
```

**Solution:**

1. Check your MongoDB Atlas IP whitelist
2. Verify MONGODB_URI in `.env`
3. Ensure database user has correct permissions

### Port Already in Use

```bash
Error: Port 3000 is already in use
```

**Solution:**

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env
PORT=3001
```

### JWT Token Errors

```bash
Error: Invalid or expired token
```

**Solution:**

1. Clear browser cookies
2. Logout and login again
3. Check JWT_SECRET is set correctly

### Build Errors

```bash
Error: Module not found
```

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## 📊 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Component library
- **React Hook Form** - Form management
- **date-fns** - Date utilities
- **Recharts** - Charts and visualizations

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@farmtech.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database by [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Happy Farming! 🌾**
