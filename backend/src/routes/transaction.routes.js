exports = function(app) {
    const TransactionController = require('../controllers/transaction.controller');
    const transactionController = new TransactionController();

    // Route to create a new transaction
    app.post('/api/transactions', transactionController.createTransaction);

    // Route to retrieve all transactions
    app.get('/api/transactions', transactionController.getAllTransactions);

    // Route to retrieve a specific transaction by ID
    app.get('/api/transactions/:id', transactionController.getTransactionById);
};