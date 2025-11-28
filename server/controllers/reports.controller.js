const { Item, Assignment } = require("../models");

// Get low stock items
exports.getLowStockReport = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    const thresholdValue = parseInt(threshold);

    // Find items where quantity is less than or equal to either:
    // 1. The provided threshold, or
    // 2. The item's own low_stock_threshold (if it's lower than the provided threshold)
    const items = await Item.find({
      $expr: {
        $lte: [
          "$quantity", 
          {
            $min: [
              thresholdValue,
              { $ifNull: ["$low_stock_threshold", thresholdValue] }
            ]
          }
        ]
      },
      status: { $ne: "inactive" }
    }).populate("category_id", "name")
    .populate("location_id", "name")
    .sort({ quantity: 1 });

    // Transform data to match frontend expectations
    const transformedItems = items.map(item => ({
      ...item.toObject(),
      category: item.category_id?.name || item.category || 'Uncategorized',
      minimum_level: item.low_stock_threshold || thresholdValue,
      unit_type: item.unit || 'units'
    }));

    res.json({
      success: true,
      data: transformedItems,
    });
  } catch (error) {
    console.error("Get low stock report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate low stock report",
    });
  }
};

// Get assigned items report
exports.getAssignedItemsReport = async (req, res) => {
  try {
    const assignments = await Assignment.find({ status: "assigned" })
      .populate("item_id", "name category")
      .populate("assigned_to_user_id", "username full_name")
      .sort({ assignment_date: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Get assigned items report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate assigned items report",
    });
  }
};

// Get seat usage for a specific item
exports.getSeatUsageReport = async (req, res) => {
  try {
    const { itemId } = req.params;

    const assignments = await Assignment.find({
      item_id: itemId,
      status: { $in: ["assigned", "overdue"] },
    })
      .populate("assigned_to_user_id", "username full_name")
      .populate("item_id", "name")
      .sort({ assignment_date: -1 });

    res.json({
      success: true,
      data: {
        item: assignments[0]?.item_id || null,
        total_assigned: assignments.length,
        assignments: assignments,
      },
    });
  } catch (error) {
    console.error("Get seat usage report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate seat usage report",
    });
  }
};
