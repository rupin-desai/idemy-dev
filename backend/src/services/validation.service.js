const logger = require('../utils/logger.utils');

class ValidationService {
  validateTransaction(transaction) {
    try {
      if (!transaction.fromAddress || !transaction.toAddress) {
        return { 
          valid: false,
          reason: 'Transaction must include from and to address'
        };
      }

      if (!transaction.signature || transaction.signature.length === 0) {
        return { 
          valid: false,
          reason: 'Transaction must be signed'
        };
      }

      return { valid: true };
    } catch (error) {
      logger.error(`Validation error: ${error.message}`);
      return { valid: false, reason: error.message };
    }
  }

  validateBlock(block, previousBlock) {
    try {
      // Check index
      if (block.index !== previousBlock.index + 1) {
        return { valid: false, reason: 'Invalid index' };
      }

      // Check previousHash
      if (block.previousHash !== previousBlock.hash) {
        return { valid: false, reason: 'Invalid previous hash' };
      }

      // Check hash
      if (block.hash !== block.calculateHash()) {
        return { valid: false, reason: 'Invalid hash' };
      }

      return { valid: true };
    } catch (error) {
      logger.error(`Block validation error: ${error.message}`);
      return { valid: false, reason: error.message };
    }
  }

  validateStudentId(studentId) {
    // Validate student ID format (e.g., alphanumeric with specific length)
    const regex = /^[A-Za-z0-9]{8,12}$/;
    if (!regex.test(studentId)) {
      return { 
        valid: false, 
        reason: 'Student ID must be alphanumeric and between 8-12 characters' 
      };
    }
    return { valid: true };
  }

  validateTransactionDetails(transaction) {
    const { sender, receiver, amount } = transaction;
    if (!sender || !receiver || amount <= 0) {
      return false;
    }
    return true;
  }

  validateBlockData(blockData) {
    const { index, previousHash, timestamp, data } = blockData;
    if (typeof index !== 'number' || typeof previousHash !== 'string' || typeof timestamp !== 'number' || !data) {
      return false;
    }
    return true;
  }

  validateMetadata(metadata) {
    try {
      if (typeof metadata !== 'object') {
        return { valid: false, reason: 'Metadata must be an object' };
      }
      
      // Check if studentId is present when required
      if (metadata.requiresStudentId && !metadata.studentId) {
        return { valid: false, reason: 'Student ID is required' };
      }
      
      // If studentId is present, validate it
      if (metadata.studentId) {
        const studentIdValidation = this.validateStudentId(metadata.studentId);
        if (!studentIdValidation.valid) {
          return studentIdValidation;
        }
      }
      
      return { valid: true };
    } catch (error) {
      logger.error(`Metadata validation error: ${error.message}`);
      return { valid: false, reason: error.message };
    }
  }
}

module.exports = new ValidationService();