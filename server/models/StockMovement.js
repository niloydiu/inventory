const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    movement_type: {
      type: String,
      enum: [
        "purchase",
        "sale",
        "transfer_in",
        "transfer_out",
        "adjustment_increase",
        "adjustment_decrease",
        "return",
        "damage",
        "expired",
        "assignment",
        "return_assignment",
      ],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit_cost: {
      type: Number,
      min: 0,
    },
    total_cost: {
      type: Number,
      min: 0,
    },
    from_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    to_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    reference_type: {
      type: String,
      enum: [
        "purchase_order",
        "sale_order",
        "transfer",
        "adjustment",
        "assignment",
        "other",
      ],
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    reference_number: {
      type: String,
      trim: true,
    },
    batch_number: {
      type: String,
      trim: true,
    },
    performed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
    },
    balance_after: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
stockMovementSchema.index({ item_id: 1, created_at: -1 });
stockMovementSchema.index({ movement_type: 1 });
stockMovementSchema.index({ from_location_id: 1 });
stockMovementSchema.index({ to_location_id: 1 });
stockMovementSchema.index({ reference_type: 1, reference_id: 1 });
stockMovementSchema.index({ batch_number: 1 });

module.exports = mongoose.model("StockMovement", stockMovementSchema);
