"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Eye,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import apiClient from "@/lib/api-client";

const movementTypeColors = {
  purchase: "bg-green-100 text-green-800",
  sale: "bg-blue-100 text-blue-800",
  transfer: "bg-purple-100 text-purple-800",
  adjustment: "bg-yellow-100 text-yellow-800",
  return: "bg-orange-100 text-orange-800",
  damage: "bg-red-100 text-red-800",
};

const movementTypeIcons = {
  purchase: TrendingUp,
  sale: TrendingDown,
  transfer: Activity,
  adjustment: Activity,
  return: Activity,
  damage: TrendingDown,
};

export default function StockMovementsPage() {
  const { token } = useAuth();
  const [movements, setMovements] = useState([]);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDialog, setViewDialog] = useState(null);
  const [filters, setFilters] = useState({
    movement_type: "",
    item_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchMovements();
    fetchItems();
    fetchLocations();
  }, [token]);

  async function fetchMovements() {
    if (!token) return;
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const response = await apiClient.get(
        `/api/stock-movements?${queryParams}`,
        {},
        token
      );
      setMovements(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      toast.error("Failed to load stock movements");
    } finally {
      setLoading(false);
    }
  }

  async function fetchItems() {
    if (!token) return;
    try {
      const response = await apiClient.get("/api/items", {}, token);
      setItems(
        Array.isArray(response)
          ? response
          : response?.items || response?.data || []
      );
    } catch (error) {
      console.error("Failed to load items");
    }
  }

  async function fetchLocations() {
    if (!token) return;
    try {
      const response = await apiClient.get("/api/locations", {}, token);
      setLocations(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      console.error("Failed to load locations");
    }
  }

  function handleFilter() {
    fetchMovements();
  }

  function clearFilters() {
    setFilters({
      movement_type: "",
      item_id: "",
      location_id: "",
      start_date: "",
      end_date: "",
    });
    setTimeout(() => fetchMovements(), 100);
  }

  const stats = {
    total: movements.length,
    purchases: movements.filter((m) => m.movement_type === "purchase").length,
    sales: movements.filter((m) => m.movement_type === "sale").length,
    transfers: movements.filter((m) => m.movement_type === "transfer").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Stock Movements</h2>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Activity className="mr-2 h-4 w-4" />
            {stats.total} Total Movements
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Movements
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.purchases}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <TrendingDown className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.sales}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfers</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.transfers}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter stock movements by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <Label>Movement Type</Label>
                <Select
                  value={filters.movement_type}
                  onValueChange={(v) =>
                    setFilters({ ...filters, movement_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Item</Label>
                <Select
                  value={filters.item_id}
                  onValueChange={(v) => setFilters({ ...filters, item_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All items</SelectItem>
                    {items.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Location</Label>
                <Select
                  value={filters.location_id}
                  onValueChange={(v) =>
                    setFilters({ ...filters, location_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc._id} value={loc._id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) =>
                    setFilters({ ...filters, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) =>
                    setFilters({ ...filters, end_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleFilter}>Apply Filters</Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Movements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Movement History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => {
                    const Icon =
                      movementTypeIcons[movement.movement_type] || Activity;
                    return (
                      <TableRow key={movement._id}>
                        <TableCell>
                          {movement.movement_date
                            ? format(
                                new Date(movement.movement_date),
                                "MMM dd, yyyy HH:mm"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              movementTypeColors[movement.movement_type]
                            }
                            variant="outline"
                          >
                            <Icon className="mr-1 h-3 w-3" />
                            {movement.movement_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {movement.item_id?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              movement.quantity_change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {movement.quantity_change > 0 ? "+" : ""}
                            {movement.quantity_change}
                          </span>
                        </TableCell>
                        <TableCell>
                          {movement.location_id?.name || "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {movement.reference || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewDialog(movement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {movements.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        No stock movements found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Detail Dialog */}
        <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Movement Details</DialogTitle>
              <DialogDescription>Stock movement information</DialogDescription>
            </DialogHeader>
            {viewDialog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Movement Type
                    </Label>
                    <div className="mt-1">
                      <Badge
                        className={movementTypeColors[viewDialog.movement_type]}
                        variant="outline"
                      >
                        {viewDialog.movement_type}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date & Time</Label>
                    <p className="mt-1">
                      {viewDialog.movement_date
                        ? format(new Date(viewDialog.movement_date), "PPP p")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Item</Label>
                    <p className="text-lg font-medium mt-1">
                      {viewDialog.item_id?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Quantity Change
                    </Label>
                    <p
                      className={`text-2xl font-bold mt-1 ${
                        viewDialog.quantity_change > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {viewDialog.quantity_change > 0 ? "+" : ""}
                      {viewDialog.quantity_change}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="mt-1">
                      {viewDialog.location_id?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">New Balance</Label>
                    <p className="text-lg font-medium mt-1">
                      {new Intl.NumberFormat("en-US").format(
                        viewDialog.quantity_after || 0
                      )}
                    </p>
                  </div>
                </div>

                {viewDialog.reference && (
                  <div>
                    <Label className="text-muted-foreground">Reference</Label>
                    <p className="font-mono mt-1">{viewDialog.reference}</p>
                  </div>
                )}

                {viewDialog.performed_by && (
                  <div>
                    <Label className="text-muted-foreground">
                      Performed By
                    </Label>
                    <p className="mt-1">
                      {viewDialog.performed_by?.username || "N/A"}
                    </p>
                  </div>
                )}

                {viewDialog.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="whitespace-pre-wrap mt-1">
                      {viewDialog.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
