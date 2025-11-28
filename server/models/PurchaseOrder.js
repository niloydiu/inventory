const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    po_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    expected_delivery_date: {
      type: Date,
    },
    actual_delivery_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "approved",
        "ordered",
        "partially_received",
        "received",
        "cancelled",
      ],
      default: "draft",
    },
    items: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        item_name: String,
        description: String,
        quantity_ordered: {
          type: Number,
          required: true,
          min: 1,
        },
        quantity_received: {
          type: Number,
          default: 0,
          min: 0,
        },
        unit_price: {
          type: Number,
          required: true,
          min: 0,
        },
        tax_rate: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        discount: {
          type: Number,
          default: 0,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    tax_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping_cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    delivery_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
    },
    terms_and_conditions: {
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
purchaseOrderSchema.index({ po_number: 1 }, { unique: true });
purchaseOrderSchema.index({ supplier_id: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ order_date: -1 });
purchaseOrderSchema.index({ created_by: 1 });

// Auto-generate PO number
purchaseOrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.po_number) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    this.po_number = `PO-${year}${month}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
