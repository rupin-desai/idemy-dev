const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticateToken, bypassAuthForAdmin } = require('../middleware/auth.middleware');

// Use the bypass middleware for development in addition to standard auth
const authMiddleware = process.env.NODE_ENV === 'development' 
  ? [bypassAuthForAdmin]
  : [authenticateToken];

// All routes require authentication
router.use(...authMiddleware);

// Application routes
router.get('/', applicationController.getAllApplications);
router.get('/:applicationId', applicationController.getApplicationById);
router.get('/student/:studentId', applicationController.getApplicationsByStudent);
router.get('/institution/:institutionId', applicationController.getApplicationsByInstitution);
router.post('/', applicationController.createApplication);
router.put('/:applicationId/status', applicationController.updateApplicationStatus);
router.post('/:applicationId/verify', applicationController.verifyApplication);

// Route to confirm an application
router.post('/:applicationId/confirm', applicationController.confirmApplication);

// Route to mark studies as completed
router.post('/:applicationId/complete', applicationController.completeStudies);

module.exports = router;