const ProductAssignment = require("../models/ProductAssignment");
const { Item, User } = require("../models");
const { paginatedQuery } = require("../utils/queryHelpers");

// Get all product assignments with pagination and filters
exports.getAllAssignments = async (req, res) => {
  try {
    // Clean the query to remove cache-busting parameters
    const cleanQuery = { ...req.query };
    delete cleanQuery._t;
    delete cleanQuery._;
    
    const result = await paginatedQuery(
      ProductAssignment,
      cleanQuery,
      [
        "purpose",
        "issue_remarks",
        "return_remarks",
        "serial_number",
        "asset_tag",
      ],
      [
        "item_id",
        "employee_id",
        "issued_by",
        "assigned_location",
        "return_acknowledgment.received_by",
      ]
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product assignments",
      error: error.message,
    });
  }
};

// Get single assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await ProductAssignment.findById(req.params.id)
      .populate("item_id")
      .populate("employee_id", "username email role")
      .populate("issued_by", "username email")
      .populate("assigned_location")
      .populate("return_acknowledgment.received_by", "username")
      .populate("history.performed_by", "username");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Get assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get assignment",
      error: error.message,
    });
  }
};

// Create new assignment
exports.createAssignment = async (req, res) => {
  try {
    const {
      item_id,
      employee_id,
      quantity,
      assigned_date,
      expected_return_date,
      purpose,
      issue_remarks,
      condition_on_issue,
      assigned_location,
      current_location,
      serial_number,
      asset_tag,
      warranty_covered,
      insurance_required,
      assigned_value,
    } = req.body;

    // Verify item exists and has sufficient quantity
    const item = await Item.findById(item_id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Available: ${item.quantity}, Requested: ${quantity}`,
      });
    }

    // Verify employee exists
    const employee = await User.findById(employee_id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Create assignment
    const assignment = new ProductAssignment({
      item_id,
      employee_id,
      issued_by: req.user.user_id,
      quantity,
      assigned_date: assigned_date || new Date(),
      expected_return_date,
      purpose,
      issue_remarks,
      condition_on_issue: condition_on_issue || "good",
      assigned_location,
      current_location: current_location || employee.department,
      serial_number,
      asset_tag,
      warranty_covered: warranty_covered || false,
      insurance_required: insurance_required || false,
      assigned_value,
      status: "assigned",
    });

    // Add initial history entry
    assignment.addHistory(
      "Assignment Created",
      req.user.user_id,
      `Assigned ${quantity} unit(s) of ${item.name} to ${employee.username}`,
      null,
      "assigned"
    );

    await assignment.save();

    // Update item quantity
    item.quantity -= quantity;
    await item.save();

    // Populate before sending response
    await assignment.populate([
      { path: "item_id" },
      { path: "employee_id", select: "username email role" },
      { path: "issued_by", select: "username email" },
      { path: "assigned_location" },
    ]);

    res.status(201).json({
      success: true,
      message: "Product assigned successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
      error: error.message,
    });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await ProductAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const oldStatus = assignment.status;

    // Update fields
    const allowedUpdates = [
      "expected_return_date",
      "status",
      "current_location",
      "issue_remarks",
      "return_remarks",
      "condition_on_return",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        assignment[field] = req.body[field];
      }
    });

    // Add history if status changed
    if (oldStatus !== assignment.status) {
      assignment.addHistory(
        "Status Updated",
        req.user.user_id,
        `Status changed from ${oldStatus} to ${assignment.status}`,
        oldStatus,
        assignment.status
      );
    }

    await assignment.save();

    await assignment.populate([
      { path: "item_id" },
      { path: "employee_id", select: "username email role" },
      { path: "issued_by", select: "username email" },
    ]);

    res.json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update assignment",
      error: error.message,
    });
  }
};

// Return product
exports.returnProduct = async (req, res) => {
  try {
    const { condition_on_return, return_remarks, current_value } = req.body;

    const assignment = await ProductAssignment.findById(req.params.id).populate(
      "item_id"
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (assignment.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Product already returned",
      });
    }

    // Update assignment
    assignment.actual_return_date = new Date();
    assignment.status = "returned";
    assignment.condition_on_return = condition_on_return;
    assignment.return_remarks = return_remarks;
    assignment.current_value = current_value;
    assignment.return_acknowledgment = {
      acknowledged: true,
      acknowledged_at: new Date(),
      received_by: req.user.user_id,
    };

    assignment.addHistory(
      "Product Returned",
      req.user.user_id,
      `Product returned in ${condition_on_return} condition`,
      "in_use",
      "returned"
    );

    await assignment.save();

    // Return quantity to item
    const item = await Item.findById(assignment.item_id);
    if (item) {
      item.quantity += assignment.quantity;
      await item.save();
    }

    await assignment.populate([
      { path: "employee_id", select: "username email role" },
      { path: "issued_by", select: "username email" },
      { path: "return_acknowledgment.received_by", select: "username" },
    ]);

    res.json({
      success: true,
      message: "Product returned successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Return product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to return product",
      error: error.message,
    });
  }
};

// Employee acknowledgment
exports.acknowledgeAssignment = async (req, res) => {
  try {
    const { signature, ip_address } = req.body;

    const assignment = await ProductAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (assignment.employee_id.toString() !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Only assigned employee can acknowledge",
      });
    }

    assignment.employee_acknowledgment = {
      acknowledged: true,
      acknowledged_at: new Date(),
      signature,
      ip_address: ip_address || req.ip,
    };

    assignment.status = "in_use";

    assignment.addHistory(
      "Employee Acknowledgment",
      req.user.user_id,
      "Employee acknowledged receipt of product",
      "assigned",
      "in_use"
    );

    await assignment.save();

    res.json({
      success: true,
      message: "Assignment acknowledged successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Acknowledge assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to acknowledge assignment",
      error: error.message,
    });
  }
};

// Get active assignments for an employee
exports.getEmployeeAssignments = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const assignments = await ProductAssignment.find({
      employee_id: employeeId,
      status: { $in: ["assigned", "in_use"] },
    })
      .populate("item_id")
      .populate("issued_by", "username email")
      .populate("assigned_location")
      .sort({ assigned_date: -1 });

    res.json({
      success: true,
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    console.error("Get employee assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get employee assignments",
      error: error.message,
    });
  }
};

// Get overdue assignments
exports.getOverdueAssignments = async (req, res) => {
  try {
    const assignments = await ProductAssignment.find({
      status: { $in: ["assigned", "in_use"] },
      expected_return_date: { $lt: new Date() },
    })
      .populate("item_id")
      .populate("employee_id", "username email role")
      .populate("issued_by", "username email")
      .sort({ expected_return_date: 1 });

    res.json({
      success: true,
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    console.error("Get overdue assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get overdue assignments",
      error: error.message,
    });
  }
};

// Get assignment statistics
exports.getAssignmentStats = async (req, res) => {
  try {
    const [total, assigned, inUse, returned, overdue] = await Promise.all([
      ProductAssignment.countDocuments(),
      ProductAssignment.countDocuments({ status: "assigned" }),
      ProductAssignment.countDocuments({ status: "in_use" }),
      ProductAssignment.countDocuments({ status: "returned" }),
      ProductAssignment.countDocuments({
        status: { $in: ["assigned", "in_use"] },
        expected_return_date: { $lt: new Date() },
      }),
    ]);

    // Get assignments by employee
    const byEmployee = await ProductAssignment.aggregate([
      { $match: { status: { $in: ["assigned", "in_use"] } } },
      { $group: { _id: "$employee_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Populate employee details
    await ProductAssignment.populate(byEmployee, {
      path: "_id",
      select: "username email role",
    });

    res.json({
      success: true,
      stats: {
        total,
        assigned,
        inUse,
        returned,
        overdue,
        active: assigned + inUse,
        byEmployee,
      },
    });
  } catch (error) {
    console.error("Get assignment stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get assignment statistics",
      error: error.message,
    });
  }
};

// Delete assignment (admin only)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await ProductAssignment.findById(req.params.id).populate(
      "item_id"
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // If assignment is active, return quantity to item
    if (assignment.status === "assigned" || assignment.status === "in_use") {
      const item = await Item.findById(assignment.item_id);
      if (item) {
        item.quantity += assignment.quantity;
        await item.save();
      }
    }

    await assignment.deleteOne();

    res.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete assignment",
      error: error.message,
    });
  }
};
