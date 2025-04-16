const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');

// Get the entire blockchain
router.get('/', blockchainController.getChain);

// Get blockchain info
router.get('/info', blockchainController.getBlockchainInfo);

// Mine pending transactions
router.post('/mine', blockchainController.minePendingTransactions);

// Validate the blockchain
router.get('/validate', blockchainController.validateChain);

// Get a block by its index
router.get('/block/index/:index', blockchainController.getBlockByIndex);

// Get a block by its hash
router.get('/block/hash/:hash', blockchainController.getBlockByHash);

module.exports = router;