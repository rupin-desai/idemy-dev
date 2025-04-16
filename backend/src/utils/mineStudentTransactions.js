// backend/src/utils/mineStudentTransactions.js
const blockchainService = require("../services/blockchain.service");
const logger = require("../utils/logger.utils");

/**
 * Mines pending student transactions into a new block
 * @returns {Object} The newly mined block
 */
async function mineStudentTransactions() {
  try {
    // Check if there are any pending transactions
    const pendingTransactions = blockchainService.getPendingTransactions();
    if (pendingTransactions.length === 0) {
      logger.info("No pending transactions to mine");
      return null;
    }

    logger.info(`Mining ${pendingTransactions.length} pending transactions...`);
    
    // Mine the pending transactions into a new block
    const newBlock = blockchainService.minePendingTransactions(
      "SYSTEM_STUDENT_REGISTRY", // Use system address for student transactions
      { note: "Student Records Block" }
    );
    
    logger.info(`Block #${newBlock.index} successfully mined with hash ${newBlock.hash} and nonce ${newBlock.nonce}`);
    logger.info(`${pendingTransactions.length} student transactions added to blockchain`);
    
    return newBlock;
  } catch (error) {
    logger.error(`Failed to mine student transactions: ${error.message}`);
    throw error;
  }
}

module.exports = mineStudentTransactions;