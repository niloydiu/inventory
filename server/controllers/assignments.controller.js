const { Assignment, Item, User } = require('../models');

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
      .populate('item_id', 'name category')
      .populate('assigned_to_user_id', 'username full_name')
      .populate('assigned_by_user_id', 'username')
      .sort({ assignment_date: -1 });

    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assignments'
    });
  }
};

// Create assignment with atomic operations to prevent race conditions
exports.createAssignment = async (req, res) => {
  const mongoose = require('mongoose');
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { item_id, user_id, quantity = 1, notes, expected_return_date } = req.body;

    if (!item_id || !user_id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Item ID and User ID are required'
      });
    }

    // Atomic update - only decrement if enough quantity available
    const item = await Item.findOneAndUpdate(
      { 
        _id: item_id,
        available_quantity: { $gte: quantity }
      },
      { 
        $inc: { available_quantity: -quantity }
      },
      { 
        new: true,
        session
      }
    );

    if (!item) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Item not found or insufficient quantity available'
      });
    }

    // Create assignment
    const assignment = await Assignment.create([{
      item_id,
      assigned_to_user_id: user_id,
      assigned_by_user_id: req.user.user_id,
      quantity,
      notes,
      expected_return_date,
      status: 'assigned'
    }], { session });

    await session.commitTransaction();

    // Populate after transaction
    await assignment[0].populate([
      { path: 'item_id', select: 'name category' },
      { path: 'assigned_to_user_id', select: 'username full_name' },
      { path: 'assigned_by_user_id', select: 'username' }
    ]);

    res.status(201).json({
      success: true,
      data: assignment[0]
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment'
    });
  } finally {
    session.endSession();
  }
};

// Return assignment with atomic operations
exports.returnAssignment = async (req, res) => {
  const mongoose = require('mongoose');
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const { return_notes, condition_at_return } = req.body;

    // Get assignment
    const assignment = await Assignment.findOne({
      _id: id,
      status: 'assigned'
    }).session(session);

    if (!assignment) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Active assignment not found'
      });
    }

    // Update assignment
    assignment.status = 'returned';
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
        message: 'Item not found'
      });
    }

    await session.commitTransaction();

    // Populate before returning
    await assignment.populate([
      { path: 'item_id', select: 'name category' },
      { path: 'assigned_to_user_id', select: 'username full_name' },
      { path: 'assigned_by_user_id', select: 'username' }
    ]);

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Return assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to return assignment'
    });
  } finally {
    session.endSession();
  }
};
