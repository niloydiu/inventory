"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { PageLoader } from "@/components/ui/loader";
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
        const response = await apiClient.get(
          DASHBOARD_ENDPOINTS.STATS,
          {},
          token
        );
        console.log("Dashboard response received:", response);
        setStats(response && response.success ? response.data : null);
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
    return <PageLoader text="Loading dashboard..." />;
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-10 w-10 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Authentication Required
          </h3>
          <p className="text-muted-foreground">
            Please log in to view the dashboard and access your inventory data.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-10 w-10 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-destructive mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
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
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            No Data Available
          </h3>
          <p className="text-muted-foreground mb-6">
            Dashboard data is not available at the moment.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-2">
            Overview of your inventory management system
          </p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <CategoryChart data={stats?.category_stats} />
        <RecentItems items={stats?.recent_items || []} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <LowStockAlert items={stats?.low_stock_items || []} />
      </div>
    </div>
  );
}
