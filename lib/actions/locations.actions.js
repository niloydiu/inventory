"use server";

import apiClient from "@/lib/api-client";
import { LOCATIONS_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get all locations
 */
export async function getAllLocations(token, activeOnly = false) {
  try {
    const params = activeOnly ? { active_only: true } : {};
    const response = await apiClient.get(LOCATIONS_ENDPOINTS.BASE, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get location by ID
 */
export async function getLocationById(id, token) {
  try {
    const response = await apiClient.get(LOCATIONS_ENDPOINTS.BY_ID(id), {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new location
 */
export async function createLocation(locationData, token) {
  try {
    const response = await apiClient.post(LOCATIONS_ENDPOINTS.BASE, locationData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update location
 */
export async function updateLocation(id, locationData, token) {
  try {
    const response = await apiClient.put(
      LOCATIONS_ENDPOINTS.BY_ID(id),
      locationData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete location
 */
export async function deleteLocation(id, token) {
  try {
    await apiClient.delete(LOCATIONS_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
