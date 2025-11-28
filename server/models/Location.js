const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
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
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: [
        "warehouse",
        "office",
        "store",
        "facility",
        "zone",
        "rack",
        "shelf",
        "bin",
        "other",
      ],
      default: "warehouse",
    },
    parent_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    // Address information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
      latitude: Number,
      longitude: Number,
    },
    // Contact information
    contact: {
      name: String,
      phone: String,
      email: String,
    },
    capacity: {
      type: Number,
      min: 0,
    },
    current_usage: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["sqm", "sqft", "cubic_m", "cubic_ft", "pallets", "items"],
      default: "sqm",
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Operating hours
    operating_hours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    // Zone/Aisle/Rack information for warehouse
    zone: {
      type: String,
      trim: true,
    },
    aisle: {
      type: String,
      trim: true,
    },
    rack: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    is_primary: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "full"],
      default: "active",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes (code already has unique: true in schema)
locationSchema.index({ name: 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ status: 1 });
locationSchema.index({ parent_location_id: 1 });
locationSchema.index({ manager_id: 1 });

// Virtual for utilization percentage
locationSchema.virtual("utilization_percentage").get(function () {
  if (!this.capacity || this.capacity === 0) return 0;
  return Math.round((this.current_usage / this.capacity) * 100);
});

// Ensure virtuals are included
locationSchema.set("toJSON", { virtuals: true });
locationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Location", locationSchema);
