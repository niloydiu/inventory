"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { feedsApi } from "@/lib/api"
import { FeedForm } from "@/components/feeds/feed-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewFeedPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await feedsApi.create(data, token)
      toast.success("Feed added successfully")
      router.push("/feeds")
    } catch (error) {
      toast.error(error.message || "Failed to add feed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/feeds">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Add New Feed</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Feed Details</CardTitle>
          <CardDescription>
            Fill in the information below to add a new feed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedForm onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
