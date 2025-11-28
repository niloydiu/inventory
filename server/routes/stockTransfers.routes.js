const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const stockTransfersController = require("../controllers/stockTransfers.controller");
const { authMiddleware } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authMiddleware);

// Validation rules
const transferValidation = [
  body("from_location_id").notEmpty().withMessage("From location is required"),
  body("to_location_id").notEmpty().withMessage("To location is required"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.item_id").notEmpty().withMessage("Item ID is required"),
  body("items.*.quantity_sent")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

// Update validation rules (more flexible)
const updateValidation = [
  body("from_location_id").optional().notEmpty().withMessage("From location cannot be empty"),
  body("to_location_id").optional().notEmpty().withMessage("To location cannot be empty"),
  body("items").optional().isArray({ min: 1 }).withMessage("At least one item is required"),
  body("items.*.item_id").optional().notEmpty().withMessage("Item ID is required"),
  body("items.*.quantity_sent").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

// Routes
router.get("/", stockTransfersController.getAllTransfers);
router.get("/stats", stockTransfersController.getTransferStats);
router.get("/:id", stockTransfersController.getTransferById);
router.post("/", transferValidation, stockTransfersController.createTransfer);
router.put("/:id", updateValidation, stockTransfersController.updateTransfer);
router.delete("/:id", stockTransfersController.deleteTransfer);
router.post("/:id/approve", stockTransfersController.approveTransfer);
router.post("/:id/ship", stockTransfersController.shipTransfer);
router.post("/:id/receive", stockTransfersController.receiveTransfer);
router.post("/:id/cancel", stockTransfersController.cancelTransfer);

module.exports = router;
