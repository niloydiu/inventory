const pool = require('../config/database');

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    let query = 'SELECT * FROM items WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get items'
    });
  }
};

// Get single item
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item'
    });
  }
};

// Create item
exports.createItem = async (req, res) => {
  try {
    const { name, description, category, quantity, low_stock_threshold, location, serial_number, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Item name is required'
      });
    }

    const result = await pool.query(
      `INSERT INTO items (name, description, category, quantity, low_stock_threshold, location, serial_number, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, category, quantity || 0, low_stock_threshold || 10, location, serial_number, status || 'available']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item'
    });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, quantity, low_stock_threshold, location, serial_number, status } = req.body;

    const result = await pool.query(
      `UPDATE items 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           quantity = COALESCE($4, quantity),
           low_stock_threshold = COALESCE($5, low_stock_threshold),
           location = COALESCE($6, location),
           serial_number = COALESCE($7, serial_number),
           status = COALESCE($8, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, description, category, quantity, low_stock_threshold, location, serial_number, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item'
    });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item'
    });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM items WHERE category IS NOT NULL ORDER BY category');

    res.json({
      success: true,
      data: result.rows.map(row => row.category)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
};

// Get low stock items
exports.getLowStock = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM items WHERE quantity <= low_stock_threshold ORDER BY quantity ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get low stock items'
    });
  }
};

// Bulk create items
exports.bulkCreate = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const createdItems = [];
      for (const item of items) {
        const result = await client.query(
          `INSERT INTO items (name, description, category, quantity, low_stock_threshold, location, serial_number, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [item.name, item.description, item.category, item.quantity || 0, item.low_stock_threshold || 10, item.location, item.serial_number, item.status || 'available']
        );
        createdItems.push(result.rows[0]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: createdItems
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk create items'
    });
  }
};
