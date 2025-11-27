"use server";

import apiClient from "@/lib/api-client";
import { AUTH_ENDPOINTS } from "@/lib/config/api-endpoints";
import { cookies } from "next/headers";

/**
 * Login user
 */
export async function loginUser(username, password) {
  try {
    const data = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
      username,
      password,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Register new user
 */
export async function registerUser(userData) {
  try {
    const data = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(token) {
  try {
    const data = await apiClient.get(AUTH_ENDPOINTS.ME, {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create user (admin only)
 */
export async function createUser(userData, token) {
  try {
    const data = await apiClient.post(AUTH_ENDPOINTS.CREATE_USER, userData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Refresh token
 */
export async function refreshToken(token) {
  try {
    const data = await apiClient.post(AUTH_ENDPOINTS.REFRESH, {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
