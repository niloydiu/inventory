"use server";

import apiClient from "@/lib/api-client";
import { DASHBOARD_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(token) {
  try {
    const data = await apiClient.get(DASHBOARD_ENDPOINTS.STATS, {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
