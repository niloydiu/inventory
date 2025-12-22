/**
 * Central export for all server actions




























































































































































































































































}  );    </div>      </div>        )}          ))            </Card>              </CardContent>                )}                  </Button>                    Delete                    <Trash2 className="mr-2 h-4 w-4" />                  >                    onClick={() => handleDelete(adjustment._id)}                    className="mt-4"                    variant="outline"                    size="sm"                  <Button                {user?.role === "admin" && adjustment.status === "pending" && (                )}                  </div>                    </Button>                      Reject                      <XCircle className="mr-2 h-4 w-4" />                    >                      onClick={() => handleReject(adjustment._id)}                      variant="destructive"                      size="sm"                    <Button                    </Button>                      Approve                      <CheckCircle className="mr-2 h-4 w-4" />                    >                      onClick={() => handleApprove(adjustment._id)}                      variant="default"                      size="sm"                    <Button                  <div className="flex gap-2 mt-4">                {canManage && adjustment.status === "pending" && (                {/* Actions */}                </div>                  <p>Date: {formatDate(adjustment.createdAt)}</p>                  )}                    </p>                      {adjustment.approved_by?.full_name || "Unknown"}                      {adjustment.status === "approved" ? "Approved" : "Rejected"} by:{" "}                    <p>                  {adjustment.approved_by && (                  </p>                    Adjusted by: {adjustment.adjusted_by?.full_name || "Unknown"}                  <p>                <div className="text-sm text-muted-foreground space-y-1">                )}                  </div>                    </p>                      {adjustment.notes}                    <p className="text-sm text-muted-foreground">                    <p className="text-sm font-medium">Notes</p>                  <div className="mb-4">                {adjustment.notes && (                </div>                  </div>                    </p>                      {adjustment.reason.replace(/_/g, " ")}                    <p className="text-sm capitalize">                    <p className="text-sm font-medium">Reason</p>                  <div>                  </div>                    <p className="text-lg">{adjustment.after_quantity}</p>                    <p className="text-sm font-medium">After</p>                  <div>                  </div>                    <p className="text-lg">{adjustment.before_quantity}</p>                    <p className="text-sm font-medium">Before</p>                  <div>                  </div>                    </p>                      {adjustment.quantity}                      {adjustment.adjustment_type === "increase" ? "+" : "-"}                    <p className="text-2xl font-bold">                    <p className="text-sm font-medium">Quantity</p>                  <div>                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">              <CardContent>              </CardHeader>                </div>                  </div>                    {getTypeBadge(adjustment.adjustment_type)}                    {getStatusBadge(adjustment.status)}                  <div className="flex gap-2">                  </div>                    </p>                      SKU: {adjustment.item_id?.sku || "N/A"}                    <p className="text-sm text-muted-foreground">                    </CardTitle>                      {adjustment.item_id?.name || "Unknown Item"}                    <CardTitle className="text-lg">                  <div className="space-y-1">                <div className="flex justify-between items-start">              <CardHeader>            <Card key={adjustment._id}>          adjustments.map((adjustment) => (        ) : (          </Card>            </CardContent>              </p>                No stock adjustments found              <p className="text-center text-muted-foreground">            <CardContent className="p-6">          <Card>        ) : adjustments.length === 0 ? (          </Card>            </CardContent>              <p className="text-center text-muted-foreground">Loading...</p>            <CardContent className="p-6">          <Card>        {loading ? (      <div className="grid gap-4">      {/* Adjustments List */}      </div>        ))}          </Button>            {f.charAt(0).toUpperCase() + f.slice(1)}          >            onClick={() => setFilter(f)}            variant={filter === f ? "default" : "outline"}            key={f}          <Button        {["all", "pending", "approved", "rejected"].map((f) => (      <div className="flex gap-2">      {/* Filter Tabs */}      </div>        )}          </Button>            New Adjustment            <Plus className="mr-2 h-4 w-4" />          <Button onClick={() => router.push("/stock-adjustments/new")}>        {canManage && (        <h1 className="text-3xl font-bold">Stock Adjustments</h1>      <div className="flex justify-between items-center">    <div className="space-y-6">  return (  const canManage = user?.role === "admin" || user?.role === "manager";  };    );      </Badge>        {type}      <Badge variant={type === "increase" ? "success" : "destructive"}>    return (  const getTypeBadge = (type) => {  };    return <Badge variant={variants[status] || "default"}>{status}</Badge>;    };      rejected: "destructive",      approved: "success",      pending: "warning",    const variants = {  const getStatusBadge = (status) => {  };    }      toast.error(result.error || "Failed to delete adjustment");    } else {      fetchAdjustments();      toast.success("Adjustment deleted successfully");    if (result.success) {    const result = await deleteStockAdjustment(id, token);    if (!confirm("Are you sure you want to delete this adjustment?")) return;  const handleDelete = async (id) => {  };    }      toast.error(result.error || "Failed to reject adjustment");    } else {      fetchAdjustments();      toast.success("Adjustment rejected");    if (result.success) {    const result = await rejectStockAdjustment(id, reason, token);    if (!reason) return;    const reason = prompt("Enter rejection reason:");  const handleReject = async (id) => {  };    }      toast.error(result.error || "Failed to approve adjustment");    } else {      fetchAdjustments();      toast.success("Adjustment approved successfully");    if (result.success) {    const result = await approveStockAdjustment(id, token);    if (!confirm("Are you sure you want to approve this adjustment?")) return;  const handleApprove = async (id) => {  };    }      setLoading(false);    } finally {      toast.error("An error occurred");    } catch (error) {      }        toast.error(result.error || "Failed to fetch stock adjustments");      } else {        setAdjustments(result.data?.data || result.data || []);      if (result.success) {      const result = await getAllStockAdjustments(token, params);      const params = filter !== "all" ? { status: filter } : {};    try {    setLoading(true);    if (!token) return;  const fetchAdjustments = async () => {  }, [token, filter]);    fetchAdjustments();  useEffect(() => {  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected  const [loading, setLoading] = useState(true);  const [adjustments, setAdjustments] = useState([]);  const { user, token } = useAuth();  const router = useRouter();export default function StockAdjustmentsPage() {import { formatDate } from "@/lib/utils";import { toast } from "sonner";import { Plus, CheckCircle, XCircle, Trash2 } from "lucide-react";import { Badge } from "@/components/ui/badge";import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";import { Button } from "@/components/ui/button";} from "@/lib/actions/stock-adjustments.actions";  deleteStockAdjustment,  rejectStockAdjustment,  approveStockAdjustment,  getAllStockAdjustments,import {import { useAuth } from "@/lib/auth-context";import { useRouter } from "next/navigation";import { useState, useEffect } from "react"; */

// Auth actions
export * from "./auth.actions";

// Items actions
export * from "./items.actions";

// Assignments actions
export * from "./assignments.actions";

// Livestock actions
export * from "./livestock.actions";

// Feeds actions
export * from "./feeds.actions";

// Dashboard actions
export * from "./dashboard.actions";

// Users actions
export * from "./users.actions";

// Locations actions
export * from "./locations.actions";

// Reports actions
export * from "./reports.actions";

// Audit actions
export * from "./audit.actions";

// Suppliers actions
export * from "./suppliers.actions";

// Purchase Orders actions
export * from "./purchase-orders.actions";

// Categories actions
export * from "./categories.actions";

// Stock Transfers actions
export * from "./stock-transfers.actions";

// Stock Movements actions
export * from "./stock-movements.actions";

// Stock Adjustments actions
export * from "./stock-adjustments.actions";

// Notifications actions
export * from "./notifications.actions";

// Product Assignments actions
export * from "./product-assignments.actions";

// Export actions
export * from "./export.actions";
