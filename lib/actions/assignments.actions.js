"use server";

import apiClient from "@/lib/api-client";
import { ASSIGNMENTS_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get all assignments with optional filtering
 */
export async function getAllAssignments(token, filters = {}) {
  try {
    const response = await apiClient.get(ASSIGNMENTS_ENDPOINTS.BASE, filters, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get assignment by ID
 */
export async function getAssignmentById(id, token) {
  try {
    const response = await apiClient.get(ASSIGNMENTS_ENDPOINTS.BY_ID(id), {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new assignment
 */
export async function createAssignment(assignmentData, token) {
  try {
    const response = await apiClient.post(
      ASSIGNMENTS_ENDPOINTS.BASE,
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
 * Return assignment
 */
export async function returnAssignment(id, returnData, token) {
  try {
    const response = await apiClient.patch(
      ASSIGNMENTS_ENDPOINTS.RETURN(id),
      returnData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get current user's assignments
 */
export async function getMyAssignments(token) {
  try {
    const response = await apiClient.get(ASSIGNMENTS_ENDPOINTS.MY_ASSIGNMENTS, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
