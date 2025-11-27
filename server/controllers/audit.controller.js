const pool = require('../config/database');

// Get all audit logs
exports.getAllLogs = async (req, res) => {
  try {
    const { user_id, action, resource_type, limit = 100 } = req.query;
    
    let query = `
      SELECT a.*, u.username 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (user_id) {
      query += ` AND a.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }

    if (action) {
      query += ` AND a.action = $${paramIndex}`;
      params.push(action);
      paramIndex++;
    }

    if (resource_type) {
      query += ` AND a.resource_type = $${paramIndex}`;
      params.push(resource_type);
      paramIndex++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get audit logs'
    });
  }
};

// Get audit log statistics
exports.getStats = async (req, res) => {
  try {
    const stats = {};

    // Total logs
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM audit_logs');
    stats.total_logs = parseInt(totalResult.rows[0].count);

    // Logs by action
    const actionResult = await pool.query(
      'SELECT action, COUNT(*) as count FROM audit_logs GROUP BY action ORDER BY count DESC'
    );
    stats.by_action = actionResult.rows;

    // Logs by user
    const userResult = await pool.query(
      `SELECT u.username, COUNT(*) as count 
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       GROUP BY u.username
       ORDER BY count DESC
       LIMIT 10`
    );
    stats.by_user = userResult.rows;

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get audit stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get audit statistics'
    });
  }
};
