const transactionService = require("../services/transaction.service");
const validationService = require("../services/validation.service");
const logger = require("../utils/logger.utils");

class TransactionController {
  async createTransaction(req, res) {
    try {
      const { fromAddress, toAddress, amount, metadata, signature } = req.body;

      if (!fromAddress || !toAddress || amount === undefined) {
        return res.status(400).json({
          success: false,
          message: "fromAddress, toAddress, and amount are required fields",
        });
      }

      // Validate metadata if provided
      if (metadata) {
        const validationResult = validationService.validateMetadata(metadata);
        if (!validationResult.valid) {
          return res.status(400).json({
            success: false,
            message: validationResult.reason,
          });
        }
      }

      const transaction = transactionService.createTransaction(
        fromAddress,
        toAddress,
        amount,
        metadata || {}
      );

      return res.status(201).json({
        success: true,
        transaction,
      });
    } catch (error) {
      logger.error(`Create transaction error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addTransaction(req, res) {
    try {
      const { transaction } = req.body;

      if (!transaction) {
        return res.status(400).json({
          success: false,
          message: "Transaction object is required",
        });
      }

      const validationResult =
        validationService.validateTransaction(transaction);
      if (!validationResult.valid) {
        return res.status(400).json({
          success: false,
          message: validationResult.reason,
        });
      }

      const result = transactionService.addTransaction(transaction);
      return res.status(201).json({
        success: true,
        message: "Transaction added successfully to pending transactions",
        transactionId: transaction.id,
      });
    } catch (error) {
      logger.error(`Add transaction error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPendingTransactions(req, res) {
    try {
      const pendingTransactions = transactionService.getPendingTransactions();
      return res.status(200).json({
        success: true,
        count: pendingTransactions.length,
        transactions: pendingTransactions,
      });
    } catch (error) {
      logger.error(`Get pending transactions error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const transaction = transactionService.getTransactionById(id);
      return res.status(200).json({
        success: true,
        transaction,
      });
    } catch (error) {
      logger.error(`Get transaction error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAddressBalance(req, res) {
    try {
      const { address } = req.params;

      if (!address) {
        return res.status(400).json({
          success: false,
          message: "Wallet address is required",
        });
      }

      const balance = transactionService.getAddressBalance(address);
      return res.status(200).json({
        success: true,
        address,
        balance,
      });
    } catch (error) {
      logger.error(`Get balance error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getTransactionsByStudentId(req, res) {
    try {
      const { studentId } = req.params;
      
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required"
        });
      }
      
      const transactions = transactionService.getTransactionsByStudentId(studentId);
      
      return res.status(200).json({
        success: true,
        count: transactions.length,
        transactions
      });
    } catch (error) {
      logger.error(`Get transactions by student ID error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new TransactionController();
