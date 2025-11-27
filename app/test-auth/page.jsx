"use client";

import { useAuth } from "@/lib/auth-context";

export default function TestAuthPage() {
  const { user, token, isLoading, isAuthenticated } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <div className="space-y-2">
        <p>
          <strong>isLoading:</strong> {isLoading ? "true" : "false"}
        </p>
        <p>
          <strong>isAuthenticated:</strong> {isAuthenticated ? "true" : "false"}
        </p>
        <p>
          <strong>Has Token:</strong> {token ? "yes" : "no"}
        </p>
        <p>
          <strong>Has User:</strong> {user ? "yes" : "no"}
        </p>
        {user && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        )}
        {token && (
          <div className="mt-4 p-4 bg-gray-100 rounded break-all">
            <p>
              <strong>Token:</strong> {token.substring(0, 50)}...
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">localStorage Check</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {typeof window !== "undefined"
            ? JSON.stringify(
                {
                  token:
                    localStorage
                      .getItem("inventory_auth_token")
                      ?.substring(0, 50) + "...",
                  user: localStorage.getItem("inventory_user"),
                },
                null,
                2
              )
            : "Server side"}
        </pre>
      </div>
    </div>
  );
}
