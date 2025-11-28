"use server";

import apiClient from "@/lib/api-client";
import { LIVESTOCK_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get all livestock with optional filtering
 */
export async function getAllLivestock(token, params = {}) {
  try {
    const response = await apiClient.get(
      LIVESTOCK_ENDPOINTS.BASE,
      params,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get livestock by ID
 */
export async function getLivestockById(id, token) {
  try {
    const response = await apiClient.get(
      LIVESTOCK_ENDPOINTS.BY_ID(id),
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
 * Create new livestock
 */
export async function createLivestock(livestockData, token) {
  try {
    const response = await apiClient.post(
      LIVESTOCK_ENDPOINTS.BASE,
      livestockData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update livestock
 */
export async function updateLivestock(id, livestockData, token) {
  try {
    const response = await apiClient.put(
      LIVESTOCK_ENDPOINTS.BY_ID(id),
      livestockData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete livestock
 */
export async function deleteLivestock(id, token) {
  try {
    await apiClient.delete(LIVESTOCK_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get health report
 */
export async function getHealthReport(token) {
  try {
    const response = await apiClient.get(
      LIVESTOCK_ENDPOINTS.HEALTH_REPORT,
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
 * Get species summary
 */
export async function getSpeciesSummary(token) {
  try {
    const response = await apiClient.get(
      LIVESTOCK_ENDPOINTS.SPECIES_SUMMARY,
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
 * Bulk create livestock
 */
export async function bulkCreateLivestock(livestock, token) {
  try {
    const response = await apiClient.post(
      LIVESTOCK_ENDPOINTS.BULK_CREATE,
      { livestock },
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
