const { Item, Assignment, Feed, Livestock } = require("../models");

// Helper function to convert array to CSV
function arrayToCSV(data, headers) {
  if (!data || data.length === 0) {
    return headers.join(",");
  }

  const csvRows = [];
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => {
      const key = header.toLowerCase().replace(/ /g, "_");
      let value = row[key] || "";

      // Handle nested objects
      if (typeof value === "object" && value !== null) {
        if (value.name) value = value.name;
        else if (value.username) value = value.username;
        else value = JSON.stringify(value);
      }

      // Escape quotes and wrap in quotes if contains comma
      value = String(value).replace(/"/g, '""');
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        value = `"${value}"`;
      }

      return value;
    });

    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

// Export items to CSV
exports.exportItemsCSV = async (req, res) => {
  try {
    const items = await Item.find({ status: "active" })
      .sort({ name: 1 })
      .lean();

    const headers = [
      "Name",
      "Category",
      "Quantity",
      "Available Quantity",
      "Unit",
      "Location",
      "Status",
      "Purchase Price",
      "Supplier",
    ];
    const csv = arrayToCSV(
      items.map((item) => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        available_quantity: item.available_quantity,
        unit: item.unit,
        location: item.location,
        status: item.status,
        purchase_price: item.purchase_price || 0,
        supplier: item.supplier || "",
      })),
      headers
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=items-export.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("Export items CSV error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export items",
    });
  }
};

// Export assignments to CSV
exports.exportAssignmentsCSV = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("item_id", "name")
      .populate("assigned_to_user_id", "username full_name")
      .populate("assigned_by_user_id", "username")
      .sort({ assignment_date: -1 })
      .lean();

    const headers = [
      "Item",
      "Assigned To",
      "Assigned By",
      "Quantity",
      "Status",
      "Assignment Date",
      "Expected Return Date",
      "Actual Return Date",
    ];
    const csv = arrayToCSV(
      assignments.map((assignment) => ({
        item: assignment.item_id?.name || "Unknown",
        assigned_to:
          assignment.assigned_to_user_id?.full_name ||
          assignment.assigned_to_user_id?.username ||
          "Unknown",
        assigned_by: assignment.assigned_by_user_id?.username || "Unknown",
        quantity: assignment.quantity,
        status: assignment.status,
        assignment_date: assignment.assignment_date
          ? new Date(assignment.assignment_date).toLocaleDateString()
          : "",
        expected_return_date: assignment.expected_return_date
          ? new Date(assignment.expected_return_date).toLocaleDateString()
          : "",
        actual_return_date: assignment.actual_return_date
          ? new Date(assignment.actual_return_date).toLocaleDateString()
          : "",
      })),
      headers
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=assignments-export.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("Export assignments CSV error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export assignments",
    });
  }
};

// Export low stock to CSV
exports.exportLowStockCSV = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const items = await Item.find({
      $expr: { $lte: ["$available_quantity", parseInt(threshold)] },
      status: "active",
    })
      .sort({ available_quantity: 1 })
      .lean();

    const headers = [
      "Name",
      "Category",
      "Current Stock",
      "Low Stock Threshold",
      "Unit",
      "Location",
      "Supplier",
    ];
    const csv = arrayToCSV(
      items.map((item) => ({
        name: item.name,
        category: item.category,
        current_stock: item.available_quantity,
        low_stock_threshold: item.low_stock_threshold || threshold,
        unit: item.unit,
        location: item.location,
        supplier: item.supplier || "",
      })),
      headers
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=low-stock-export.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("Export low stock CSV error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export low stock",
    });
  }
};
