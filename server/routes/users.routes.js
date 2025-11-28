const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const auditLog = require("../middleware/audit");

// All routes require authentication
router.use(authMiddleware);

// Get all users
router.get("/", requireRole("admin", "manager"), usersController.getAllUsers);

// Create user (admin only)
router.post(
  "/",
  requireRole("admin"),
  auditLog("create", "user"),
  usersController.createUser
);

// Get single user
router.get("/:id", usersController.getUserById);

// Update user
router.put(
  "/:id",
  requireRole("admin"),
  auditLog("update", "user"),
  usersController.updateUser
);

// Delete user
router.delete(
  "/:id",
  requireRole("admin"),
  auditLog("delete", "user"),
  usersController.deleteUser
);

module.exports = router;
