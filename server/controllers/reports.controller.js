const { Item, Assignment } = require("../models");

// Get low stock items
exports.getLowStockReport = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const items = await Item.find({
      $expr: { $lte: ["$available_quantity", parseInt(threshold)] },
      status: "active",
    }).sort({ available_quantity: 1 });

    res.json({
      success: true,
      data: items,
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
