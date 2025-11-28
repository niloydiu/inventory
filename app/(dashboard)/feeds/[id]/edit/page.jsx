"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { feedsApi } from "@/lib/api"
import { FeedForm } from "@/components/feeds/feed-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EditFeedPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const [feed, setFeed] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      if (!token || !params.id) return
      
      try {
        const data = await feedsApi.getById(params.id, token)
        setFeed(data)
      } catch (error) {
        toast.error("Failed to load feed")
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [token, params.id])

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await feedsApi.update(params.id, data, token)
      toast.success("Feed updated successfully")
      router.push("/feeds")
    } catch (error) {
      toast.error(error.message || "Failed to update feed")
    } finally {
      setIsLoading(false)
    }
  }

  // Transform feed data to ensure all form fields have proper default values
  const getFormDefaultValues = () => {
    if (!feed) return undefined;
    
    return {
      name: feed.name || "",
      feed_type: feed.feed_type || "Other",
      quantity: feed.quantity ? feed.quantity.toString() : "",
      unit_type: feed.unit_type || "",
      unit_cost: feed.unit_cost ? feed.unit_cost.toString() : "",
      supplier_id: feed.supplier_id || "",
      production_date: feed.production_date ? feed.production_date.split('T')[0] : "",
      expiry_date: feed.expiry_date ? feed.expiry_date.split('T')[0] : "",
      nutritional_info: feed.nutritional_info || "",
      storage_location: feed.storage_location || "",
      notes: feed.notes || "",
    };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/feeds">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Feed</h2>
        </div>
        
        <Card>
        <CardHeader>
          <CardTitle>Feed Details</CardTitle>
          <CardDescription>
            Update the information below to modify the feed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedForm 
            defaultValues={getFormDefaultValues()} 
            onSubmit={onSubmit} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
