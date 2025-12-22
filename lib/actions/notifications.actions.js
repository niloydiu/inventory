"use server";

import apiClient from "@/lib/api-client";

const BASE_URL = "/notifications";

/**
 * Get all notifications with optional filtering
 */
export async function getAllNotifications(token, params = {}) {
  try {
    const response = await apiClient.get(BASE_URL, params, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get unread notifications
 */
export async function getUnreadNotifications(token) {
  try {
    const response = await apiClient.get(`${BASE_URL}/unread`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id, token) {
  try {
    const response = await apiClient.post(`${BASE_URL}/${id}/read`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(token) {
  try {
    const response = await apiClient.post(`${BASE_URL}/read-all`, {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(id, token) {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`, token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
