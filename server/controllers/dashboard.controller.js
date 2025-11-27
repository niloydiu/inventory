const { Item, Assignment, Livestock, Feed, User } = require('../models');

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const stats = {};

    // Total items
    stats.total_items = await Item.countDocuments();

    // Low stock items
    stats.low_stock = await Item.countDocuments({
      $expr: { $lte: ['$quantity', '$low_stock_threshold'] }
    });

    // Active assignments
    stats.active_assignments = await Assignment.countDocuments({ status: 'active' });

    // Total users
    stats.total_users = await User.countDocuments();

    // Items by category
    const categoriesResult = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    stats.items_by_category = categoriesResult;

    // Recent items
    const recentItemsResult = await Item.find()
      .sort({ created_at: -1 })
      .limit(5)
      .lean();
    stats.recent_items = recentItemsResult;

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
