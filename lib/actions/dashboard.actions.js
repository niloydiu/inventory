"use server";

import apiClient from "@/lib/api-client";
import { DASHBOARD_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(token) {
  try {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.STATS, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
