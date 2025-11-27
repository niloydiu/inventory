const pool = require('../config/database');

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const stats = {};

    // Total items
    const itemsResult = await pool.query('SELECT COUNT(*) as count FROM items');
    stats.total_items = parseInt(itemsResult.rows[0].count);

    // Low stock items
    const lowStockResult = await pool.query('SELECT COUNT(*) as count FROM items WHERE quantity <= low_stock_threshold');
    stats.low_stock = parseInt(lowStockResult.rows[0].count);

    // Active assignments
    const assignmentsResult = await pool.query("SELECT COUNT(*) as count FROM assignments WHERE status = 'active'");
    stats.active_assignments = parseInt(assignmentsResult.rows[0].count);

    // Total users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    stats.total_users = parseInt(usersResult.rows[0].count);

    // Items by category
    const categoriesResult = await pool.query(
      'SELECT category, COUNT(*) as count FROM items GROUP BY category ORDER BY count DESC'
    );
    stats.items_by_category = categoriesResult.rows;

    // Recent items
    const recentItemsResult = await pool.query(
      'SELECT * FROM items ORDER BY created_at DESC LIMIT 5'
    );
    stats.recent_items = recentItemsResult.rows;

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
};
