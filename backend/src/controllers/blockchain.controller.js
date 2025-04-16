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
}

module.exports = new BlockchainController();