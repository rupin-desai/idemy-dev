const Block = require("../models/block.model");
const blockchainService = require("./blockchain.service");
const logger = require("../utils/logger.utils");

class BlockService {
  constructor() {
    this.blocks = [];
  }

  getBlockByIndex(index) {
    return blockchainService.getBlockByIndex(index);
  }

  getBlockByHash(hash) {
    return blockchainService.getBlockByHash(hash);
  }

  getLatestBlock() {
    const chain = blockchainService.getChain();
    return chain[chain.length - 1];
  }

  createBlock(transactions, metadata = {}) {
    try {
      const previousBlock = this.getLatestBlock();
      const newBlock = new Block(
        previousBlock.index + 1,
        Date.now(),
        transactions,
        previousBlock.hash,
        metadata
      );
      logger.info(`Block created with index ${newBlock.index}`);
      return newBlock;
    } catch (error) {
      logger.error(`Create block error: ${error.message}`);
      throw error;
    }
  }

  mineBlock(block, difficulty) {
    try {
      logger.info(`Mining block ${block.index}...`);
      const hash = block.mineBlock(
        difficulty || blockchainService.getBlockchainDifficulty()
      );
      logger.info(`Block mined: ${hash}`);
      return block;
    } catch (error) {
      logger.error(`Mine block error: ${error.message}`);
      throw error;
    }
  }

  validateBlock(block, previousBlock) {
    // Check index
    if (block.index !== previousBlock.index + 1) {
      return { valid: false, reason: "Invalid index" };
    }

    // Check previousHash
    if (block.previousHash !== previousBlock.hash) {
      return { valid: false, reason: "Invalid previous hash" };
    }

    // Check hash
    if (block.hash !== block.calculateHash()) {
      return { valid: false, reason: "Invalid hash" };
    }

    return { valid: true };
  }

  calculateHash(index, timestamp, data, previousHash) {
    return require("crypto")
      .createHash("sha256")
      .update(index + timestamp + JSON.stringify(data) + previousHash)
      .digest("hex");
  }

  getBlock(index) {
    return this.blocks[index - 1] || null;
  }

  getAllBlocks() {
    return this.blocks;
  }
}

module.exports = new BlockService();
