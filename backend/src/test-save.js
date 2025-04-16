const blockchainService = require("./services/blockchain.service");
const transactionService = require("./services/transaction.service");
const logger = require("./utils/logger.utils");

async function testBlockchainPersistence() {
  // 1. Create a transaction
  const tx = transactionService.createTransaction(
    "test-address-1",
    "test-address-2",
    50,
    { studentId: "STU12345678", note: "Test transaction" }
  );

  // 2. Add transaction to pending
  try {
    transactionService.addTransaction(tx);
    logger.info("Transaction added successfully");
  } catch (error) {
    logger.error(`Failed to add transaction: ${error.message}`);
  }

  // 3. Mine a block with the transaction
  try {
    const newBlock = blockchainService.minePendingTransactions(
      "miner-reward-address",
      { note: "Test mining block" }
    );
    logger.info(`Block mined successfully: ${JSON.stringify(newBlock)}`);
  } catch (error) {
    logger.error(`Failed to mine block: ${error.message}`);
  }

  // 4. Manually save the blockchain
  try {
    const result = blockchainService.saveBlockchain();
    logger.info(`Blockchain saved: ${result ? "success" : "failed"}`);
  } catch (error) {
    logger.error(`Failed to save blockchain: ${error.message}`);
  }

  logger.info("Persistence test completed!");
}

testBlockchainPersistence().catch(console.error);
