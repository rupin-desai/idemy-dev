const express = require("express");
const router = express.Router();
const blockchainController = require("../controllers/blockchain.controller");

// Get the entire blockchain
router.get("/", blockchainController.getChain);

// Get blockchain info
router.get("/info", blockchainController.getBlockchainInfo);

// Mine pending transactions
router.post("/mine", blockchainController.minePendingTransactions);

// Mine student transactions
router.post("/mine-students", blockchainController.mineStudentTransactions);

// Validate the blockchain
router.get("/validate", blockchainController.validateChain);

// Get a block by its index
router.get("/block/index/:index", blockchainController.getBlockByIndex);

// Get a block by its hash
router.get("/block/hash/:hash", blockchainController.getBlockByHash);

// Manually save blockchain to file
router.post("/save", blockchainController.saveBlockchain);

// Add this new route before any other routes with path parameters
router.get("/transactions/user", blockchainController.getUserTransactions);

// Add this new route
router.get("/student-by-email/:email", blockchainController.getStudentByEmail);

// Add this line to your blockchain routes file
router.get("/metadata", blockchainController.getUserMetadata);

module.exports = router;
