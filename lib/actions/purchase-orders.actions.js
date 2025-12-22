"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/purchase-orders";

/**
 * Get all purchase orders with optional filtering
 */
export async function getAllPurchaseOrders(token, params = {}) {
  try {
    const response = await apiClient.get(BASE_URL, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get purchase order by ID
 */
export async function getPurchaseOrderById(id, token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get purchase order statistics
 */
export async function getPurchaseOrderStats(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/stats`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new purchase order
 */
export async function createPurchaseOrder(poData, token) {
  try {
    const response = await apiClient.post(BASE_URL, poData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update purchase order
 */
export async function updatePurchaseOrder(id, poData, token) {
  try {
    const response = await apiClient.put(`${BASE_URL}/${id}`, poData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete purchase order
 */
export async function deletePurchaseOrder(id, token) {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`, token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Approve purchase order
 */
export async function approvePurchaseOrder(id, token) {
  try {
    const response = await apiClient.post(
      `${BASE_URL}/${id}/approve`,
      {},
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Receive purchase order
 */
export async function receivePurchaseOrder(id, token) {
  try {
    const response = await apiClient.post(
      `${BASE_URL}/${id}/receive`,
      {},
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Cancel purchase order
 */
export async function cancelPurchaseOrder(id, token) {
  try {
    const response = await apiClient.post(
      `${BASE_URL}/${id}/cancel`,
      {},
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
