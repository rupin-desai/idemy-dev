const logger = require("../utils/logger.utils");

// Main error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  if (err.name === "BlockchainError") {
    return res.status(400).json({
      success: false,
      error: "Blockchain Error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  return res.status(500).json({
    success: false,
    error: "Server Error",
    message: "An unexpected error occurred",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// 404 handler middleware
const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Resource not found.",
  });
};

// Export the main error handler as default
module.exports = errorHandler;

// Also export individual handlers
module.exports.errorHandler = errorHandler;
module.exports.notFoundHandler = notFoundHandler;
