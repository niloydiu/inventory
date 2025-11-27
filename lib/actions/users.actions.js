"use server";

import apiClient from "@/lib/api-client";
import { USERS_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get all users
 */
export async function getAllUsers(token) {
  try {
    const data = await apiClient.get(USERS_ENDPOINTS.BASE, {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id, token) {
  try {
    const data = await apiClient.get(USERS_ENDPOINTS.BY_ID(id), {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update user
 */
export async function updateUser(id, userData, token) {
  try {
    const data = await apiClient.put(USERS_ENDPOINTS.BY_ID(id), userData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete user
 */
export async function deleteUser(id, token) {
  try {
    await apiClient.delete(USERS_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
