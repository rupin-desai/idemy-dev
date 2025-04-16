const express = require('express');
const bodyParser = require('body-parser');
const blockchainRoutes = require('./routes/blockchain.routes');
const transactionRoutes = require('./routes/transaction.routes');
const { loggerMiddleware } = require('./middleware/logger.middleware');
const { errorMiddleware } = require('./middleware/error.middleware');
const appConfig = require('./app.config');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Routes
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = appConfig.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});