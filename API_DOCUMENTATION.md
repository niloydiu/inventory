# API Endpoints Documentation

## Overview

This document lists all API endpoints available in the Inventory Management System.

**Base URL**: `/api/v1`

---

## 1. Authentication Endpoints (`/auth`)

| Method | Endpoint         | Description       | Auth Required | Role Required |
| ------ | ---------------- | ----------------- | ------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            | -             |
| POST   | `/auth/login`    | User login        | No            | -             |
| POST   | `/auth/logout`   | User logout       | No            | -             |
| GET    | `/auth/me`       | Get current user  | Yes           | -             |
| POST   | `/auth/refresh`  | Refresh token     | Yes           | -             |

---

## 2. Items/Inventory Endpoints (`/items`)

| Method | Endpoint            | Description         | Auth Required | Role Required  |
| ------ | ------------------- | ------------------- | ------------- | -------------- |
| GET    | `/items`            | Get all items       | Yes           | -              |
| GET    | `/items/:id`        | Get item by ID      | Yes           | -              |
| GET    | `/items/categories` | Get categories      | Yes           | -              |
| GET    | `/items/low-stock`  | Get low stock items | Yes           | -              |
| POST   | `/items`            | Create item         | Yes           | admin, manager |
| POST   | `/items/bulk`       | Bulk create items   | Yes           | admin, manager |
| PUT    | `/items/:id`        | Update item         | Yes           | admin, manager |
| DELETE | `/items/:id`        | Delete item         | Yes           | admin, manager |

---

## 3. Assignments Endpoints (`/assignments`)

| Method | Endpoint                  | Description         | Auth Required | Role Required  |
| ------ | ------------------------- | ------------------- | ------------- | -------------- |
| GET    | `/assignments`            | Get all assignments | Yes           | -              |
| POST   | `/assignments`            | Create assignment   | Yes           | admin, manager |
| PATCH  | `/assignments/:id/return` | Return assignment   | Yes           | -              |

---

## 4. Product Assignments Endpoints (`/product-assignments`)

| Method | Endpoint                                    | Description                 | Auth Required | Role Required |
| ------ | ------------------------------------------- | --------------------------- | ------------- | ------------- |
| GET    | `/product-assignments`                      | Get all product assignments | Yes           | -             |
| GET    | `/product-assignments/:id`                  | Get assignment by ID        | Yes           | -             |
| GET    | `/product-assignments/stats`                | Get assignment statistics   | Yes           | -             |
| GET    | `/product-assignments/overdue`              | Get overdue assignments     | Yes           | -             |
| GET    | `/product-assignments/employee/:employeeId` | Get employee assignments    | Yes           | -             |
| POST   | `/product-assignments`                      | Create assignment           | Yes           | -             |
| POST   | `/product-assignments/:id/acknowledge`      | Acknowledge assignment      | Yes           | -             |
| POST   | `/product-assignments/:id/return`           | Return product              | Yes           | -             |
| PUT    | `/product-assignments/:id`                  | Update assignment           | Yes           | -             |
| DELETE | `/product-assignments/:id`                  | Delete assignment           | Yes           | admin         |

---

## 5. Livestock Endpoints (`/livestock`)

| Method | Endpoint         | Description         | Auth Required | Role Required  |
| ------ | ---------------- | ------------------- | ------------- | -------------- |
| GET    | `/livestock`     | Get all livestock   | Yes           | -              |
| GET    | `/livestock/:id` | Get livestock by ID | Yes           | -              |
| POST   | `/livestock`     | Create livestock    | Yes           | admin, manager |
| PUT    | `/livestock/:id` | Update livestock    | Yes           | admin, manager |
| DELETE | `/livestock/:id` | Delete livestock    | Yes           | admin, manager |

---

## 6. Feeds Endpoints (`/feeds`)

| Method | Endpoint     | Description    | Auth Required | Role Required  |
| ------ | ------------ | -------------- | ------------- | -------------- |
| GET    | `/feeds`     | Get all feeds  | Yes           | -              |
| GET    | `/feeds/:id` | Get feed by ID | Yes           | -              |
| POST   | `/feeds`     | Create feed    | Yes           | admin, manager |
| PUT    | `/feeds/:id` | Update feed    | Yes           | admin, manager |
| DELETE | `/feeds/:id` | Delete feed    | Yes           | admin, manager |

---

## 7. Users Endpoints (`/users`)

| Method | Endpoint     | Description    | Auth Required | Role Required  |
| ------ | ------------ | -------------- | ------------- | -------------- |
| GET    | `/users`     | Get all users  | Yes           | admin, manager |
| GET    | `/users/:id` | Get user by ID | Yes           | -              |
| POST   | `/users`     | Create user    | Yes           | admin          |
| PUT    | `/users/:id` | Update user    | Yes           | admin          |
| DELETE | `/users/:id` | Delete user    | Yes           | admin          |

---

## 8. Dashboard Endpoints (`/dashboard`)

| Method | Endpoint                     | Description              | Auth Required | Role Required |
| ------ | ---------------------------- | ------------------------ | ------------- | ------------- |
| GET    | `/dashboard/stats`           | Get dashboard statistics | Yes           | -             |
| GET    | `/dashboard/overview`        | Get dashboard overview   | Yes           | -             |
| GET    | `/dashboard/recent-activity` | Get recent activity      | Yes           | -             |

---

## 9. Locations Endpoints (`/locations`)

| Method | Endpoint         | Description        | Auth Required | Role Required  |
| ------ | ---------------- | ------------------ | ------------- | -------------- |
| GET    | `/locations`     | Get all locations  | Yes           | -              |
| GET    | `/locations/:id` | Get location by ID | Yes           | -              |
| POST   | `/locations`     | Create location    | Yes           | admin, manager |
| PUT    | `/locations/:id` | Update location    | Yes           | admin, manager |
| DELETE | `/locations/:id` | Delete location    | Yes           | admin, manager |

---

## 10. Maintenance Endpoints (`/maintenance`)

| Method | Endpoint           | Description                 | Auth Required | Role Required  |
| ------ | ------------------ | --------------------------- | ------------- | -------------- |
| GET    | `/maintenance`     | Get all maintenance records | Yes           | -              |
| GET    | `/maintenance/:id` | Get maintenance by ID       | Yes           | -              |
| POST   | `/maintenance`     | Create maintenance          | Yes           | admin, manager |
| PUT    | `/maintenance/:id` | Update maintenance          | Yes           | admin, manager |
| DELETE | `/maintenance/:id` | Delete maintenance          | Yes           | admin, manager |

---

## 11. Reservations Endpoints (`/reservations`)

| Method | Endpoint            | Description           | Auth Required | Role Required  |
| ------ | ------------------- | --------------------- | ------------- | -------------- |
| GET    | `/reservations`     | Get all reservations  | Yes           | -              |
| GET    | `/reservations/:id` | Get reservation by ID | Yes           | -              |
| POST   | `/reservations`     | Create reservation    | Yes           | -              |
| PUT    | `/reservations/:id` | Update reservation    | Yes           | -              |
| DELETE | `/reservations/:id` | Delete reservation    | Yes           | admin, manager |

---

## 12. Approvals Endpoints (`/approvals`)

| Method | Endpoint                 | Description        | Auth Required | Role Required  |
| ------ | ------------------------ | ------------------ | ------------- | -------------- |
| GET    | `/approvals`             | Get all approvals  | Yes           | -              |
| GET    | `/approvals/:id`         | Get approval by ID | Yes           | -              |
| POST   | `/approvals`             | Create approval    | Yes           | -              |
| POST   | `/approvals/:id/approve` | Approve request    | Yes           | admin, manager |
| POST   | `/approvals/:id/reject`  | Reject request     | Yes           | admin, manager |
| DELETE | `/approvals/:id`         | Delete approval    | Yes           | admin          |

---

## 13. Audit Logs Endpoints (`/audit`)

| Method | Endpoint       | Description          | Auth Required | Role Required |
| ------ | -------------- | -------------------- | ------------- | ------------- |
| GET    | `/audit`       | Get all audit logs   | Yes           | admin         |
| GET    | `/audit/stats` | Get audit statistics | Yes           | admin         |

---

## 14. Reports Endpoints (`/reports`)

| Method | Endpoint                  | Description           | Auth Required | Role Required |
| ------ | ------------------------- | --------------------- | ------------- | ------------- |
| GET    | `/reports/inventory`      | Inventory report      | Yes           | -             |
| GET    | `/reports/stock-movement` | Stock movement report | Yes           | -             |
| GET    | `/reports/low-stock`      | Low stock report      | Yes           | -             |

---

## 15. Export Endpoints (`/export`)

| Method | Endpoint              | Description               | Auth Required | Role Required |
| ------ | --------------------- | ------------------------- | ------------- | ------------- |
| GET    | `/export/items`       | Export items to CSV       | Yes           | -             |
| GET    | `/export/assignments` | Export assignments to CSV | Yes           | -             |

---

## 16. Suppliers Endpoints (`/suppliers`)

| Method | Endpoint           | Description             | Auth Required | Role Required  |
| ------ | ------------------ | ----------------------- | ------------- | -------------- |
| GET    | `/suppliers`       | Get all suppliers       | Yes           | -              |
| GET    | `/suppliers/:id`   | Get supplier by ID      | Yes           | -              |
| GET    | `/suppliers/stats` | Get supplier statistics | Yes           | -              |
| POST   | `/suppliers`       | Create supplier         | Yes           | admin, manager |
| PUT    | `/suppliers/:id`   | Update supplier         | Yes           | admin, manager |
| DELETE | `/suppliers/:id`   | Delete supplier         | Yes           | admin, manager |

---

## 17. Purchase Orders Endpoints (`/purchase-orders`)

| Method | Endpoint                       | Description              | Auth Required | Role Required  |
| ------ | ------------------------------ | ------------------------ | ------------- | -------------- |
| GET    | `/purchase-orders`             | Get all purchase orders  | Yes           | -              |
| GET    | `/purchase-orders/:id`         | Get purchase order by ID | Yes           | -              |
| GET    | `/purchase-orders/stats`       | Get PO statistics        | Yes           | -              |
| POST   | `/purchase-orders`             | Create purchase order    | Yes           | admin, manager |
| POST   | `/purchase-orders/:id/approve` | Approve PO               | Yes           | admin, manager |
| POST   | `/purchase-orders/:id/receive` | Receive PO               | Yes           | admin, manager |
| POST   | `/purchase-orders/:id/cancel`  | Cancel PO                | Yes           | admin, manager |
| PUT    | `/purchase-orders/:id`         | Update purchase order    | Yes           | admin, manager |
| DELETE | `/purchase-orders/:id`         | Delete purchase order    | Yes           | admin          |

---

## 18. Categories Endpoints (`/categories`)

| Method | Endpoint            | Description             | Auth Required | Role Required  |
| ------ | ------------------- | ----------------------- | ------------- | -------------- |
| GET    | `/categories`       | Get all categories      | Yes           | -              |
| GET    | `/categories/:id`   | Get category by ID      | Yes           | -              |
| GET    | `/categories/tree`  | Get category tree       | Yes           | -              |
| GET    | `/categories/stats` | Get category statistics | Yes           | -              |
| POST   | `/categories`       | Create category         | Yes           | admin, manager |
| PUT    | `/categories/:id`   | Update category         | Yes           | admin, manager |
| DELETE | `/categories/:id`   | Delete category         | Yes           | admin, manager |

---

## 19. Stock Transfers Endpoints (`/stock-transfers`)

| Method | Endpoint                       | Description             | Auth Required | Role Required  |
| ------ | ------------------------------ | ----------------------- | ------------- | -------------- |
| GET    | `/stock-transfers`             | Get all stock transfers | Yes           | -              |
| GET    | `/stock-transfers/:id`         | Get transfer by ID      | Yes           | -              |
| GET    | `/stock-transfers/stats`       | Get transfer statistics | Yes           | -              |
| POST   | `/stock-transfers`             | Create stock transfer   | Yes           | admin, manager |
| POST   | `/stock-transfers/:id/approve` | Approve transfer        | Yes           | admin, manager |
| POST   | `/stock-transfers/:id/ship`    | Ship transfer           | Yes           | admin, manager |
| POST   | `/stock-transfers/:id/receive` | Receive transfer        | Yes           | admin, manager |
| POST   | `/stock-transfers/:id/cancel`  | Cancel transfer         | Yes           | admin, manager |
| PUT    | `/stock-transfers/:id`         | Update stock transfer   | Yes           | admin, manager |
| DELETE | `/stock-transfers/:id`         | Delete stock transfer   | Yes           | admin          |

---

## 20. Stock Movements Endpoints (`/stock-movements`)

| Method | Endpoint                 | Description             | Auth Required | Role Required |
| ------ | ------------------------ | ----------------------- | ------------- | ------------- |
| GET    | `/stock-movements`       | Get all stock movements | Yes           | -             |
| GET    | `/stock-movements/:id`   | Get movement by ID      | Yes           | -             |
| GET    | `/stock-movements/stats` | Get movement statistics | Yes           | -             |

---

## 21. Notifications Endpoints (`/notifications`)

| Method | Endpoint                  | Description              | Auth Required | Role Required |
| ------ | ------------------------- | ------------------------ | ------------- | ------------- |
| GET    | `/notifications`          | Get all notifications    | Yes           | -             |
| GET    | `/notifications/unread`   | Get unread notifications | Yes           | -             |
| POST   | `/notifications/:id/read` | Mark as read             | Yes           | -             |
| POST   | `/notifications/read-all` | Mark all as read         | Yes           | -             |
| DELETE | `/notifications/:id`      | Delete notification      | Yes           | -             |

---

## Summary

- **Total Routes**: 21 route groups
- **Total Endpoints**: ~130+ endpoints
- **Authentication**: Most endpoints require authentication
- **Authorization**: Many endpoints restricted to admin/manager roles
- **Rate Limiting**: Applied to auth endpoints (5 req/15min) and general API (60-200 req/min)

---

## Standard Features for Inventory Management

### ✅ Features Present in This Application:

1. **Core Inventory**
   - Item management (CRUD)
   - Categories & categorization
   - Low stock alerts
   - Stock movements tracking
2. **Assignment & Allocation**

   - Product assignments to employees
   - Assignment tracking with acknowledgment
   - Return management

3. **Livestock Management**

   - Animal tracking
   - Health status monitoring

4. **Feed Management**

   - Feed inventory
   - Expiry tracking

5. **Procurement**

   - Supplier management
   - Purchase orders
   - PO approval workflow

6. **Stock Management**

   - Stock transfers between locations
   - Location management
   - Stock movement history

7. **Approval Workflows**

   - Approval requests
   - Approve/reject functionality

8. **Reporting & Analytics**

   - Dashboard statistics
   - Various reports (inventory, stock movement, low stock)
   - CSV export functionality

9. **System Features**
   - User management
   - Role-based access control
   - Audit logs
   - Notifications
   - Maintenance scheduling
   - Reservations

---

## ❌ Missing Critical Features (Standard Inventory Should Have):

### 1. **Barcode/QR Code Management**

- Barcode generation for items
- Barcode scanning functionality
- QR code for quick lookup
- **Status**: Partially mentioned in endpoints but not fully implemented

### 2. **Advanced Stock Features**

- **Batch/Lot Tracking**: Track items by batch numbers
- **Serial Number Tracking**: For individual item tracking
- **Expiry Date Management**: Beyond feeds (for all perishable items)
- **Reorder Point Alerts**: Automatic low stock alerts with reorder suggestions
- **Status**: Missing

### 3. **Warehouse Management**

- **Bin/Shelf Location**: Specific storage location within warehouses
- **Zone Management**: Different zones within locations
- **Pick, Pack, Ship workflow**
- **Status**: Partially covered (locations exist but not detailed)

### 4. **Advanced Procurement**

- **Vendor/Supplier Performance Tracking**
- **Request for Quotation (RFQ)**
- **Purchase Requisitions** (before PO creation)
- **Receiving Notes/GRN (Goods Receipt Note)**
- **Status**: Purchase orders exist but workflow incomplete

### 5. **Inventory Valuation**

- **Cost Tracking** (FIFO, LIFO, Weighted Average)
- **Inventory Value Reports**
- **Profit/Loss tracking**
- **Status**: Missing

### 6. **Cycle Counting & Physical Inventory**

- **Stock Adjustment** functionality
- **Cycle Count scheduling**
- **Variance reports** (expected vs actual)
- **Status**: Missing

### 7. **Kitting & Assembly**

- **Bill of Materials (BOM)**
- **Assembly/Disassembly** of products
- **Status**: Missing

### 8. **Returns & Refunds**

- **Return to Supplier** functionality
- **Customer Returns** (if applicable)
- **Damaged/Defective Item tracking**
- **Status**: Missing

### 9. **Multi-Currency & Multi-Location**

- **Currency conversion**
- **Inter-branch transfers** (exists but could be enhanced)
- **Status**: Partially implemented

### 10. **Advanced Analytics**

- **Inventory Turnover Ratio**
- **ABC Analysis** (classify items by value/importance)
- **Demand Forecasting**
- **Trend Analysis**
- **Status**: Basic reports exist, advanced analytics missing

### 11. **Integration Features**

- **Import/Export** (CSV, Excel)
- **API for external systems**
- **Webhook notifications**
- **Status**: Partial (export exists, import missing)

### 12. **Mobile App Features**

- **Mobile barcode scanning**
- **Mobile stock taking**
- **Status**: Missing (web-only)

---

## 🎯 Priority Features to Implement

Based on standard inventory management systems, here are the TOP PRIORITY features to add:

### Priority 1 (Critical):

1. **Stock Adjustments** - Adjust inventory quantities (damage, loss, found)
2. **Batch/Lot Tracking** - Track items by batch with expiry dates
3. **Inventory Valuation** - Track cost and value of inventory
4. **Reorder Levels** - Minimum/maximum stock levels with auto-alerts

### Priority 2 (Important):

5. **CSV Import** - Import items, stock, etc. from CSV
6. **Barcode/QR Generation & Scanning** - For quick item lookup
7. **Stock Adjustment History** - Track all adjustments with reasons
8. **Purchase Requisitions** - Request approval before creating PO

### Priority 3 (Nice to Have):

9. **ABC Analysis** - Classify inventory by value
10. **Bin Location Management** - Specific shelf/bin within warehouses
11. **Vendor Performance** - Track supplier quality, delivery time
12. **Advanced Reports** - Turnover, aging, valuation reports
