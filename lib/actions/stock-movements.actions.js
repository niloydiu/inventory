"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/stock-movements";

/**
 * Get all stock movements with optional filtering
 */
export async function getAllStockMovements(token, params = {}) {
  try {
    const response = await apiClient.get(BASE_URL, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get stock movement by ID
 */
export async function getStockMovementById(id, token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get stock movement statistics
 */
export async function getStockMovementStats(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/stats`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
