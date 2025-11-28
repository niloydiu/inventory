"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "./api-client";
import { AUTH_ENDPOINTS } from "./config/api-endpoints";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount and validate it
    const validateToken = async () => {
      try {
        // Only access localStorage on client side
        if (typeof window === "undefined") {
          console.log("[AuthContext] Server side, skipping validation");
          setIsLoading(false);
          return;
        }

        const storedToken = localStorage.getItem("inventory_auth_token");
        const storedUser = localStorage.getItem("inventory_user");

        console.log("[AuthContext] Checking stored credentials:", {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
        });

        if (storedToken && storedUser) {
          try {
            // Validate token by fetching current user
            console.log("[AuthContext] Validating token with API...");
            const userData = await apiClient.get(
              AUTH_ENDPOINTS.ME,
              {},
              storedToken
            );
            console.log("[AuthContext] Token validation successful:", userData);
            setToken(storedToken);
            setUser(userData);
          } catch (error) {
            // Token is invalid or expired, clear everything
            console.log(
              "[AuthContext] Token validation failed:",
              error.message
            );
            // Clear all auth data
            localStorage.removeItem("inventory_auth_token");
            localStorage.removeItem("inventory_user");
            document.cookie =
              "inventory_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
            setToken(null);
            setUser(null);

            // If we're on a protected route, redirect to login
            if (
              typeof window !== "undefined" &&
              window.location.pathname !== "/" &&
              window.location.pathname !== "/login" &&
              window.location.pathname !== "/register"
            ) {
              console.log(
                "[AuthContext] Redirecting to login due to invalid token"
              );
              window.location.href = "/login";
            }
          }
        } else {
          console.log("[AuthContext] No stored credentials found");
        }
      } catch (error) {
        console.error("[AuthContext] Auth initialization error:", error);
      } finally {
        console.log("[AuthContext] Auth initialization complete");
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (username, password) => {
    try {
      console.log("[AuthContext] Starting login...", { username });

      // Login to get token
      const data = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      console.log("[AuthContext] Login response received:", data);

      // Check if we got the expected data structure
      if (!data.access_token) {
        console.error("[AuthContext] No access_token in response:", data);
        throw new Error("Invalid server response: missing access_token");
      }

      // Use user from login response if available, otherwise fetch it
      let userData = data.user;
      if (!userData) {
        console.log("[AuthContext] Fetching user details...");
        userData = await apiClient.get(
          AUTH_ENDPOINTS.ME,
          {},
          data.access_token
        );
      }
      console.log("[AuthContext] User data:", userData);

      // Store in localStorage first
      localStorage.setItem("inventory_auth_token", data.access_token);
      localStorage.setItem("inventory_user", JSON.stringify(userData));

      // Set cookie for middleware
      document.cookie = `inventory_auth_token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;

      // Update state
      setToken(data.access_token);
      setUser(userData);

      console.log("[AuthContext] Login complete, navigating to dashboard...");

      // Force immediate navigation using window.location
      // This is more reliable than router.push/replace for login redirects
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("[AuthContext] Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      console.log("[AuthContext] Starting logout...");

      // Clear state first
      setToken(null);
      setUser(null);

      // Clear localStorage
      localStorage.removeItem("inventory_auth_token");
      localStorage.removeItem("inventory_user");

      // Clear all cookies
      document.cookie =
        "inventory_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";

      // Call logout endpoint to clear server-side cookie
      try {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {});
      } catch (error) {
        console.log(
          "[AuthContext] Logout API call failed (this is okay):",
          error.message
        );
      }

      console.log("[AuthContext] Logout complete, redirecting to login...");

      // Force a hard redirect to login page to clear all caches
      window.location.href = "/login";
    } catch (error) {
      console.error("[AuthContext] Logout error:", error);
      // Even if logout fails, redirect to login
      window.location.href = "/login";
    }
  };

  const register = async (data) => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.REGISTER, data);
      await router.replace("/login");
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        authLoading: isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
