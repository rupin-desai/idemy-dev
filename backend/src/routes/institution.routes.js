const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller');
const { authenticateToken, bypassAuthForAdmin } = require('../middleware/auth.middleware');

// Use the bypass middleware for development in addition to standard auth
const authMiddleware = process.env.NODE_ENV === 'development' 
  ? [bypassAuthForAdmin]
  : [authenticateToken];

// Public routes
router.get('/', institutionController.getAllInstitutions);
router.get('/active', institutionController.getActiveInstitutions);

// Update your existing route to use the correct middleware

// Make sure this route is BEFORE any routes with :institutionId parameter
// to prevent route conflicts
router.get('/me', ...authMiddleware, institutionController.getInstitutionByUserEmail);

// Other routes
router.get('/:institutionId', ...authMiddleware, institutionController.getInstitutionById);

// Protected routes
router.post('/', ...authMiddleware, institutionController.createInstitution);
router.put('/:institutionId', ...authMiddleware, institutionController.updateInstitution);
router.delete('/:institutionId', ...authMiddleware, institutionController.deleteInstitution);
router.post('/:institutionId/mint-nft', ...authMiddleware, institutionController.mintInstitutionNFT);

// Get institution applications
router.get('/:institutionId/applications', institutionController.getInstitutionApplications);

module.exports = router;