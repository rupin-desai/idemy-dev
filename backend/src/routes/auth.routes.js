// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes - require authentication
router.get('/profile', authenticate, authController.getUserProfile);
router.put('/profile', authenticate, authController.updateUserProfile);
router.get('/verify-token', authenticate, authController.verifyToken);

// Add a test route
router.get('/test-auth', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    user: req.user
  });
});

// Admin routes - require admin role
router.get('/users', authenticate, authorizeRoles('admin'), (req, res) => {
  // This would be implemented in a real admin controller
  res.status(200).json({
    success: true,
    message: 'Admin access granted'
  });
});

module.exports = router;