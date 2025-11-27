"use server";

import apiClient from "@/lib/api-client";
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get all items with optional filtering
 */
export async function getAllItems(token, params = {}) {
  try {
    const data = await apiClient.get(ITEMS_ENDPOINTS.BASE, params, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get item by ID
 */
export async function getItemById(id, token) {
  try {
    const data = await apiClient.get(ITEMS_ENDPOINTS.BY_ID(id), {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get all categories
 */
export async function getCategories(token) {
  try {
    const data = await apiClient.get(ITEMS_ENDPOINTS.CATEGORIES, {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new item
 */
export async function createItem(itemData, token) {
  try {
    const data = await apiClient.post(ITEMS_ENDPOINTS.BASE, itemData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update item
 */
export async function updateItem(id, itemData, token) {
  try {
    const data = await apiClient.put(ITEMS_ENDPOINTS.BY_ID(id), itemData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete item
 */
export async function deleteItem(id, token) {
  try {
    await apiClient.delete(ITEMS_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update stock quantity
 */
export async function updateStock(id, quantityChange, token) {
  try {
    const data = await apiClient.patch(
      ITEMS_ENDPOINTS.STOCK(id),
      { quantity_change: quantityChange },
      token
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Bulk create items
 */
export async function bulkCreateItems(items, token) {
  try {
    const data = await apiClient.post(
      ITEMS_ENDPOINTS.BULK_CREATE,
      { items },
      token
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Bulk update items
 */
export async function bulkUpdateItems(updates, token) {
  try {
    const data = await apiClient.put(
      ITEMS_ENDPOINTS.BULK_UPDATE,
      { updates },
      token
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Bulk delete items
 */
export async function bulkDeleteItems(itemIds, token) {
  try {
    const data = await apiClient.delete(
      ITEMS_ENDPOINTS.BULK_DELETE,
      { item_ids: itemIds },
      token
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
