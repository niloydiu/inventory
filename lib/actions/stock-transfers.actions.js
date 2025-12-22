"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/stock-transfers";

/**
 * Get all stock transfers with optional filtering
 */
export async function getAllStockTransfers(token, params = {}) {
  try {
    const response = await apiClient.get(BASE_URL, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get stock transfer by ID
 */
export async function getStockTransferById(id, token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get stock transfer statistics
 */
export async function getStockTransferStats(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/stats`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new stock transfer
 */
export async function createStockTransfer(transferData, token) {
  try {
    const response = await apiClient.post(BASE_URL, transferData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update stock transfer
 */
export async function updateStockTransfer(id, transferData, token) {
  try {
    const response = await apiClient.put(
      `${BASE_URL}/${id}`,
      transferData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete stock transfer
 */
export async function deleteStockTransfer(id, token) {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`, token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Approve stock transfer
 */
export async function approveStockTransfer(id, token) {
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
 * Ship stock transfer
 */
export async function shipStockTransfer(id, token) {
  try {
    const response = await apiClient.post(`${BASE_URL}/${id}/ship`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Receive stock transfer
 */
export async function receiveStockTransfer(id, token) {
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
 * Cancel stock transfer
 */
export async function cancelStockTransfer(id, token) {
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
