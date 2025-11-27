"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { assignmentsApi, itemsApi, usersApi } from "@/lib/api"
import { AssignmentForm } from "@/components/assignments/assignment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewAssignmentPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchData() {
      if (!token) return
      
      try {
        const [itemsData, usersData] = await Promise.all([
          itemsApi.getAll(token),
          usersApi.getAll(token)
        ])
        setItems(itemsData)
        setUsers(usersData)
      } catch (error) {
        toast.error("Failed to load data")
      }
    }

    fetchData()
  }, [token])

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await assignmentsApi.create(data, token)
      toast.success("Assignment created successfully")
      router.push("/assignments")
    } catch (error) {
      toast.error(error.message || "Failed to create assignment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/assignments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">New Assignment</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>
            Assign an item to an employee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentForm 
            onSubmit={onSubmit} 
            isLoading={isLoading}
            items={items}
            users={users}
          />
        </CardContent>
      </Card>
    </div>
  )
}
