"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { livestockApi } from "@/lib/api"
import { LivestockForm } from "@/components/livestock/livestock-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewLivestockPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await livestockApi.create(data, token)
      toast.success("Livestock added successfully")
      router.push("/livestock")
    } catch (error) {
      toast.error(error.message || "Failed to add livestock")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/livestock">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Add New Livestock</h2>
        </div>
        
        <Card>
        <CardHeader>
          <CardTitle>Livestock Details</CardTitle>
          <CardDescription>
            Fill in the information below to add a new animal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LivestockForm onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
