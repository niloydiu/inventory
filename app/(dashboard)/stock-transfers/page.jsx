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
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Edit,
  Trash,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import apiClient from "@/lib/api-client";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  in_transit: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function StockTransfersPage() {
  const { token, user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDialog, setFormDialog] = useState(null);
  const [viewDialog, setViewDialog] = useState(null);
  const [formData, setFormData] = useState({});
  const [transferItems, setTransferItems] = useState([]);

  useEffect(() => {
    fetchTransfers();
    fetchLocations();
    fetchItems();
  }, [token]);

  async function fetchTransfers() {
    if (!token) return;
    try {
      const response = await apiClient.get("/api/stock-transfers", {}, token);
      setTransfers(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      toast.error("Failed to load stock transfers");
    } finally {
      setLoading(false);
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

  async function handleSubmit() {
    try {
      const dataToSubmit = {
        ...formData,
        items: transferItems,
        created_by: user?.userId,
      };

      if (formDialog === "new") {
        await apiClient.post("/api/stock-transfers", dataToSubmit, token);
        toast.success("Stock transfer created successfully");
      } else {
        await apiClient.put(
          `/api/stock-transfers/${formDialog}`,
          dataToSubmit,
          token
        );
        toast.success("Stock transfer updated successfully");
      }

      setFormDialog(null);
      setFormData({});
      setTransferItems([]);
      fetchTransfers();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this transfer?")) return;
    try {
      await apiClient.delete(`/api/stock-transfers/${id}`, token);
      toast.success("Transfer deleted successfully");
      fetchTransfers();
    } catch (error) {
      toast.error("Failed to delete transfer");
    }
  }

  async function handleApprove(id) {
    try {
      await apiClient.post(`/api/stock-transfers/${id}/approve`, {}, token);
      toast.success("Transfer approved");
      fetchTransfers();
    } catch (error) {
      toast.error("Failed to approve transfer");
    }
  }

  async function handleComplete(id) {
    try {
      await apiClient.post(`/api/stock-transfers/${id}/complete`, {}, token);
      toast.success("Transfer completed");
      fetchTransfers();
    } catch (error) {
      toast.error("Failed to complete transfer");
    }
  }

  function openEditDialog(transfer) {
    setFormDialog(transfer._id);
    setFormData({
      from_location_id: transfer.from_location_id?._id || "",
      to_location_id: transfer.to_location_id?._id || "",
      transfer_date: transfer.transfer_date
        ? format(new Date(transfer.transfer_date), "yyyy-MM-dd")
        : "",
      notes: transfer.notes || "",
    });
    setTransferItems(transfer.items || []);
  }

  function addTransferItem() {
    setTransferItems([...transferItems, { item_id: "", quantity: 1 }]);
  }

  function removeTransferItem(index) {
    setTransferItems(transferItems.filter((_, i) => i !== index));
  }

  function updateTransferItem(index, field, value) {
    const updated = [...transferItems];
    updated[index][field] = value;
    setTransferItems(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Stock Transfers</h2>
          <Button
            onClick={() => {
              setFormDialog("new");
              setFormData({ status: "pending" });
              setTransferItems([]);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          {["pending", "approved", "in_transit", "completed", "cancelled"].map(
            (status) => (
              <Card key={status}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {status.replace("_", " ")}
                  </CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {transfers.filter((t) => t.status === status).length}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* Transfers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Stock Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer ID</TableHead>
                    <TableHead>From Location</TableHead>
                    <TableHead>To Location</TableHead>
                    <TableHead>Transfer Date</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer._id}>
                      <TableCell className="font-mono">
                        {transfer._id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        {transfer.from_location_id?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {transfer.to_location_id?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {transfer.transfer_date
                          ? format(
                              new Date(transfer.transfer_date),
                              "MMM dd, yyyy"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>{transfer.items?.length || 0}</TableCell>
                      <TableCell>
                        <Badge
                          className={statusColors[transfer.status]}
                          variant="outline"
                        >
                          {transfer.status?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewDialog(transfer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transfer.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(transfer._id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(transfer)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {transfer.status === "in_transit" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleComplete(transfer._id)}
                            >
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transfer._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {transfers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        No stock transfers found
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Stock Transfer Details</DialogTitle>
              <DialogDescription>
                Transfer #{viewDialog?._id?.slice(-8)}
              </DialogDescription>
            </DialogHeader>
            {viewDialog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      From Location
                    </Label>
                    <p className="text-lg font-medium">
                      {viewDialog.from_location_id?.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To Location</Label>
                    <p className="text-lg font-medium">
                      {viewDialog.to_location_id?.name}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Transfer Date
                    </Label>
                    <p>
                      {viewDialog.transfer_date
                        ? format(new Date(viewDialog.transfer_date), "PPP")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge
                      className={statusColors[viewDialog.status]}
                      variant="outline"
                    >
                      {viewDialog.status?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Items</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewDialog.items?.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.item_id?.name || "N/A"}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {viewDialog.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="whitespace-pre-wrap">{viewDialog.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Form Dialog */}
        <Dialog
          open={!!formDialog}
          onOpenChange={() => {
            setFormDialog(null);
            setFormData({});
            setTransferItems([]);
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {formDialog === "new"
                  ? "New Stock Transfer"
                  : "Edit Stock Transfer"}
              </DialogTitle>
              <DialogDescription>Enter transfer details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Location *</Label>
                  <Select
                    value={formData.from_location_id || ""}
                    onValueChange={(v) =>
                      setFormData({ ...formData, from_location_id: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc._id} value={loc._id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To Location *</Label>
                  <Select
                    value={formData.to_location_id || ""}
                    onValueChange={(v) =>
                      setFormData({ ...formData, to_location_id: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc._id} value={loc._id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Transfer Date *</Label>
                <Input
                  type="date"
                  value={formData.transfer_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, transfer_date: e.target.value })
                  }
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Items *</Label>
                  <Button type="button" size="sm" onClick={addTransferItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {transferItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 mb-2 items-end"
                  >
                    <div className="col-span-8">
                      <Select
                        value={item.item_id}
                        onValueChange={(v) =>
                          updateTransferItem(index, "item_id", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((it) => (
                            <SelectItem key={it._id} value={it._id}>
                              {it.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          updateTransferItem(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTransferItem(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {formDialog === "new" ? "Create Transfer" : "Update Transfer"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
