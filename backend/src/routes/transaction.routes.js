const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Add a signed transaction to pending transactions
router.post('/add', transactionController.addTransaction);

// Get all pending transactions
router.get('/pending', transactionController.getPendingTransactions);

// Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Get balance for an address
router.get('/balance/:address', transactionController.getAddressBalance);

module.exports = router;