const Blockchain = require('../models/blockchain.model');
const logger = require('../utils/logger.utils');

class BlockchainService {
  constructor() {
    this.blockchain = new Blockchain();
    logger.info('Blockchain service initialized');
  }

  getChain() {
    return this.blockchain.chain;
  }

  getPendingTransactions() {
    return this.blockchain.pendingTransactions;
  }

  minePendingTransactions(miningRewardAddress, metadata = {}) {
    try {
      const newBlock = this.blockchain.minePendingTransactions(miningRewardAddress, metadata);
      return newBlock;
    } catch (error) {
      logger.error(`Mining error: ${error.message}`);
      throw error;
    }
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