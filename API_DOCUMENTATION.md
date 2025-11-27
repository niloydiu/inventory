# Inventory Management System API Documentation

## Overview

Complete API documentation for the Inventory Management System - covering software licenses, hardware, office inventory, livestock, and feed management.

**Base URL:** `http://localhost:5000`  
**API Prefix:** `/api/v1`  
**Authentication:** Bearer Token (JWT)

---

## Quick Start

1. **Login** to get an access token:
   ```
   POST /api/v1/auth/login
   Username: Arnisha
   Password: Arnisha
   ```

2. **Get current user info:**
   ```
   GET /api/v1/auth/me
   ```

3. Use the access token in the `Authorization` header for all protected endpoints:
   ```
   Authorization: Bearer <your_access_token>
   ```

---

## Database Configuration

- **Database:** PostgreSQL
- **Connection:** Configured via `DATABASE_URL` in `.env` file
- **Default URL:** `postgresql://root:TutorsplanDevDB@192.227.120.78:5432/hr_dev`

---

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features including user creation and deletions |
| **Manager** | Can create/update items, assign items to any user, manage quantities |
| **Employee** | Can view items, assign items to themselves only |

---

## Features

- ✅ **Role-Based Access:** Admin, Manager, Employee roles with different permissions
- 📊 **CSV Export:** Export items, assignments, and low stock reports
- 📥 **CSV Import:** Import items, feeds, and livestock from CSV files
- 🔄 **Bulk Operations:** Create, update, or delete multiple items, feeds, or livestock at once
- 📱 **QR Codes:** Generate QR codes for item identification
- 📝 **Audit Logs:** Track all system changes and activities
- 👥 **User Management:** Get list of users, create users with any role (Manager/Admin only)
- 📦 **Categories:** Get available item categories
- 🔢 **Quantity Support:** Assign multiple quantities of items (default: 1)
- ⚠️ **Low Stock Threshold:** Default threshold is 10 (configurable)
- 🐄 **Livestock Management:** Track animals with health status, species, location
- 🌾 **Feed Management:** Track feed products with expiry dates, batch numbers, cost prices, SKU, suppliers, profit tracking
- 📍 **Location Management:** Manage multiple locations/warehouses
- 🔧 **Maintenance Records:** Track maintenance and service history
- 📅 **Reservations:** Reserve items for future use
- ✓ **Approval Workflows:** Request and approve item assignments

---

## Environment Variables

```env
base_url=http://localhost:5000
access_token=<auto-set-after-login>
item_id=<auto-set-after-creating-item>
assignment_id=<auto-set-after-creating-assignment>
user_id=<auto-set-after-creating-user>
livestock_id=<auto-set-after-creating-livestock>
feed_id=<auto-set-after-creating-feed>
location_id=<auto-set-after-creating-location>
maintenance_id=<auto-set-after-creating-maintenance-record>
reservation_id=<auto-set-after-creating-reservation>
approval_id=<auto-set-after-creating-approval-request>
```

---

## Default Credentials

```
Username: Arnisha
Password: Arnisha
Role: Admin
```

---

## API Structure

- All endpoints are prefixed with `/api/v1`
- Authentication uses Bearer tokens (JWT)
- Responses use JSON format
- Pagination uses `page` and `limit` parameters (1-indexed)

---

# API Endpoints

## 1. Authentication

### Register User
**POST** `/api/v1/auth/register`

Register a new user. Self-registration only allows 'employee' role for security.

**Request Body:**
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "Test123!@#",
  "role": "employee"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "testuser",
  "email": "testuser@example.com",
  "role": "employee"
}
```

---

### Login
**POST** `/api/v1/auth/login`

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

### Get Current User
**GET** `/api/v1/auth/me`

Get current authenticated user information including role.

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

### Create User by Admin
**POST** `/api/v1/auth/users/create`

Create a new user with any role (admin, manager, or employee).

**⚠️ Role Required:** Admin

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (!@#$%^&*(),.?":{}|<>-_=+[]\;'`~)

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin123!@#",
  "role": "admin"
}
```

**Response:** `201 Created`

---

### Refresh Token
**POST** `/api/v1/auth/refresh`

Refresh the access token. Returns a new token with extended expiration.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "access_token": "new_token_here",
  "token_type": "bearer"
}
```

---

## 2. Items

### Get All Items
**GET** `/api/v1/items/`

Get all items with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (1-indexed)
- `limit` (optional): Items per page (max 100)
- `category` (optional): Filter by category (Software, Hardware, Stationery, Essentials, Consumable)
- `search` (optional): Search by name or description

**Example:**
```
GET /api/v1/items/?page=1&limit=20&category=Software
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Microsoft Office 365",
    "category": "Software",
    "quantity": 50,
    "unit_type": "license seat",
    "description": "Office productivity suite",
    "status": "available"
  }
]
```

---

### Get Categories
**GET** `/api/v1/items/categories`

Get all available item categories.

**Response:** `200 OK`
```json
[
  "Software",
  "Hardware",
  "Stationery",
  "Essentials",
  "Consumable"
]
```

---

### Get Item by ID
**GET** `/api/v1/items/{item_id}`

Get a specific item by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Microsoft Office 365",
  "category": "Software",
  "quantity": 50,
  "unit_type": "license seat",
  "description": "Office productivity suite",
  "serial_number": "SN-123456",
  "asset_tag": "ASSET-001",
  "location_id": null,
  "status": "available"
}
```

---

### Create Item
**POST** `/api/v1/items/`

Create a new item.

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "name": "Microsoft Office 365",
  "category": "Software",
  "quantity": 50,
  "unit_type": "license seat",
  "description": "Office productivity suite with cloud storage",
  "serial_number": "SN-123456",
  "asset_tag": "ASSET-001",
  "location_id": null,
  "status": "available"
}
```

**Response:** `201 Created`

---

### Update Item
**PUT** `/api/v1/items/{item_id}`

Update an existing item (partial update supported).

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "name": "Microsoft Office 365 Updated",
  "quantity": 75,
  "description": "Updated description"
}
```

**Response:** `200 OK`

---

### Delete Item
**DELETE** `/api/v1/items/{item_id}`

Delete an item.

**⚠️ Role Required:** Admin only

**Response:** `204 No Content`

---

### Update Stock
**PATCH** `/api/v1/items/{item_id}/stock`

Increase or decrease stock quantity.

**Query Parameters:**
- `quantity_change`: Positive to increase, negative to decrease

**Examples:**
```
PATCH /api/v1/items/1/stock?quantity_change=10   # Increase by 10
PATCH /api/v1/items/1/stock?quantity_change=-5   # Decrease by 5
```

**Response:** `200 OK`

---

## 3. Assignments

### Get All Assignments
**GET** `/api/v1/assignments/`

Get all assignments, optionally filtered by status.

**Query Parameters:**
- `status_filter` (optional): active, returned
- `page` (optional): Page number (1-indexed)
- `limit` (optional): Assignments per page (max 100)

**Response:** `200 OK`

---

### Get Assignment by ID
**GET** `/api/v1/assignments/{assignment_id}`

Get a specific assignment by ID.

**Response:** `200 OK`

---

### Create Assignment
**POST** `/api/v1/assignments/`

Assign an item to a user.

**Request Body:**
```json
{
  "item_id": 1,
  "quantity": 1,
  "user_id": null,
  "notes": "Assigned for testing purposes"
}
```

**Rules:**
- `quantity`: Number of items to assign (default: 1, must be > 0)
- **Employees**: Can only assign to themselves (`user_id` must be null or omitted)
- **Managers/Admins**: Can assign to any user by providing `user_id`
- Automatically decreases item quantity by the assigned amount
- Validates that requested quantity doesn't exceed available stock

**Response:** `201 Created`

---

### Return Assignment
**PATCH** `/api/v1/assignments/{assignment_id}/return`

Return an assigned item.

**Request Body:**
```json
{
  "notes": "Item returned after use"
}
```

**Note:** Automatically increases item quantity by the full amount that was assigned.

**Response:** `200 OK`

---

### Get My Assignments
**GET** `/api/v1/assignments/user/me`

Get all assignments for the current authenticated user.

**Response:** `200 OK`

---

## 4. Dashboard

### Get Dashboard Stats
**GET** `/api/v1/dashboard/stats`

Get comprehensive dashboard statistics.

**Response:** `200 OK`
```json
{
  "total_items": 150,
  "low_stock_count": 12,
  "active_assignments": 45,
  "software_stats": {
    "total_items": 50,
    "categories": {...}
  },
  "livestock_stats": {
    "total": 100,
    "health_status": {...},
    "species_distribution": {...}
  },
  "feed_stats": {
    "total": 75,
    "type_distribution": {...},
    "expiry_alerts": [...]
  },
  "recent_items": [...],
  "recent_livestock": [...],
  "recent_feeds": [...]
}
```

---

## 5. Reports

### Low Stock Report
**GET** `/api/v1/reports/low-stock`

Get low stock items report (quantity <= threshold).

**Query Parameters:**
- `threshold` (optional): Custom threshold (default: 10)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Item Name",
    "quantity": 5,
    "threshold": 10
  }
]
```

---

### Assigned Items Report
**GET** `/api/v1/reports/assigned-items`

Get report of all currently assigned items.

**Response:** `200 OK`

---

### Seat Usage Report
**GET** `/api/v1/reports/seat-usage/{item_id}`

Get software seat usage report for a specific item.

**Response:** `200 OK`

---

## 6. Export

### Export Items to CSV
**GET** `/api/v1/export/items/csv`

Export all items to CSV file.

**Response:** `200 OK` (CSV file download)

---

### Export Assignments to CSV
**GET** `/api/v1/export/assignments/csv`

Export all assignments to CSV file.

**Response:** `200 OK` (CSV file download)

---

### Export Low Stock to CSV
**GET** `/api/v1/export/low-stock/csv`

Export low stock items to CSV file.

**Query Parameters:**
- `threshold` (optional): Stock threshold (default: 10)

**Response:** `200 OK` (CSV file download)

---

## 7. Bulk Operations

### Bulk Create Items
**POST** `/api/v1/items/bulk-create`

Create multiple items at once.

**Request Body:**
```json
{
  "items": [
    {
      "name": "Bulk Item 1",
      "category": "Hardware",
      "quantity": 10,
      "unit_type": "piece",
      "description": "First bulk item"
    },
    {
      "name": "Bulk Item 2",
      "category": "Software",
      "quantity": 5,
      "unit_type": "license seat",
      "description": "Second bulk item"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "created_count": 2,
  "errors": []
}
```

---

### Bulk Update Items
**PUT** `/api/v1/items/bulk-update`

Update multiple items at once.

**Request Body:**
```json
{
  "updates": [
    {
      "id": 1,
      "data": {
        "quantity": 20,
        "description": "Updated via bulk operation"
      }
    },
    {
      "id": 2,
      "data": {
        "quantity": 15
      }
    }
  ]
}
```

**Response:** `200 OK`

---

### Bulk Delete Items
**DELETE** `/api/v1/items/bulk-delete`

Delete multiple items at once.

**Request Body:**
```json
{
  "item_ids": [1, 2, 3]
}
```

**Response:** `200 OK`

---

### Bulk Create Feeds
**POST** `/api/v1/feeds/bulk-create`

Create multiple feeds at once.

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "feeds": [
    {
      "name": "Cattle Feed Premium",
      "sku": "FEED-CATTLE-001",
      "feed_type": "Cattle Feed",
      "quantity": 1000.0,
      "unit_type": "kg",
      "production_date": "2024-01-15T00:00:00Z",
      "expiry_date": "2025-01-15T00:00:00Z",
      "batch_number": "BATCH-001",
      "cost_price": 25.50,
      "unit_price": 30.00,
      "supplier_name": "Feed Supplier Inc",
      "description": "Premium cattle feed",
      "status": "available"
    }
  ]
}
```

**Response:** `201 Created`

---

### Bulk Create Livestock
**POST** `/api/v1/livestock/bulk-create`

Create multiple livestock at once.

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "livestock": [
    {
      "name": "Cow-001",
      "species": "Cow",
      "breed": "Holstein",
      "gender": "Female",
      "age": 24,
      "weight": 450.5,
      "health_status": "healthy",
      "tag_number": "TAG-001",
      "status": "active"
    }
  ]
}
```

**Response:** `201 Created`

---

### Import CSV
**POST** `/api/v1/import/csv`

Import data from CSV file.

**⚠️ Role Required:** Manager or Admin

**Request:** `multipart/form-data`
- `file`: CSV file
- `entity_type`: items, feeds, or livestock

**CSV Format for Items:**
- Required: name, category, quantity, unit_type
- Optional: description, serial_number, asset_tag, status

**CSV Format for Feeds:**
- Required: name, feed_type, quantity, unit_type
- Optional: sku, production_date, expiry_date, batch_number, cost_price, unit_price, supplier_name, description, status

**CSV Format for Livestock:**
- Required: name, species, gender, age
- Optional: breed, weight, health_status, tag_number, description, status

**Response:** `201 Created`

---

## 8. QR Codes

### Generate Item QR Code
**GET** `/api/v1/items/{item_id}/qrcode`

Generate QR code image (PNG) for an item.

**Query Parameters:**
- `size` (optional): QR code box size (default: 10)
- `border` (optional): Border thickness (default: 4)

**Response:** `200 OK` (PNG image)

---

### Get QR Code Data
**GET** `/api/v1/items/{item_id}/qrcode/data`

Get QR code data (JSON) for an item.

**Response:** `200 OK`
```json
{
  "qr_data": "item_id:1,name:Item Name,category:Software"
}
```

---

## 9. Audit Logs

### Get Audit Logs
**GET** `/api/v1/audit/`

Get audit logs with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (1-indexed)
- `limit` (optional): Logs per page (max 1000)
- `action` (optional): create, update, delete, assign, return, bulk_create, bulk_update, bulk_delete
- `entity_type` (optional): item, assignment, user
- `user_id` (optional): Filter by user ID
- `start_date` (optional): Start date filter (ISO format)
- `end_date` (optional): End date filter (ISO format)

**Response:** `200 OK`

---

### Get Audit Statistics
**GET** `/api/v1/audit/stats`

Get audit log statistics.

**Query Parameters:**
- `days` (optional): Number of days to analyze (1-365)

**Response:** `200 OK`
```json
{
  "total_logs": 1500,
  "by_action": {...},
  "by_entity": {...},
  "most_active_users": [...]
}
```

---

## 10. Users

### Get All Users
**GET** `/api/v1/users/`

Get all active users.

**⚠️ Role Required:** Manager or Admin

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "role": "employee"
  }
]
```

---

## 11. Locations

### Get All Locations
**GET** `/api/v1/locations/`

Get all locations (warehouses, offices, etc.).

**Query Parameters:**
- `active_only` (optional): Show only active locations

**Response:** `200 OK`

---

### Get Location by ID
**GET** `/api/v1/locations/{location_id}`

Get a specific location by ID.

**Response:** `200 OK`

---

### Create Location
**POST** `/api/v1/locations/`

Create a new location.

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "name": "Main Warehouse",
  "address": "123 Main St, City",
  "description": "Primary storage location",
  "is_active": true
}
```

**Response:** `201 Created`

---

### Update Location
**PUT** `/api/v1/locations/{location_id}`

Update a location.

**⚠️ Role Required:** Manager or Admin

**Response:** `200 OK`

---

### Delete Location
**DELETE** `/api/v1/locations/{location_id}`

Delete a location (cannot delete if items are assigned).

**⚠️ Role Required:** Manager or Admin

**Response:** `204 No Content`

---

## 12. Livestock

### Get All Livestock
**GET** `/api/v1/livestock/`

Get all livestock with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (1-indexed)
- `limit` (optional): Livestock per page (max 100)
- `species` (optional): Cow, Goat, Sheep, Chicken, Duck, Pig, Buffalo, Other
- `health_status` (optional): healthy, sick, under_treatment, quarantined
- `location_id` (optional): Filter by location
- `status_filter` (optional): active, sold, deceased, transferred
- `search` (optional): Search by name, tag_number, description

**Response:** `200 OK`

---

### Get Livestock by ID
**GET** `/api/v1/livestock/{livestock_id}`

Get a specific livestock by ID.

**Response:** `200 OK`

---

### Create Livestock
**POST** `/api/v1/livestock/`

Create a new livestock entry.

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "name": "Cow-001",
  "species": "Cow",
  "breed": "Holstein",
  "gender": "Female",
  "age": 24,
  "weight": 450.5,
  "health_status": "healthy",
  "tag_number": "TAG-001",
  "status": "active",
  "location_id": null
}
```

**Valid Values:**
- **Species:** Cow, Goat, Sheep, Chicken, Duck, Pig, Buffalo, Other
- **Gender:** Male, Female
- **Health Status:** healthy, sick, under_treatment, quarantined
- **Status:** active, sold, deceased, transferred

**Response:** `201 Created`

---

### Update Livestock
**PUT** `/api/v1/livestock/{livestock_id}`

Update a livestock entry.

**⚠️ Role Required:** Manager or Admin

**Response:** `200 OK`

---

### Delete Livestock
**DELETE** `/api/v1/livestock/{livestock_id}`

Delete a livestock entry.

**⚠️ Role Required:** Admin only

**Response:** `204 No Content`

---

### Get Health Report
**GET** `/api/v1/livestock/health/report`

Get livestock health status report with counts by health status.

**Response:** `200 OK`

---

### Get Species Summary
**GET** `/api/v1/livestock/species/summary`

Get livestock count by species.

**Response:** `200 OK`

---

## 13. Feeds

### Get All Feeds
**GET** `/api/v1/feeds/`

Get all feeds with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (1-indexed)
- `limit` (optional): Feeds per page (max 100)
- `feed_type` (optional): Cattle Feed, Poultry Feed, Goat Feed, Sheep Feed, Pig Feed, Fish Feed, Supplement, Other
- `status_filter` (optional): available, sold, expired, reserved, damaged
- `location_id` (optional): Filter by location
- `search` (optional): Search by name, sku, batch_number, description, supplier_name
- `expired_only` (optional): Show only expired feeds
- `expiring_soon` (optional): Show feeds expiring within 30 days

**Response:** `200 OK`

---

### Get Feed by ID
**GET** `/api/v1/feeds/{feed_id}`

Get a specific feed by ID.

**Response:** `200 OK`

---

### Create Feed
**POST** `/api/v1/feeds/`

Create a new feed entry.

**⚠️ Role Required:** Manager or Admin

**Required Fields:**
- `name`: Product name
- `feed_type`: Feed type
- `quantity`: Quantity (float)
- `unit_type`: Unit type
- `status`: Status

**Optional Fields:**
- `sku`: Unique SKU/Product code (e.g., "FEED-CATTLE-001")
- `cost_price`: Production cost per unit (for profit calculation)
- `unit_price`: Selling price per unit
- `supplier_name`: Supplier/Vendor name
- `supplier_id`: Supplier ID or reference
- `production_date`: Production date (ISO format)
- `expiry_date`: Expiry date (ISO format)
- `batch_number`: Production batch number
- `location_id`: Location ID
- `description`: Additional notes

**Request Body:**
```json
{
  "name": "Premium Cattle Feed",
  "sku": "FEED-CATTLE-001",
  "feed_type": "Cattle Feed",
  "quantity": 1000.0,
  "unit_type": "kg",
  "production_date": "2024-01-15T00:00:00Z",
  "expiry_date": "2024-12-31T00:00:00Z",
  "batch_number": "BATCH-001",
  "location_id": null,
  "cost_price": 1.80,
  "unit_price": 2.50,
  "supplier_name": "ABC Feed Supplies",
  "supplier_id": "SUP-001",
  "status": "available",
  "description": "Premium quality cattle feed"
}
```

**Valid Values:**
- **Feed Types:** Cattle Feed, Poultry Feed, Goat Feed, Sheep Feed, Pig Feed, Fish Feed, Supplement, Other
- **Unit Types:** kg, ton, bag, sack, pack, box
- **Status:** available, sold, expired, reserved, damaged

**Notes:**
- `total_value` is automatically calculated from `unit_price * quantity`
- `sku` must be unique if provided
- Profit margin = (unit_price - cost_price) × quantity

**Response:** `201 Created`

---

### Update Feed
**PUT** `/api/v1/feeds/{feed_id}`

Update a feed entry.

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "quantity": 950.0,
  "cost_price": 1.85,
  "unit_price": 2.55,
  "status": "available"
}
```

**Notes:**
- All fields are optional
- `total_value` is automatically recalculated if `unit_price` or `quantity` changes
- `sku` must be unique if being updated

**Response:** `200 OK`

---

### Delete Feed
**DELETE** `/api/v1/feeds/{feed_id}`

Delete a feed entry.

**⚠️ Role Required:** Admin only

**Response:** `204 No Content`

---

### Get Expiry Report
**GET** `/api/v1/feeds/expiry/report`

Get feed expiry report showing expired and expiring soon feeds.

**Query Parameters:**
- `days` (optional): Number of days ahead to check (default: 30)

**Response:** `200 OK`

---

### Get Feed Type Summary
**GET** `/api/v1/feeds/type/summary`

Get feed count and total quantity by feed type.

**Response:** `200 OK`

---

### Get Feed Profit Summary
**GET** `/api/v1/feeds/profit/summary`

Get profit summary for feeds with cost and selling prices.

**Response:** `200 OK`
```json
{
  "total_cost": 1800.0,
  "total_value": 2500.0,
  "total_profit": 700.0,
  "profit_margin_percentage": 38.89,
  "feeds_count": 1
}
```

**Note:** Only includes feeds with both `cost_price` and `unit_price` set, and `status='available'`

---

## 14. Maintenance

### Get Maintenance Records
**GET** `/api/v1/maintenance/`

Get maintenance records, optionally filtered by item.

**Query Parameters:**
- `item_id` (optional): Filter by item ID
- `skip` (optional): Number of records to skip (for pagination)
- `limit` (optional): Maximum number of records to return

**Response:** `200 OK`

---

### Get Upcoming Maintenance
**GET** `/api/v1/maintenance/upcoming`

Get upcoming maintenance records within specified days.

**Query Parameters:**
- `days` (optional): Number of days ahead to check (default: 30)

**Response:** `200 OK`

---

### Create Maintenance Record
**POST** `/api/v1/maintenance/`

Create a maintenance record.

**⚠️ Role Required:** Manager or Admin

**Request Body:**
```json
{
  "item_id": 1,
  "maintenance_type": "regular",
  "description": "Routine maintenance check",
  "performed_by": "Service Provider Inc",
  "cost": "150.00",
  "next_maintenance_date": "2024-06-15T00:00:00Z",
  "warranty_expiry": "2025-12-31T00:00:00Z"
}
```

**Maintenance Types:** regular, repair, upgrade, warranty

**Response:** `201 Created`

---

### Update Maintenance Record
**PUT** `/api/v1/maintenance/{maintenance_id}`

Update a maintenance record.

**⚠️ Role Required:** Manager or Admin

**Response:** `200 OK`

---

### Delete Maintenance Record
**DELETE** `/api/v1/maintenance/{maintenance_id}`

Delete a maintenance record.

**⚠️ Role Required:** Manager or Admin

**Response:** `204 No Content`

---

## 15. Reservations

### Get All Reservations
**GET** `/api/v1/reservations/`

Get all reservations with optional filtering.

**Query Parameters:**
- `item_id` (optional): Filter by item
- `user_id` (optional): Filter by user
- `status_filter` (optional): pending, confirmed, cancelled, completed

**Response:** `200 OK`

---

### Get Reservation by ID
**GET** `/api/v1/reservations/{reservation_id}`

Get a specific reservation by ID.

**Response:** `200 OK`

---

### Create Reservation
**POST** `/api/v1/reservations/`

Create a reservation for an item.

**Request Body:**
```json
{
  "item_id": 1,
  "reserved_date": "2024-06-01T00:00:00Z",
  "return_date": "2024-06-15T00:00:00Z",
  "quantity": 1,
  "notes": "Reserved for upcoming project",
  "auto_assign": false
}
```

**Fields:**
- `user_id` (optional): Defaults to current user
- `auto_assign`: If true, automatically assigns item when reservation date arrives

**Response:** `201 Created`

---

### Update Reservation
**PUT** `/api/v1/reservations/{reservation_id}`

Update a reservation. Users can only update their own reservations unless Manager/Admin.

**Response:** `200 OK`

---

### Cancel Reservation
**DELETE** `/api/v1/reservations/{reservation_id}`

Cancel a reservation. Users can only cancel their own reservations unless Manager/Admin.

**Response:** `204 No Content`

---

## 16. Approvals

### Get All Approval Requests
**GET** `/api/v1/approvals/`

Get approval requests. Employees see only their own requests. Managers/Admins see all.

**Query Parameters:**
- `status_filter` (optional): pending, approved, rejected
- `requested_by_id` (optional): Filter by requester
- `approver_id` (optional): Filter by approver

**Response:** `200 OK`

---

### Get Pending Approvals
**GET** `/api/v1/approvals/pending`

Get pending approval requests for current user (as approver).

**⚠️ Role Required:** Manager or Admin

**Response:** `200 OK`

---

### Get Approval Request by ID
**GET** `/api/v1/approvals/{approval_id}`

Get a specific approval request by ID.

**Response:** `200 OK`

---

### Create Approval Request
**POST** `/api/v1/approvals/`

Create an approval request.

**Request Body:**
```json
{
  "item_id": 1,
  "request_type": "assignment",
  "quantity": 1,
  "priority": "normal",
  "reason": "Need item for project work",
  "approver_id": null
}
```

**Valid Values:**
- **Request Types:** assignment, purchase, transfer, etc.
- **Priority:** low, normal, high, urgent
- **approver_id:** Optional, auto-assigned to Manager/Admin if not provided

**Response:** `201 Created`

---

### Approve Request
**PATCH** `/api/v1/approvals/{approval_id}/approve`

Approve an approval request.

**⚠️ Role Required:** Manager or Admin (must be the assigned approver)

**Response:** `200 OK`

---

### Reject Request
**PATCH** `/api/v1/approvals/{approval_id}/reject`

Reject an approval request with reason.

**⚠️ Role Required:** Manager or Admin (must be the assigned approver)

**Request Body:**
```json
{
  "rejection_reason": "Item not available at this time"
}
```

**Response:** `200 OK`

---

## 17. Health Check

### Health Check
**GET** `/health`

Health check endpoint.

**Response:** `200 OK`
```json
{
  "status": "healthy"
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200 OK:** Successful GET/PUT/PATCH
- **201 Created:** Successful POST
- **204 No Content:** Successful DELETE
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **422 Unprocessable Entity:** Validation error
- **500 Internal Server Error:** Server error

**Error Response Format:**
```json
{
  "detail": "Error message here"
}
```

---

## Pagination

List endpoints support pagination with these parameters:
- `page`: Page number (1-indexed)
- `limit`: Items per page (max varies by endpoint)

Some endpoints use `skip`/`limit` pagination instead:
- `skip`: Number of records to skip
- `limit`: Maximum number of records to return

---

## Notes

1. **First Admin User:** To create the first admin user, use the Python script:
   ```bash
   cd backend
   python create_user.py --username admin --email admin@example.com --password Admin123!@# --role admin
   ```

2. **Token Expiration:** Access tokens expire after a period. Use the refresh token endpoint to get a new token.

3. **CSV Import:** Ensure CSV files match the required format for the entity type.

4. **Audit Logs:** All create, update, delete, assign, and return operations are automatically logged.

5. **Quantity Management:** Item quantities are automatically adjusted when items are assigned or returned.

---

## Support

For issues or questions, refer to the API logs or contact the development team.
