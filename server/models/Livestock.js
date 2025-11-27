const mongoose = require("mongoose");

const livestockSchema = new mongoose.Schema(
  {
    tag_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      enum: ["Cattle", "Goat", "Sheep", "Chicken", "Duck", "Other"],
    },
    breed: {
      type: String,
      trim: true,
    },
    date_of_birth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    weight: {
      type: Number,
      min: 0,
    },
    health_status: {
      type: String,
      enum: ["healthy", "sick", "under_treatment", "quarantined"],
      default: "healthy",
    },
    location: {
      type: String,
      trim: true,
    },
    purchase_date: {
      type: Date,
    },
    purchase_price: {
      type: Number,
      min: 0,
    },
    current_value: {
      type: Number,
      min: 0,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livestock",
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "sold", "deceased", "transferred"],
      default: "active",
    },
    image_url: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
livestockSchema.index({ species: 1 });
livestockSchema.index({ status: 1 });
livestockSchema.index({ health_status: 1 });

module.exports = mongoose.model("Livestock", livestockSchema);
