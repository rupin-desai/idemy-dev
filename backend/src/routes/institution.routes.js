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
router.get('/:institutionId', institutionController.getInstitutionById);

// Protected routes
router.post('/', ...authMiddleware, institutionController.createInstitution);
router.put('/:institutionId', ...authMiddleware, institutionController.updateInstitution);
router.delete('/:institutionId', ...authMiddleware, institutionController.deleteInstitution);
router.post('/mint-nft', ...authMiddleware, institutionController.mintInstitutionNFT);

module.exports = router;