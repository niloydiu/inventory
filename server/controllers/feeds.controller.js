const pool = require('../config/database');

// Get all feeds
exports.getAllFeeds = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT * FROM feeds WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get feeds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feeds'
    });
  }
};

// Get single feed
exports.getFeedById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM feeds WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feed not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feed'
    });
  }
};

// Create feed
exports.createFeed = async (req, res) => {
  try {
    const { name, type, quantity, unit, expiry_date, batch_number, supplier, cost_price, selling_price, sku, location } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Feed name is required'
      });
    }

    const result = await pool.query(
      `INSERT INTO feeds (name, type, quantity, unit, expiry_date, batch_number, supplier, cost_price, selling_price, sku, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, type, quantity, unit, expiry_date, batch_number, supplier, cost_price, selling_price, sku, location]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feed'
    });
  }
};

// Update feed
exports.updateFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, quantity, unit, expiry_date, batch_number, supplier, cost_price, selling_price, sku, location } = req.body;

    const result = await pool.query(
      `UPDATE feeds 
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           quantity = COALESCE($3, quantity),
           unit = COALESCE($4, unit),
           expiry_date = COALESCE($5, expiry_date),
           batch_number = COALESCE($6, batch_number),
           supplier = COALESCE($7, supplier),
           cost_price = COALESCE($8, cost_price),
           selling_price = COALESCE($9, selling_price),
           sku = COALESCE($10, sku),
           location = COALESCE($11, location),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [name, type, quantity, unit, expiry_date, batch_number, supplier, cost_price, selling_price, sku, location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feed not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feed'
    });
  }
};

// Delete feed
exports.deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM feeds WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feed not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Delete feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feed'
    });
  }
};
