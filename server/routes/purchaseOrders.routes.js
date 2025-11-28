const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const purchaseOrdersController = require("../controllers/purchaseOrders.controller");
const { authMiddleware } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authMiddleware);

// Validation rules
const poValidation = [
  body("supplier_id").notEmpty().withMessage("Supplier is required"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.item_id").notEmpty().withMessage("Item ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.unit_price")
    .isFloat({ min: 0 })
    .withMessage("Unit price must be non-negative"),
];

// Routes
router.get("/", purchaseOrdersController.getAllPurchaseOrders);
router.get("/stats", purchaseOrdersController.getPurchaseOrderStats);
router.get("/:id", purchaseOrdersController.getPurchaseOrderById);
router.post("/", poValidation, purchaseOrdersController.createPurchaseOrder);
router.put("/:id", poValidation, purchaseOrdersController.updatePurchaseOrder);
router.post("/:id/approve", purchaseOrdersController.approvePurchaseOrder);
router.post("/:id/receive", purchaseOrdersController.receivePurchaseOrder);
router.post("/:id/cancel", purchaseOrdersController.cancelPurchaseOrder);

module.exports = router;
