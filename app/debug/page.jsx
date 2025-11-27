"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";

export default function DebugPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [apiTest, setApiTest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const storedToken = localStorage.getItem("inventory_auth_token");
        const storedUser = localStorage.getItem("inventory_user");

        setApiTest({
          localStorage: {
            token: storedToken ? "EXISTS" : "MISSING",
            user: storedUser ? "EXISTS" : "MISSING",
          },
          context: {
            token: token ? "EXISTS" : "MISSING",
            user: user ? JSON.stringify(user) : "MISSING",
            isAuthenticated,
            isLoading,
          },
        });

        if (token) {
          const dashStats = await apiClient.get("/dashboard/stats", {}, token);
          setApiTest((prev) => ({
            ...prev,
            apiCall: "SUCCESS",
            stats: dashStats,
          }));
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (!isLoading) {
      testAPI();
    }
  }, [token, user, isAuthenticated, isLoading]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>

      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Auth Context</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(
              {
                user,
                token: token ? "EXISTS" : "MISSING",
                isAuthenticated,
                isLoading,
              },
              null,
              2
            )}
          </pre>
        </div>

        {apiTest && (
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-2">API Test Results</h2>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="border border-red-500 p-4 rounded bg-red-50">
            <h2 className="font-semibold mb-2 text-red-700">Error</h2>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Browser Info</h2>
          <p className="text-sm">
            Current URL:{" "}
            {typeof window !== "undefined" ? window.location.href : "N/A"}
          </p>
          <p className="text-sm">
            User Agent:{" "}
            {typeof window !== "undefined" ? window.navigator.userAgent : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
