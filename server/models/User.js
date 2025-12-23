const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
      select: false, // Never include by default
    },
    role: {
      type: String,
      enum: ["admin", "manager", "employee", "warehouse_staff", "viewer"],
      default: "employee",
    },
    full_name: {
      type: String,
      trim: true,
    },
    // Additional user information
    employee_id: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    department: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },
    // Work location
    primary_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    // Manager/Supervisor
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Permissions
    permissions: {
      can_create_items: { type: Boolean, default: false },
      can_edit_items: { type: Boolean, default: false },
      can_delete_items: { type: Boolean, default: false },
      can_create_assignments: { type: Boolean, default: false },
      can_approve_requests: { type: Boolean, default: false },
      can_manage_users: { type: Boolean, default: false },
      can_view_reports: { type: Boolean, default: false },
      can_manage_suppliers: { type: Boolean, default: false },
      can_create_purchase_orders: { type: Boolean, default: false },
      can_receive_stock: { type: Boolean, default: false },
      can_transfer_stock: { type: Boolean, default: false },
    },
    // Preferences
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      currency: {
        type: String,
        default: "USD",
      },
      timezone: {
        type: String,
        default: "UTC",
      },
      date_format: {
        type: String,
        default: "YYYY-MM-DD",
      },
      notifications_enabled: {
        type: Boolean,
        default: true,
      },
      email_notifications: {
        type: Boolean,
        default: true,
      },
    },
    // Status
    is_active: {
      type: Boolean,
      default: true,
    },
    // Account security - failed login tracking
    failed_login_attempts: {
      type: Number,
      default: 0,
    },
    account_locked_until: {
      type: Date,
      default: null,
    },
    last_failed_login: {
      type: Date,
    },
    last_login: {
      type: Date,
    },
    login_count: {
      type: Number,
      default: 0,
    },
    // Profile
    avatar_url: {
      type: String,
    },
    bio: {
      type: String,
    },
    // Employment dates
    hire_date: {
      type: Date,
    },
    termination_date: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password_hash;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password_hash;
        return ret;
      },
    },
  }
);

// Indexes for performance (email, username, employee_id already have unique: true in schema)
userSchema.index({ role: 1 });
userSchema.index({ is_active: 1 });
userSchema.index({ department: 1 });
userSchema.index({ primary_location_id: 1 });
userSchema.index({ manager_id: 1 });

module.exports = mongoose.model("User", userSchema);
