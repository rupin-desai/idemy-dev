require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  blockchain: {
    difficulty: process.env.BLOCKCHAIN_DIFFICULTY || 4,
    miningReward: process.env.BLOCKCHAIN_MINING_REWARD || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Explicitly allow your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  // Logging configuration
  logLevel: process.env.LOG_LEVEL || "INFO",
  consoleLog: process.env.CONSOLE_LOG === "true" || true,
  logRequestBody: process.env.LOG_REQUEST_BODY === "true" || false,
  logToFile: process.env.LOG_TO_FILE !== "false",
  logFileMaxSize: parseInt(process.env.LOG_FILE_MAX_SIZE || 5 * 1024 * 1024), // 5MB default
  maxLogFiles: parseInt(process.env.MAX_LOG_FILES || 10),
};
