const express = require('express');
const router = express.Router();
const feedsController = require('../controllers/feeds.controller');
const { authMiddleware, requireRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

// All routes require authentication
router.use(authMiddleware);

// Get all feeds
router.get('/', feedsController.getAllFeeds);

// Get single feed
router.get('/:id', feedsController.getFeedById);

// Create feed
router.post('/', requireRole('admin', 'manager'), auditLog('create', 'feed'), feedsController.createFeed);

// Update feed
router.put('/:id', requireRole('admin', 'manager'), auditLog('update', 'feed'), feedsController.updateFeed);

// Delete feed
router.delete('/:id', requireRole('admin', 'manager'), auditLog('delete', 'feed'), feedsController.deleteFeed);

module.exports = router;
