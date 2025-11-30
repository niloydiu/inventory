const mongoose = require("mongoose");

const productAssignmentSchema = new mongoose.Schema(
  {
    // Product/Item being assigned
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },

    // Employee/Person receiving the product
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Person who issued/gave the product
    issued_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Assignment details
    assigned_date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    expected_return_date: {
      type: Date,
      index: true,
    },

    actual_return_date: {
      type: Date,
      index: true,
    },

    // Status tracking
    status: {
      type: String,
      enum: [
        "assigned",
        "in_use",
        "returned",
        "lost",
        "damaged",
        "transferred",
      ],
      default: "assigned",
      required: true,
      index: true,
    },

    // Quantity assigned
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    // Condition tracking
    condition_on_issue: {
      type: String,
      enum: ["new", "excellent", "good", "fair", "poor"],
      default: "good",
    },

    condition_on_return: {
      type: String,
      enum: ["new", "excellent", "good", "fair", "poor", "damaged", "lost"],
    },

    // Location tracking
    assigned_location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },

    current_location: {
      type: String,
    },

    // Purpose and notes
    purpose: {
      type: String,
      required: true,
    },

    issue_remarks: {
      type: String,
    },

    return_remarks: {
      type: String,
    },

    // Acknowledgment
    employee_acknowledgment: {
      acknowledged: {
        type: Boolean,
        default: false,
      },
      acknowledged_at: Date,
      signature: String, // Could store digital signature or confirmation
      ip_address: String,
    },

    // Return acknowledgment
    return_acknowledgment: {
      acknowledged: {
        type: Boolean,
        default: false,
      },
      acknowledged_at: Date,
      received_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // Additional tracking
    serial_number: String,
    asset_tag: String,

    // Warranty/Insurance
    warranty_covered: {
      type: Boolean,
      default: false,
    },

    insurance_required: {
      type: Boolean,
      default: false,
    },

    // Depreciation value (if applicable)
    assigned_value: Number,
    current_value: Number,

    // Reminders
    reminder_sent: {
      type: Boolean,
      default: false,
    },

    reminder_date: Date,

    // Attachments (photos, documents)
    attachments: [
      {
        filename: String,
        url: String,
        type: String, // 'issue_photo', 'return_photo', 'document', 'signature'
        uploaded_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Audit trail
    history: [
      {
        action: String,
        performed_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: String,
        old_status: String,
        new_status: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
productAssignmentSchema.index({ status: 1, assigned_date: -1 });
productAssignmentSchema.index({ employee_id: 1, status: 1 });
productAssignmentSchema.index({ item_id: 1, status: 1 });
productAssignmentSchema.index({ expected_return_date: 1, status: 1 });

// Virtual for assignment duration
productAssignmentSchema.virtual("duration_days").get(function () {
  if (this.actual_return_date) {
    return Math.ceil(
      (this.actual_return_date - this.assigned_date) / (1000 * 60 * 60 * 24)
    );
  }
  return Math.ceil((new Date() - this.assigned_date) / (1000 * 60 * 60 * 24));
});

// Virtual for overdue status
productAssignmentSchema.virtual("is_overdue").get(function () {
  if (this.status === "returned" || !this.expected_return_date) return false;
  return new Date() > this.expected_return_date;
});

// Method to add history entry
productAssignmentSchema.methods.addHistory = function (
  action,
  performedBy,
  details,
  oldStatus,
  newStatus
) {
  this.history.push({
    action,
    performed_by: performedBy,
    timestamp: new Date(),
    details,
    old_status: oldStatus,
    new_status: newStatus,
  });
};

// Static method to get active assignments for employee
productAssignmentSchema.statics.getActiveAssignments = function (employeeId) {
  return this.find({
    employee_id: employeeId,
    status: { $in: ["assigned", "in_use"] },
  }).populate("item_id issued_by");
};

// Static method to get overdue assignments
productAssignmentSchema.statics.getOverdueAssignments = function () {
  return this.find({
    status: { $in: ["assigned", "in_use"] },
    expected_return_date: { $lt: new Date() },
  }).populate("item_id employee_id issued_by");
};

// Pre-save middleware to add history - removed as history is added manually in controllers
// productAssignmentSchema.pre("save", function (next) {
//   if (this.isModified("status") && !this.isNew) {
//     const oldStatus = this._doc.status; // Get old value
//     this.addHistory(
//       "Status Changed",
//       this.issued_by,
//       `Status changed from ${oldStatus} to ${this.status}`,
//       oldStatus,
//       this.status
//     );
//   }
//   next();
// });

module.exports = mongoose.model("ProductAssignment", productAssignmentSchema);
