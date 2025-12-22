const mongoose = require("mongoose");

const stockAdjustmentSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },
    adjustment_type: {
      type: String,
      enum: ["increase", "decrease"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    reason: {
      type: String,
      enum: [
        "damage",
        "theft",
        "loss",
        "found",
        "expired",
        "quality_issue",
        "physical_count",
        "other",
      ],
      required: true,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    adjusted_by: {
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
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    before_quantity: {
      type: Number,
      required: true,
    },
    after_quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
stockAdjustmentSchema.index({ item_id: 1, createdAt: -1 });
stockAdjustmentSchema.index({ adjusted_by: 1 });
stockAdjustmentSchema.index({ status: 1 });
stockAdjustmentSchema.index({ reason: 1 });

// Virtual for adjustment amount (signed)
stockAdjustmentSchema.virtual("adjustment_amount").get(function () {
  return this.adjustment_type === "increase" ? this.quantity : -this.quantity;
});

const StockAdjustment = mongoose.model(
  "StockAdjustment",
  stockAdjustmentSchema
);

module.exports = StockAdjustment;
