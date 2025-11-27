"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { livestockApi } from "@/lib/api"
import { LivestockForm } from "@/components/livestock/livestock-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EditLivestockPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const [livestock, setLivestock] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLivestock() {
      if (!token || !params.id) return
      
      try {
        const data = await livestockApi.getById(params.id, token)
        setLivestock(data)
      } catch (error) {
        toast.error("Failed to load livestock")
      } finally {
        setLoading(false)
      }
    }

    fetchLivestock()
  }, [token, params.id])

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await livestockApi.update(params.id, data, token)
      toast.success("Livestock updated successfully")
      router.push("/livestock")
    } catch (error) {
      toast.error(error.message || "Failed to update livestock")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/livestock">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Livestock</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Livestock Details</CardTitle>
          <CardDescription>
            Update the information below to modify the animal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LivestockForm 
            defaultValues={livestock} 
            onSubmit={onSubmit} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  )
}
