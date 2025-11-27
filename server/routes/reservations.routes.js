const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservations.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/reservations - Get all reservations
router.get('/', reservationsController.getAllReservations);

// GET /api/v1/reservations/:id - Get single reservation
router.get('/:id', reservationsController.getReservationById);

// POST /api/v1/reservations - Create reservation
router.post('/', reservationsController.createReservation);

// PUT /api/v1/reservations/:id - Update reservation
router.put('/:id', reservationsController.updateReservation);

// DELETE /api/v1/reservations/:id - Delete reservation
router.delete('/:id', reservationsController.deleteReservation);

module.exports = router;
