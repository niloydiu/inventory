const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
    purpose: {
      type: String,
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
reservationSchema.index({ item_id: 1 });
reservationSchema.index({ user_id: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ start_date: 1, end_date: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);
