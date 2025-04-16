const Blockchain = require("../models/blockchain.model");
const Block = require("../models/block.model");
const Transaction = require("../models/transaction.model");
const persistenceService = require("./persistence.service");
const logger = require("../utils/logger.utils");

class BlockchainService {
  constructor() {
    // Try to load existing blockchain from file
    const savedData = persistenceService.loadBlockchain();

    if (savedData) {
      // Create a new blockchain
      this.blockchain = new Blockchain();

      // Restore chain (convert plain objects back to Block instances)
      this.blockchain.chain = savedData.chain.map((blockData) => {
        const block = new Block(
          blockData.index,
          blockData.timestamp,
          blockData.transactions,
          blockData.previousHash,
          blockData.metadata
        );
        block.hash = blockData.hash;
        block.nonce = blockData.nonce;
        return block;
      });

      // Restore other properties
      this.blockchain.difficulty = savedData.difficulty;
      this.blockchain.miningReward = savedData.miningReward;

      // Restore pending transactions
      this.blockchain.pendingTransactions = savedData.pendingTransactions.map(
        (txData) => {
          const tx = new Transaction(
            txData.fromAddress,
            txData.toAddress,
            txData.amount,
            txData.metadata
          );
          tx.id = txData.id;
          tx.timestamp = txData.timestamp;
          tx.signature = txData.signature;
          return tx;
        }
      );

      logger.info(
        `Blockchain restored with ${this.blockchain.chain.length} blocks`
      );
    } else {
      // Create a new blockchain if nothing was loaded
      this.blockchain = new Blockchain();
    }

    // Set up auto-save every 5 minutes
    persistenceService.setupAutoSave(this.blockchain, 5);

    logger.info("Blockchain service initialized");
  }

  getChain() {
    return this.blockchain.chain;
  }

  getPendingTransactions() {
    return this.blockchain.pendingTransactions;
  }

  minePendingTransactions(miningRewardAddress, metadata = {}) {
    try {
      const newBlock = this.blockchain.minePendingTransactions(
        miningRewardAddress,
        metadata
      );

      // Save blockchain after mining new block
      persistenceService.saveBlockchain(this.blockchain);

      return newBlock;
    } catch (error) {
      logger.error(`Mining error: ${error.message}`);
      throw error;
    }
  }

  // Add method to manually save blockchain
  saveBlockchain() {
    return persistenceService.saveBlockchain(this.blockchain);
  }

  validateChain() {
    const isValid = this.blockchain.isChainValid();
    return { valid: isValid };
  }

  getBlockByIndex(index) {
    try {
      const block = this.blockchain.getBlockByIndex(parseInt(index, 10));
      if (!block) {
        throw new Error(`Block with index ${index} not found`);
      }
      return block;
    } catch (error) {
      logger.error(`Get block error: ${error.message}`);
      throw error;
    }
  }

  getBlockByHash(hash) {
    try {
      const block = this.blockchain.getBlockByHash(hash);
      if (!block) {
        throw new Error(`Block with hash ${hash} not found`);
      }
      return block;
    } catch (error) {
      logger.error(`Get block error: ${error.message}`);
      throw error;
    }
  }

  getChainLength() {
    return this.blockchain.chain.length;
  }

  getBlockchainDifficulty() {
    return this.blockchain.difficulty;
  }

  setBlockchainDifficulty(difficulty) {
    this.blockchain.difficulty = difficulty;
    return this.blockchain.difficulty;
  }
}

module.exports = new BlockchainService();
