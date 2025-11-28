"use server";

import apiClient from "@/lib/api-client";
import { APPROVALS_ENDPOINTS } from "@/lib/config/api-endpoints";

export async function getAllApprovals(token, filters = {}) {
  try {
    const response = await apiClient.get(
      APPROVALS_ENDPOINTS.BASE,
      filters,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getPendingApprovals(token) {
  try {
    const response = await apiClient.get(
      APPROVALS_ENDPOINTS.PENDING,
      {},
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getApprovalById(id, token) {
  try {
    const response = await apiClient.get(
      APPROVALS_ENDPOINTS.BY_ID(id),
      {},
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createApproval(approvalData, token) {
  try {
    const response = await apiClient.post(
      APPROVALS_ENDPOINTS.BASE,
      approvalData,
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function approveRequest(id, decision_notes, token) {
  try {
    const response = await apiClient.patch(
      APPROVALS_ENDPOINTS.APPROVE(id),
      { decision_notes },
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function rejectRequest(id, decision_notes, token) {
  try {
    const response = await apiClient.patch(
      APPROVALS_ENDPOINTS.REJECT(id),
      { decision_notes },
      token
    );
    const data = response.data || response;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteApproval(id, token) {
  try {
    await apiClient.delete(APPROVALS_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
