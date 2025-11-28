"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

const actionColors = {
  create: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800",
  delete: "bg-red-100 text-red-800",
  login: "bg-purple-100 text-purple-800",
  logout: "bg-gray-100 text-gray-800",
}

export function AuditTable({ logs }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log._id}>
              <TableCell>
                <Badge className={actionColors[log.action] || ""} variant="outline">
                  {log.action?.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{log.username || 'System'}</TableCell>
              <TableCell>{log.entity_type || log.resource_type || '-'}</TableCell>
              <TableCell className="max-w-md truncate">
                {log.details ? (typeof log.details === 'string' ? log.details : JSON.stringify(log.details)) : log.description || '-'}
              </TableCell>
              <TableCell>
                {log.created_at ? format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss') : '-'}
              </TableCell>
            </TableRow>
          ))}
          {(!logs || logs.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No audit logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
