# Backend API Requirements for Inventory Management System

## Overview

This document outlines the complete backend API requirements for the Inventory Management System frontend. The backend should be built using Express.js with PostgreSQL database.

---

## Tech Stack Requirements

- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator or Joi
- **CORS**: Enable CORS for frontend communication
- **Environment Variables**: dotenv

---

## Base Configuration

### API Base URL
```
Production: https://inv-api.tutorsplan.com/api/v1
Development: http://localhost:5000/api/v1
```

### Response Format

All API responses should follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* actual data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "detail": "Detailed error message (optional)"
}
```

### HTTP Status Codes

- `200` - OK (Successful GET, PUT, PATCH)
- `201` - Created (Successful POST)
- `204` - No Content (Successful DELETE)
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

---

## Authentication & Authorization

### JWT Token Requirements

**Token Structure:**
```json
{
  "user_id": 1,
  "username": "testuser",
  "role": "admin",
  "exp": 1234567890
}
```

**Token Expiry**: 24 hours (86400 seconds)

**Header Format:**
```
Authorization: Bearer <access_token>
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **admin** | Full access to all endpoints, including user management |
| **manager** | Can create/update items, assign to any user, manage inventory |
| **employee** | Can view items, assign to themselves only, limited access |

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'employee', -- 'admin', 'manager', 'employee'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Items Table
```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'Software', 'Hardware', 'Office Supplies', etc.
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 10, -- Low stock threshold
  location VARCHAR(255),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Assignments Table
```sql
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  assigned_by INTEGER REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  returned_at TIMESTAMP,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active' -- 'active', 'returned'
);
```

### Livestock Table
```sql
CREATE TABLE livestock (
  id SERIAL PRIMARY KEY,
  tag_number VARCHAR(100) UNIQUE NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  birth_date DATE,
  gender VARCHAR(20),
  health_status VARCHAR(50) DEFAULT 'healthy', -- 'healthy', 'sick', 'quarantine', 'deceased'
  location VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Feeds Table
```sql
CREATE TABLE feeds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'kg', -- 'kg', 'lbs', 'bags', etc.
  cost_price DECIMAL(10, 2),
  supplier VARCHAR(255),
  batch_number VARCHAR(100),
  expiry_date DATE,
  sku VARCHAR(100),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Locations Table
```sql
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  type VARCHAR(100), -- 'warehouse', 'office', 'farm', etc.
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Maintenance Table
```sql
CREATE TABLE maintenance (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  cost DECIMAL(10, 2),
  performed_by INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  reserved_from DATE NOT NULL,
  reserved_to DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Approvals Table
```sql
CREATE TABLE approvals (
  id SERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL, -- 'assignment', 'reservation', 'item_creation', etc.
  reference_id INTEGER, -- ID of the item/assignment/reservation being approved
  requested_by INTEGER REFERENCES users(id),
  approved_by INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  request_data JSONB, -- Store request details
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
  entity_type VARCHAR(100), -- 'item', 'user', 'assignment', etc.
  entity_id INTEGER,
  changes JSONB, -- Store before/after data
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### 1. Authentication Endpoints

#### POST /api/v1/auth/register
Register a new user (self-registration only allows 'employee' role).

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123",
  "email": "user@example.com",
  "role": "employee"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "testuser",
  "email": "user@example.com",
  "role": "employee"
}
```

---

#### POST /api/v1/auth/login
Login and get access token.

**Request Body:**
```json
{
  "username": "Arnisha",
  "password": "Arnisha"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

#### GET /api/v1/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "Arnisha",
  "email": "arnisha@example.com",
  "role": "admin"
}
```

---

#### POST /api/v1/auth/users/create
Create a new user (Admin/Manager only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "username": "newmanager",
  "password": "password123",
  "email": "manager@example.com",
  "role": "manager"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "username": "newmanager",
  "email": "manager@example.com",
  "role": "manager"
}
```

---

### 2. Items Endpoints

#### GET /api/v1/items
Get all items with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category
- `location` (optional): Filter by location
- `low_stock` (optional): Boolean, show only low stock items
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Microsoft Office 365",
    "description": "Office productivity suite",
    "category": "Software",
    "quantity": 25,
    "min_quantity": 10,
    "location": "IT Department",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

---

#### GET /api/v1/items/:id
Get a single item by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Microsoft Office 365",
  "description": "Office productivity suite",
  "category": "Software",
  "quantity": 25,
  "min_quantity": 10,
  "location": "IT Department",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

---

#### POST /api/v1/items
Create a new item (Manager/Admin only).

**Request Body:**
```json
{
  "name": "Dell Monitor 24\"",
  "description": "24 inch LED monitor",
  "category": "Hardware",
  "quantity": 10,
  "min_quantity": 5,
  "location": "Storage Room A"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "name": "Dell Monitor 24\"",
  "description": "24 inch LED monitor",
  "category": "Hardware",
  "quantity": 10,
  "min_quantity": 5,
  "location": "Storage Room A",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

---

#### PUT /api/v1/items/:id
Update an item (Manager/Admin only).

**Request Body:**
```json
{
  "name": "Dell Monitor 27\"",
  "quantity": 15
}
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "name": "Dell Monitor 27\"",
  "quantity": 15,
  "updated_at": "2024-01-02T10:00:00Z"
}
```

---

#### DELETE /api/v1/items/:id
Delete an item (Admin only).

**Response:** `204 No Content`

---

#### GET /api/v1/items/categories
Get list of all item categories.

**Response:** `200 OK`
```json
[
  "Software",
  "Hardware",
  "Office Supplies",
  "Furniture",
  "Electronics"
]
```

---

#### PATCH /api/v1/items/:id/stock
Update item stock quantity (Manager/Admin only).

**Request Body:**
```json
{
  "quantity": 20,
  "operation": "set" // or "add" or "subtract"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "quantity": 20,
  "updated_at": "2024-01-02T10:00:00Z"
}
```

---

### 3. Assignments Endpoints

#### GET /api/v1/assignments
Get all assignments with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status ('active' or 'returned')
- `user_id` (optional): Filter by user
- `item_id` (optional): Filter by item

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "item_id": 1,
    "item_name": "Microsoft Office 365",
    "user_id": 2,
    "username": "john_doe",
    "quantity": 1,
    "assigned_by": 1,
    "assigned_at": "2024-01-01T10:00:00Z",
    "returned_at": null,
    "status": "active",
    "notes": "For marketing department"
  }
]
```

---

#### POST /api/v1/assignments
Create a new assignment.

**Request Body:**
```json
{
  "item_id": 1,
  "user_id": 2,
  "quantity": 1,
  "notes": "Assigned for project work"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "item_id": 1,
  "user_id": 2,
  "quantity": 1,
  "assigned_by": 1,
  "assigned_at": "2024-01-02T10:00:00Z",
  "status": "active"
}
```

---

#### PATCH /api/v1/assignments/:id/return
Mark an assignment as returned.

**Request Body:**
```json
{
  "notes": "Item returned in good condition"
}
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "status": "returned",
  "returned_at": "2024-01-03T10:00:00Z"
}
```

---

#### GET /api/v1/assignments/user/me
Get assignments for current logged-in user.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "item_name": "Microsoft Office 365",
    "quantity": 1,
    "assigned_at": "2024-01-01T10:00:00Z",
    "status": "active"
  }
]
```

---

### 4. Dashboard Endpoints

#### GET /api/v1/dashboard/stats
Get dashboard statistics.

**Response:** `200 OK`
```json
{
  "total_items": 150,
  "total_categories": 5,
  "low_stock_count": 8,
  "active_assignments": 42,
  "recent_items": [
    {
      "id": 10,
      "name": "HP Printer",
      "category": "Hardware",
      "quantity": 3,
      "created_at": "2024-01-05T10:00:00Z"
    }
  ],
  "low_stock_items": [
    {
      "id": 5,
      "name": "Paper Reams",
      "quantity": 8,
      "min_quantity": 10
    }
  ],
  "category_stats": [
    {
      "category": "Software",
      "count": 45,
      "total_quantity": 120
    },
    {
      "category": "Hardware",
      "count": 60,
      "total_quantity": 200
    }
  ]
}
```

---

### 5. Livestock Endpoints

#### GET /api/v1/livestock
Get all livestock with optional filtering.

**Query Parameters:**
- `species` (optional): Filter by species
- `health_status` (optional): Filter by health status
- `location` (optional): Filter by location

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "tag_number": "COW-001",
    "species": "Cattle",
    "breed": "Holstein",
    "birth_date": "2022-03-15",
    "gender": "Female",
    "health_status": "healthy",
    "location": "Barn A",
    "notes": "Pregnant",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

#### POST /api/v1/livestock
Create a new livestock entry.

**Request Body:**
```json
{
  "tag_number": "COW-002",
  "species": "Cattle",
  "breed": "Angus",
  "birth_date": "2023-01-10",
  "gender": "Male",
  "health_status": "healthy",
  "location": "Barn B"
}
```

**Response:** `201 Created`

---

#### PUT /api/v1/livestock/:id
Update livestock information.

**Response:** `200 OK`

---

#### DELETE /api/v1/livestock/:id
Delete a livestock entry.

**Response:** `204 No Content`

---

#### GET /api/v1/livestock/health/report
Get health status report for all livestock.

**Response:** `200 OK`
```json
{
  "healthy": 45,
  "sick": 3,
  "quarantine": 1,
  "deceased": 2
}
```

---

### 6. Feeds Endpoints

#### GET /api/v1/feeds
Get all feed inventory.

**Query Parameters:**
- `type` (optional): Filter by feed type
- `expiring_soon` (optional): Boolean, show feeds expiring within 30 days

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Cattle Feed Premium",
    "type": "Grain Mix",
    "quantity": 500.50,
    "unit": "kg",
    "cost_price": 25.00,
    "supplier": "FeedCo Ltd",
    "batch_number": "BATCH-2024-001",
    "expiry_date": "2024-12-31",
    "sku": "CF-PREM-001",
    "location": "Feed Storage 1",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

#### POST /api/v1/feeds
Create a new feed entry.

**Request Body:**
```json
{
  "name": "Chicken Feed Starter",
  "type": "Pellets",
  "quantity": 200,
  "unit": "kg",
  "cost_price": 15.50,
  "supplier": "PoultrySupply Inc",
  "batch_number": "BATCH-2024-002",
  "expiry_date": "2024-06-30",
  "sku": "CF-START-001",
  "location": "Feed Storage 2"
}
```

**Response:** `201 Created`

---

#### PUT /api/v1/feeds/:id
Update feed information.

**Response:** `200 OK`

---

#### DELETE /api/v1/feeds/:id
Delete a feed entry.

**Response:** `204 No Content`

---

### 7. Locations Endpoints

#### GET /api/v1/locations
Get all locations.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Main Warehouse",
    "address": "123 Storage Ave, City",
    "type": "warehouse",
    "capacity": 1000,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

#### POST /api/v1/locations
Create a new location.

**Request Body:**
```json
{
  "name": "Office Building A",
  "address": "456 Business Rd, City",
  "type": "office",
  "capacity": 200
}
```

**Response:** `201 Created`

---

#### PUT /api/v1/locations/:id
Update location information.

**Response:** `200 OK`

---

#### DELETE /api/v1/locations/:id
Delete a location.

**Response:** `204 No Content`

---

### 8. Maintenance Endpoints

#### GET /api/v1/maintenance
Get all maintenance records.

**Query Parameters:**
- `status` (optional): Filter by status
- `item_id` (optional): Filter by item

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "item_id": 5,
    "item_name": "Generator",
    "description": "Annual service and oil change",
    "scheduled_date": "2024-02-01",
    "completed_date": null,
    "cost": 150.00,
    "status": "scheduled",
    "notes": "Contact service provider"
  }
]
```

---

#### POST /api/v1/maintenance
Create a new maintenance record.

**Response:** `201 Created`

---

#### PUT /api/v1/maintenance/:id
Update maintenance record.

**Response:** `200 OK`

---

#### GET /api/v1/maintenance/upcoming
Get upcoming maintenance (next 30 days).

**Response:** `200 OK`

---

### 9. Reservations Endpoints

#### GET /api/v1/reservations
Get all reservations.

**Query Parameters:**
- `status` (optional): Filter by status
- `user_id` (optional): Filter by user

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "item_id": 3,
    "item_name": "Projector",
    "user_id": 2,
    "username": "john_doe",
    "quantity": 1,
    "reserved_from": "2024-02-15",
    "reserved_to": "2024-02-17",
    "status": "approved",
    "notes": "For client presentation"
  }
]
```

---

#### POST /api/v1/reservations
Create a new reservation.

**Request Body:**
```json
{
  "item_id": 3,
  "quantity": 1,
  "reserved_from": "2024-02-15",
  "reserved_to": "2024-02-17",
  "notes": "For conference"
}
```

**Response:** `201 Created`

---

#### PUT /api/v1/reservations/:id
Update reservation.

**Response:** `200 OK`

---

#### DELETE /api/v1/reservations/:id
Cancel reservation.

**Response:** `204 No Content`

---

### 10. Approvals Endpoints

#### GET /api/v1/approvals
Get all approval requests.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "type": "assignment",
    "reference_id": 5,
    "requested_by": 3,
    "requester_name": "employee_user",
    "status": "pending",
    "request_data": {
      "item_id": 10,
      "quantity": 2
    },
    "created_at": "2024-01-10T10:00:00Z"
  }
]
```

---

#### GET /api/v1/approvals/pending
Get pending approval requests only.

**Response:** `200 OK`

---

#### PATCH /api/v1/approvals/:id/approve
Approve a request (Manager/Admin only).

**Request Body:**
```json
{
  "notes": "Approved for business use"
}
```

**Response:** `200 OK`

---

#### PATCH /api/v1/approvals/:id/reject
Reject a request (Manager/Admin only).

**Request Body:**
```json
{
  "notes": "Insufficient justification"
}
```

**Response:** `200 OK`

---

### 11. Audit Logs Endpoints

#### GET /api/v1/audit
Get audit logs with filtering.

**Query Parameters:**
- `user_id` (optional): Filter by user
- `action` (optional): Filter by action type
- `entity_type` (optional): Filter by entity type
- `from_date` (optional): Start date
- `to_date` (optional): End date
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`
```json
[
  {
    "id": 100,
    "user_id": 1,
    "username": "admin",
    "action": "create",
    "entity_type": "item",
    "entity_id": 25,
    "changes": {
      "name": "New Item"
    },
    "ip_address": "192.168.1.100",
    "created_at": "2024-01-10T10:00:00Z"
  }
]
```

---

#### GET /api/v1/audit/stats
Get audit statistics.

**Response:** `200 OK`
```json
{
  "total_actions": 1250,
  "actions_today": 45,
  "by_action": {
    "create": 300,
    "update": 500,
    "delete": 50,
    "login": 400
  },
  "by_entity": {
    "item": 600,
    "user": 100,
    "assignment": 350
  }
}
```

---

### 12. Users Endpoints

#### GET /api/v1/users
Get all users (Manager/Admin only).

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

#### GET /api/v1/users/:id
Get user by ID (Manager/Admin only).

**Response:** `200 OK`

---

#### PUT /api/v1/users/:id
Update user (Admin only).

**Response:** `200 OK`

---

#### DELETE /api/v1/users/:id
Delete user (Admin only).

**Response:** `204 No Content`

---

### 13. Reports Endpoints

#### GET /api/v1/reports/low-stock
Get low stock report.

**Response:** `200 OK`
```json
[
  {
    "id": 5,
    "name": "Paper Reams",
    "category": "Office Supplies",
    "quantity": 8,
    "min_quantity": 10,
    "deficit": 2
  }
]
```

---

#### GET /api/v1/reports/assigned-items
Get assigned items report.

**Response:** `200 OK`
```json
[
  {
    "item_id": 1,
    "item_name": "Laptop",
    "total_assigned": 15,
    "available": 5
  }
]
```

---

### 14. Export Endpoints

#### GET /api/v1/export/items/csv
Export items as CSV file.

**Response:** CSV file download

---

#### GET /api/v1/export/assignments/csv
Export assignments as CSV file.

**Response:** CSV file download

---

#### GET /api/v1/export/low-stock/csv
Export low stock items as CSV file.

**Response:** CSV file download

---

### 15. Import Endpoints

#### POST /api/v1/import/csv
Import data from CSV file.

**Request:** Multipart form-data with file upload

**Request Body:**
```
file: <CSV file>
type: "items" | "feeds" | "livestock"
```

**Response:** `200 OK`
```json
{
  "imported": 25,
  "failed": 2,
  "errors": [
    {
      "row": 10,
      "error": "Invalid category"
    }
  ]
}
```

---

## Middleware Requirements

### 1. Authentication Middleware
- Verify JWT token from Authorization header
- Extract user information and attach to request object
- Return 401 if token is missing or invalid

### 2. Role-Based Access Middleware
- Check user role against required permissions
- Return 403 if user doesn't have required role

### 3. Audit Logging Middleware
- Log all CREATE, UPDATE, DELETE operations
- Store user ID, action type, entity type, changes, IP address

### 4. CORS Middleware
- Allow requests from frontend domain
- Allow credentials (cookies/auth headers)

### 5. Error Handling Middleware
- Catch all errors and format as JSON
- Log errors to console/file
- Return appropriate status codes

---

## Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=86400

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

---

## Implementation Checklist

### Phase 1: Core Setup
- [ ] Initialize Express.js project
- [ ] Setup PostgreSQL database connection
- [ ] Create database schema and tables
- [ ] Setup environment variables
- [ ] Configure CORS middleware
- [ ] Setup error handling middleware

### Phase 2: Authentication
- [ ] Implement user registration endpoint
- [ ] Implement login endpoint with JWT generation
- [ ] Implement JWT verification middleware
- [ ] Implement "get current user" endpoint
- [ ] Implement role-based access middleware

### Phase 3: Core Modules
- [ ] Items CRUD endpoints
- [ ] Assignments CRUD endpoints
- [ ] Dashboard statistics endpoint
- [ ] Users management endpoints
- [ ] Categories endpoint

### Phase 4: Extended Features
- [ ] Livestock CRUD endpoints
- [ ] Feeds CRUD endpoints
- [ ] Locations CRUD endpoints
- [ ] Maintenance records endpoints
- [ ] Reservations endpoints
- [ ] Approvals workflow endpoints

### Phase 5: Reporting & Audit
- [ ] Audit logging middleware
- [ ] Audit logs query endpoints
- [ ] Low stock report endpoint
- [ ] Assigned items report endpoint
- [ ] CSV export endpoints
- [ ] CSV import endpoint

### Phase 6: Testing & Deployment
- [ ] Write unit tests for core functions
- [ ] Write integration tests for endpoints
- [ ] Setup logging (Winston/Morgan)
- [ ] Optimize database queries (indexes)
- [ ] Setup PM2 for production
- [ ] Deploy to production server

---

## Security Best Practices

1. **Password Security**
   - Use bcrypt with salt rounds >= 10
   - Never return password hashes in API responses
   - Enforce strong password requirements

2. **JWT Security**
   - Use strong secret key (at least 32 characters)
   - Set appropriate expiry time (24 hours)
   - Include user role in token payload
   - Validate token signature on every protected route

3. **Input Validation**
   - Validate all request bodies using express-validator or Joi
   - Sanitize inputs to prevent SQL injection
   - Use parameterized queries (pg library with placeholders)

4. **Rate Limiting**
   - Implement rate limiting on login endpoint
   - Use express-rate-limit package

5. **HTTPS**
   - Use HTTPS in production
   - Set secure cookies

6. **Database**
   - Use connection pooling
   - Never expose database credentials
   - Regular backups

---

## Example Express.js Server Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── env.js               # Environment variables
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── rbac.js              # Role-based access control
│   │   ├── audit.js             # Audit logging
│   │   └── errorHandler.js     # Global error handler
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── items.routes.js
│   │   ├── assignments.routes.js
│   │   ├── livestock.routes.js
│   │   ├── feeds.routes.js
│   │   ├── dashboard.routes.js
│   │   └── ... (other routes)
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── items.controller.js
│   │   └── ... (other controllers)
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── ... (other models)
│   ├── utils/
│   │   ├── jwt.js               # JWT helper functions
│   │   ├── validators.js        # Input validation schemas
│   │   └── helpers.js
│   └── app.js                   # Express app setup
├── .env
├── .gitignore
├── package.json
└── server.js                    # Entry point
```

---

## Testing the API

Use tools like:
- **Postman** - For manual API testing
- **Thunder Client** (VS Code extension) - Lightweight API testing
- **Jest + Supertest** - For automated testing

---

## Documentation

The backend should provide:
1. **Swagger/OpenAPI documentation** - Auto-generated API docs
2. **Postman Collection** - Import all endpoints to Postman
3. **README.md** - Setup and deployment instructions

---

## Support & Maintenance

The backend should include:
1. **Logging** - Use Winston or Morgan for request/error logging
2. **Monitoring** - Setup health check endpoint `/api/v1/health`
3. **Database Migrations** - Use a migration tool (e.g., node-pg-migrate)
4. **Seeding** - Initial data seeding scripts for development

---

**End of Backend API Requirements**
