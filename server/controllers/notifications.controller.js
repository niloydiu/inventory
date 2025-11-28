const Notification = require("../models/Notification");
const { validationResult } = require("express-validator");

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      priority,
      is_read,
      sort = "-created_at",
    } = req.query;

    const query = { user_id: req.user.user_id };

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Filter by read status
    if (is_read !== undefined) {
      query.is_read = is_read === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ user_id: req.user.user_id, is_read: false }),
    ]);

    res.json({
      notifications,
      unread_count: unreadCount,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(
      "[Notifications Controller] Error getting notifications:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user_id: req.user.user_id, // Ensure user can only access their own notifications
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error(
      "[Notifications Controller] Error getting notification:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new notification (typically called internally by the system)
exports.createNotification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const notification = new Notification(req.body);
    await notification.save();

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error(
      "[Notifications Controller] Error creating notification:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.user_id },
      { is_read: true, read_at: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("[Notifications Controller] Error marking as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user_id: req.user.user_id, is_read: false },
      { is_read: true, read_at: new Date() }
    );

    res.json({
      message: "All notifications marked as read",
      updated_count: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "[Notifications Controller] Error marking all as read:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.user_id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(
      "[Notifications Controller] Error deleting notification:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete all read notifications
exports.deleteAllRead = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      user_id: req.user.user_id,
      is_read: true,
    });

    res.json({
      message: "All read notifications deleted",
      deleted_count: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "[Notifications Controller] Error deleting read notifications:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Utility function to create notification (for internal use by other controllers)
exports.createNotificationForUser = async (userId, notificationData) => {
  try {
    const notification = new Notification({
      user_id: userId,
      ...notificationData,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error(
      "[Notifications Controller] Error creating notification:",
      error
    );
    throw error;
  }
};

// Utility function to create notifications for multiple users
exports.createNotificationsForUsers = async (userIds, notificationData) => {
  try {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      ...notificationData,
    }));

    const result = await Notification.insertMany(notifications);
    return result;
  } catch (error) {
    console.error(
      "[Notifications Controller] Error creating bulk notifications:",
      error
    );
    throw error;
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const [total, unread, byType, byPriority] = await Promise.all([
      Notification.countDocuments({ user_id: req.user.user_id }),
      Notification.countDocuments({ user_id: req.user.user_id, is_read: false }),
      Notification.aggregate([
        { $match: { user_id: req.user.user_id } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      Notification.aggregate([
        { $match: { user_id: req.user.user_id, is_read: false } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      stats: {
        total,
        unread,
        by_type: byType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        by_priority: byPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("[Notifications Controller] Error getting stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
