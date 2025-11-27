const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["warehouse", "office", "store", "facility", "other"],
      default: "warehouse",
    },
    address: {
      type: String,
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
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
locationSchema.index({ name: 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ status: 1 });

module.exports = mongoose.model("Location", locationSchema);
