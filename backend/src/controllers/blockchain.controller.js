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
            
            logger.info(`Looking for student with email: ${email} in blockchain`);
            
            // Get the blockchain
            const chain = blockchainService.getChain();
            const pendingTransactions = blockchainService.getPendingTransactions();
            
            // Search for student transactions across all blocks
            let studentData = null;
            let timestamp = null;
            let blockIndex = null;
            
            // First search in confirmed blocks with more flexible matching
            for (const block of chain) {
                for (const tx of block.transactions) {
                    // Check all possible locations where email might be stored
                    const emailMatches = (
                        // Check in data.email (original check)
                        (tx.data && tx.data.email && tx.data.email.toLowerCase() === email.toLowerCase()) ||
                        // Check in metadata.studentData.email (how it's actually stored)
                        (tx.metadata && tx.metadata.studentData && 
                         tx.metadata.studentData.email && 
                         tx.metadata.studentData.email.toLowerCase() === email.toLowerCase()) ||
                        // Check if the email itself is the sender
                        (tx.fromAddress && tx.fromAddress.toLowerCase() === email.toLowerCase()) ||
                        // Check in metadata.email
                        (tx.metadata && tx.metadata.email && 
                         tx.metadata.email.toLowerCase() === email.toLowerCase())
                    );
                    
                    // Check transaction types that might represent student records
                    const isStudentRecord = 
                        tx.type === 'STUDENT_REGISTRATION' || 
                        (tx.metadata && (tx.metadata.role === 'student' || tx.metadata.action === 'CREATE')) ||
                        tx.fromAddress === 'SYSTEM_STUDENT_REGISTRY';
                    
                    if (emailMatches && isStudentRecord) {
                        // Get the student data from wherever it exists
                        const foundStudentData = 
                            (tx.metadata && tx.metadata.studentData) ? tx.metadata.studentData : 
                            (tx.data) ? tx.data : 
                            {
                                email: email,
                                studentId: tx.metadata?.studentId || '',
                                firstName: '',
                                lastName: '',
                                institution: ''
                            };
                        
                        // Use newer transactions over older ones
                        if (!studentData || new Date(tx.timestamp) > new Date(timestamp)) {
                            studentData = foundStudentData;
                            timestamp = tx.timestamp;
                            blockIndex = block.index;
                            
                            logger.info(`Found student record in blockchain block ${block.index}, timestamp ${tx.timestamp}`);
                        }
                    }
                }
            }
            
            // Also check pending transactions with the same checks
            for (const tx of pendingTransactions) {
                const emailMatches = (
                    (tx.data && tx.data.email && tx.data.email.toLowerCase() === email.toLowerCase()) ||
                    (tx.metadata && tx.metadata.studentData && 
                     tx.metadata.studentData.email && 
                     tx.metadata.studentData.email.toLowerCase()) ||
                    (tx.fromAddress && tx.fromAddress.toLowerCase() === email.toLowerCase()) ||
                    (tx.metadata && tx.metadata.email && 
                     tx.metadata.email.toLowerCase() === email.toLowerCase())
                );
                
                const isStudentRecord = 
                    tx.type === 'STUDENT_REGISTRATION' || 
                    (tx.metadata && (tx.metadata.role === 'student' || tx.metadata.action === 'CREATE')) ||
                    tx.fromAddress === 'SYSTEM_STUDENT_REGISTRY';
                
                if (emailMatches && isStudentRecord) {
                    const foundStudentData = 
                        (tx.metadata && tx.metadata.studentData) ? tx.metadata.studentData : 
                        (tx.data) ? tx.data : 
                        {
                            email: email,
                            studentId: tx.metadata?.studentId || '',
                            firstName: '',
                            lastName: '',
                            institution: ''
                        };
                    
                    if (!studentData || new Date(tx.timestamp) > new Date(timestamp)) {
                        studentData = foundStudentData;
                        timestamp = tx.timestamp;
                        blockIndex = 'pending';
                        
                        logger.info(`Found student record in pending transactions, timestamp ${tx.timestamp}`);
                    }
                }
            }
            
            if (!studentData) {
                logger.warn(`No student found with email ${email} in blockchain`);
                return res.status(404).json({
                    success: false,
                    message: 'No student registration found for this email'
                });
            }
            
            logger.info(`Found student with email ${email} in blockchain`);
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

    // Add this new method to the BlockchainController class
    async getUserTransactions(req, res) {
        try {
            const { email, studentId } = req.query;
            
            if (!email && !studentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Either email or studentId is required'
                });
            }
            
            logger.info(`Getting transactions for user with email: ${email}, studentId: ${studentId}`);
            
            // Get the blockchain
            const chain = blockchainService.getChain();
            const pendingTransactions = blockchainService.getPendingTransactions();
            
            const userTransactions = [];
            
            // Search confirmed blocks
            for (const block of chain) {
                for (const tx of block.transactions) {
                    const isRelevantTransaction = 
                        // Check studentId in various locations
                        (studentId && tx.metadata?.studentId === studentId) ||
                        (studentId && tx.metadata?.studentData?.studentId === studentId) ||
                        (studentId && tx.fromAddress === studentId) ||
                        // Check email in various locations
                        (email && tx.metadata?.studentData?.email?.toLowerCase() === email.toLowerCase()) ||
                        (email && tx.metadata?.email?.toLowerCase() === email.toLowerCase()) ||
                        (email && tx.fromAddress?.toLowerCase() === email.toLowerCase()) ||
                        (email && tx.data?.email?.toLowerCase() === email.toLowerCase());
                    
                    if (isRelevantTransaction) {
                        userTransactions.push({
                            ...tx,
                            blockIndex: block.index,
                            blockHash: block.hash,
                            confirmed: true
                        });
                    }
                }
            }
            
            // Search pending transactions
            for (const tx of pendingTransactions) {
                const isRelevantTransaction = 
                    // Same checks as above
                    (studentId && tx.metadata?.studentId === studentId) ||
                    (studentId && tx.metadata?.studentData?.studentId === studentId) ||
                    (studentId && tx.fromAddress === studentId) ||
                    (email && tx.metadata?.studentData?.email?.toLowerCase() === email.toLowerCase()) ||
                    (email && tx.metadata?.email?.toLowerCase() === email.toLowerCase()) ||
                    (email && tx.fromAddress?.toLowerCase() === email.toLowerCase()) ||
                    (email && tx.data?.email?.toLowerCase() === email.toLowerCase());
                
                if (isRelevantTransaction) {
                    userTransactions.push({
                        ...tx,
                        confirmed: false
                    });
                }
            }
            
            // Sort by timestamp (newest first)
            userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            logger.info(`Found ${userTransactions.length} transactions for user`);
            
            return res.status(200).json({
                success: true,
                count: userTransactions.length,
                transactions: userTransactions
            });
        } catch (error) {
            logger.error(`Error getting user transactions: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Add this function to your blockchain controller
    // If you have a class-based controller, add it as a method to the class

    /**
     * Get blockchain metadata for users or institutions
     */
    async getUserMetadata(req, res) {
        try {
            const { userId, email, institutionId } = req.query;
            
            if (!userId && !email && !institutionId) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one of userId, email, or institutionId must be provided'
                });
            }
            
            logger.info(`Getting blockchain metadata for user: ${email || userId || institutionId}`);
            
            let metadata = [];
            
            // Safely check if this is an institution user by handling undefined req.user
            const isInstitution = req.user && (req.user.role === 'institution' || req.user.institutionId);
            const instId = institutionId || (isInstitution && req.user ? req.user.institutionId : null);
            const instEmail = email || (isInstitution && req.user ? req.user.email : null);
            
            // Handle institution case (if institutionId provided or user is an institution)
            if (instId || instEmail) {
                metadata = await blockchainService.getInstitutionMetadata(instId, instEmail);
                logger.info(`Found ${metadata.length} institution transactions`);
            } 
            // Handle student case
            else {
                const userEmail = email || (req.user ? req.user.email : null);
                const userStudentId = userId || (req.user ? req.user.studentId : null);
                
                if (!userEmail && !userStudentId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Either email or userId is required for student metadata'
                    });
                }
                
                metadata = await blockchainService.getUserMetadata(userStudentId, userEmail);
                logger.info(`Found ${metadata.length} student transactions`);
            }
            
            return res.json({
                success: true,
                count: metadata.length,
                metadata
            });
        } catch (error) {
            logger.error(`Error retrieving blockchain metadata: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve blockchain metadata',
                error: { message: error.message }
            });
        }
    }
}

module.exports = new BlockchainController();