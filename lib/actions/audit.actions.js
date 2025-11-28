"use server";

import apiClient from "@/lib/api-client";
import { AUDIT_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get audit logs with optional filtering
 */
export async function getAuditLogs(token, filters = {}) {
  try {
    const response = await apiClient.get(AUDIT_ENDPOINTS.BASE, filters, token);
    // Extract data from wrapped response
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get audit statistics
 */
export async function getAuditStats(token, days = 30) {
  try {
    const response = await apiClient.get(
      AUDIT_ENDPOINTS.STATS,
      { days },
      token
    );
    // Extract data from wrapped response
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
