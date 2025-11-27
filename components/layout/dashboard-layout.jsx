"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export default function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed on desktop */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <Sidebar className="fixed top-0 left-0 w-64 h-screen" />
      </aside>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
