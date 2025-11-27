const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
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
    unit: {
      type: String,
      default: "units",
    },
    location: {
      type: String,
      trim: true,
    },
    purchase_date: {
      type: Date,
    },
    purchase_price: {
      type: Number,
      min: 0,
    },
    warranty_expiry: {
      type: Date,
    },
    supplier: {
      type: String,
      trim: true,
    },
    serial_number: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    low_stock_threshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    image_url: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes for better query performance
itemSchema.index({ name: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ barcode: 1 });
itemSchema.index({ serial_number: 1 });

module.exports = mongoose.model("Item", itemSchema);
