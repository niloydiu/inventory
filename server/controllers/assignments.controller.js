const pool = require('../config/database');

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
