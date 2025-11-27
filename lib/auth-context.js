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
      const storedToken = localStorage.getItem("inventory_auth_token");
      const storedUser = localStorage.getItem("inventory_user");

      if (storedToken && storedUser) {
        try {
          // Validate token by fetching current user
          const userData = await apiClient.get(AUTH_ENDPOINTS.ME, {}, storedToken);
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          // Token is invalid or expired, clear everything
          console.log("Token validation failed:", error.message);
          localStorage.removeItem("inventory_auth_token");
          localStorage.removeItem("inventory_user");
          document.cookie = "inventory_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = async (username, password) => {
    try {
      // Login to get token
      const data = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
        username,
        password,
      });

      // Fetch user details
      const userData = await apiClient.get(AUTH_ENDPOINTS.ME, {}, data.access_token);

      setToken(data.access_token);
      setUser(userData);
      localStorage.setItem("inventory_auth_token", data.access_token);
      localStorage.setItem("inventory_user", JSON.stringify(userData));

      // Set cookie for middleware
      document.cookie = `inventory_auth_token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;

      // Navigate to dashboard
      await router.replace("/dashboard");
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("inventory_auth_token");
    localStorage.removeItem("inventory_user");
    document.cookie =
      "inventory_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    await router.replace("/login");
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
