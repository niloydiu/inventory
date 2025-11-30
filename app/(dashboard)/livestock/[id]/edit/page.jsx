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
import { PageLoader } from "@/components/ui/loader";

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

  // Transform livestock data to ensure all form fields have proper default values
  const getFormDefaultValues = () => {
    if (!livestock) return undefined;
    
    return {
      name: livestock.name || "",
      species: livestock.species || "Cow",
      breed: livestock.breed || "",
      gender: livestock.gender ? livestock.gender.charAt(0).toUpperCase() + livestock.gender.slice(1) : "Male",
      age: livestock.date_of_birth ? 
        Math.floor((new Date() - new Date(livestock.date_of_birth)) / (1000 * 60 * 60 * 24 * 30.44)).toString() : "",
      weight: livestock.weight ? livestock.weight.toString() : "",
      health_status: livestock.health_status || "healthy",
      status: "active", // Default status since model doesn't have this field
      description: livestock.notes || "",
      tag_number: livestock.tag_number || "",
      purchase_price: livestock.purchase_price ? livestock.purchase_price.toString() : "",
    };
  };

  if (loading) {
    return <PageLoader />;
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
