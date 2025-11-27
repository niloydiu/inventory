const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

// All routes require authentication
router.use(authMiddleware);

// Get all assignments
router.get('/', assignmentsController.getAllAssignments);

// Create assignment
router.post('/', requireRole('admin', 'manager'), auditLog('create', 'assignment'), assignmentsController.createAssignment);

// Return assignment
router.patch('/:id/return', auditLog('return', 'assignment'), assignmentsController.returnAssignment);

module.exports = router;
