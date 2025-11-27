/**
 * API Client Instance
 * Handles all HTTP requests with automatic bearer token injection
 */

import { API_BASE_URL } from "./config/api-endpoints";

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication token from localStorage
   */
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inventory_auth_token");
    }
    return null;
  }

  /**
   * Build headers with bearer token
   */
  buildHeaders(token, isFormData = false) {
    const headers = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const authToken = token || this.getToken();
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    console.log(
      "[ApiClient] Response status:",
      response.status,
      response.statusText
    );

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.log(
        "[ApiClient] 401 Unauthorized - clearing auth and redirecting"
      );
      if (typeof window !== "undefined") {
        localStorage.removeItem("inventory_auth_token");
        localStorage.removeItem("inventory_user");
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }

    // Handle 204 No Content
    if (response.status === 204) {
      console.log("[ApiClient] 204 No Content - returning empty object");
      return {};
    }

    // Parse response
    const parsed = await response.json().catch(() => ({}));
    console.log("[ApiClient] Parsed response:", parsed);

    // If server returns the wrapper { success: boolean, data: ... }, unwrap it
    if (parsed && typeof parsed === "object" && parsed.success !== undefined) {
      if (!parsed.success) {
        const errMsg =
          parsed.detail || parsed.message || `HTTP ${response.status}`;
        console.log("[ApiClient] Server returned success=false:", errMsg);
        throw new Error(errMsg);
      }
      console.log(
        "[ApiClient] Unwrapping success response, returning data:",
        parsed.data
      );
      return parsed.data === undefined ? {} : parsed.data;
    }

    if (!response.ok) {
      const errMsg =
        parsed.detail || parsed.message || `HTTP ${response.status}`;
      console.log("[ApiClient] Response not OK:", errMsg);
      throw new Error(errMsg);
    }

    console.log("[ApiClient] Returning parsed response as-is");
    return parsed;
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, token = null) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.buildHeaders(token),
      credentials: "include", // Include cookies
    });

    return this.handleResponse(response);
  }

  /**
   * POST request
   */
  async post(endpoint, body = {}, token = null, isFormData = false) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(token, isFormData),
      credentials: "include", // Include cookies
      body: isFormData ? body : JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * PUT request
   */
  async put(endpoint, body = {}, token = null) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.buildHeaders(token),
      credentials: "include", // Include cookies
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, body = {}, token = null) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.buildHeaders(token),
      credentials: "include", // Include cookies
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, token = null) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.buildHeaders(token),
      credentials: "include", // Include cookies
    });

    return this.handleResponse(response);
  }

  /**
   * Upload file
   */
  async upload(endpoint, formData, token = null) {
    return this.post(endpoint, formData, token, true);
  }

  /**
   * Download file (returns blob)
   */
  async download(endpoint, params = {}, token = null) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const authToken = token || this.getToken();
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    return response.blob();
  }
}

// Create and export singleton instance
const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
