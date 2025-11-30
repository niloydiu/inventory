"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints";
import { ItemTable } from "@/components/inventory/item-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export function InventoryContent() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const canEdit = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    fetchItems();
  }, [token]);

  async function fetchItems() {
    // Allow fetching even when `token` is not present (httpOnly cookie auth)
    try {
      const response = await apiClient.get(ITEMS_ENDPOINTS.BASE, {}, token);

      // Handle the new response structure
      if (response && response.success && Array.isArray(response.data)) {
        setItems(response.data);
      } else if (Array.isArray(response)) {
        // Fallback for legacy format
        setItems(response);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to load items:", error);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  }

  async function confirmDelete() {
    if (!itemToDelete) return;

    try {
      await apiClient.delete(ITEMS_ENDPOINTS.BY_ID(itemToDelete), token);
      toast.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader className="h-full" text="Loading inventory..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        {canEdit && (
          <Button asChild>
            <Link href="/inventory/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <ItemTable
        items={filteredItems}
        onDelete={handleDelete}
        canEdit={canEdit}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
