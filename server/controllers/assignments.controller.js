const { Assignment, Item, User } = require("../models");

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const { user_id, status } = req.query;

    let filter = {};

    if (user_id) {
      filter.assigned_to_user_id = user_id;
    }

    if (status) {
      filter.status = status;
    }

    const assignments = await Assignment.find(filter)
      .populate("item_id", "name category")
      .populate("assigned_to_user_id", "username full_name")
      .populate("assigned_by_user_id", "username")
      .sort({ assignment_date: -1 });

    // Format the response to include readable names
    const formattedAssignments = assignments.map((assignment) => ({
      ...assignment.toObject(),
      item_name: assignment.item_id?.name || "Unknown Item",
      employee_name:
        assignment.assigned_to_user_id?.full_name ||
        assignment.assigned_to_user_id?.username ||
        "Unknown User",
      assigned_by_name: assignment.assigned_by_user_id?.username || "Unknown",
    }));

    res.json({
      success: true,
      data: formattedAssignments,
    });
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get assignments",
    });
  }
};

// Create assignment with atomic operations to prevent race conditions
exports.createAssignment = async (req, res) => {
  const mongoose = require("mongoose");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      item_id,
      user_id,
      quantity = 1,
      notes,
      expected_return_date,
    } = req.body;

    console.log("Create assignment request body:", req.body);
    console.log("Parsed values:", { item_id, user_id, quantity, notes });

    if (!item_id || !user_id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Item ID and User ID are required",
      });
    }

    // First, get the item to check its current state
    console.log("Looking for item with ID:", item_id);
    let itemCheck = await Item.findById(item_id).session(session);

    if (!itemCheck) {
      console.log("Item not found with ID:", item_id);
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Item not found",
      });
    }

    console.log("Found item (before fix):", {
      id: itemCheck._id,
      name: itemCheck.name,
      quantity: itemCheck.quantity,
      available_quantity: itemCheck.available_quantity,
      reserved_quantity: itemCheck.reserved_quantity,
    });

    // If available_quantity is not set, initialize it atomically
    if (
      itemCheck.available_quantity === undefined ||
      itemCheck.available_quantity === null
    ) {
      console.log("available_quantity not set, initializing it");
      const calculatedAvailable =
        itemCheck.quantity - (itemCheck.reserved_quantity || 0);
      await Item.findByIdAndUpdate(
        item_id,
        { $set: { available_quantity: calculatedAvailable } },
        { session }
      );
      // Re-fetch the item to get the updated value
      itemCheck = await Item.findById(item_id).session(session);
      console.log("Item after initialization:", {
        available_quantity: itemCheck.available_quantity,
      });
    }

    // Calculate the actual available quantity
    const actualAvailableQty = itemCheck.available_quantity;

    console.log("Actual available quantity:", actualAvailableQty);

    // Check if enough quantity is available
    if (actualAvailableQty < quantity) {
      console.log(
        `Insufficient quantity: requested ${quantity}, available ${actualAvailableQty}`
      );
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity available. Only ${actualAvailableQty} units available.`,
      });
    }

    // Atomic update - only decrement if enough quantity available
    const item = await Item.findOneAndUpdate(
      {
        _id: item_id,
        available_quantity: { $gte: quantity },
      },
      {
        $inc: { available_quantity: -quantity },
      },
      {
        new: true,
        session,
      }
    );

    if (!item) {
      console.log(
        "Atomic update failed - concurrent modification or insufficient quantity"
      );
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Item not found or insufficient quantity available",
      });
    }

    console.log("Item updated successfully, creating assignment");

    // Create assignment
    const assignment = await Assignment.create(
      [
        {
          item_id,
          assigned_to_user_id: user_id,
          assigned_by_user_id: req.user.user_id,
          quantity,
          notes,
          expected_return_date,
          status: "assigned",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    console.log("Assignment created successfully");

    // Populate after transaction
    await assignment[0].populate([
      { path: "item_id", select: "name category" },
      { path: "assigned_to_user_id", select: "username full_name" },
      { path: "assigned_by_user_id", select: "username" },
    ]);

    res.status(201).json({
      success: true,
      data: assignment[0],
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Create assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
    });
  } finally {
    session.endSession();
  }
};

// Return assignment with atomic operations
exports.returnAssignment = async (req, res) => {
  const mongoose = require("mongoose");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { return_notes, condition_at_return } = req.body;

    // Get assignment
    const assignment = await Assignment.findOne({
      _id: id,
      status: "assigned",
    }).session(session);

    if (!assignment) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Active assignment not found",
      });
    }

    // Update assignment
    assignment.status = "returned";
    assignment.actual_return_date = new Date();
    assignment.return_notes = return_notes;
    assignment.condition_at_return = condition_at_return;
    await assignment.save({ session });

    // Atomic update to return quantity to item
    const item = await Item.findByIdAndUpdate(
      assignment.item_id,
      { $inc: { available_quantity: assignment.quantity } },
      { new: true, session }
    );

    if (!item) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await session.commitTransaction();

    // Populate before returning
    await assignment.populate([
      { path: "item_id", select: "name category" },
      { path: "assigned_to_user_id", select: "username full_name" },
      { path: "assigned_by_user_id", select: "username" },
    ]);

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Return assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to return assignment",
    });
  } finally {
    session.endSession();
  }
};
