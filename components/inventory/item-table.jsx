"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Eye, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
  available: "bg-green-100 text-green-800",
  in_use: "bg-blue-100 text-blue-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  retired: "bg-gray-100 text-gray-800",
};

export function ItemTable({ items, onDelete, canEdit }) {
  return (
    <div className="rounded-xl border-2 border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Quantity</TableHead>
            <TableHead className="font-semibold">Unit</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow
              key={item._id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-semibold">{item.name}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {item.category}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "font-semibold",
                    item.quantity <= (item.minimum_level || 0)
                      ? "text-destructive"
                      : "text-foreground"
                  )}
                >
                  {item.quantity}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.unit_type}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn("font-medium", statusColors[item.status] || "")}
                  variant="outline"
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold">
                ${item.price?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 hover:bg-muted"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-semibold">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/inventory/${item._id}`}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {canEdit && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/inventory/${item._id}/edit`}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {canEdit && (
                      <DropdownMenuItem
                        onClick={() => onDelete(item._id)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {(!items || items.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-base font-medium">No items found</p>
                  <p className="text-sm mt-1">
                    Get started by adding your first item
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
