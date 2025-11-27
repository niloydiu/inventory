"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import apiClient from "@/lib/api-client"
import { DASHBOARD_ENDPOINTS } from "@/lib/config/api-endpoints"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentItems } from "@/components/dashboard/recent-items"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { toast } from "sonner"

export function DashboardContent() {
  const { token, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token) {
        setLoading(false)
        return
      }
      
      try {
        console.log("Fetching dashboard stats with token:", token ? "Token exists" : "No token")
        const data = await apiClient.get(DASHBOARD_ENDPOINTS.STATS, {}, token)
        console.log("Dashboard data received:", data)
        setStats(data)
      } catch (error) {
        console.error("Dashboard fetch error:", error)
        toast.error("Failed to load dashboard data: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchDashboardData()
    }
  }, [token, authLoading])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view the dashboard.</p>
        </div>
      </div>
    )
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
  )
}
