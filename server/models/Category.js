const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
      min: 0,
    },
    path: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
    },
    attributes: [
      {
        name: String,
        type: {
          type: String,
          enum: ["text", "number", "date", "boolean", "select"],
        },
        required: Boolean,
        options: [String],
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    sort_order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes (code already has unique: true in schema)
categorySchema.index({ name: 1 });
categorySchema.index({ parent_id: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ status: 1 });

// Update path on save
categorySchema.pre("save", async function () {
  if (this.parent_id) {
    const parent = await this.constructor.findById(this.parent_id);
    if (parent) {
      this.level = parent.level + 1;
      this.path = parent.path ? `${parent.path}/${this.code}` : this.code;
    }
  } else {
    this.level = 0;
    this.path = this.code;
  }
});

module.exports = mongoose.model("Category", categorySchema);
