const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nft.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Add this new route at the beginning of the file
router.get('/', nftController.getAllNFTs);

// Add this new route to get current user NFTs
router.get('/user', authMiddleware.authenticate, nftController.getCurrentUserNFTs);

// Create ID card for student
router.post('/idcards/:studentId', nftController.createIDCard);

// Get ID card for student
router.get('/idcards/:studentId', nftController.getIDCardByStudent);

// Get ID card image
router.get('/idcards/:studentId/image', nftController.getIDCardImage);

// Get NFT metadata
router.get('/idcards/:studentId/metadata', nftController.getNFTMetadata);

// Mint NFT for student ID card
router.post('/mint/:studentId', nftController.mintNFT);

// Transfer NFT ownership
router.post('/transfer/:tokenId', nftController.transferNFT);

// Get NFTs by student ID
router.get('/student/:studentId', nftController.getNFTsByStudent);

// Get NFT by token ID
router.get('/:tokenId', nftController.getNFTByTokenId);

// Verify NFT authenticity
router.get('/verify/:tokenId', nftController.verifyNFT);

module.exports = router;