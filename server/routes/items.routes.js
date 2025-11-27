const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');
const validateObjectId = require('../middleware/validateObjectId');
const { validate, itemValidationRules } = require('../middleware/validate');

// All routes require authentication
router.use(authMiddleware);

// Get all items
router.get('/', itemsController.getAllItems);

// Get categories
router.get('/categories', itemsController.getCategories);

// Get low stock items
router.get('/low-stock', itemsController.getLowStock);

// Bulk create
router.post('/bulk', requireRole('admin', 'manager'), auditLog('bulk_create', 'items'), itemsController.bulkCreate);

// Get single item
router.get('/:id', validateObjectId(), itemsController.getItemById);

// Create item
router.post('/', requireRole('admin', 'manager'), itemValidationRules.create, validate, auditLog('create', 'item'), itemsController.createItem);

// Update item
router.put('/:id', validateObjectId(), requireRole('admin', 'manager'), itemValidationRules.update, validate, auditLog('update', 'item'), itemsController.updateItem);

// Delete item
router.delete('/:id', validateObjectId(), requireRole('admin', 'manager'), auditLog('delete', 'item'), itemsController.deleteItem);

module.exports = router;
