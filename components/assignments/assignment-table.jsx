"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "Partially Returned": "bg-yellow-100 text-yellow-800",
  Returned: "bg-gray-100 text-gray-800",
};

export function AssignmentTable({ assignments, onReturn }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Assigned Qty</TableHead>
            <TableHead>Returned Qty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments?.map((assignment) => (
            <TableRow key={assignment._id}>
              <TableCell className="font-medium">
                {assignment.item_name ||
                  assignment.item_id?.name ||
                  "Unknown Item"}
              </TableCell>
              <TableCell>
                {assignment.employee_name ||
                  assignment.assigned_to_user_id?.full_name ||
                  assignment.assigned_to_user_id?.username ||
                  "Unknown User"}
              </TableCell>
              <TableCell>{assignment.quantity || 0}</TableCell>
              <TableCell>
                {assignment.actual_return_date ? assignment.quantity : 0}
              </TableCell>
              <TableCell>
                <Badge
                  className={statusColors[assignment.status] || ""}
                  variant="outline"
                >
                  {assignment.status}
                </Badge>
              </TableCell>
              <TableCell>
                {assignment.assignment_date
                  ? format(new Date(assignment.assignment_date), "MMM dd, yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                {assignment.status !== "returned" &&
                  assignment.status !== "Returned" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReturn(assignment)}
                    >
                      Return
                    </Button>
                  )}
              </TableCell>
            </TableRow>
          ))}
          {(!assignments || assignments.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No assignments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
