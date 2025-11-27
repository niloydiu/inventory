# Inventory Management System

A modern, full-featured inventory management system built with Next.js 16 and React.

## Features

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

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Authentication**: Custom JWT-based auth
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/niloydiu/inventory-management-system.git
cd inventory-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
JWT_SECRET=your-secret-key-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
