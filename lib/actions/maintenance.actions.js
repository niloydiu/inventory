"use server";

import apiClient from "@/lib/api-client";
import { MAINTENANCE_ENDPOINTS } from "@/lib/config/api-endpoints";

export async function getAllMaintenance(token, filters = {}) {
  try {
    const data = await apiClient.get(MAINTENANCE_ENDPOINTS.BASE, filters, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUpcomingMaintenance(token) {
  try {
    const data = await apiClient.get(MAINTENANCE_ENDPOINTS.UPCOMING, {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getMaintenanceById(id, token) {
  try {
    const data = await apiClient.get(MAINTENANCE_ENDPOINTS.BY_ID(id), {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createMaintenance(maintenanceData, token) {
  try {
    const data = await apiClient.post(MAINTENANCE_ENDPOINTS.BASE, maintenanceData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateMaintenance(id, maintenanceData, token) {
  try {
    const data = await apiClient.put(MAINTENANCE_ENDPOINTS.BY_ID(id), maintenanceData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteMaintenance(id, token) {
  try {
    await apiClient.delete(MAINTENANCE_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
