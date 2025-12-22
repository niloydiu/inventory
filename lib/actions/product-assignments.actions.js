"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/product-assignments";

/**
 * Get all product assignments with optional filtering
 */
export async function getAllProductAssignments(token, params = {}) {
  try {
    const response = await apiClient.get(BASE_URL, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get product assignment by ID
 */
export async function getProductAssignmentById(id, token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get product assignment statistics
 */
export async function getProductAssignmentStats(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/stats`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get overdue product assignments
 */
export async function getOverdueProductAssignments(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/overdue`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get assignments for a specific employee
 */
export async function getEmployeeProductAssignments(employeeId, token) {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/employee/${employeeId}`,
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
 * Create new product assignment
 */
export async function createProductAssignment(assignmentData, token) {
  try {
    const response = await apiClient.post(BASE_URL, assignmentData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update product assignment
 */
export async function updateProductAssignment(id, assignmentData, token) {
  try {
    const response = await apiClient.put(
      `${BASE_URL}/${id}`,
      assignmentData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Acknowledge product assignment (employee confirms receipt)
 */
export async function acknowledgeProductAssignment(id, token) {
  try {
    const response = await apiClient.post(
      `${BASE_URL}/${id}/acknowledge`,
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
 * Return product from assignment
 */
export async function returnProductAssignment(id, token) {
  try {
    const response = await apiClient.post(
      `${BASE_URL}/${id}/return`,
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
 * Delete product assignment
 */
export async function deleteProductAssignment(id, token) {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`, token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
