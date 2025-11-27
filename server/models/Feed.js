const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Grain",
        "Hay",
        "Silage",
        "Concentrate",
        "Supplement",
        "Mineral",
        "Other",
      ],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      default: "kg",
      enum: ["kg", "lbs", "bags", "tons", "liters"],
    },
    low_stock_threshold: {
      type: Number,
      default: 50,
      min: 0,
    },
    cost_per_unit: {
      type: Number,
      min: 0,
    },
    supplier: {
      type: String,
      trim: true,
    },
    purchase_date: {
      type: Date,
    },
    expiry_date: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
    },
    batch_number: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "low_stock", "out_of_stock", "expired"],
      default: "available",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
feedSchema.index({ name: 1 });
feedSchema.index({ type: 1 });
feedSchema.index({ status: 1 });
feedSchema.index({ expiry_date: 1 });

// Update status based on quantity and expiry
feedSchema.pre("save", function () {
  if (this.quantity === 0) {
    this.status = "out_of_stock";
  } else if (this.quantity <= this.low_stock_threshold) {
    this.status = "low_stock";
  } else if (this.expiry_date && this.expiry_date < new Date()) {
    this.status = "expired";
  } else {
    this.status = "available";
  }
});

module.exports = mongoose.model("Feed", feedSchema);
