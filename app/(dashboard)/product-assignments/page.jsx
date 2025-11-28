"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  PackageCheck,
  Clock,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DetailViewDialog } from "@/components/ui/detail-view-dialog";
import api from "@/lib/api-client";
import { toast } from "sonner";

export default function ProductAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [formData, setFormData] = useState({
    item_id: "",
    employee_id: "",
    quantity: 1,
    expected_return_date: "",
    purpose: "",
    issue_remarks: "",
    condition_on_issue: "good",
  });

  const [returnData, setReturnData] = useState({
    condition_on_return: "good",
    return_remarks: "",
    current_value: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignments();
    }, 300); // Debounce API calls

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchTerm, pagination.page, pagination.limit]);

  useEffect(() => {
    // Fetch initial data only once
    fetchStats();
    fetchItems();
    fetchEmployees();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get(`/product-assignments?${params}`);
      if (response && response.success) {
        setAssignments(response.data || []);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/product-assignments/stats");
      if (response && response.success) {
        setStats(response.stats || {});
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get("/items?limit=1000&status=active");
      if (response && response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/users?limit=1000&role=employee,manager");
      if (response && response.success) {
        setEmployees(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/product-assignments", formData);
      if (response && response.success) {
        toast.success("Product assigned successfully");
        setShowAssignDialog(false);
        resetForm();
        fetchAssignments();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.message || "Failed to assign product");
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/product-assignments/${selectedAssignment._id}/return`,
        returnData
      );
      if (response && response.success) {
        toast.success("Product returned successfully");
        setShowReturnDialog(false);
        setReturnData({
          condition_on_return: "good",
          return_remarks: "",
          current_value: "",
        });
        fetchAssignments();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.message || "Failed to return product");
    }
  };

  const handleAcknowledge = async (assignmentId) => {
    try {
      const response = await api.post(
        `/product-assignments/${assignmentId}/acknowledge`,
        { signature: "Digital Signature" }
      );
      if (response && response.success) {
        toast.success("Assignment acknowledged");
        fetchAssignments();
      }
    } catch (error) {
      toast.error(error.message || "Failed to acknowledge");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const response = await api.delete(`/product-assignments/${id}`);
      if (response && response.success) {
        toast.success("Assignment deleted successfully");
        fetchAssignments();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete assignment");
    }
  };

  const resetForm = () => {
    setFormData({
      item_id: "",
      employee_id: "",
      quantity: 1,
      expected_return_date: "",
      purpose: "",
      issue_remarks: "",
      condition_on_issue: "good",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      assigned: "secondary",
      in_use: "default",
      returned: "outline",
      lost: "destructive",
      damaged: "destructive",
      transferred: "secondary",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status?.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getConditionBadge = (condition) => {
    const variants = {
      new: "default",
      excellent: "default",
      good: "secondary",
      fair: "secondary",
      poor: "destructive",
      damaged: "destructive",
      lost: "destructive",
    };
    return (
      <Badge variant={variants[condition] || "default"}>
        {condition?.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), "MMM dd, yyyy") : "N/A";
  };

  const isOverdue = (assignment) => {
    if (!assignment.expected_return_date || assignment.status === "returned")
      return false;
    return new Date(assignment.expected_return_date) < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Assignments</h1>
          <p className="text-muted-foreground">
            Track product assignments to employees
          </p>
        </div>
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Assign Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Product to Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product *</Label>
                  <Select
                    value={formData.item_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, item_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name} (Qty: {item.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Employee *</Label>
                  <Select
                    value={formData.employee_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, employee_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp._id} value={emp._id}>
                          {emp.username} - {emp.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Expected Return Date</Label>
                  <Input
                    type="date"
                    value={formData.expected_return_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expected_return_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Condition on Issue</Label>
                <Select
                  value={formData.condition_on_issue}
                  onValueChange={(value) =>
                    setFormData({ ...formData, condition_on_issue: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Purpose *</Label>
                <Textarea
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="Enter purpose of assignment"
                  required
                />
              </div>

              <div>
                <Label>Remarks</Label>
                <Textarea
                  value={formData.issue_remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_remarks: e.target.value })
                  }
                  placeholder="Any additional notes"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAssignDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Assign Product</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.active || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.inUse || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Returned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.returned || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product, employee, purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) =>
                setPagination({
                  ...pagination,
                  limit: parseInt(value),
                  page: 1,
                })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No assignments found
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment._id}>
                    <TableCell>
                      <div className="font-medium">
                        {assignment.item_id?.name || "N/A"}
                      </div>
                      {assignment.serial_number && (
                        <div className="text-sm text-muted-foreground">
                          SN: {assignment.serial_number}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {assignment.employee_id?.username || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {assignment.employee_id?.email}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.quantity}</TableCell>
                    <TableCell>
                      {formatDate(assignment.assigned_date)}
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(assignment.expected_return_date)}</div>
                      {isOverdue(assignment) && (
                        <Badge variant="destructive" className="mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      {getConditionBadge(assignment.condition_on_issue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewAssignment(assignment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {assignment.status === "assigned" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAcknowledge(assignment._id)}
                            title="Acknowledge"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {(assignment.status === "assigned" ||
                          assignment.status === "in_use") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowReturnDialog(true);
                            }}
                            title="Return Product"
                          >
                            <PackageCheck className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(assignment._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReturn} className="space-y-4">
            <div>
              <Label>Condition on Return</Label>
              <Select
                value={returnData.condition_on_return}
                onValueChange={(value) =>
                  setReturnData({ ...returnData, condition_on_return: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Return Remarks</Label>
              <Textarea
                value={returnData.return_remarks}
                onChange={(e) =>
                  setReturnData({
                    ...returnData,
                    return_remarks: e.target.value,
                  })
                }
                placeholder="Any notes about the return"
              />
            </div>

            <div>
              <Label>Current Value (optional)</Label>
              <Input
                type="number"
                step="0.01"
                value={returnData.current_value}
                onChange={(e) =>
                  setReturnData({
                    ...returnData,
                    current_value: e.target.value,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReturnDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Complete Return</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewAssignment && (
        <DetailViewDialog
          open={!!viewAssignment}
          onOpenChange={(open) => !open && setViewAssignment(null)}
          title="Assignment Details"
          data={{
            Product: viewAssignment.item_id?.name,
            SKU: viewAssignment.item_id?.sku,
            "Serial Number": viewAssignment.serial_number,
            Employee: viewAssignment.employee_id?.username,
            "Employee Email": {
              value: viewAssignment.employee_id?.email,
              type: "email",
            },
            "Issued By": viewAssignment.issued_by?.username,
            Quantity: viewAssignment.quantity,
            Status: { value: viewAssignment.status, type: "badge" },
            "Assigned Date": {
              value: viewAssignment.assigned_date,
              type: "date",
            },
            "Expected Return": {
              value: viewAssignment.expected_return_date,
              type: "date",
            },
            "Actual Return": {
              value: viewAssignment.actual_return_date,
              type: "date",
            },
            "Condition on Issue": {
              value: viewAssignment.condition_on_issue,
              type: "badge",
            },
            "Condition on Return": {
              value: viewAssignment.condition_on_return,
              type: "badge",
            },
            Purpose: viewAssignment.purpose,
            "Issue Remarks": viewAssignment.issue_remarks,
            "Return Remarks": viewAssignment.return_remarks,
            "Duration (Days)": viewAssignment.duration_days,
            "Is Overdue": { value: viewAssignment.is_overdue, type: "boolean" },
          }}
        />
      )}
    </div>
  );
}
