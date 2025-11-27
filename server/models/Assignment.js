const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    assigned_to_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assigned_by_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    assignment_date: {
      type: Date,
      default: Date.now,
    },
    expected_return_date: {
      type: Date,
    },
    actual_return_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["assigned", "returned", "overdue"],
      default: "assigned",
    },
    condition_at_assignment: {
      type: String,
      enum: ["new", "good", "fair", "poor"],
      default: "good",
    },
    condition_at_return: {
      type: String,
      enum: ["new", "good", "fair", "poor"],
    },
    notes: {
      type: String,
    },
    return_notes: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes for performance
assignmentSchema.index({ item_id: 1 });
assignmentSchema.index({ assigned_to_user_id: 1 });
assignmentSchema.index({ assigned_by_user_id: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ assignment_date: -1 });
assignmentSchema.index({ assigned_to_user_id: 1, status: 1 });
assignmentSchema.index({ assigned_to_user_id: 1, assignment_date: -1 });

module.exports = mongoose.model("Assignment", assignmentSchema);
