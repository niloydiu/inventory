import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager", "employee"]).optional(),
})

export const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Software", "Hardware", "Stationery", "Essentials", "Consumable"]),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit_type: z.string().min(1, "Unit type is required"),
  price: z.coerce.number().optional(),
  minimum_level: z.coerce.number().optional(),
  serial_number: z.string().optional(),
  asset_tag: z.string().optional(),
  location_id: z.coerce.number().optional(),
  status: z.enum(["available", "in_use", "maintenance", "retired"]),
  description: z.string().optional(),
  image_url: z.string().optional(),
})

export const assignmentSchema = z.object({
  item_id: z.string().min(1, "Item is required"),
  user_id: z.string().min(1, "User is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
})

export const livestockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.enum(["Cow", "Goat", "Sheep", "Chicken", "Duck", "Pig", "Buffalo", "Other"]),
  breed: z.string().optional(),
  gender: z.enum(["Male", "Female"]),
  age: z.coerce.number().min(0, "Age must be positive"),
  weight: z.coerce.number().optional(),
  health_status: z.enum(["healthy", "sick", "under_treatment", "quarantined"]),
  tag_number: z.string().optional(),
  location_id: z.coerce.number().optional(),
  purchase_date: z.string().optional(),
  purchase_price: z.coerce.number().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "sold", "deceased", "transferred"]),
  image_url: z.string().optional(),
})

export const feedSchema = z.object({
  name: z.string().min(1, "Name is required"),
  feed_type: z.enum(["Cattle Feed", "Poultry Feed", "Goat Feed", "Sheep Feed", "Pig Feed", "Fish Feed", "Supplement", "Other"]),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit_type: z.string().min(1, "Unit type is required"),
  production_date: z.string().optional(),
  expiry_date: z.string().optional(),
  batch_number: z.string().optional(),
  location_id: z.coerce.number().optional(),
  cost_price: z.coerce.number().optional(),
  unit_price: z.coerce.number().optional(),
  supplier_name: z.string().optional(),
  description: z.string().optional(),
  minimum_level: z.coerce.number().optional(),
  alert_enabled: z.boolean().optional(),
  image_url: z.string().optional(),
})
