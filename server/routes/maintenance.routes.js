const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/maintenance - Get all maintenance records
router.get('/', maintenanceController.getAllMaintenance);

// GET /api/v1/maintenance/upcoming - Get upcoming maintenance
router.get('/upcoming', maintenanceController.getUpcomingMaintenance);

// GET /api/v1/maintenance/:id - Get single maintenance record
router.get('/:id', maintenanceController.getMaintenanceById);

// POST /api/v1/maintenance - Create maintenance record (Manager/Admin only)
router.post('/', authorize(['admin', 'manager']), maintenanceController.createMaintenance);

// PUT /api/v1/maintenance/:id - Update maintenance record (Manager/Admin only)
router.put('/:id', authorize(['admin', 'manager']), maintenanceController.updateMaintenance);

// DELETE /api/v1/maintenance/:id - Delete maintenance record (Admin only)
router.delete('/:id', authorize(['admin']), maintenanceController.deleteMaintenance);

module.exports = router;
