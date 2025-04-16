const blockchainService = require('../services/blockchain.service');
const blockService = require('../services/block.service');
const validationService = require('../services/validation.service');
const logger = require('../utils/logger.utils');

class BlockchainController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    async createBlockchain(req, res) {
        try {
            const blockchain = await this.blockchainService.createBlockchain();
            res.status(201).json(blockchain);
        } catch (error) {
            res.status(500).json({ message: 'Error creating blockchain', error: error.message });
        }
    }

    async getBlockchain(req, res) {
        try {
            const blockchain = await this.blockchainService.getBlockchain();
            res.status(200).json(blockchain);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving blockchain', error: error.message });
        }
    }

    async addBlock(req, res) {
        try {
            const blockData = req.body;
            const block = await this.blockchainService.addBlock(blockData);
            res.status(201).json(block);
        } catch (error) {
            res.status(500).json({ message: 'Error adding block', error: error.message });
        }
    }

    async validateBlockchain(req, res) {
        try {
            const isValid = await this.blockchainService.validateBlockchain();
            res.status(200).json({ valid: isValid });
        } catch (error) {
            res.status(500).json({ message: 'Error validating blockchain', error: error.message });
        }
    }

    async getChain(req, res) {
        try {
            const chain = blockchainService.getChain();
            return res.status(200).json({
                success: true,
                length: chain.length,
                chain
            });
        } catch (error) {
            logger.error(`Get chain error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getBlockByIndex(req, res) {
        try {
            const { index } = req.params;
            const block = blockchainService.getBlockByIndex(index);
            return res.status(200).json({
                success: true,
                block
            });
        } catch (error) {
            logger.error(`Get block error: ${error.message}`);
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async getBlockByHash(req, res) {
        try {
            const { hash } = req.params;
            const block = blockchainService.getBlockByHash(hash);
            return res.status(200).json({
                success: true,
                block
            });
        } catch (error) {
            logger.error(`Get block error: ${error.message}`);
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async minePendingTransactions(req, res) {
        try {
            const { miningRewardAddress, metadata } = req.body;

            if (!miningRewardAddress) {
                return res.status(400).json({
                    success: false,
                    message: 'Mining reward address is required'
                });
            }

            // Validate metadata if provided
            if (metadata) {
                const validationResult = validationService.validateMetadata(metadata);
                if (!validationResult.valid) {
                    return res.status(400).json({
                        success: false,
                        message: validationResult.reason
                    });
                }
            }

            const newBlock = blockchainService.minePendingTransactions(miningRewardAddress, metadata || {});
            return res.status(201).json({
                success: true,
                message: 'Pending transactions have been mined',
                block: newBlock
            });
        } catch (error) {
            logger.error(`Mine transactions error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async validateChain(req, res) {
        try {
            const result = blockchainService.validateChain();
            return res.status(200).json({
                success: true,
                isValid: result.valid,
                message: result.valid ? 'Blockchain is valid' : 'Blockchain is invalid'
            });
        } catch (error) {
            logger.error(`Validate chain error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getBlockchainInfo(req, res) {
        try {
            const chain = blockchainService.getChain();
            return res.status(200).json({
                success: true,
                blockCount: chain.length,
                difficulty: blockchainService.getBlockchainDifficulty(),
                latestBlock: chain[chain.length - 1]
            });
        } catch (error) {
            logger.error(`Get blockchain info error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async saveBlockchain(req, res) {
        try {
            const result = blockchainService.saveBlockchain();
            return res.status(200).json({
                success: result,
                message: result ? 'Blockchain saved successfully' : 'Failed to save blockchain'
            });
        } catch (error) {
            logger.error(`Save blockchain error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async mineStudentTransactions(req, res) {
        try {
            const mineStudentTransactions = require("../utils/mineStudentTransactions");
            const newBlock = await mineStudentTransactions();
            
            if (newBlock) {
                return res.status(200).json({
                    success: true,
                    message: 'Student transactions successfully mined',
                    block: {
                        index: newBlock.index,
                        hash: newBlock.hash,
                        nonce: newBlock.nonce,
                        transactionCount: newBlock.transactions.length
                    }
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'No pending student transactions to mine'
                });
            }
        } catch (error) {
            logger.error(`Mine student transactions error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Fix the getStudentByEmail method

    async getStudentByEmail(req, res) {
        try {
            const { email } = req.params;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email parameter is required'
                });
            }
            
            // Get the blockchain
            const chain = blockchainService.getChain();
            
            // Search for student transactions across all blocks
            let studentData = null;
            let timestamp = null;
            let blockIndex = null;
            
            // First search in confirmed blocks
            for (const block of chain) {
                for (const tx of block.transactions) {
                    // Check if this is a student registration transaction
                    if (tx.fromAddress === "SYSTEM_STUDENT_REGISTRY" && 
                        tx.metadata && 
                        tx.metadata.action === "CREATE" &&
                        tx.metadata.studentData && 
                        tx.metadata.studentData.email && 
                        tx.metadata.studentData.email.toLowerCase() === email.toLowerCase()) {
                        
                        // If we already found a student record, only update if this one is newer
                        if (!studentData || tx.timestamp > timestamp) {
                            studentData = tx.metadata.studentData;
                            timestamp = tx.timestamp;
                            blockIndex = block.index;
                        }
                    }
                }
            }
            
            // Also check pending transactions
            const pendingTransactions = blockchainService.getPendingTransactions();
            for (const tx of pendingTransactions) {
                if (tx.fromAddress === "SYSTEM_STUDENT_REGISTRY" && 
                    tx.metadata && 
                    tx.metadata.action === "CREATE" &&
                    tx.metadata.studentData && 
                    tx.metadata.studentData.email && 
                    tx.metadata.studentData.email.toLowerCase() === email.toLowerCase()) {
                    
                    // If we already found a student record, only update if this one is newer
                    if (!studentData || tx.timestamp > timestamp) {
                        studentData = tx.metadata.studentData;
                        timestamp = tx.timestamp;
                        blockIndex = 'pending';
                    }
                }
            }
            
            if (!studentData) {
                return res.status(404).json({
                    success: false,
                    message: 'No student registration found for this email'
                });
            }
            
            return res.status(200).json({
                success: true,
                studentInfo: {
                    ...studentData,
                    timestamp,
                    blockIndex,
                    blockchainVerified: true
                }
            });
        } catch (error) {
            logger.error(`Error getting student by email: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new BlockchainController();