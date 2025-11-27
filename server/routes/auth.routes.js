const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate, authValidationRules } = require('../middleware/validate');

// Public routes with validation
router.post('/register', authValidationRules.register, validate, authController.register);
router.post('/login', authValidationRules.login, validate, authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/refresh', authMiddleware, authController.refreshToken);

module.exports = router;
