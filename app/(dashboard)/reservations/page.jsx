"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllReservations } from "@/lib/actions/reservations.actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Calendar } from "lucide-react"
import { format } from "date-fns"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function ReservationsPage() {
  const { token } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [token])

  async function fetchReservations() {
    if (!token) return
    
    try {
      const result = await getAllReservations(token)
      if (result.success) {
        setReservations(result.data)
      } else {
        toast.error(result.error || "Failed to load reservations")
      }
    } catch (error) {
      toast.error("Failed to load reservations")
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
        <h2 className="text-3xl font-bold tracking-tight">Reservations</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              All Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Reserved By</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations?.map((reservation) => (
                    <TableRow key={reservation._id}>
                      <TableCell className="font-medium">
                        {reservation.item_id?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {reservation.user_id?.username || 'N/A'}
                      </TableCell>
                      <TableCell>{reservation.quantity}</TableCell>
                      <TableCell>
                        {reservation.start_date ? format(new Date(reservation.start_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {reservation.end_date ? format(new Date(reservation.end_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[reservation.status]} variant="outline">
                          {reservation.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!reservations || reservations.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No reservations found
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
