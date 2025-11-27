const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const categoriesController = require("../controllers/categories.controller");
const { authMiddleware } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authMiddleware);

// Validation rules
const categoryValidation = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("code").optional().trim(),
  body("parent_id").optional(),
];

// Routes
router.get("/", categoriesController.getAllCategories);
router.get("/tree", categoriesController.getCategoryTree);
router.get("/stats", categoriesController.getCategoryStats);
router.get("/:id", categoriesController.getCategoryById);
router.post("/", categoryValidation, categoriesController.createCategory);
router.put("/:id", categoryValidation, categoriesController.updateCategory);
router.delete("/:id", categoriesController.deleteCategory);

module.exports = router;
