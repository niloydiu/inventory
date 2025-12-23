const { body, param, query, validationResult } = require("express-validator");

/**
 * Validation middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Item validation rules
 */
const itemValidationRules = {
  create: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 200 })
      .withMessage("Name too long"),
    body("category")
      .isIn([
        "Software",
        "Hardware",
        "Stationery",
        "Essentials",
        "Consumable",
        "Office Supplies",
        "Electronics",
        "Furniture",
        "Other",
      ])
      .withMessage("Invalid category"),
    body("quantity")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Quantity must be positive"),
    body("purchase_price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be positive"),
  ],
  update: [
    param("id").isMongoId().withMessage("Invalid ID"),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("quantity")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Quantity must be positive"),
  ],
};

/**
 * Auth validation rules
 */
const authValidationRules = {
  login: [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must be 3-50 characters")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "Username can only contain letters, numbers, underscores, and hyphens"
      )
      .escape(), // Escape HTML to prevent XSS
    body("password")
      .notEmpty()
      .withMessage("Password required")
      .isLength({ min: 6, max: 128 })
      .withMessage("Password must be 6-128 characters"),
    // Reject any additional fields to prevent pollution attacks
    body().custom((value, { req }) => {
      const allowedFields = ["username", "password"];
      const extraFields = Object.keys(req.body).filter(
        (key) => !allowedFields.includes(key)
      );
      if (extraFields.length > 0) {
        throw new Error(`Unexpected fields: ${extraFields.join(", ")}`);
      }
      return true;
    }),
  ],
  register: [
    body("username")
      .trim()
      .notEmpty()
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must be 3-50 characters")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "Username can only contain letters, numbers, underscores, and hyphens"
      )
      .escape(),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email")
      .isLength({ max: 254 })
      .withMessage("Email too long"),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be 8-128 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain uppercase, lowercase, and number"),
    body("full_name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Full name too long")
      .escape(),
    body("role")
      .optional()
      .isIn(["admin", "manager", "employee"])
      .withMessage("Invalid role"),
  ],
};

/**
 * Assignment validation rules
 */
const assignmentValidationRules = {
  create: [
    body("item_id").isMongoId().withMessage("Invalid item ID"),
    body("user_id").isMongoId().withMessage("Invalid user ID"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
};

module.exports = {
  validate,
  itemValidationRules,
  authValidationRules,
  assignmentValidationRules,
};
