const express = require("express");
const bodyParser = require("body-parser");
const config = require("./app.config");
const logger = require("./utils/logger.utils");
const loggerMiddleware = require("./middleware/logger.middleware");
const errorMiddleware = require("./middleware/error.middleware");

// Import routes
const blockchainRoutes = require("./routes/blockchain.routes");
const transactionRoutes = require("./routes/transaction.routes");

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Routes
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/transactions", transactionRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Blockchain Backend API",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

module.exports = app;
