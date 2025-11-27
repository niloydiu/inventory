const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      trim: true,
    },
    action: {
      type: String,
      required: true,
    },
    entity_type: {
      type: String,
      required: true,
      enum: [
        "user",
        "item",
        "assignment",
        "livestock",
        "feed",
        "location",
        "maintenance",
        "reservation",
        "approval",
        "other",
      ],
    },
    entity_id: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ip_address: {
      type: String,
    },
    user_agent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
auditLogSchema.index({ user_id: 1 });
auditLogSchema.index({ entity_type: 1 });
auditLogSchema.index({ created_at: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
