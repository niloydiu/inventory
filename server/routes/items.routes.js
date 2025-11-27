const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

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
router.get('/:id', itemsController.getItemById);

// Create item
router.post('/', requireRole('admin', 'manager'), auditLog('create', 'item'), itemsController.createItem);

// Update item
router.put('/:id', requireRole('admin', 'manager'), auditLog('update', 'item'), itemsController.updateItem);

// Delete item
router.delete('/:id', requireRole('admin', 'manager'), auditLog('delete', 'item'), itemsController.deleteItem);

module.exports = router;
