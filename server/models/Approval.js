const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema(
  {
    request_type: {
      type: String,
      enum: ["assignment", "purchase", "maintenance", "reservation", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    requested_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    related_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    amount: {
      type: Number,
      min: 0,
    },
    decision_date: {
      type: Date,
    },
    decision_notes: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
approvalSchema.index({ requested_by: 1 });
approvalSchema.index({ status: 1 });
approvalSchema.index({ created_at: -1 });

module.exports = mongoose.model("Approval", approvalSchema);
