"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { itemsApi } from "@/lib/api"
import { ItemForm } from "@/components/inventory/item-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItem() {
      if (!token || !params.id) return
      
      try {
        const data = await itemsApi.getById(params.id, token)
        setItem(data)
      } catch (error) {
        toast.error("Failed to load item")
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [token, params.id])

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await itemsApi.update(params.id, data, token)
      toast.success("Item updated successfully")
      router.push("/inventory")
    } catch (error) {
      toast.error(error.message || "Failed to update item")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/inventory">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Item</h2>
        </div>
        
        <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Update the information below to modify the item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm 
            defaultValues={item} 
            onSubmit={onSubmit} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
