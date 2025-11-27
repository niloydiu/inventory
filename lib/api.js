const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6210/api/v1';

async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, token } = options;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized - clear auth and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('inventory_auth_token');
        localStorage.removeItem('inventory_user');
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }
    
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {};
  }

  return response.json();
}

// ============ AUTH API ============
export const authApi = {
  login: (username, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),
  
  register: (data) =>
    apiRequest('/auth/register', { method: 'POST', body: data }),
  
  me: (token) =>
    apiRequest('/auth/me', { token }),
};

// ============ ITEMS API ============
export const itemsApi = {
  getAll: (token, params) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const query = searchParams.toString() ? `?${searchParams}` : '';
    return apiRequest(`/items${query}`, { token });
  },
  
  getById: (id, token) =>
    apiRequest(`/items/${id}`, { token }),
  
  create: (data, token) =>
    apiRequest('/items', { method: 'POST', body: data, token }),
  
  update: (id, data, token) =>
    apiRequest(`/items/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (id, token) =>
    apiRequest(`/items/${id}`, { method: 'DELETE', token }),
  
  updateStock: (id, quantityChange, token) =>
    apiRequest(`/items/${id}/stock`, {
      method: 'PATCH',
      body: { quantity_change: quantityChange },
      token,
    }),
  
  getCategories: (token) =>
    apiRequest('/items/categories', { token }),
};

// ============ ASSIGNMENTS API ============
export const assignmentsApi = {
  getAll: (token, filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status_filter', filters.status);
    if (filters?.employee_id) params.append('employee_id', filters.employee_id.toString());
    if (filters?.item_id) params.append('item_id', filters.item_id.toString());
    const query = params.toString() ? `?${params}` : '';
    return apiRequest(`/assignments${query}`, { token });
  },
  
  getById: (id, token) =>
    apiRequest(`/assignments/${id}`, { token }),
  
  create: (data, token) =>
    apiRequest('/assignments', { method: 'POST', body: data, token }),
  
  createBulk: (assignments, token) =>
    apiRequest('/assignments/bulk', {
      method: 'POST',
      body: { assignments },
      token,
    }),
  
  return: (id, data, token) =>
    apiRequest(`/assignments/${id}/return`, {
      method: 'PATCH',
      body: data,
      token,
    }),
  
  getMyAssignments: (token) =>
    apiRequest('/assignments/user/me', { token }),
};

// ============ LIVESTOCK API ============
export const livestockApi = {
  getAll: (token, params) => {
    const searchParams = new URLSearchParams();
    if (params?.species) searchParams.append('species', params.species);
    if (params?.health_status) searchParams.append('health_status', params.health_status);
    if (params?.search) searchParams.append('search', params.search);
    const query = searchParams.toString() ? `?${searchParams}` : '';
    return apiRequest(`/livestock${query}`, { token });
  },
  
  getById: (id, token) =>
    apiRequest(`/livestock/${id}`, { token }),
  
  create: (data, token) =>
    apiRequest('/livestock', { method: 'POST', body: data, token }),
  
  update: (id, data, token) =>
    apiRequest(`/livestock/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (id, token) =>
    apiRequest(`/livestock/${id}`, { method: 'DELETE', token }),
};

// ============ FEEDS API ============
export const feedsApi = {
  getAll: (token, params) => {
    const searchParams = new URLSearchParams();
    if (params?.feed_type) searchParams.append('feed_type', params.feed_type);
    if (params?.status) searchParams.append('status_filter', params.status);
    if (params?.expired_only) searchParams.append('expired_only', 'true');
    const query = searchParams.toString() ? `?${searchParams}` : '';
    return apiRequest(`/feeds${query}`, { token });
  },
  
  getById: (id, token) =>
    apiRequest(`/feeds/${id}`, { token }),
  
  create: (data, token) =>
    apiRequest('/feeds', { method: 'POST', body: data, token }),
  
  update: (id, data, token) =>
    apiRequest(`/feeds/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (id, token) =>
    apiRequest(`/feeds/${id}`, { method: 'DELETE', token }),
};

// ============ LOCATIONS API ============
export const locationsApi = {
  getAll: (token) =>
    apiRequest('/locations', { token }),
  
  create: (data, token) =>
    apiRequest('/locations', { method: 'POST', body: data, token }),
  
  update: (id, data, token) =>
    apiRequest(`/locations/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (id, token) =>
    apiRequest(`/locations/${id}`, { method: 'DELETE', token }),
};

// ============ USERS API ============
export const usersApi = {
  getAll: (token) =>
    apiRequest('/users', { token }),
  
  create: (data, token) =>
    apiRequest('/auth/users', { method: 'POST', body: data, token }),
  
  update: (id, data, token) =>
    apiRequest(`/users/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (id, token) =>
    apiRequest(`/users/${id}`, { method: 'DELETE', token }),
};

// ============ DASHBOARD API ============
export const dashboardApi = {
  getStats: (token) =>
    apiRequest('/dashboard/stats', { token }),
  
  getSummary: (token) =>
    apiRequest('/dashboard/summary', { token }),
  
  getRestocking: (token) =>
    apiRequest('/dashboard/restocking', { token }),
  
  getRecentItems: (token) =>
    apiRequest('/dashboard/recent-items', { token }),
};

// ============ REPORTS API ============
export const reportsApi = {
  getLowStock: (token, threshold) => {
    const query = threshold ? `?threshold=${threshold}` : '';
    return apiRequest(`/reports/low-stock${query}`, { token });
  },
  
  getAssignedItems: (token) =>
    apiRequest('/reports/assigned-items', { token }),
  
  getSeatUsage: (itemId, token) =>
    apiRequest(`/reports/seat-usage/${itemId}`, { token }),
};

// ============ MAINTENANCE API ============
export const maintenanceApi = {
  getAll: (token, itemId) => {
    const query = itemId ? `?item_id=${itemId}` : '';
    return apiRequest(`/maintenance${query}`, { token });
  },
  
  getUpcoming: (token, days) => {
    const query = days ? `?days=${days}` : '';
    return apiRequest(`/maintenance/upcoming${query}`, { token });
  },
  
  create: (data, token) =>
    apiRequest('/maintenance', { method: 'POST', body: data, token }),
  
  update: (id, data, token) =>
    apiRequest(`/maintenance/${id}`, { method: 'PUT', body: data, token }),
  
  delete: (id, token) =>
    apiRequest(`/maintenance/${id}`, { method: 'DELETE', token }),
};

// ============ RESERVATIONS API ============
export const reservationsApi = {
  getAll: (token) =>
    apiRequest('/reservations', { token }),
  
  create: (data, token) =>
    apiRequest('/reservations', { method: 'POST', body: data, token }),
  
  update: (id, data, token) =>
    apiRequest(`/reservations/${id}`, { method: 'PUT', body: data, token }),
  
  cancel: (id, token) =>
    apiRequest(`/reservations/${id}`, { method: 'DELETE', token }),
};

// ============ APPROVALS API ============
export const approvalsApi = {
  getAll: (token, status) => {
    const query = status ? `?status_filter=${status}` : '';
    return apiRequest(`/approvals${query}`, { token });
  },
  
  getPending: (token) =>
    apiRequest('/approvals/pending', { token }),
  
  create: (data, token) =>
    apiRequest('/approvals', { method: 'POST', body: data, token }),
  
  approve: (id, token) =>
    apiRequest(`/approvals/${id}/approve`, { method: 'PATCH', token }),
  
  reject: (id, reason, token) =>
    apiRequest(`/approvals/${id}/reject`, {
      method: 'PATCH',
      body: { rejection_reason: reason },
      token,
    }),
};

// ============ AUDIT LOGS API ============
export const auditApi = {
  getAll: (token, filters) => {
    const params = new URLSearchParams();
    if (filters?.action) params.append('action', filters.action);
    if (filters?.entity_type) params.append('entity_type', filters.entity_type);
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    const query = params.toString() ? `?${params}` : '';
    return apiRequest(`/audit${query}`, { token });
  },
};

// ============ UPLOAD API ============
export const uploadApi = {
  uploadImage: async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
};

// ============ BULK OPERATIONS API ============
export const bulkApi = {
  importCSV: async (file, entityType, token) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', entityType);
    
    const response = await fetch(`${API_BASE_URL}/import/csv`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    
    if (!response.ok) throw new Error('Import failed');
    return response.json();
  },
  
  bulkCreateItems: (items, token) =>
    apiRequest('/items/bulk-create', { method: 'POST', body: { items }, token }),
  
  bulkUpdateItems: (updates, token) =>
    apiRequest('/items/bulk-update', { method: 'PUT', body: { items: updates }, token }),
  
  bulkDeleteItems: (ids, token) =>
    apiRequest('/items/bulk-delete', { method: 'POST', body: { ids }, token }),
};

// ============ QR CODE API ============
export const qrcodeApi = {
  getItemQRCode: (itemId, token) =>
    `${API_BASE_URL}/qrcode/item/${itemId}?token=${token}`,
};

// ============ EXPORT API ============
export const exportApi = {
  exportItemsCSV: (token) =>
    `${API_BASE_URL}/export/items/csv?token=${token}`,
  
  exportAssignmentsCSV: (token) =>
    `${API_BASE_URL}/export/assignments/csv?token=${token}`,
};
