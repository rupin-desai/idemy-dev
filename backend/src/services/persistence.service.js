const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger.utils");
const Blockchain = require("../models/blockchain.model");

class PersistenceService {
  constructor() {
    this.dataDir = path.join(__dirname, "../../data");
    this.blockchainFile = path.join(this.dataDir, "blockchain.json");

    // Create data directory if it doesn't exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      logger.info(`Created data directory at ${this.dataDir}`);
    }
  }

  // Save blockchain to file
  saveBlockchain(blockchain) {
    try {
      // Make a deep copy to avoid circular references
      const blockchainData = {
        chain: blockchain.chain,
        difficulty: blockchain.difficulty,
        pendingTransactions: blockchain.pendingTransactions,
        miningReward: blockchain.miningReward,
      };

      fs.writeFileSync(
        this.blockchainFile,
        JSON.stringify(blockchainData, null, 2)
      );

      logger.info("Blockchain saved to file successfully");
      return true;
    } catch (error) {
      logger.error(`Failed to save blockchain: ${error.message}`);
      return false;
    }
  }

  // Load blockchain from file
  loadBlockchain() {
    try {
      if (!fs.existsSync(this.blockchainFile)) {
        logger.info(
          "No blockchain file found. Starting with a new blockchain."
        );
        return null;
      }

      const data = fs.readFileSync(this.blockchainFile, "utf8");
      const blockchainData = JSON.parse(data);

      logger.info("Blockchain loaded from file successfully");
      return blockchainData;
    } catch (error) {
      logger.error(`Failed to load blockchain: ${error.message}`);
      return null;
    }
  }

  // Auto-save blockchain periodically
  setupAutoSave(blockchain, intervalMinutes = 5) {
    const intervalMs = intervalMinutes * 60 * 1000;

    setInterval(() => {
      this.saveBlockchain(blockchain);
      logger.info(
        `Auto-saved blockchain (interval: ${intervalMinutes} minutes)`
      );
    }, intervalMs);

    logger.info(
      `Blockchain auto-save configured for every ${intervalMinutes} minutes`
    );
  }
}

module.exports = new PersistenceService();
