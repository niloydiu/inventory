const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");
const { authenticate } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/v1/reports/low-stock
router.get("/low-stock", reportsController.getLowStockReport);

// GET /api/v1/reports/assigned-items
router.get("/assigned-items", reportsController.getAssignedItemsReport);

// GET /api/v1/reports/seat-usage/:itemId
router.get("/seat-usage/:itemId", reportsController.getSeatUsageReport);

module.exports = router;
