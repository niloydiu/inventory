"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/stock-adjustments";

/**
 * Get all stock adjustments with optional filtering
 */
export async function getAllStockAdjustments(token, params = {}) {
  try {
    const response = await apiClient.get(BASE_URL, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get stock adjustment by ID
 */
export async function getStockAdjustmentById(id, token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get stock adjustment statistics
 */
export async function getStockAdjustmentStats(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/stats`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new stock adjustment
 */
export async function createStockAdjustment(adjustmentData, token) {
  try {
    const response = await apiClient.post(BASE_URL, adjustmentData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Approve stock adjustment
 */
export async function approveStockAdjustment(id, token) {
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
 * Reject stock adjustment
 */
export async function rejectStockAdjustment(id, rejectionReason, token) {
  try {
    const response = await apiClient.post(
      `${BASE_URL}/${id}/reject`,
      { rejection_reason: rejectionReason },
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete stock adjustment
 */
export async function deleteStockAdjustment(id, token) {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`, token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
