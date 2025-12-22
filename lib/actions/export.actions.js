"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/export";

/**
 * Export items to CSV
 */
export async function exportItemsToCSV(token, params = {}) {
  try {
    const response = await apiClient.get(`${BASE_URL}/items`, params, token);
    // The response should be CSV data
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Export assignments to CSV
 */
export async function exportAssignmentsToCSV(token, params = {}) {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/assignments`,
      params,
      token
    );
    // The response should be CSV data
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Download CSV file helper
 */
export function downloadCSV(csvData, filename = "export.csv") {
  if (typeof window === "undefined") return;

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
