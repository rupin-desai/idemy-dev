const crypto = require("crypto");
const Block = require("./block.model");
const Transaction = require("./transaction.model");
const logger = require("../utils/logger.utils");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    const genesisBlock = new Block(0, Date.now(), [], "0", {
      note: "Genesis Block",
    });
    logger.info("Genesis block created");
    return genesisBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress, metadata = {}) {
    // Create mining reward transaction
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward,
      metadata
    );
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash,
      metadata
    );

    logger.info(`Mining block ${block.index}...`);
    block.mineBlock(this.difficulty);
    logger.info(`Block ${block.index} mined: ${block.hash}`);

    this.chain.push(block);
    this.pendingTransactions = [];

    return block;
  }

  // Add this to your addTransaction method
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    // In development mode, bypass signature validation
    const isValidTransaction =
      require("../app.config").nodeEnv === "development" ||
      transaction.isValid();

    if (!isValidTransaction) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction);
    logger.info(`Transaction added: ${transaction.id}`);

    return true;
  }

  getAddressBalance(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Validate hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Validate chain linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getBlockByIndex(index) {
    return this.chain.find((block) => block.index === index);
  }

  getBlockByHash(hash) {
    return this.chain.find((block) => block.hash === hash);
  }

  getTransactionById(id) {
    for (const block of this.chain) {
      const transaction = block.transactions.find((tx) => tx.id === id);
      if (transaction) return transaction;
    }
    return null;
  }

  // Add this method to your Blockchain class
  getTransactionsByStudentId(studentId) {
    if (!studentId) {
      throw new Error("Student ID is required");
    }
    
    const transactions = [];
    
    // Search all transactions in confirmed blocks
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.metadata && 
            transaction.metadata.studentId === studentId) {
          transactions.push({
            ...transaction,
            blockIndex: block.index,
            blockHash: block.hash,
            confirmed: true
          });
        }
      }
    }
    
    // Also search pending transactions
    for (const transaction of this.pendingTransactions) {
      if (transaction.metadata && 
          transaction.metadata.studentId === studentId) {
        transactions.push({
          ...transaction,
          confirmed: false
        });
      }
    }
    
    return transactions;
  }
}

module.exports = Blockchain;
