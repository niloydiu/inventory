"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all auth data
    localStorage.removeItem("inventory_auth_token")
    localStorage.removeItem("inventory_user")
    document.cookie = "inventory_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    
    // Redirect to login
    setTimeout(() => {
      router.replace("/login")
    }, 500)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Logging out...</p>
    </div>
  )
}
