const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth");
const { validate, authValidationRules } = require("../middleware/validate");

// Public routes with validation
router.post(
  "/register",
  authValidationRules.register,
  validate,
  authController.register
);
router.post(
  "/login",
  authValidationRules.login,
  validate,
  authController.login
);
router.post("/logout", authController.logout);

// Protected routes
router.get("/me", authMiddleware, authController.getCurrentUser);
router.put("/profile", authMiddleware, authController.updateProfile);
router.post("/refresh", authMiddleware, authController.refreshToken);

module.exports = router;
