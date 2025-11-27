const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Item validation rules
 */
const itemValidationRules = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required')
      .isLength({ max: 200 }).withMessage('Name too long'),
    body('category').isIn(['Software', 'Hardware', 'Office Supplies', 'Electronics', 'Furniture', 'Other'])
      .withMessage('Invalid category'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be positive'),
    body('purchase_price').optional().isFloat({ min: 0 }).withMessage('Price must be positive'),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be positive'),
  ]
};

/**
 * Auth validation rules
 */
const authValidationRules = {
  login: [
    body('username').trim().notEmpty().withMessage('Username required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('password').notEmpty().withMessage('Password required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register: [
    body('username').trim().notEmpty().isLength({ min: 3, max: 50 })
      .withMessage('Username must be 3-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
    body('role').optional().isIn(['admin', 'manager', 'employee']).withMessage('Invalid role'),
  ]
};

/**
 * Assignment validation rules
 */
const assignmentValidationRules = {
  create: [
    body('item_id').isMongoId().withMessage('Invalid item ID'),
    body('user_id').isMongoId().withMessage('Invalid user ID'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ]
};

module.exports = { 
  validate, 
  itemValidationRules, 
  authValidationRules,
  assignmentValidationRules 
};
