const { Item, Assignment, Livestock, Feed, User } = require('../models');

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const stats = {};

    // Total items
    stats.total_items = await Item.countDocuments();

    // Low stock count - items where quantity is less than or equal to low_stock_threshold
    stats.low_stock_count = await Item.countDocuments({
      $expr: { $lte: ['$quantity', '$low_stock_threshold'] }
    });
    
    // For backward compatibility
    stats.low_stock = stats.low_stock_count;

    // Active assignments - check for both 'active' and 'assigned' status
    stats.active_assignments = await Assignment.countDocuments({ 
      status: { $in: ['active', 'assigned'] }
    });

    // Total users
    stats.total_users = await User.countDocuments();

    // Items by category - aggregate both old category field and new category_id
    const categoriesResult = await Item.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $project: {
          category: {
            $cond: {
              if: { $gt: [{ $size: '$categoryInfo' }, 0] },
              then: { $arrayElemAt: ['$categoryInfo.name', 0] },
              else: { $ifNull: ['$category', 'Uncategorized'] }
            }
          }
        }
      },
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
    
    // Convert categories to object format for chart
    stats.category_stats = {};
    stats.total_categories = categoriesResult.length;
    categoriesResult.forEach(cat => {
      stats.category_stats[cat.category] = cat.count;
    });
    stats.items_by_category = categoriesResult;

    // Recent items with populated category info
    const recentItemsResult = await Item.find()
      .populate('category_id', 'name')
      .sort({ created_at: -1 })
      .limit(5)
      .lean();
    
    // Transform recent items to include proper category display
    stats.recent_items = recentItemsResult.map(item => ({
      ...item,
      category: item.category_id?.name || item.category || 'Uncategorized'
    }));

    // Low stock items for the alert component
    const lowStockItems = await Item.find({
      $expr: { $lte: ['$quantity', '$low_stock_threshold'] }
    })
    .populate('category_id', 'name')
    .sort({ quantity: 1 })
    .limit(10)
    .lean();
    
    stats.low_stock_items = lowStockItems.map(item => ({
      ...item,
      category: item.category_id?.name || item.category || 'Uncategorized',
      unit_type: item.unit || 'units'
    }));

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
