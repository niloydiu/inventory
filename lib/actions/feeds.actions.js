"use server";

import apiClient from "@/lib/api-client";
import { FEEDS_ENDPOINTS } from "@/lib/config/api-endpoints";

/**
 * Get all feeds with optional filtering
 */
export async function getAllFeeds(token, params = {}) {
  try {
    const data = await apiClient.get(FEEDS_ENDPOINTS.BASE, params, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get feed by ID
 */
export async function getFeedById(id, token) {
  try {
    const data = await apiClient.get(FEEDS_ENDPOINTS.BY_ID(id), {}, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new feed
 */
export async function createFeed(feedData, token) {
  try {
    const data = await apiClient.post(FEEDS_ENDPOINTS.BASE, feedData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update feed
 */
export async function updateFeed(id, feedData, token) {
  try {
    const data = await apiClient.put(FEEDS_ENDPOINTS.BY_ID(id), feedData, token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete feed
 */
export async function deleteFeed(id, token) {
  try {
    await apiClient.delete(FEEDS_ENDPOINTS.BY_ID(id), token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Bulk create feeds
 */
export async function bulkCreateFeeds(feeds, token) {
  try {
    const data = await apiClient.post(
      FEEDS_ENDPOINTS.BULK_CREATE,
      { feeds },
      token
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
