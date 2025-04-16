const fs = require("fs");
const path = require("path");
const config = require("../app.config");

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

    // Enable file logging by default, can be disabled via config
    this.logToFile = config.logToFile !== false;
    this.logToConsole = config.nodeEnv !== "production" || config.consoleLog;

    // Configure log file settings
    this.logDir = path.join(__dirname, "../../logs");
    this.logFileMaxSize = config.logFileMaxSize || 5 * 1024 * 1024; // 5MB default
    this.maxLogFiles = config.maxLogFiles || 10;

    // Initialize logging directory structure
    this.initializeLogDirectory();
  }

  // Create log directory structure
  initializeLogDirectory() {
    try {
      // Create main logs directory if it doesn't exist
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }

      // Create subdirectories for different log levels
      ["error", "warn", "info", "debug"].forEach((level) => {
        const levelDir = path.join(this.logDir, level);
        if (!fs.existsSync(levelDir)) {
          fs.mkdirSync(levelDir, { recursive: true });
        }
      });

      // Create a combined logs directory
      const combinedDir = path.join(this.logDir, "combined");
      if (!fs.existsSync(combinedDir)) {
        fs.mkdirSync(combinedDir, { recursive: true });
      }

      console.log(`Log directories initialized at ${this.logDir}`);
    } catch (error) {
      console.error(`Failed to initialize log directories: ${error.message}`);
    }
  }

  // Format the log message with timestamp, level, and context
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length
      ? ` ${JSON.stringify(context)}`
      : "";
    return `[${level}] ${timestamp}: ${message}${contextStr}`;
  }

  // Check if log file needs rotation and rotate if necessary
  checkLogFileRotation(logFile) {
    try {
      if (!fs.existsSync(logFile)) {
        return;
      }

      const stats = fs.statSync(logFile);
      if (stats.size >= this.logFileMaxSize) {
        // Rotate log files
        for (let i = this.maxLogFiles - 1; i > 0; i--) {
          const oldFile = `${logFile}.${i}`;
          const newFile = `${logFile}.${i + 1}`;

          if (fs.existsSync(oldFile)) {
            fs.renameSync(oldFile, newFile);
          }
        }

        // Rename current log file
        fs.renameSync(logFile, `${logFile}.1`);
      }
    } catch (error) {
      console.error(`Log rotation error: ${error.message}`);
    }
  }

  // Write to log file with proper directory structure and rotation
  writeToFile(formattedMessage, level) {
    if (!this.logToFile) return;

    try {
      // Get current date for log file naming
      const today = new Date().toISOString().split("T")[0];

      // Create log file paths
      const levelLogFile = path.join(
        this.logDir,
        level.toLowerCase(),
        `${level.toLowerCase()}-${today}.log`
      );
      const combinedLogFile = path.join(
        this.logDir,
        "combined",
        `combined-${today}.log`
      );

      // Check for log rotation
      this.checkLogFileRotation(levelLogFile);
      this.checkLogFileRotation(combinedLogFile);

      // Append to level-specific log file
      fs.appendFileSync(levelLogFile, formattedMessage + "\n");

      // Append to combined log file
      fs.appendFileSync(combinedLogFile, formattedMessage + "\n");
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
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
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get ? req.get("user-agent") : req.headers["user-agent"],
      body: config.logRequestBody ? req.body : undefined,
      params: req.params,
      query: req.query,
    };

    this.info(
      `Request received: ${req.method} ${req.originalUrl || req.url}`,
      context
    );
  }

  logResponse(res) {
    if (LOG_LEVELS.INFO > this.level) return;

    const context = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      responseTime: res.responseTime || "unknown",
    };

    this.info(`Response sent: ${res.statusCode}`, context);
  }

  // Blockchain specific logging
  logBlockchainTransaction(transactionId, type, details) {
    this.info(`Blockchain transaction: ${type}`, {
      transactionId,
      type,
      ...details,
    });
  }

  logBlockMining(blockIndex, hash, difficulty, miningTime) {
    this.info(`Block mined`, {
      blockIndex,
      hash,
      difficulty,
      miningTimeMs: miningTime,
    });
  }

  // Performance measurement utilities
  startTimer() {
    return process.hrtime();
  }

  endTimer(start) {
    const diff = process.hrtime(start);
    return (diff[0] * 1e9 + diff[1]) / 1e6; // Return time in milliseconds
  }
}

module.exports = new Logger();
