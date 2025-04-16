// backend/src/scripts/mineStudents.js
const mineStudentTransactions = require("../utils/mineStudentTransactions");
const logger = require("../utils/logger.utils");

async function main() {
  try {
    logger.info("Starting student transaction mining process...");
    const newBlock = await mineStudentTransactions();
    
    if (newBlock) {
      logger.info("Mining successful!");
      logger.info(`Block #${newBlock.index} added to blockchain`);
      logger.info(`Hash: ${newBlock.hash}`);
      logger.info(`Nonce: ${newBlock.nonce}`);
      process.exit(0);
    } else {
      logger.info("No transactions were mined");
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Mining failed: ${error.message}`);
    process.exit(1);
  }
}

main();