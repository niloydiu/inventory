"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { dashboardApi } from "@/lib/api"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentItems } from "@/components/dashboard/recent-items"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { toast } from "sonner"

export default function DashboardPage() {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token) return
      
      try {
        const statsData = await dashboardApi.getStats(token)
        setStats(statsData)
        
        const recentData = await dashboardApi.getRecentItems(token)
        setRecentItems(recentData.recentItems)
        
      } catch (error) {
        console.error(error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <StatsCards stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CategoryChart data={stats?.category_stats} />
        <RecentItems items={recentItems} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <LowStockAlert items={stats?.low_stock_items} />
      </div>
    </div>
  )
}
