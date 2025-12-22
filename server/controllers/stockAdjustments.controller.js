const StockAdjustment = require("../models/StockAdjustment");
const Item = require("../models/Item");
const StockMovement = require("../models/StockMovement");

/**
 * Get all stock adjustments with filtering and pagination
 */
exports.getAllAdjustments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      item_id,
      status,
      reason,
      adjustment_type,
      start_date,
      end_date,
    } = req.query;

    const query = {};

    if (item_id) query.item_id = item_id;
    if (status) query.status = status;
    if (reason) query.reason = reason;
    if (adjustment_type) query.adjustment_type = adjustment_type;

    // Date range filtering
    if (start_date || end_date) {
      query.createdAt = {};
      if (start_date) query.createdAt.$gte = new Date(start_date);
      if (end_date) query.createdAt.$lte = new Date(end_date);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [adjustments, total] = await Promise.all([
      StockAdjustment.find(query)
        .populate("item_id", "name sku category")
        .populate("adjusted_by", "username full_name")
        .populate("approved_by", "username full_name")
        .populate("location_id", "name code")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      StockAdjustment.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: adjustments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching stock adjustments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock adjustments",
      error: error.message,
    });
  }
};

/**
 * Get stock adjustment by ID
 */
exports.getAdjustmentById = async (req, res) => {
  try {
    const adjustment = await StockAdjustment.findById(req.params.id)
      .populate("item_id", "name sku category quantity")
      .populate("adjusted_by", "username full_name email")
      .populate("approved_by", "username full_name email")
      .populate("location_id", "name code address")
      .lean();

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: "Stock adjustment not found",
      });
    }

    res.json({
      success: true,
      data: adjustment,
    });
  } catch (error) {
    console.error("Error fetching stock adjustment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock adjustment",
      error: error.message,
    });
  }
};

/**
 * Create stock adjustment
 */
exports.createAdjustment = async (req, res) => {
  try {
    const {
      item_id,
      adjustment_type,
      quantity,
      reason,
      notes,
      location_id,
      auto_approve,
    } = req.body;

    // Validate item exists
    const item = await Item.findById(item_id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Calculate before and after quantities
    const before_quantity = item.quantity || 0;
    let after_quantity;

    if (adjustment_type === "increase") {
      after_quantity = before_quantity + quantity;
    } else {
      // decrease
      after_quantity = before_quantity - quantity;
      if (after_quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Adjustment would result in negative inventory",
        });
      }
    }

    // Create adjustment record
    const adjustment = await StockAdjustment.create({
      item_id,
      adjustment_type,
      quantity,
      reason,
      notes,
      location_id,
      adjusted_by: req.user._id,
      before_quantity,
      after_quantity,
      status:
        auto_approve && req.user.role === "admin" ? "approved" : "pending",
      approved_by:
        auto_approve && req.user.role === "admin" ? req.user._id : null,
    });

    // If auto-approved (admin only), update item quantity immediately
    if (auto_approve && req.user.role === "admin") {
      await Item.findByIdAndUpdate(item_id, {
        quantity: after_quantity,
      });

      // Create stock movement record
      await StockMovement.create({
        item_id,
        movement_type: "adjustment",
        quantity: adjustment_type === "increase" ? quantity : -quantity,
        reference_type: "stock_adjustment",
        reference_id: adjustment._id,
        user_id: req.user._id,
        notes: `Stock adjustment: ${reason} - ${notes || ""}`,
      });
    }

    const populatedAdjustment = await StockAdjustment.findById(adjustment._id)
      .populate("item_id", "name sku category")
      .populate("adjusted_by", "username full_name")
      .populate("location_id", "name code")
      .lean();

    res.status(201).json({
      success: true,
      data: populatedAdjustment,
      message: auto_approve
        ? "Stock adjustment created and applied"
        : "Stock adjustment created and pending approval",
    });
  } catch (error) {
    console.error("Error creating stock adjustment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create stock adjustment",
      error: error.message,
    });
  }
};

/**
 * Approve stock adjustment
 */
exports.approveAdjustment = async (req, res) => {
  try {
    const adjustment = await StockAdjustment.findById(req.params.id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: "Stock adjustment not found",
      });
    }

    if (adjustment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Adjustment is already ${adjustment.status}`,
      });
    }

    // Update item quantity
    const item = await Item.findById(adjustment.item_id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await Item.findByIdAndUpdate(adjustment.item_id, {
      quantity: adjustment.after_quantity,
    });

    // Update adjustment status
    adjustment.status = "approved";
    adjustment.approved_by = req.user._id;
    await adjustment.save();

    // Create stock movement record
    await StockMovement.create({
      item_id: adjustment.item_id,
      movement_type: "adjustment",
      quantity:
        adjustment.adjustment_type === "increase"
          ? adjustment.quantity
          : -adjustment.quantity,
      reference_type: "stock_adjustment",
      reference_id: adjustment._id,
      user_id: req.user._id,
      notes: `Stock adjustment approved: ${adjustment.reason}`,
    });

    const populatedAdjustment = await StockAdjustment.findById(adjustment._id)
      .populate("item_id", "name sku category quantity")
      .populate("adjusted_by", "username full_name")
      .populate("approved_by", "username full_name")
      .populate("location_id", "name code")
      .lean();

    res.json({
      success: true,
      data: populatedAdjustment,
      message: "Stock adjustment approved successfully",
    });
  } catch (error) {
    console.error("Error approving stock adjustment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve stock adjustment",
      error: error.message,
    });
  }
};

/**
 * Reject stock adjustment
 */
exports.rejectAdjustment = async (req, res) => {
  try {
    const { rejection_reason } = req.body;

    const adjustment = await StockAdjustment.findById(req.params.id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: "Stock adjustment not found",
      });
    }

    if (adjustment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Adjustment is already ${adjustment.status}`,
      });
    }

    adjustment.status = "rejected";
    adjustment.approved_by = req.user._id;
    adjustment.notes = `${adjustment.notes || ""}\nREJECTION REASON: ${
      rejection_reason || "No reason provided"
    }`;
    await adjustment.save();

    const populatedAdjustment = await StockAdjustment.findById(adjustment._id)
      .populate("item_id", "name sku category")
      .populate("adjusted_by", "username full_name")
      .populate("approved_by", "username full_name")
      .populate("location_id", "name code")
      .lean();

    res.json({
      success: true,
      data: populatedAdjustment,
      message: "Stock adjustment rejected",
    });
  } catch (error) {
    console.error("Error rejecting stock adjustment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject stock adjustment",
      error: error.message,
    });
  }
};

/**
 * Delete stock adjustment (only if pending)
 */
exports.deleteAdjustment = async (req, res) => {
  try {
    const adjustment = await StockAdjustment.findById(req.params.id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: "Stock adjustment not found",
      });
    }

    if (adjustment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete approved or rejected adjustments",
      });
    }

    await StockAdjustment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Stock adjustment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting stock adjustment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete stock adjustment",
      error: error.message,
    });
  }
};

/**
 * Get stock adjustment statistics
 */
exports.getAdjustmentStats = async (req, res) => {
  try {
    const stats = await StockAdjustment.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byReason: [{ $group: { _id: "$reason", count: { $sum: 1 } } }],
          byType: [
            {
              $group: {
                _id: "$adjustment_type",
                count: { $sum: 1 },
                totalQty: { $sum: "$quantity" },
              },
            },
          ],
          pending: [{ $match: { status: "pending" } }, { $count: "count" }],
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error("Error fetching adjustment stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
