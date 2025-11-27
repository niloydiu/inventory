const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    maintenance_type: {
      type: String,
      enum: ["repair", "inspection", "upgrade", "cleaning", "other"],
      default: "repair",
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    scheduled_date: {
      type: Date,
      required: true,
    },
    completed_date: {
      type: Date,
    },
    technician_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cost: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
maintenanceSchema.index({ item_id: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ scheduled_date: -1 });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
