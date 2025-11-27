"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { assignmentsApi } from "@/lib/api"
import { AssignmentTable } from "@/components/assignments/assignment-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AssignmentsPage() {
  const { token } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [returnDialog, setReturnDialog] = useState(null)
  const [returnQuantity, setReturnQuantity] = useState("")

  useEffect(() => {
    fetchAssignments()
  }, [token])

  async function fetchAssignments() {
    if (!token) return
    
    try {
      const data = await assignmentsApi.getAll(token)
      setAssignments(data)
    } catch (error) {
      toast.error("Failed to load assignments")
    } finally {
      setLoading(false)
    }
  }

  async function handleReturn() {
    if (!returnDialog) return
    
    const qty = parseInt(returnQuantity)
    if (isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }
    
    if (qty > returnDialog.remaining_quantity) {
      toast.error("Return quantity cannot exceed remaining quantity")
      return
    }
    
    try {
      await assignmentsApi.return(returnDialog.id, { return_count: qty }, token)
      toast.success("Item returned successfully")
      setReturnDialog(null)
      setReturnQuantity("")
      fetchAssignments()
    } catch (error) {
      toast.error("Failed to return item")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <Button asChild>
            <Link href="/assignments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Link>
          </Button>
        </div>
        
        <AssignmentTable 
        assignments={assignments} 
        onReturn={(assignment) => {
          setReturnDialog(assignment)
          setReturnQuantity(assignment.remaining_quantity?.toString() || "")
        }}
      />
      
      <Dialog open={!!returnDialog} onOpenChange={() => setReturnDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Item</DialogTitle>
            <DialogDescription>
              Enter the quantity to return for this assignment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Item</Label>
              <p className="text-sm text-muted-foreground">{returnDialog?.item_name}</p>
            </div>
            <div className="space-y-2">
              <Label>Remaining Quantity</Label>
              <p className="text-sm text-muted-foreground">{returnDialog?.remaining_quantity}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-qty">Return Quantity</Label>
              <Input
                id="return-qty"
                type="number"
                min="1"
                max={returnDialog?.remaining_quantity}
                value={returnQuantity}
                onChange={(e) => setReturnQuantity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleReturn}>Return Items</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
