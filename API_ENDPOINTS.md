# API Endpoints Documentation

Base URL: `/api/v1`

## Summary Statistics

- **Total Endpoints**: 130
- **Authentication Required**: 125 endpoints
- **Public Endpoints**: 5 (login, register, logout)
- **Role-Restricted**: 28 endpoints

### By HTTP Method

- GET: 64 endpoints
- POST: 38 endpoints
- PUT: 13 endpoints
- PATCH: 4 endpoints
- DELETE: 11 endpoints

---

## Authentication Routes (`/api/v1/auth`)

| Method | Endpoint                | Description                             | Auth Required | Role Required | Rate Limited     |
| ------ | ----------------------- | --------------------------------------- | ------------- | ------------- | ---------------- |
| POST   | `/api/v1/auth/register` | Register new user account               | ❌            | -             | ✅ (5 req/15min) |
| POST   | `/api/v1/auth/login`    | Login user and get authentication token | ❌            | -             | ✅ (5 req/15min) |
| POST   | `/api/v1/auth/logout`   | Logout current user                     | ❌            | -             | ❌               |
| GET    | `/api/v1/auth/me`       | Get current authenticated user profile  | ✅            | -             | ❌               |
| POST   | `/api/v1/auth/refresh`  | Refresh authentication token            | ✅            | -             | ❌               |

---

## Items Routes (`/api/v1/items`)

| Method | Endpoint                   | Description                                         | Auth Required | Role Required  | Audit Logged |
| ------ | -------------------------- | --------------------------------------------------- | ------------- | -------------- | ------------ |
| GET    | `/api/v1/items`            | Get all inventory items with pagination and filters | ✅            | -              | ❌           |
| GET    | `/api/v1/items/categories` | Get all item categories                             | ✅            | -              | ❌           |
| GET    | `/api/v1/items/low-stock`  | Get items with low stock levels                     | ✅            | -              | ❌           |
| POST   | `/api/v1/items/bulk`       | Bulk create multiple items                          | ✅            | admin, manager | ✅           |
| GET    | `/api/v1/items/:id`        | Get single item by ID                               | ✅            | -              | ❌           |
| POST   | `/api/v1/items`            | Create new inventory item                           | ✅            | admin, manager | ✅           |
| PUT    | `/api/v1/items/:id`        | Update existing item                                | ✅            | admin, manager | ✅           |
| DELETE | `/api/v1/items/:id`        | Delete item by ID                                   | ✅            | admin, manager | ✅           |

---

## Assignments Routes (`/api/v1/assignments`)

| Method | Endpoint                         | Description              | Auth Required | Role Required  | Audit Logged |
| ------ | -------------------------------- | ------------------------ | ------------- | -------------- | ------------ |
| GET    | `/api/v1/assignments`            | Get all item assignments | ✅            | -              | ❌           |
| POST   | `/api/v1/assignments`            | Create new assignment    | ✅            | admin, manager | ✅           |
| PATCH  | `/api/v1/assignments/:id/return` | Return assigned item     | ✅            | -              | ✅           |

---

## Livestock Routes (`/api/v1/livestock`)

| Method | Endpoint                | Description                       | Auth Required | Role Required  | Audit Logged |
| ------ | ----------------------- | --------------------------------- | ------------- | -------------- | ------------ |
| GET    | `/api/v1/livestock`     | Get all livestock records         | ✅            | -              | ❌           |
| GET    | `/api/v1/livestock/:id` | Get single livestock record by ID | ✅            | -              | ❌           |
| POST   | `/api/v1/livestock`     | Create new livestock record       | ✅            | admin, manager | ✅           |
| PUT    | `/api/v1/livestock/:id` | Update livestock record           | ✅            | admin, manager | ✅           |
| DELETE | `/api/v1/livestock/:id` | Delete livestock record           | ✅            | admin, manager | ✅           |

---

## Feeds Routes (`/api/v1/feeds`)

| Method | Endpoint            | Description                  | Auth Required | Role Required  | Audit Logged |
| ------ | ------------------- | ---------------------------- | ------------- | -------------- | ------------ |
| GET    | `/api/v1/feeds`     | Get all feed records         | ✅            | -              | ❌           |
| GET    | `/api/v1/feeds/:id` | Get single feed record by ID | ✅            | -              | ❌           |
| POST   | `/api/v1/feeds`     | Create new feed record       | ✅            | admin, manager | ✅           |
| PUT    | `/api/v1/feeds/:id` | Update feed record           | ✅            | admin, manager | ✅           |
| DELETE | `/api/v1/feeds/:id` | Delete feed record           | ✅            | admin, manager | ✅           |

---

## Users Routes (`/api/v1/users`)

| Method | Endpoint            | Description           | Auth Required | Role Required  | Audit Logged |
| ------ | ------------------- | --------------------- | ------------- | -------------- | ------------ |
| GET    | `/api/v1/users`     | Get all users         | ✅            | admin, manager | ❌           |
| POST   | `/api/v1/users`     | Create new user       | ✅            | admin          | ✅           |
| GET    | `/api/v1/users/:id` | Get single user by ID | ✅            | -              | ❌           |
| PUT    | `/api/v1/users/:id` | Update user           | ✅            | admin          | ✅           |
| DELETE | `/api/v1/users/:id` | Delete user           | ✅            | admin          | ✅           |

---

## Dashboard Routes (`/api/v1/dashboard`)

| Method | Endpoint                  | Description              | Auth Required | Role Required |
| ------ | ------------------------- | ------------------------ | ------------- | ------------- |
| GET    | `/api/v1/dashboard/stats` | Get dashboard statistics | ✅            | -             |

---

## Audit Routes (`/api/v1/audit`)

| Method | Endpoint              | Description          | Auth Required | Role Required  |
| ------ | --------------------- | -------------------- | ------------- | -------------- |
| GET    | `/api/v1/audit`       | Get all audit logs   | ✅            | admin, manager |
| GET    | `/api/v1/audit/stats` | Get audit statistics | ✅            | admin, manager |

---

## Locations Routes (`/api/v1/locations`)

| Method | Endpoint                | Description               | Auth Required | Role Required  |
| ------ | ----------------------- | ------------------------- | ------------- | -------------- |
| GET    | `/api/v1/locations`     | Get all storage locations | ✅            | -              |
| GET    | `/api/v1/locations/:id` | Get single location by ID | ✅            | -              |
| POST   | `/api/v1/locations`     | Create new location       | ✅            | admin, manager |
| PUT    | `/api/v1/locations/:id` | Update location           | ✅            | admin, manager |
| DELETE | `/api/v1/locations/:id` | Delete location           | ✅            | admin          |

---

## Maintenance Routes (`/api/v1/maintenance`)

| Method | Endpoint                       | Description                         | Auth Required | Role Required  |
| ------ | ------------------------------ | ----------------------------------- | ------------- | -------------- |
| GET    | `/api/v1/maintenance`          | Get all maintenance records         | ✅            | -              |
| GET    | `/api/v1/maintenance/upcoming` | Get upcoming maintenance schedules  | ✅            | -              |
| GET    | `/api/v1/maintenance/:id`      | Get single maintenance record by ID | ✅            | -              |
| POST   | `/api/v1/maintenance`          | Create new maintenance record       | ✅            | admin, manager |
| PUT    | `/api/v1/maintenance/:id`      | Update maintenance record           | ✅            | admin, manager |
| DELETE | `/api/v1/maintenance/:id`      | Delete maintenance record           | ✅            | admin          |

---

## Reservations Routes (`/api/v1/reservations`)

| Method | Endpoint                   | Description                  | Auth Required | Role Required |
| ------ | -------------------------- | ---------------------------- | ------------- | ------------- |
| GET    | `/api/v1/reservations`     | Get all reservations         | ✅            | -             |
| GET    | `/api/v1/reservations/:id` | Get single reservation by ID | ✅            | -             |
| POST   | `/api/v1/reservations`     | Create new reservation       | ✅            | -             |
| PUT    | `/api/v1/reservations/:id` | Update reservation           | ✅            | -             |
| DELETE | `/api/v1/reservations/:id` | Delete reservation           | ✅            | -             |

---

## Approvals Routes (`/api/v1/approvals`)

| Method | Endpoint                        | Description                   | Auth Required | Role Required  |
| ------ | ------------------------------- | ----------------------------- | ------------- | -------------- |
| GET    | `/api/v1/approvals`             | Get all approval requests     | ✅            | -              |
| GET    | `/api/v1/approvals/pending`     | Get pending approval requests | ✅            | -              |
| GET    | `/api/v1/approvals/:id`         | Get single approval by ID     | ✅            | -              |
| POST   | `/api/v1/approvals`             | Create approval request       | ✅            | -              |
| PATCH  | `/api/v1/approvals/:id/approve` | Approve request               | ✅            | admin, manager |
| PATCH  | `/api/v1/approvals/:id/reject`  | Reject request                | ✅            | admin, manager |
| DELETE | `/api/v1/approvals/:id`         | Delete approval               | ✅            | -              |

---

## Reports Routes (`/api/v1/reports`)

| Method | Endpoint                             | Description                             | Auth Required | Role Required |
| ------ | ------------------------------------ | --------------------------------------- | ------------- | ------------- |
| GET    | `/api/v1/reports/low-stock`          | Get low stock report                    | ✅            | -             |
| GET    | `/api/v1/reports/assigned-items`     | Get assigned items report               | ✅            | -             |
| GET    | `/api/v1/reports/seat-usage/:itemId` | Get seat usage report for specific item | ✅            | -             |

---

## Export Routes (`/api/v1/export`)

| Method | Endpoint                         | Description                   | Auth Required | Role Required |
| ------ | -------------------------------- | ----------------------------- | ------------- | ------------- |
| GET    | `/api/v1/export/items/csv`       | Export items to CSV           | ✅            | -             |
| GET    | `/api/v1/export/assignments/csv` | Export assignments to CSV     | ✅            | -             |
| GET    | `/api/v1/export/low-stock/csv`   | Export low stock items to CSV | ✅            | -             |

---

## Suppliers Routes (`/api/v1/suppliers`)

| Method | Endpoint                  | Description               | Auth Required | Role Required |
| ------ | ------------------------- | ------------------------- | ------------- | ------------- |
| GET    | `/api/v1/suppliers`       | Get all suppliers         | ✅            | -             |
| GET    | `/api/v1/suppliers/stats` | Get supplier statistics   | ✅            | -             |
| GET    | `/api/v1/suppliers/:id`   | Get single supplier by ID | ✅            | -             |
| POST   | `/api/v1/suppliers`       | Create new supplier       | ✅            | -             |
| PUT    | `/api/v1/suppliers/:id`   | Update supplier           | ✅            | -             |
| DELETE | `/api/v1/suppliers/:id`   | Delete supplier           | ✅            | -             |

---

## Purchase Orders Routes (`/api/v1/purchase-orders`)

| Method | Endpoint                              | Description                               | Auth Required | Role Required |
| ------ | ------------------------------------- | ----------------------------------------- | ------------- | ------------- |
| GET    | `/api/v1/purchase-orders`             | Get all purchase orders                   | ✅            | -             |
| GET    | `/api/v1/purchase-orders/stats`       | Get purchase order statistics             | ✅            | -             |
| GET    | `/api/v1/purchase-orders/:id`         | Get single purchase order by ID           | ✅            | -             |
| POST   | `/api/v1/purchase-orders`             | Create new purchase order                 | ✅            | -             |
| PUT    | `/api/v1/purchase-orders/:id`         | Update purchase order                     | ✅            | -             |
| DELETE | `/api/v1/purchase-orders/:id`         | Delete purchase order                     | ✅            | -             |
| POST   | `/api/v1/purchase-orders/:id/approve` | Approve purchase order                    | ✅            | -             |
| POST   | `/api/v1/purchase-orders/:id/receive` | Receive purchase order (mark as received) | ✅            | -             |
| POST   | `/api/v1/purchase-orders/:id/cancel`  | Cancel purchase order                     | ✅            | -             |

---

## Categories Routes (`/api/v1/categories`)

| Method | Endpoint                   | Description                 | Auth Required | Role Required |
| ------ | -------------------------- | --------------------------- | ------------- | ------------- |
| GET    | `/api/v1/categories`       | Get all categories          | ✅            | -             |
| GET    | `/api/v1/categories/tree`  | Get category tree structure | ✅            | -             |
| GET    | `/api/v1/categories/stats` | Get category statistics     | ✅            | -             |
| GET    | `/api/v1/categories/:id`   | Get single category by ID   | ✅            | -             |
| POST   | `/api/v1/categories`       | Create new category         | ✅            | -             |
| PUT    | `/api/v1/categories/:id`   | Update category             | ✅            | -             |
| DELETE | `/api/v1/categories/:id`   | Delete category             | ✅            | -             |

---

## Stock Transfers Routes (`/api/v1/stock-transfers`)

| Method | Endpoint                              | Description                     | Auth Required | Role Required |
| ------ | ------------------------------------- | ------------------------------- | ------------- | ------------- |
| GET    | `/api/v1/stock-transfers`             | Get all stock transfers         | ✅            | -             |
| GET    | `/api/v1/stock-transfers/stats`       | Get stock transfer statistics   | ✅            | -             |
| GET    | `/api/v1/stock-transfers/:id`         | Get single stock transfer by ID | ✅            | -             |
| POST   | `/api/v1/stock-transfers`             | Create new stock transfer       | ✅            | -             |
| PUT    | `/api/v1/stock-transfers/:id`         | Update stock transfer           | ✅            | -             |
| DELETE | `/api/v1/stock-transfers/:id`         | Delete stock transfer           | ✅            | -             |
| POST   | `/api/v1/stock-transfers/:id/approve` | Approve stock transfer          | ✅            | -             |
| POST   | `/api/v1/stock-transfers/:id/ship`    | Ship stock transfer             | ✅            | -             |
| POST   | `/api/v1/stock-transfers/:id/receive` | Receive stock transfer          | ✅            | -             |
| POST   | `/api/v1/stock-transfers/:id/cancel`  | Cancel stock transfer           | ✅            | -             |

---

## Stock Movements Routes (`/api/v1/stock-movements`)

| Method | Endpoint                                | Description                            | Auth Required | Role Required |
| ------ | --------------------------------------- | -------------------------------------- | ------------- | ------------- |
| GET    | `/api/v1/stock-movements`               | Get all stock movements                | ✅            | -             |
| GET    | `/api/v1/stock-movements/stats`         | Get stock movement statistics          | ✅            | -             |
| GET    | `/api/v1/stock-movements/summary`       | Get stock movement summary             | ✅            | -             |
| GET    | `/api/v1/stock-movements/item/:item_id` | Get movement history for specific item | ✅            | -             |
| GET    | `/api/v1/stock-movements/:id`           | Get single stock movement by ID        | ✅            | -             |
| POST   | `/api/v1/stock-movements`               | Create new stock movement              | ✅            | -             |

---

## Notifications Routes (`/api/v1/notifications`)

| Method | Endpoint                                | Description                            | Auth Required | Role Required |
| ------ | --------------------------------------- | -------------------------------------- | ------------- | ------------- |
| GET    | `/api/v1/notifications`                 | Get all notifications for current user | ✅            | -             |
| GET    | `/api/v1/notifications/stats`           | Get notification statistics            | ✅            | -             |
| POST   | `/api/v1/notifications/mark-all-read`   | Mark all notifications as read         | ✅            | -             |
| DELETE | `/api/v1/notifications/delete-all-read` | Delete all read notifications          | ✅            | -             |
| GET    | `/api/v1/notifications/:id`             | Get single notification by ID          | ✅            | -             |
| POST   | `/api/v1/notifications/:id/read`        | Mark notification as read              | ✅            | -             |
| DELETE | `/api/v1/notifications/:id`             | Delete notification                    | ✅            | -             |

---

## Product Assignments Routes (`/api/v1/product-assignments`)

| Method | Endpoint                                           | Description                                             | Auth Required | Role Required |
| ------ | -------------------------------------------------- | ------------------------------------------------------- | ------------- | ------------- |
| GET    | `/api/v1/product-assignments`                      | Get all product assignments with pagination and filters | ✅            | -             |
| GET    | `/api/v1/product-assignments/stats`                | Get assignment statistics                               | ✅            | -             |
| GET    | `/api/v1/product-assignments/overdue`              | Get overdue assignments                                 | ✅            | -             |
| GET    | `/api/v1/product-assignments/employee/:employeeId` | Get active assignments for specific employee            | ✅            | -             |
| GET    | `/api/v1/product-assignments/:id`                  | Get single assignment by ID                             | ✅            | -             |
| POST   | `/api/v1/product-assignments`                      | Create new product assignment                           | ✅            | -             |
| PUT    | `/api/v1/product-assignments/:id`                  | Update product assignment                               | ✅            | -             |
| POST   | `/api/v1/product-assignments/:id/acknowledge`      | Employee acknowledges assignment                        | ✅            | -             |
| POST   | `/api/v1/product-assignments/:id/return`           | Return assigned product                                 | ✅            | -             |
| DELETE | `/api/v1/product-assignments/:id`                  | Delete assignment (admin only)                          | ✅            | -             |

---

## Rate Limiting

### Authentication Endpoints

- **Paths**: `/api/v1/auth/login`, `/api/v1/auth/register`
- **Limit**: 5 requests per 15 minutes
- **Error Message**: "Too many login attempts, please try again later"

### General API Endpoints

- **Window**: 1 minute
- **Production**: 60 requests per minute
- **Development**: 200 requests per minute
- **Skipped Paths**: `/health`, `/api/v1/health`

---

## Middleware Notes

### Authentication Middleware

- **`authenticate`**: Used in approvals, locations, maintenance, export, reports
- **`authMiddleware`**: Used in assignments, audit, feeds, items, livestock, users, categories, dashboard, notifications, purchase-orders, stock-movements, stock-transfers, suppliers, product-assignments

### Authorization Middleware

- **`authorize(['admin', 'manager'])`**: Used in approvals, locations, maintenance routes
- **`requireRole('admin', 'manager')`**: Used in assignments, feeds, items, livestock, users routes

### Validation

- Uses `express-validator` for input validation on POST/PUT routes
- Custom validation rules defined per route file

### Audit Logging

- Automatically logs create/update/delete operations
- Middleware: `auditLog('action', 'resource')`
- Used in items, assignments, feeds, livestock, users routes

---

## Notes

1. All API endpoints except auth (login, register, logout) require authentication
2. Role-based access control enforced via middleware
3. Rate limiting applied to prevent abuse
4. Audit logging tracks all mutations for compliance
5. ObjectId validation on routes with `:id` parameters
6. CORS configured to allow all origins in both development and production
7. NoSQL injection protection middleware sanitizes requests
