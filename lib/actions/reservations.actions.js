"use server";

import apiClient from "@/lib/api-client";
import { RESERVATIONS_ENDPOINTS } from "@/lib/config/api-endpoints";

export async function getAllReservations(token, filters = {}) {
  try {
    const data = await apiClient.get(RESERVATIONS_ENDPOINTS.BASE, filters, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getReservationById(id, token) {
  try {
    const data = await apiClient.get(RESERVATIONS_ENDPOINTS.BY_ID(id), {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createReservation(reservationData, token) {
  try {
    const data = await apiClient.post(RESERVATIONS_ENDPOINTS.BASE, reservationData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateReservation(id, reservationData, token) {
  try {
    const data = await apiClient.put(RESERVATIONS_ENDPOINTS.BY_ID(id), reservationData, token);
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
