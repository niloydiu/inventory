/**
 * API Endpoint Configuration
 * Centralized API endpoint paths for the entire application
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6210/api/v1";

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  CREATE_USER: "/auth/users/create",
};

// Items Endpoints
export const ITEMS_ENDPOINTS = {
  BASE: "/items",
  BY_ID: (id) => `/items/${id}`,
  CATEGORIES: "/items/categories",
  STOCK: (id) => `/items/${id}/stock`,
  BULK_CREATE: "/items/bulk-create",
  BULK_UPDATE: "/items/bulk-update",
  BULK_DELETE: "/items/bulk-delete",
  QR_CODE: (id) => `/items/${id}/qrcode`,
  QR_CODE_DATA: (id) => `/items/${id}/qrcode/data`,
};

// Assignments Endpoints
export const ASSIGNMENTS_ENDPOINTS = {
  BASE: "/assignments",
  BY_ID: (id) => `/assignments/${id}`,
  RETURN: (id) => `/assignments/${id}/return`,
  MY_ASSIGNMENTS: "/assignments/user/me",
};

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: "/dashboard/stats",
};

// Reports Endpoints
export const REPORTS_ENDPOINTS = {
  LOW_STOCK: "/reports/low-stock",
  ASSIGNED_ITEMS: "/reports/assigned-items",
  SEAT_USAGE: (id) => `/reports/seat-usage/${id}`,
};

// Export Endpoints
export const EXPORT_ENDPOINTS = {
  ITEMS_CSV: "/export/items/csv",
  ASSIGNMENTS_CSV: "/export/assignments/csv",
  LOW_STOCK_CSV: "/export/low-stock/csv",
};

// Import Endpoints
export const IMPORT_ENDPOINTS = {
  CSV: "/import/csv",
};

// Livestock Endpoints
export const LIVESTOCK_ENDPOINTS = {
  BASE: "/livestock",
  BY_ID: (id) => `/livestock/${id}`,
  HEALTH_REPORT: "/livestock/health/report",
  SPECIES_SUMMARY: "/livestock/species/summary",
  BULK_CREATE: "/livestock/bulk-create",
};

// Feeds Endpoints
export const FEEDS_ENDPOINTS = {
  BASE: "/feeds",
  BY_ID: (id) => `/feeds/${id}`,
  BULK_CREATE: "/feeds/bulk-create",
};

// Locations Endpoints
export const LOCATIONS_ENDPOINTS = {
  BASE: "/locations",
  BY_ID: (id) => `/locations/${id}`,
};

// Maintenance Endpoints
export const MAINTENANCE_ENDPOINTS = {
  BASE: "/maintenance",
  BY_ID: (id) => `/maintenance/${id}`,
  UPCOMING: "/maintenance/upcoming",
};

// Reservations Endpoints
export const RESERVATIONS_ENDPOINTS = {
  BASE: "/reservations",
  BY_ID: (id) => `/reservations/${id}`,
};

// Approvals Endpoints
export const APPROVALS_ENDPOINTS = {
  BASE: "/approvals",
  BY_ID: (id) => `/approvals/${id}`,
  PENDING: "/approvals/pending",
  APPROVE: (id) => `/approvals/${id}/approve`,
  REJECT: (id) => `/approvals/${id}/reject`,
};

// Audit Logs Endpoints
export const AUDIT_ENDPOINTS = {
  BASE: "/audit",
  STATS: "/audit/stats",
};

// Users Endpoints
export const USERS_ENDPOINTS = {
  BASE: "/users",
  BY_ID: (id) => `/users/${id}`,
};
