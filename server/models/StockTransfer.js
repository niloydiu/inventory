const mongoose = require("mongoose");

const stockTransferSchema = new mongoose.Schema(
  {
    transfer_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    from_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    to_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    items: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity_requested: {
          type: Number,
          required: true,
          min: 1,
        },
        quantity_sent: {
          type: Number,
          default: 0,
          min: 0,
        },
        quantity_received: {
          type: Number,
          default: 0,
          min: 0,
        },
        batch_number: String,
        notes: String,
      },
    ],
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "in_transit",
        "partially_received",
        "received",
        "cancelled",
      ],
      default: "draft",
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
    shipped_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    received_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    request_date: {
      type: Date,
      default: Date.now,
    },
    shipped_date: {
      type: Date,
    },
    expected_delivery_date: {
      type: Date,
    },
    received_date: {
      type: Date,
    },
    shipping_method: {
      type: String,
    },
    tracking_number: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    attachments: [
      {
        file_name: String,
        file_url: String,
        uploaded_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
stockTransferSchema.index({ transfer_number: 1 }, { unique: true });
stockTransferSchema.index({ from_location_id: 1 });
stockTransferSchema.index({ to_location_id: 1 });
stockTransferSchema.index({ status: 1 });
stockTransferSchema.index({ request_date: -1 });

// Auto-generate transfer number
stockTransferSchema.pre("save", async function (next) {
  if (this.isNew && !this.transfer_number) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    this.transfer_number = `TR-${year}${month}-${String(count + 1).padStart(
      5,
      "0"
    )}`;
  }
  next();
});

module.exports = mongoose.model("StockTransfer", stockTransferSchema);
