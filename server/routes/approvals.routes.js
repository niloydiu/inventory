const express = require('express');
const router = express.Router();
const approvalsController = require('../controllers/approvals.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/approvals - Get all approval requests
router.get('/', approvalsController.getAllApprovals);

// GET /api/v1/approvals/pending - Get pending approvals
router.get('/pending', approvalsController.getPendingApprovals);

// GET /api/v1/approvals/:id - Get single approval
router.get('/:id', approvalsController.getApprovalById);

// POST /api/v1/approvals - Create approval request
router.post('/', approvalsController.createApproval);

// PATCH /api/v1/approvals/:id/approve - Approve request (Manager/Admin only)
router.patch('/:id/approve', authorize(['admin', 'manager']), approvalsController.approveRequest);

// PATCH /api/v1/approvals/:id/reject - Reject request (Manager/Admin only)
router.patch('/:id/reject', authorize(['admin', 'manager']), approvalsController.rejectRequest);

// DELETE /api/v1/approvals/:id - Delete approval
router.delete('/:id', approvalsController.deleteApproval);

module.exports = router;
