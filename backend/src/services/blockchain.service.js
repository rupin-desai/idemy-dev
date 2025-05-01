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

  getTransactionsByStudentId(studentId) {
    try {
      return this.blockchain.getTransactionsByStudentId(studentId);
    } catch (error) {
      logger.error(`Get transactions by student ID error: ${error.message}`);
      throw error;
    }
  }

  getTransactionsByType(type) {
    try {
      const transactions = [];
      
      // Search all transactions in confirmed blocks
      for (const block of this.blockchain.chain) {
        for (const transaction of block.transactions) {
          // Check if transaction has metadata with the specified type
          if (transaction.metadata && 
             ((transaction.metadata.type === type) || 
              (transaction.metadata.action === type))) {
            
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
      for (const transaction of this.blockchain.pendingTransactions) {
        if (transaction.metadata && 
           ((transaction.metadata.type === type) || 
            (transaction.metadata.action === type))) {
          
          transactions.push({
            ...transaction,
            confirmed: false
          });
        }
      }
      
      return transactions;
    } catch (error) {
      logger.error(`Get transactions by type error: ${error.message}`);
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

  /**
   * Get metadata for institution-related transactions
   */
  getInstitutionMetadata(institutionId, email) {
    const chain = this.blockchain.chain;
    const institutionMetadata = [];
    
    chain.forEach(block => {
      block.transactions.forEach(tx => {
        // Check if transaction is related to this institution
        const isInstitutionTx = 
          (tx.metadata?.institutionId === institutionId) ||
          (tx.metadata?.institutionData?.institutionId === institutionId) ||
          (tx.metadata?.applicationData?.institutionId === institutionId) ||
          (email && (tx.fromAddress === email || tx.toAddress === email)) ||
          (tx.fromAddress === `INSTITUTION_${institutionId}`) ||
          (tx.toAddress === `INSTITUTION_${institutionId}`);
        
        if (isInstitutionTx) {
          // Process the transaction into meaningful metadata
          const processedTx = this.processInstitutionTransaction(tx, block);
          if (processedTx) {
            institutionMetadata.push({
              ...processedTx,
              blockIndex: block.index,
              blockHash: block.hash,
              timestamp: tx.timestamp,
              transactionId: tx.id,
              rawMetadata: tx.metadata,
              institutionId: institutionId,
              institutionEmail: email
            });
          }
        }
      });
    });
    
    // Sort by timestamp (newest first)
    return institutionMetadata.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get metadata for student/user-related transactions
   */
  getUserMetadata(userId, email) {
    const chain = this.blockchain.chain;
    const userMetadata = [];
    
    chain.forEach(block => {
      block.transactions.forEach(tx => {
        // Check if transaction is related to this user
        const isUserTx = 
          (tx.metadata?.studentId === userId) ||
          (tx.metadata?.studentData?.studentId === userId) ||
          (email && (tx.fromAddress === email || tx.toAddress === email)) ||
          (tx.metadata?.studentData?.email === email);
        
        if (isUserTx) {
          // Process the transaction into meaningful metadata
          const processedTx = this.processStudentTransaction(tx, block);
          if (processedTx) {
            userMetadata.push({
              ...processedTx,
              blockIndex: block.index,
              blockHash: block.hash,
              timestamp: tx.timestamp,
              transactionId: tx.id,
              rawMetadata: tx.metadata
            });
          }
        }
      });
    });
    
    // Sort by timestamp (newest first)
    return userMetadata.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Process institution transactions into metadata
   */
  processInstitutionTransaction(tx, block) {
    try {
      let type = 'UNKNOWN';
      let title = 'Unknown Transaction';
      let icon = 'database';
      let details = {};
      
      // Process based on metadata type and action
      if (tx.metadata?.type === 'INSTITUTION_REGISTRATION') {
        type = 'INSTITUTION_REGISTRATION';
        title = 'Institution Registration';
        icon = 'building';
        details = {
          institutionId: tx.metadata.institutionId || tx.metadata.institutionData?.institutionId || 'Unknown',
          name: tx.metadata.institutionData?.name || 'Unknown',
          email: tx.metadata.institutionData?.email || tx.fromAddress || 'Unknown',
          action: tx.metadata.action || 'Unknown',
          status: tx.metadata.institutionData?.status || 'Unknown',
          createdAt: new Date(tx.timestamp).toISOString()
        };
      }
      else if (tx.metadata?.type === 'INSTITUTION_NFT_MINT') {
        type = 'INSTITUTION_NFT_MINT';
        title = 'Institution NFT Created';
        icon = 'file-plus';
        details = {
          institutionId: tx.metadata.institutionId || 'Unknown',
          institutionName: tx.metadata.institutionName || 'Unknown',
          nftTokenId: tx.metadata.nftTokenId || 'Unknown',
          timestamp: new Date(tx.timestamp).toISOString()
        };
      }
      else if ((tx.metadata?.action === 'CREATE' || tx.metadata?.type === 'APPLICATION_CREATE') && tx.metadata.applicationData) {
        type = 'STUDENT_APPLICATION';
        title = 'Application Submitted';
        icon = 'file-text';
        details = {
          applicationId: tx.metadata.applicationId || tx.metadata.applicationData?.applicationId || 'Unknown',
          studentId: tx.metadata.studentId || tx.metadata.applicationData?.studentId || 'Unknown',
          institutionId: tx.metadata.institutionId || tx.metadata.applicationData?.institutionId || 'Unknown',
          institutionName: tx.metadata.institutionName || tx.metadata.applicationData?.institutionName || 'Unknown',
          program: tx.metadata.applicationData?.programDetails?.program || 'General',
          status: tx.metadata.applicationData?.status || 'PENDING',
          submittedAt: new Date(tx.timestamp).toISOString()
        };
      }
      else if (tx.metadata?.action === 'UPDATE_STATUS' && 
               tx.metadata.applicationData?.status === 'APPROVED') {
        type = 'APPLICATION_APPROVED';
        title = 'Application Approved';
        icon = 'check-circle';
        details = {
          applicationId: tx.metadata.applicationId || 'Unknown',
          studentId: tx.metadata.studentId || 'Unknown',
          institutionId: tx.metadata.institutionId || 'Unknown',
          institutionName: tx.metadata.applicationData?.institutionName || 'Unknown',
          program: tx.metadata.applicationData?.programDetails?.program || 'Unknown Program',
          status: 'APPROVED',
          verifiedAt: new Date(tx.metadata.applicationData?.verificationData?.verifiedAt || tx.timestamp).toISOString(),
          verifier: tx.metadata.applicationData?.verificationData?.additionalDetails?.verifiedBy || tx.fromAddress || 'Institution Admin'
        };
      }
      else if (tx.metadata?.type === 'STUDENT_VERIFICATION' || 
               (tx.metadata?.applicationId && tx.metadata?.verificationData)) {
        type = 'APPLICATION_BLOCKCHAIN_VERIFIED';
        title = 'Application Verified on Blockchain';
        icon = 'shield-check';
        details = {
          applicationId: tx.metadata.applicationId || 'Unknown',
          studentId: tx.metadata.studentId || 'Unknown',
          institutionId: tx.metadata.institutionId || 'Unknown',
          institutionName: tx.metadata.institutionName || 'Unknown',
          program: tx.metadata.programDetails?.program || 'Unknown Program',
          status: 'VERIFIED',
          verifiedAt: new Date(tx.metadata.verificationData?.verifiedAt || tx.timestamp).toISOString(),
          verifier: tx.metadata.verificationData?.additionalDetails?.verifiedBy || tx.fromAddress || 'Institution Admin'
        };
      }
      else if (tx.metadata?.action === 'CONFIRM') {
        type = 'APPLICATION_CONFIRMED';
        title = 'Application Confirmed';
        icon = 'school';
        details = {
          applicationId: tx.metadata.applicationId || 'Unknown',
          studentId: tx.metadata.studentId || 'Unknown',
          institutionId: tx.metadata.institutionId || 'Unknown',
          institutionName: tx.metadata.applicationData?.institutionName || 'Unknown',
          program: tx.metadata.applicationData?.programDetails?.program || 'Unknown Program',
          status: 'CONFIRMED',
          confirmedAt: new Date(tx.timestamp).toISOString()
        };
      }
      else if (tx.metadata?.action === 'COMPLETE') {
        type = 'APPLICATION_COMPLETED';
        title = 'Studies Completed';
        icon = 'briefcase';
        details = {
          applicationId: tx.metadata.applicationId || 'Unknown',
          studentId: tx.metadata.studentId || 'Unknown',
          institutionId: tx.metadata.institutionId || 'Unknown',
          institutionName: tx.metadata.applicationData?.institutionName || 'Unknown',
          program: tx.metadata.applicationData?.programDetails?.program || 'Unknown Program',
          status: 'COMPLETED',
          completedAt: new Date(tx.timestamp).toISOString()
        };
      }
      else {
        // If not a recognized type, return null
        return null;
      }
      
      return { type, title, icon, details };
    } catch (err) {
      console.error(`Error processing institution transaction: ${err.message}`);
      return null;
    }
  }

  /**
   * Process student transactions into metadata
   */
  processStudentTransaction(tx, block) {
    try {
      let type = 'UNKNOWN';
      let title = 'Transaction';
      let icon = 'database';
      let details = {};
      
      // Process student transactions
      if (tx.metadata?.type === 'STUDENT_REGISTRATION') {
        type = 'PROFILE_CREATED';
        title = 'Student Profile Created';
        icon = 'user-plus';
        details = {
          studentId: tx.metadata.studentId || 'Unknown',
          email: tx.metadata.studentData?.email || tx.fromAddress || 'Unknown',
          createdAt: new Date(tx.timestamp).toISOString()
        };
      } 
      else if (tx.metadata?.action === 'MINT_NFT') {
        type = 'ID_CREATION';
        title = 'Digital ID Created';
        icon = 'file-plus';
        details = {
          tokenId: tx.metadata.tokenId || 'Unknown',
          studentId: tx.metadata.studentId || 'Unknown',
          createdAt: new Date(tx.timestamp).toISOString()
        };
      }
      
      return { type, title, icon, details };
    } catch (err) {
      console.error(`Error processing student transaction: ${err.message}`);
      return null;
    }
  }
}

module.exports = new BlockchainService();
