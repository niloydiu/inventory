const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "low_stock",
        "out_of_stock",
        "expiry_alert",
        "assignment_due",
        "maintenance_due",
        "approval_request",
        "approval_decision",
        "purchase_order",
        "transfer",
        "general",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    read_at: {
      type: Date,
    },
    reference_type: {
      type: String,
      enum: [
        "item",
        "assignment",
        "maintenance",
        "approval",
        "purchase_order",
        "transfer",
        "other",
      ],
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    action_url: {
      type: String,
    },
    expires_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ user_id: 1, created_at: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expires_at: 1 });

// Auto-delete expired notifications
notificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);
