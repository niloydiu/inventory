/**
 * Client-side API utilities
 * These functions wrap server actions and handle client-side concerns
 */

import { toast } from "sonner";

/**
 * Execute an action with loading and error handling
 */
export async function executeAction(action, options = {}) {
  const {
    loadingMessage,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    showToast = true,
  } = options;

  try {
    if (loadingMessage && showToast) {
      toast.loading(loadingMessage);
    }

    const result = await action();

    if (showToast) {
      toast.dismiss();
    }

    if (result.success) {
      if (successMessage && showToast) {
        toast.success(successMessage);
      }
      if (onSuccess) {
        onSuccess(result.data);
      }
      return result;
    } else {
      const error = result.error || errorMessage || "Operation failed";
      if (showToast) {
        toast.error(error);
      }
      if (onError) {
        onError(error);
      }
      return result;
    }
  } catch (error) {
    if (showToast) {
      toast.dismiss();
      toast.error(error.message || errorMessage || "An error occurred");
    }
    if (onError) {
      onError(error.message);
    }
    return { success: false, error: error.message };
  }
}

/**
 * Get token from localStorage (client-side only)
 */
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("inventory_auth_token");
  }
  return null;
}

/**
 * Get user from localStorage (client-side only)
 */
export function getUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("inventory_user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * Download blob as file
 */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
