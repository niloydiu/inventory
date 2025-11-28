const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications.controller");
const { authMiddleware } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authMiddleware);

// Routes
router.get("/", notificationsController.getNotifications);
router.get("/stats", notificationsController.getNotificationStats);
router.post("/mark-all-read", notificationsController.markAllAsRead);
router.delete("/delete-all-read", notificationsController.deleteAllRead);
router.get("/:id", notificationsController.getNotificationById);
router.post("/:id/read", notificationsController.markAsRead);
router.delete("/:id", notificationsController.deleteNotification);

module.exports = router;
