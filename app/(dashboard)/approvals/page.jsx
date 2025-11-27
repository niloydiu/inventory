"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllApprovals, getPendingApprovals, approveRequest, rejectRequest } from "@/lib/actions/approvals.actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-red-100 text-red-800",
}

export default function ApprovalsPage() {
  const { token, user } = useAuth()
  const [approvals, setApprovals] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  const canApprove = user?.role === 'admin' || user?.role === 'manager'

  useEffect(() => {
    fetchApprovals()
  }, [token])

  async function fetchApprovals() {
    if (!token) return
    
    try {
      const [allResult, pendingResult] = await Promise.all([
        getAllApprovals(token),
        getPendingApprovals(token)
      ])
      
      if (allResult.success) {
        setApprovals(allResult.data)
      }
      
      if (pendingResult.success) {
        setPending(pendingResult.data)
      }
    } catch (error) {
      toast.error("Failed to load approvals")
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id) {
    const notes = prompt("Add approval notes (optional):") 
    
    try {
      const result = await approveRequest(id, notes, token)
      if (result.success) {
        toast.success("Request approved successfully")
        fetchApprovals()
      } else {
        toast.error(result.error || "Failed to approve request")
      }
    } catch (error) {
      toast.error("Failed to approve request")
    }
  }

  async function handleReject(id) {
    const notes = prompt("Add rejection reason:") 
    if (!notes) return
    
    try {
      const result = await rejectRequest(id, notes, token)
      if (result.success) {
        toast.success("Request rejected")
        fetchApprovals()
      } else {
        toast.error(result.error || "Failed to reject request")
      }
    } catch (error) {
      toast.error("Failed to reject request")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Approvals</h2>
        
        {/* Pending Approvals */}
        {canApprove && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Pending Approvals
              </CardTitle>
              <CardDescription>{pending.length} requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pending?.map((approval) => (
                  <div key={approval._id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <p className="font-medium">{approval.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Requested by: {approval.requested_by?.username} - {approval.request_type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={priorityColors[approval.priority]} variant="outline">
                        {approval.priority}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(approval._id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(approval._id)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {(!pending || pending.length === 0) && (
                  <p className="text-center text-sm text-muted-foreground">No pending approvals</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* All Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>All Approval Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals?.map((approval) => (
                    <TableRow key={approval._id}>
                      <TableCell className="font-medium">{approval.title}</TableCell>
                      <TableCell>{approval.request_type}</TableCell>
                      <TableCell>{approval.requested_by?.username || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={priorityColors[approval.priority]} variant="outline">
                          {approval.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {approval.created_at ? format(new Date(approval.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[approval.status]} variant="outline">
                          {approval.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!approvals || approvals.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No approval requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
