const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const suppliersController = require("../controllers/suppliers.controller");
const { authMiddleware } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authMiddleware);

// Validation rules
const supplierValidation = [
  body("name").trim().notEmpty().withMessage("Supplier name is required"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("phone").optional().trim(),
  body("currency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "INR", "BDT"])
    .withMessage("Invalid currency"),
  body("status")
    .optional()
    .isIn(["active", "inactive", "blocked"])
    .withMessage("Invalid status"),
];

// Routes
router.get("/", suppliersController.getAllSuppliers);
router.get("/stats", suppliersController.getSupplierStats);
router.get("/:id", suppliersController.getSupplierById);
router.post("/", supplierValidation, suppliersController.createSupplier);
router.put("/:id", supplierValidation, suppliersController.updateSupplier);
router.delete("/:id", suppliersController.deleteSupplier);

module.exports = router;
