const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const stockMovementsController = require("../controllers/stockMovements.controller");
const { authMiddleware } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authMiddleware);

// Validation rules
const movementValidation = [
  body("item_id").notEmpty().withMessage("Item ID is required"),
  body("location_id").notEmpty().withMessage("Location ID is required"),
  body("movement_type")
    .isIn([
      "purchase",
      "sale",
      "transfer_in",
      "transfer_out",
      "adjustment",
      "damage",
      "expiry",
      "return",
    ])
    .withMessage("Invalid movement type"),
  body("quantity").isInt().withMessage("Quantity must be a number"),
];

// Routes
router.get("/", stockMovementsController.getAllMovements);
router.get("/stats", stockMovementsController.getMovementStats);
router.get("/summary", stockMovementsController.getMovementSummary);
router.get("/item/:item_id", stockMovementsController.getItemMovementHistory);
router.get("/:id", stockMovementsController.getMovementById);
router.post("/", movementValidation, stockMovementsController.createMovement);

module.exports = router;
