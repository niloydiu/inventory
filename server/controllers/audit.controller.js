const { AuditLog } = require('../models');

// Get all audit logs
exports.getAllLogs = async (req, res) => {
  try {
    const { user_id, action, resource_type, limit = 100 } = req.query;
    
    // Build query filter
    const filter = {};

    if (user_id) {
      filter.user_id = user_id;
    }

    if (action) {
      filter.action = action;
    }

    if (resource_type) {
      filter.resource_type = resource_type;
    }

    // Fetch audit logs with user population
    const logs = await AuditLog.find(filter)
      .populate('user_id', 'username')
      .sort({ created_at: -1 })
      .limit(parseInt(limit));

    // Format response to include username at top level (matching PostgreSQL format)
    const formattedLogs = logs.map(log => {
      const logObj = log.toObject();
      return {
        ...logObj,
        username: logObj.user_id?.username || null,
        user_id: logObj.user_id?._id || logObj.user_id
      };
    });

    res.json({
      success: true,
      data: formattedLogs
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
    stats.total_logs = await AuditLog.countDocuments();

    // Logs by action - using aggregation
    const actionStats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $project: {
          _id: 0,
          action: '$_id',
          count: 1
        }
      }
    ]);
    stats.by_action = actionStats;

    // Logs by user - using aggregation with lookup
    const userStats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$user_id',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          username: { $ifNull: ['$user.username', null] },
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    stats.by_user = userStats;

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
