const express = require("express");
const router = express.Router();
const nftController = require("../controllers/nft.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Get all NFTs
router.get("/", (req, res) => nftController.getAllNFTs(req, res));

// Get current user NFTs
router.get("/user", authMiddleware.authenticate, (req, res) =>
  nftController.getCurrentUserNFTs(req, res)
);

// Create ID card for student
router.post("/idcards/:studentId", (req, res) =>
  nftController.createIDCard(req, res)
);

// Get ID card for student
router.get("/idcards/:studentId", (req, res) =>
  nftController.getIDCardByStudent(req, res)
);

// Get ID card image
router.get("/idcards/:studentId/image", (req, res) =>
  nftController.getIDCardImage(req, res)
);

// Get NFT metadata
router.get("/idcards/:studentId/metadata", (req, res) =>
  nftController.getNFTMetadata(req, res)
);

// Mint NFT for student ID card
router.post("/mint/:studentId", (req, res) => nftController.mintNFT(req, res));

// Transfer NFT ownership
router.post("/transfer/:tokenId", (req, res) =>
  nftController.transferNFT(req, res)
);

// Update NFT version
router.put("/update/:tokenId", (req, res) =>
  nftController.updateNFTVersion(req, res)
);

// Get all NFT versions for a student
router.get("/student/:studentId/versions", (req, res) =>
  nftController.getNFTVersionsByStudentId(req, res)
);

// Get latest NFT version for a student
router.get("/student/:studentId/latest", (req, res) =>
  nftController.getLatestNFTVersionByStudentId(req, res)
);

// Get NFTs by student ID - keep this after the more specific /student/ routes
router.get("/student/:studentId", (req, res) =>
  nftController.getNFTsByStudent(req, res)
);

// Get NFT by token ID
router.get("/:tokenId", (req, res) => nftController.getNFTByTokenId(req, res));

// Verify NFT authenticity
router.get("/verify/:tokenId", (req, res) => nftController.verifyNFT(req, res));

// Institution NFT endpoints
router.get("/institution/:institutionId/metadata", (req, res) =>
  nftController.getInstitutionNFTMetadata(req, res)
);

router.get("/institution/:institutionId/image", (req, res) =>
  nftController.getInstitutionNFTImage(req, res)
);

module.exports = router;
