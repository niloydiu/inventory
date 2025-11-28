"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    // Use the centralized logout function
    logout();
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Logging out...</p>
    </div>
  );
}
