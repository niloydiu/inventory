"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { DASHBOARD_ENDPOINTS } from "@/lib/config/api-endpoints";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentItems } from "@/components/dashboard/recent-items";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { toast } from "sonner";

export function DashboardContent() {
  const { token, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token) {
        console.log("No token available");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching dashboard stats...");
        console.log("API URL:", DASHBOARD_ENDPOINTS.STATS);
        const data = await apiClient.get(DASHBOARD_ENDPOINTS.STATS, {}, token);
        console.log("Dashboard data received:", data);
        setStats(data);
        setError(null);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setError(error.message);
        toast.error("Failed to load dashboard: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && token) {
      fetchDashboardData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [token, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Auth: {authLoading ? "Loading" : "Done"}, Data:{" "}
            {loading ? "Loading" : "Done"}
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            Please log in to view the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-medium">
            Error loading dashboard
          </p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">No dashboard data available</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CategoryChart data={stats?.category_stats} />
        <RecentItems items={stats?.recent_items || []} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <LowStockAlert items={stats?.low_stock_items || []} />
      </div>
    </div>
  );
}
