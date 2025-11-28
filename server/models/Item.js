const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // Legacy category field for backward compatibility
    category: {
      type: String,
      enum: [
        "Software",
        "Hardware",
        "Office Supplies",
        "Electronics",
        "Furniture",
        "Other",
      ],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    available_quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reserved_quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: "units",
      enum: [
        "units",
        "kg",
        "lbs",
        "liters",
        "gallons",
        "meters",
        "feet",
        "boxes",
        "pairs",
        "sets",
      ],
    },
    // Multi-location support
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    // Legacy location field
    location: {
      type: String,
      trim: true,
    },
    // Stock levels
    low_stock_threshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    reorder_point: {
      type: Number,
      default: 15,
      min: 0,
    },
    reorder_quantity: {
      type: Number,
      default: 50,
      min: 0,
    },
    max_stock_level: {
      type: Number,
    },
    // Pricing
    purchase_price: {
      type: Number,
      min: 0,
    },
    selling_price: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    // Tax information
    tax_rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    taxable: {
      type: Boolean,
      default: true,
    },
    // Supplier information
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    // Legacy supplier field
    supplier: {
      type: String,
      trim: true,
    },
    supplier_sku: {
      type: String,
      trim: true,
    },
    // Dates
    purchase_date: {
      type: Date,
    },
    warranty_expiry: {
      type: Date,
    },
    manufacture_date: {
      type: Date,
    },
    expiry_date: {
      type: Date,
    },
    // Identification
    serial_number: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
      index: true,
    },
    qr_code: {
      type: String,
    },
    // Physical properties
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["cm", "m", "in", "ft"],
        default: "cm",
      },
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["kg", "g", "lbs", "oz"],
        default: "kg",
      },
    },
    // Tracking
    batch_number: {
      type: String,
      trim: true,
    },
    lot_number: {
      type: String,
      trim: true,
    },
    // Costing method
    costing_method: {
      type: String,
      enum: ["fifo", "lifo", "average", "specific"],
      default: "fifo",
    },
    // Media
    image_url: {
      type: String,
    },
    images: [
      {
        url: String,
        alt_text: String,
        is_primary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    attachments: [
      {
        file_name: String,
        file_url: String,
        file_type: String,
        uploaded_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Custom attributes
    custom_fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued", "out_of_stock"],
      default: "active",
    },
    notes: {
      type: String,
    },
    // Audit fields
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes for better query performance
itemSchema.index({ name: 1 });
itemSchema.index({ sku: 1 }, { unique: true });
itemSchema.index({ category_id: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ barcode: 1 });
itemSchema.index({ serial_number: 1 });
itemSchema.index({ location_id: 1 });
itemSchema.index({ supplier_id: 1 });
itemSchema.index({ batch_number: 1 });
itemSchema.index({ lot_number: 1 });
itemSchema.index({ expiry_date: 1 });

// Virtual for stock status
itemSchema.virtual("stock_status").get(function () {
  if (this.quantity === 0) return "out_of_stock";
  if (this.quantity <= this.low_stock_threshold) return "low_stock";
  if (this.max_stock_level && this.quantity >= this.max_stock_level)
    return "overstock";
  return "in_stock";
});

// Auto-generate SKU if not provided
itemSchema.pre("save", async function (next) {
  if (this.isNew && !this.sku) {
    const count = await this.constructor.countDocuments();
    const prefix = this.category
      ? this.category.substring(0, 3).toUpperCase()
      : "ITM";
    this.sku = `${prefix}-${String(count + 1).padStart(6, "0")}`;
  }

  // Update reserved quantity
  this.available_quantity = this.quantity - (this.reserved_quantity || 0);

  next();
});

// Ensure virtuals are included in JSON
itemSchema.set("toJSON", { virtuals: true });
itemSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Item", itemSchema);
