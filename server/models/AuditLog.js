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

// Indexes for performance and TTL
auditLogSchema.index({ user_id: 1 });
auditLogSchema.index({ entity_type: 1 });
auditLogSchema.index({ entity_type: 1, entity_id: 1 });
auditLogSchema.index({ created_at: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ user_id: 1, created_at: -1 });
// Auto-delete logs older than 90 days (optional - uncomment if needed)
// auditLogSchema.index({ created_at: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
