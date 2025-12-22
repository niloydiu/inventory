const express = require("express");
const router = express.Router();
const stockAdjustmentsController = require("../controllers/stockAdjustments.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { body } = require("express-validator");

// Apply authentication to all routes
router.use(authMiddleware);

// Validation rules
const adjustmentValidation = [
  body("item_id").notEmpty().withMessage("Item ID is required"),
  body("adjustment_type")
    .isIn(["increase", "decrease"])
    .withMessage("Adjustment type must be 'increase' or 'decrease'"),
  body("quantity")
    .isNumeric()
    .isFloat({ min: 0.01 })
    .withMessage("Quantity must be greater than 0"),
  body("reason")
    .isIn([
      "damage",
      "theft",
      "loss",
      "found",
      "expired",
      "quality_issue",
      "physical_count",
      "other",
    ])
    .withMessage("Invalid reason"),
  body("notes").optional().trim(),
  body("location_id").optional(),
];

// Routes
router.get("/", stockAdjustmentsController.getAllAdjustments);
router.get("/stats", stockAdjustmentsController.getAdjustmentStats);
router.get("/:id", stockAdjustmentsController.getAdjustmentById);
router.post(
  "/",
  requireRole("admin", "manager"),
  adjustmentValidation,
  stockAdjustmentsController.createAdjustment
);
router.post(
  "/:id/approve",
  requireRole("admin", "manager"),
  stockAdjustmentsController.approveAdjustment
);
router.post(
  "/:id/reject",
  requireRole("admin", "manager"),
  stockAdjustmentsController.rejectAdjustment
);
router.delete(
  "/:id",
  requireRole("admin"),
  stockAdjustmentsController.deleteAdjustment
);

module.exports = router;
