"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function AssignmentForm({
  defaultValues,
  onSubmit,
  isLoading,
  items = [],
  users = [],
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(null);

  const form = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: defaultValues || {
      item_id: "",
      user_id: "",
      quantity: 1,
      notes: "",
    },
  });

  // Watch for item selection changes
  const watchedItemId = form.watch("item_id");

  useEffect(() => {
    if (watchedItemId && items.length > 0) {
      const item = items.find((i) => i._id.toString() === watchedItemId);
      if (item) {
        setSelectedItem(item);
        const available = item.available_quantity ?? item.quantity ?? 0;
        setMaxQuantity(available);

        // Reset quantity to 1 if current value exceeds available quantity
        const currentQty = form.getValues("quantity");
        if (currentQty > available) {
          form.setValue("quantity", Math.min(1, available));
        }
      }
    } else {
      setSelectedItem(null);
      setMaxQuantity(null);
    }
  }, [watchedItemId, items, form]);

  const handleSubmit = (data) => {
    // Validate quantity doesn't exceed available
    if (maxQuantity !== null && data.quantity > maxQuantity) {
      form.setError("quantity", {
        type: "manual",
        message: `Only ${maxQuantity} units available`,
      });
      return;
    }

    // Ensure quantity is a number
    const formattedData = {
      item_id: data.item_id,
      user_id: data.user_id,
      quantity: Number(data.quantity),
    };

    // Only include notes if it has a value
    if (data.notes && data.notes.trim()) {
      formattedData.notes = data.notes.trim();
    }

    console.log("Formatted assignment data:", formattedData);
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="item_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {items && items.length > 0 ? (
                    items.map((item) => {
                      const available =
                        item.available_quantity ?? item.quantity ?? 0;
                      const isOutOfStock = available <= 0;
                      return (
                        <SelectItem
                          key={item._id}
                          value={item._id.toString()}
                          disabled={isOutOfStock}
                        >
                          {item.name} ({available} available)
                          {isOutOfStock && " - Out of Stock"}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="none" disabled>
                      No items available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id.toString()}>
                        {user.full_name || user.username} - {user.email}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No users available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max={maxQuantity ?? undefined}
                  placeholder="1"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const clampedValue =
                      maxQuantity !== null
                        ? Math.min(Math.max(1, value), maxQuantity)
                        : Math.max(1, value);
                    field.onChange(clampedValue);
                  }}
                />
              </FormControl>
              {selectedItem && maxQuantity !== null && (
                <FormDescription>
                  {maxQuantity > 0
                    ? `${maxQuantity} unit${
                        maxQuantity !== 1 ? "s" : ""
                      } available`
                    : "No units available"}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional notes..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Assignment
        </Button>
      </form>
    </Form>
  );
}
