const fs = require("fs");
const path = require("path");
const config = require("../app.config");

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS[config.logLevel] || LOG_LEVELS.INFO;
    this.logToFile = config.nodeEnv === "production";
    this.logToConsole = config.nodeEnv !== "production" || config.consoleLog;
  }

  // Format the log message with timestamp, level, and context
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length
      ? ` ${JSON.stringify(context)}`
      : "";
    return `[${level}] ${timestamp}: ${message}${contextStr}`;
  }

  // Write to log file
  writeToFile(formattedMessage, level) {
    if (!this.logToFile) return;

    const today = new Date().toISOString().split("T")[0];
    const logFile = path.join(logDir, `${level.toLowerCase()}-${today}.log`);

    fs.appendFile(logFile, formattedMessage + "\n", (err) => {
      if (err) console.error(`Failed to write to log file: ${err.message}`);
    });
  }

  // Main log method
  log(level, message, context = {}) {
    if (LOG_LEVELS[level] > this.level) return;

    const formattedMessage = this.formatMessage(level, message, context);

    if (this.logToConsole) {
      switch (level) {
        case "ERROR":
          console.error(formattedMessage);
          break;
        case "WARN":
          console.warn(formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    }

    this.writeToFile(formattedMessage, level);
  }

  // Convenience methods for different log levels
  error(message, context = {}) {
    if (context instanceof Error) {
      context = {
        message: context.message,
        stack: context.stack,
        ...context,
      };
    }
    this.log("ERROR", message, context);
  }

  warn(message, context = {}) {
    this.log("WARN", message, context);
  }

  info(message, context = {}) {
    this.log("INFO", message, context);
  }

  debug(message, context = {}) {
    this.log("DEBUG", message, context);
  }

  // HTTP request/response logging
  logRequest(req) {
    if (LOG_LEVELS.INFO > this.level) return;

    const context = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      body: config.logRequestBody ? req.body : undefined,
      params: req.params,
      query: req.query,
    };

    this.info(`Request received: ${req.method} ${req.originalUrl}`, context);
  }

  logResponse(res) {
    if (LOG_LEVELS.INFO > this.level) return;

    const context = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      responseTime: res.responseTime,
    };

    this.info(`Response sent: ${res.statusCode}`, context);
  }

  // Transaction tracking for blockchain operations
  logBlockchainTransaction(transactionId, type, details) {
    this.info(`Blockchain transaction: ${type}`, {
      transactionId,
      type,
      ...details,
    });
  }

  // Block mining logs
  logBlockMining(blockIndex, hash, difficulty, miningTime) {
    this.info(`Block mined`, {
      blockIndex,
      hash,
      difficulty,
      miningTimeMs: miningTime,
    });
  }

  // For measuring performance
  startTimer() {
    return process.hrtime();
  }

  endTimer(start) {
    const diff = process.hrtime(start);
    return (diff[0] * 1e9 + diff[1]) / 1e6; // Return time in milliseconds
  }
}

module.exports = new Logger();
