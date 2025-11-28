const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    contact_person: {
      name: String,
      email: String,
      phone: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },
    tax_id: {
      type: String,
      trim: true,
    },
    payment_terms: {
      type: String,
      enum: ["cash", "net_15", "net_30", "net_60", "net_90", "custom"],
      default: "net_30",
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    credit_limit: {
      type: Number,
      min: 0,
    },
    current_balance: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    notes: {
      type: String,
    },
    website: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes (code already has unique: true in schema)
supplierSchema.index({ name: 1 });
supplierSchema.index({ status: 1 });

module.exports = mongoose.model("Supplier", supplierSchema);
