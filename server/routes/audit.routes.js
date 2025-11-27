const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');

// All routes require authentication and admin/manager role
router.use(authMiddleware);
router.use(requireRole('admin', 'manager'));

// Get all audit logs
router.get('/', auditController.getAllLogs);

// Get audit statistics
router.get('/stats', auditController.getStats);

module.exports = router;
