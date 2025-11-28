"use server";

import apiClient from "@/lib/api-client";
import { RESERVATIONS_ENDPOINTS } from "@/lib/config/api-endpoints";

export async function getAllReservations(token, filters = {}) {
  try {
    const response = await apiClient.get(RESERVATIONS_ENDPOINTS.BASE, filters, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getReservationById(id, token) {
  try {
    const response = await apiClient.get(RESERVATIONS_ENDPOINTS.BY_ID(id), {}, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createReservation(reservationData, token) {
  try {
    const response = await apiClient.post(RESERVATIONS_ENDPOINTS.BASE, reservationData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateReservation(id, reservationData, token) {
  try {
    const response = await apiClient.put(RESERVATIONS_ENDPOINTS.BY_ID(id), reservationData, token);
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteReservation(id, token) {
  try {
    await apiClient.delete(RESERVATIONS_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
