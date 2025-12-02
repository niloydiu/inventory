"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useCategories } from "@/lib/categories-context";
import { ITEM_STATUSES, ITEM_UNIT_TYPES } from "@/lib/constants";

export function ItemForm({
  defaultValues,
  onSubmit,
  isLoading,
  locations = [],
}) {
  const form = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: defaultValues || {
      name: "",
      category: "Hardware",
      quantity: 0,
      unit_type: "units",
      price: 0,
      minimum_level: 0,
      serial_number: "",
      asset_tag: "",
      status: "available",
      description: "",
    },
  });

  const { categories: providerCategories = [], loading: categoriesLoading } =
    useCategories();

  // Extract categories from provider
  const categoryOptions =
    providerCategories && providerCategories.length > 0
      ? providerCategories
      : [
          { _id: "Hardware", name: "Hardware" },
          { _id: "Software", name: "Software" },
          { _id: "Stationery", name: "Stationery" },
          { _id: "Essentials", name: "Essentials" },
          { _id: "Consumable", name: "Consumable" },
        ];

  // Set default category to first provider category when available
  useEffect(() => {
    if (!defaultValues && providerCategories && providerCategories.length > 0) {
      const first = providerCategories[0]._id || providerCategories[0];
      form.setValue("category", first);
    }
  }, [defaultValues, providerCategories, form]);

  const handleSubmitWrapper = (data) => {
    // Find selected category object
    const selectedCategory = categoryOptions.find(
      (c) => c._id === data.category || c === data.category
    );

    // Format payload
    const payload = {
      ...data,
      // If it's a real category object, send ID as category_id and name as category
      // If it's a string (legacy), send it as category
      category: selectedCategory?.name || data.category,
      category_id: selectedCategory?._id && selectedCategory._id !== selectedCategory.name ? selectedCategory._id : undefined,
    };

    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWrapper)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category">
                        {categoryOptions.find((c) => (c._id || c) === field.value)?.name || field.value || "Select category"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map((cat) => {
                      const value = cat._id || cat;
                      const label = cat.name || cat;
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
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
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ITEM_UNIT_TYPES.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimum_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Level</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asset_tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Tag</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ITEM_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional description..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {defaultValues ? "Update Item" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
}
