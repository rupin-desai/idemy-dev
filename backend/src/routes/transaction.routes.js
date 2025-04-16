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

// Get transactions by student ID - MUST be before the generic /:id route
router.get('/student/:studentId', transactionController.getTransactionsByStudentId);

// Get balance for an address
router.get('/balance/:address', transactionController.getAddressBalance);

// Get transaction by ID - Must be AFTER more specific routes
router.get('/:id', transactionController.getTransactionById);

module.exports = router;