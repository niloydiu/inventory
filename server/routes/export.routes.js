const express = require("express");
const router = express.Router();
const exportController = require("../controllers/export.controller");
const { authenticate } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/v1/export/items/csv
router.get("/items/csv", exportController.exportItemsCSV);

// GET /api/v1/export/assignments/csv
router.get("/assignments/csv", exportController.exportAssignmentsCSV);

// GET /api/v1/export/low-stock/csv
router.get("/low-stock/csv", exportController.exportLowStockCSV);

module.exports = router;
