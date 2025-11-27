const express = require('express');
const router = express.Router();
const livestockController = require('../controllers/livestock.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

// All routes require authentication
router.use(authMiddleware);

// Get all livestock
router.get('/', livestockController.getAllLivestock);

// Get single livestock
router.get('/:id', livestockController.getLivestockById);

// Create livestock
router.post('/', requireRole('admin', 'manager'), auditLog('create', 'livestock'), livestockController.createLivestock);

// Update livestock
router.put('/:id', requireRole('admin', 'manager'), auditLog('update', 'livestock'), livestockController.updateLivestock);

// Delete livestock
router.delete('/:id', requireRole('admin', 'manager'), auditLog('delete', 'livestock'), livestockController.deleteLivestock);

module.exports = router;
