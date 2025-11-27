const pool = require('../config/database');

// Get all livestock
exports.getAllLivestock = async (req, res) => {
  try {
    const { species, health_status } = req.query;
    
    let query = 'SELECT * FROM livestock WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (species) {
      query += ` AND species = $${paramIndex}`;
      params.push(species);
      paramIndex++;
    }

    if (health_status) {
      query += ` AND health_status = $${paramIndex}`;
      params.push(health_status);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get livestock'
    });
  }
};

// Get single livestock
exports.getLivestockById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM livestock WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get livestock'
    });
  }
};

// Create livestock
exports.createLivestock = async (req, res) => {
  try {
    const { tag_number, species, breed, birth_date, gender, health_status, location, weight, notes } = req.body;

    if (!tag_number) {
      return res.status(400).json({
        success: false,
        message: 'Tag number is required'
      });
    }

    const result = await pool.query(
      `INSERT INTO livestock (tag_number, species, breed, birth_date, gender, health_status, location, weight, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [tag_number, species, breed, birth_date, gender, health_status || 'healthy', location, weight, notes]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create livestock'
    });
  }
};

// Update livestock
exports.updateLivestock = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag_number, species, breed, birth_date, gender, health_status, location, weight, notes } = req.body;

    const result = await pool.query(
      `UPDATE livestock 
       SET tag_number = COALESCE($1, tag_number),
           species = COALESCE($2, species),
           breed = COALESCE($3, breed),
           birth_date = COALESCE($4, birth_date),
           gender = COALESCE($5, gender),
           health_status = COALESCE($6, health_status),
           location = COALESCE($7, location),
           weight = COALESCE($8, weight),
           notes = COALESCE($9, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [tag_number, species, breed, birth_date, gender, health_status, location, weight, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update livestock'
    });
  }
};

// Delete livestock
exports.deleteLivestock = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM livestock WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Delete livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete livestock'
    });
  }
};
