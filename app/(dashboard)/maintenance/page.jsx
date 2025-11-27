"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllMaintenance, getUpcomingMaintenance } from "@/lib/actions/maintenance.actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Wrench, Calendar } from "lucide-react"
import { format } from "date-fns"

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export default function MaintenancePage() {
  const { token } = useAuth()
  const [maintenance, setMaintenance] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMaintenance()
  }, [token])

  async function fetchMaintenance() {
    if (!token) return
    
    try {
      const [allResult, upcomingResult] = await Promise.all([
        getAllMaintenance(token),
        getUpcomingMaintenance(token)
      ])
      
      if (allResult.success) {
        setMaintenance(allResult.data)
      }
      
      if (upcomingResult.success) {
        setUpcoming(upcomingResult.data)
      }
    } catch (error) {
      toast.error("Failed to load maintenance records")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Maintenance Records</h2>
        
        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Maintenance (Next 30 Days)
            </CardTitle>
            <CardDescription>{upcoming.length} scheduled tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcoming?.map((record) => (
                <div key={record._id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{record.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.item_id?.name} - {format(new Date(record.scheduled_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={priorityColors[record.priority]} variant="outline">
                      {record.priority}
                    </Badge>
                    <Badge className={statusColors[record.status]} variant="outline">
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!upcoming || upcoming.length === 0) && (
                <p className="text-center text-sm text-muted-foreground">No upcoming maintenance</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* All Maintenance Records */}
        <Card>
          <CardHeader>
            <CardTitle>All Maintenance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance?.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell className="font-medium">{record.title}</TableCell>
                      <TableCell>{record.item_id?.name || 'N/A'}</TableCell>
                      <TableCell>{record.maintenance_type}</TableCell>
                      <TableCell>
                        {record.scheduled_date ? format(new Date(record.scheduled_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[record.priority]} variant="outline">
                          {record.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[record.status]} variant="outline">
                          {record.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!maintenance || maintenance.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No maintenance records found
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
