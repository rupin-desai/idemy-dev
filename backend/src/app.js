require('dotenv').config();

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log("Service Account Parsed Successfully");
  
  // Check required fields
  const requiredFields = ['project_id', 'private_key', 'client_email', 'private_key_id'];
  const missingFields = requiredFields.filter(field => !serviceAccount[field]);
  
  if (missingFields.length > 0) {
    console.error(`Missing required fields: ${missingFields.join(', ')}`);
  } else {
    console.log("All required fields present");
  }
} catch (error) {
  console.error(`Failed to parse Firebase service account: ${error.message}`);
}

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app.config");
const logger = require("./utils/logger.utils");
const loggerMiddleware = require("./middleware/logger.middleware");
const errorMiddleware = require("./middleware/error.middleware");

// Import routes
const blockchainRoutes = require("./routes/blockchain.routes");
const transactionRoutes = require("./routes/transaction.routes");
const studentRoutes = require("./routes/student.routes");
const nftRoutes = require('./routes/nft.routes');
const authRoutes = require('./routes/auth.routes'); // Add this line
const institutionRoutes = require("./routes/institution.routes");
const applicationRoutes = require("./routes/application.routes");

// Initialize the app
const app = express();

// CORS should be the first middleware
app.use(cors(config.cors));

// Other middleware
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Routes
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/auth', authRoutes); // Add this line
app.use("/api/institutions", institutionRoutes);
app.use("/api/applications", applicationRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Blockchain Backend API",
    version: "1.0.0",
  });
});

// 404 handler for undefined routes - must be before error handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use(errorMiddleware.errorHandler || errorMiddleware);

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

module.exports = app;
