const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');
const validateObjectId = require('../middleware/validateObjectId');
const { validate, assignmentValidationRules } = require('../middleware/validate');

// All routes require authentication
router.use(authMiddleware);

// Get all assignments
router.get('/', assignmentsController.getAllAssignments);

// Create assignment with validation
router.post('/', requireRole('admin', 'manager'), assignmentValidationRules.create, validate, auditLog('create', 'assignment'), assignmentsController.createAssignment);

// Return assignment
router.patch('/:id/return', validateObjectId(), auditLog('return', 'assignment'), assignmentsController.returnAssignment);

module.exports = router;
