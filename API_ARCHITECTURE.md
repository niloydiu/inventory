# API Architecture Documentation

## Overview

This application uses a modern, secure architecture with server actions and centralized API configuration. API calls are not exposed to the client, and authentication is handled automatically via bearer tokens.

## Structure

```
lib/
├── config/
│   └── api-endpoints.js      # Centralized API endpoint definitions
├── actions/                   # Server actions (secure API calls)
│   ├── index.js              # Export all actions
│   ├── auth.actions.js       # Authentication actions
│   ├── items.actions.js      # Items CRUD actions
│   ├── assignments.actions.js
│   ├── livestock.actions.js
│   ├── feeds.actions.js
│   ├── dashboard.actions.js
│   ├── users.actions.js
│   ├── locations.actions.js
│   ├── reports.actions.js
│   └── audit.actions.js
├── api-client.js             # HTTP client with bearer token support
├── client-utils.js           # Client-side utilities
└── auth-context.js           # Authentication context
```

## Key Features

### 1. **Centralized API Endpoints** (`lib/config/api-endpoints.js`)

All API endpoints are defined in one place:

```javascript
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints";

// Use like this:
ITEMS_ENDPOINTS.BASE              // "/items"
ITEMS_ENDPOINTS.BY_ID(123)        // "/items/123"
ITEMS_ENDPOINTS.CATEGORIES        // "/items/categories"
```

### 2. **API Client** (`lib/api-client.js`)

Singleton HTTP client that:
- Automatically injects bearer tokens
- Handles 401 unauthorized responses
- Provides methods: `get()`, `post()`, `put()`, `patch()`, `delete()`, `upload()`, `download()`
- Centralizes error handling

**Use API Client directly in client components:**

```javascript
import apiClient from "@/lib/api-client";
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints";

// GET request
const data = await apiClient.get(ITEMS_ENDPOINTS.BASE, { category: "Software" }, token);

// POST request
const result = await apiClient.post(ITEMS_ENDPOINTS.BASE, itemData, token);

// File upload
const formData = new FormData();
formData.append("file", file);
await apiClient.upload("/import/csv", formData, token);
```

### 3. **Server Actions** (`lib/actions/`)

Server-side functions for form submissions and server-side operations:

**Use server actions for:**
- Form submissions from Server Components
- API routes that need server-side processing
- Operations that should not expose API logic to client

```javascript
"use server";

import apiClient from "@/lib/api-client";
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints";

export async function createItemAction(formData) {
  const token = cookies().get("inventory_auth_token")?.value;
  try {
    const data = await apiClient.post(ITEMS_ENDPOINTS.BASE, formData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 4. **Clean Page Components**

Pages are now minimal and delegate logic to components:

```javascript
// app/(dashboard)/inventory/page.jsx
"use client"

import { InventoryContent } from "@/components/inventory/inventory-content"

export default function InventoryPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <InventoryContent />
    </div>
  )
}
```

### 5. **Component Logic** (`components/`)

Business logic lives in components using API client directly:

```javascript
// components/inventory/inventory-content.jsx
"use client"

import apiClient from "@/lib/api-client"
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints"

export function InventoryContent() {
  const { token } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await apiClient.get(ITEMS_ENDPOINTS.BASE, {}, token)
        setItems(data)
      } catch (error) {
        toast.error("Failed to load items")
      }
    }
    fetchItems()
  }, [token])

  async function handleDelete(id) {
    try {
      await apiClient.delete(ITEMS_ENDPOINTS.BY_ID(id), token)
      toast.success("Item deleted")
      fetchItems() // Refresh
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  // ... rest of component
}
```

## Usage Examples

### Client Component Data Fetching

```javascript
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api-client"
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints"

export function MyComponent() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.get(ITEMS_ENDPOINTS.BASE, {}, token)
        setItems(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [token])
  
  return <div>{/* render items */}</div>
}
```

### CRUD Operations

```javascript
import apiClient from "@/lib/api-client"
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints"

// Get all items with filters
const items = await apiClient.get(ITEMS_ENDPOINTS.BASE, { 
  category: "Software",
  search: "office",
  page: 1,
  limit: 20
}, token);

// Get single item
const item = await apiClient.get(ITEMS_ENDPOINTS.BY_ID(123), {}, token);

// Create item
const newItem = await apiClient.post(ITEMS_ENDPOINTS.BASE, {
  name: "New Item",
  category: "Hardware",
  quantity: 10,
  // ...
}, token);

// Update item
const updated = await apiClient.put(ITEMS_ENDPOINTS.BY_ID(123), {
  quantity: 15
}, token);

// Delete item
await apiClient.delete(ITEMS_ENDPOINTS.BY_ID(123), token);
```

### Dashboard & Reports

```javascript
import { getDashboardStats } from "@/lib/actions";
import { getLowStockReport, exportItemsCSV } from "@/lib/actions";

// Get dashboard stats
const stats = await getDashboardStats(token);

// Get low stock report
const report = await getLowStockReport(token, 10); // threshold = 10

// Export to CSV
const csvResult = await exportItemsCSV(token);
if (csvResult.success) {
  downloadBlob(csvResult.blob, "items.csv");
}
```

### Livestock & Feeds

```javascript
import { 
  getAllLivestock, 
  createLivestock,
  getAllFeeds,
  createFeed 
} from "@/lib/actions";

// Get livestock with filters
const livestock = await getAllLivestock(token, {
  species: "Cow",
  health_status: "healthy"
});

// Create livestock
const animal = await createLivestock({
  name: "Cow-001",
  species: "Cow",
  gender: "Female",
  age: 24,
  // ...
}, token);

// Get feeds
const feeds = await getAllFeeds(token, {
  feed_type: "Cattle Feed",
  expired_only: false
});
```

## API Response Format

All server actions return a consistent format:

```javascript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: "Error message"
}
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://inv-api.tutorsplan.com/api/v1
```

## Migration Guide

### Old Pattern (api.js)
```javascript
import { itemsApi } from "@/lib/api";

const items = await itemsApi.getAll(token);
```

### New Pattern (Server Actions)
```javascript
import { getAllItems } from "@/lib/actions";

const result = await getAllItems(token);
if (result.success) {
  const items = result.data;
}
```

## Benefits

1. **Security**: API calls happen on the server, tokens never exposed to client
2. **Type Safety**: Centralized endpoints prevent typos
3. **Maintainability**: One place to update API paths
4. **Consistency**: All responses follow same pattern
5. **Error Handling**: Centralized error handling logic
6. **Clean Code**: Pages stay minimal, logic in components
7. **Reusability**: Actions can be used anywhere in the app

## Best Practices

1. **Always use server actions** - Never make direct fetch calls from components
2. **Check result.success** - Always handle both success and error cases
3. **Pass token explicitly** - Get from `useAuth()` hook
4. **Use client-utils** - For common client-side operations
5. **Keep pages clean** - Move logic to dedicated components
6. **Component structure** - One content component per page

## Available Actions

See `lib/actions/index.js` for complete list of available server actions.

## Support

For API documentation, see `API_DOCUMENTATION.md`.
