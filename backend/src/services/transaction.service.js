const Transaction = require("../models/transaction.model");
const blockchainService = require("./blockchain.service");
const persistenceService = require("./persistence.service");
const logger = require("../utils/logger.utils");

class TransactionService {
  createTransaction(fromAddress, toAddress, amount, metadata = {}) {
    try {
      const transaction = new Transaction(
        fromAddress,
        toAddress,
        amount,
        metadata
      );
      logger.info(`Transaction created: ${transaction.id}`);
      return transaction;
    } catch (error) {
      logger.error(`Create transaction error: ${error.message}`);
      throw error;
    }
  }

  addTransaction(transaction) {
    try {
      const result = blockchainService.blockchain.addTransaction(transaction);
      logger.info(`Transaction added: ${transaction.id}`);

      // Save blockchain after adding a new transaction
      persistenceService.saveBlockchain(blockchainService.blockchain);

      return result;
    } catch (error) {
      logger.error(`Add transaction error: ${error.message}`);
      throw error;
    }
  }

  getPendingTransactions() {
    return blockchainService.blockchain.pendingTransactions;
  }

  getTransactionById(id) {
    try {
      const transaction = blockchainService.blockchain.getTransactionById(id);
      if (!transaction) {
        throw new Error(`Transaction with ID ${id} not found`);
      }
      return transaction;
    } catch (error) {
      logger.error(`Get transaction error: ${error.message}`);
      throw error;
    }
  }

  getAddressBalance(address) {
    try {
      return blockchainService.blockchain.getAddressBalance(address);
    } catch (error) {
      logger.error(`Get balance error: ${error.message}`);
      throw error;
    }
  }

  signTransaction(transaction, signingKey) {
    try {
      transaction.signTransaction(signingKey);
      return transaction;
    } catch (error) {
      logger.error(`Sign transaction error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TransactionService();
