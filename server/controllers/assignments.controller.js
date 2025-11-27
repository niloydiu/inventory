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

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const { item_id, user_id, quantity = 1, notes, expected_return_date } = req.body;

    if (!item_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and User ID are required'
      });
    }

    // Check if item has enough quantity
    const item = await Item.findById(item_id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.available_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient quantity available'
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      item_id,
      assigned_to_user_id: user_id,
      assigned_by_user_id: req.user.user_id,
      quantity,
      notes,
      expected_return_date,
      status: 'assigned'
    });

    // Update item available quantity
    item.available_quantity -= quantity;
    await item.save();

    // Populate the assignment before returning
    await assignment.populate([
      { path: 'item_id', select: 'name category' },
      { path: 'assigned_to_user_id', select: 'username full_name' },
      { path: 'assigned_by_user_id', select: 'username' }
    ]);

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment'
    });
  }
};

// Return assignment
exports.returnAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { return_notes, condition_at_return } = req.body;

    // Get assignment
    const assignment = await Assignment.findOne({
      _id: id,
      status: 'assigned'
    });

    if (!assignment) {
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
    await assignment.save();

    // Return quantity to item
    const item = await Item.findById(assignment.item_id);
    if (item) {
      item.available_quantity += assignment.quantity;
      await item.save();
    }

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
    console.error('Return assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to return assignment'
    });
  }
};

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const { user_id, status } = req.query;
    
    let query = `
      SELECT a.*, 
             i.name as item_name, 
             u.username as assigned_to,
             ub.username as assigned_by_name
      FROM assignments a
      LEFT JOIN items i ON a.item_id = i.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN users ub ON a.assigned_by = ub.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (user_id) {
      query += ` AND a.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY a.assigned_date DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assignments'
    });
  }
};

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const { item_id, user_id, quantity = 1, notes } = req.body;

    if (!item_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and User ID are required'
      });
    }

    // Check if item has enough quantity
    const itemResult = await pool.query('SELECT quantity FROM items WHERE id = $1', [item_id]);
    
    if (itemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (itemResult.rows[0].quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient quantity'
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create assignment
      const assignmentResult = await client.query(
        `INSERT INTO assignments (item_id, user_id, assigned_by, quantity, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [item_id, user_id, req.user.user_id, quantity, notes]
      );

      // Update item quantity
      await client.query(
        'UPDATE items SET quantity = quantity - $1 WHERE id = $2',
        [quantity, item_id]
      );

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: assignmentResult.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment'
    });
  }
};

// Return assignment
exports.returnAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get assignment
      const assignmentResult = await client.query(
        'SELECT * FROM assignments WHERE id = $1 AND status = $2',
        [id, 'active']
      );

      if (assignmentResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'Active assignment not found'
        });
      }

      const assignment = assignmentResult.rows[0];

      // Update assignment
      const updateResult = await client.query(
        `UPDATE assignments 
         SET status = 'returned', 
             return_date = CURRENT_TIMESTAMP,
             notes = COALESCE($1, notes)
         WHERE id = $2
         RETURNING *`,
        [notes, id]
      );

      // Return quantity to item
      await client.query(
        'UPDATE items SET quantity = quantity + $1 WHERE id = $2',
        [assignment.quantity, assignment.item_id]
      );

      await client.query('COMMIT');

      res.json({
        success: true,
        data: updateResult.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Return assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to return assignment'
    });
  }
};
