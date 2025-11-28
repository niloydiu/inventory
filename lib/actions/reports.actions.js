"use server";

import apiClient from "@/lib/api-client";
import { REPORTS_ENDPOINTS, EXPORT_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get low stock report
 */
export async function getLowStockReport(token, threshold = 10) {
  try {
    const response = await apiClient.get(
      REPORTS_ENDPOINTS.LOW_STOCK,
      { threshold },
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get assigned items report
 */
export async function getAssignedItemsReport(token) {
  try {
    const response = await apiClient.get(REPORTS_ENDPOINTS.ASSIGNED_ITEMS, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get seat usage report
 */
export async function getSeatUsageReport(itemId, token) {
  try {
    const response = await apiClient.get(
      REPORTS_ENDPOINTS.SEAT_USAGE(itemId),
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
 * Export items to CSV
 */
export async function exportItemsCSV(token) {
  try {
    const blob = await apiClient.download(EXPORT_ENDPOINTS.ITEMS_CSV, {}, token);
    return { success: true, blob };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Export assignments to CSV
 */
export async function exportAssignmentsCSV(token) {
  try {
    const blob = await apiClient.download(EXPORT_ENDPOINTS.ASSIGNMENTS_CSV, {}, token);
    return { success: true, blob };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Export low stock to CSV
 */
export async function exportLowStockCSV(token, threshold = 10) {
  try {
    const blob = await apiClient.download(
      EXPORT_ENDPOINTS.LOW_STOCK_CSV,
      { threshold },
      token
    );
    return { success: true, blob };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
