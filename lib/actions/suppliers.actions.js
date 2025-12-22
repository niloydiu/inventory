"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/suppliers";

/**
 * Get all suppliers with optional filtering
 */
export async function getAllSuppliers(token, params = {}) {
  try {
    const response = await apiClient.get(BASE_URL, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get supplier by ID
 */
export async function getSupplierById(id, token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get supplier statistics
 */
export async function getSupplierStats(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/stats`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new supplier
 */
export async function createSupplier(supplierData, token) {
  try {
    const response = await apiClient.post(BASE_URL, supplierData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update supplier
 */
export async function updateSupplier(id, supplierData, token) {
  try {
    const response = await apiClient.put(
      `${BASE_URL}/${id}`,
      supplierData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete supplier
 */
export async function deleteSupplier(id, token) {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`, token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
