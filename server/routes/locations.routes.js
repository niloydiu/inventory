const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locations.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/locations - Get all locations
router.get('/', locationsController.getAllLocations);

// GET /api/v1/locations/:id - Get single location
router.get('/:id', locationsController.getLocationById);

// POST /api/v1/locations - Create location (Manager/Admin only)
router.post('/', authorize(['admin', 'manager']), locationsController.createLocation);

// PUT /api/v1/locations/:id - Update location (Manager/Admin only)
router.put('/:id', authorize(['admin', 'manager']), locationsController.updateLocation);

// DELETE /api/v1/locations/:id - Delete location (Admin only)
router.delete('/:id', authorize(['admin']), locationsController.deleteLocation);

module.exports = router;
