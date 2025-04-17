const fs = require('fs');
const path = require('path');
const NFT = require('../models/nft.model.js');
const IDCard = require('../models/idcard.model.js');
const transactionService = require('./transaction.service');
const blockchainService = require('./blockchain.service');
const studentService = require('./student.service');
const idCardGenerator = require('../utils/idCardGenerator.utils');
const logger = require('../utils/logger.utils');

class NFTService {
  constructor() {
    this.dataDir = path.join(__dirname, "../../data");
    this.nftsFile = path.join(this.dataDir, "nfts.json");
    this.idcardsFile = path.join(this.dataDir, "idcards.json");
    this.cardsDir = path.join(this.dataDir, "cards");
    
    // Ensure directories exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.cardsDir)) {
      fs.mkdirSync(this.cardsDir, { recursive: true });
    }
    
    // Initialize collections
    this.nfts = new Map();
    this.idCards = new Map();
    
    // Load existing data
    this.loadNFTs();
    this.loadIDCards();
  }
  
  loadNFTs() {
    try {
      if (fs.existsSync(this.nftsFile)) {
        const data = fs.readFileSync(this.nftsFile, 'utf8');
        const nftsArray = JSON.parse(data);
        
        nftsArray.forEach(nftData => {
          const nft = new NFT(
            nftData.tokenId,
            nftData.studentId,
            nftData.ownerAddress,
            nftData.metadataUri
          );
          nft.mintedAt = nftData.mintedAt;
          nft.lastTransferredAt = nftData.lastTransferredAt;
          nft.mintTxHash = nftData.mintTxHash;
          nft.status = nftData.status;
          
          this.nfts.set(nftData.tokenId, nft);
        });
        
        logger.info(`Loaded ${this.nfts.size} NFTs from file`);
      } else {
        logger.info('No NFT file found. Starting with empty NFT database.');
      }
    } catch (error) {
      logger.error(`Failed to load NFTs: ${error.message}`);
    }
  }
  
  loadIDCards() {
    try {
      if (fs.existsSync(this.idcardsFile)) {
        const data = fs.readFileSync(this.idcardsFile, 'utf8');
        const idCardsArray = JSON.parse(data);
        
        idCardsArray.forEach(cardData => {
          const idCard = new IDCard(
            cardData.studentId,
            cardData.cardNumber,
            cardData.issueDate,
            cardData.expiryDate,
            cardData.cardType,
            cardData.imageUri
          );
          idCard.status = cardData.status;
          idCard.createdAt = cardData.createdAt;
          idCard.updatedAt = cardData.updatedAt;
          idCard.nftTokenId = cardData.nftTokenId;
          
          this.idCards.set(cardData.studentId, idCard);
        });
        
        logger.info(`Loaded ${this.idCards.size} ID cards from file`);
      } else {
        logger.info('No ID cards file found. Starting with empty ID cards database.');
      }
    } catch (error) {
      logger.error(`Failed to load ID cards: ${error.message}`);
    }
  }
  
  saveNFTs() {
    try {
      const nftsArray = Array.from(this.nfts.values()).map(nft => nft.toJSON());
      fs.writeFileSync(this.nftsFile, JSON.stringify(nftsArray, null, 2));
      logger.info('NFTs saved to file successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to save NFTs: ${error.message}`);
      return false;
    }
  }
  
  saveIDCards() {
    try {
      const idCardsArray = Array.from(this.idCards.values()).map(card => card.toJSON());
      fs.writeFileSync(this.idcardsFile, JSON.stringify(idCardsArray, null, 2));
      logger.info('ID cards saved to file successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to save ID cards: ${error.message}`);
      return false;
    }
  }

  async createIDCard(studentId, cardData, imageBase64) {
    try {
      // Check if student already has an ID card
      if (this.idCards.has(studentId)) {
        throw new Error(`Student with ID ${studentId} already has an ID card`);
      }
      
      // Check if student exists
      const student = studentService.getStudentById(studentId);
      
      // Generate a unique card number
      const cardNumber = `CARD-${Date.now().toString().slice(-6)}-${studentId}`;
      
      // Save image if provided
      let imageUri = null;
      if (imageBase64) {
        const imageBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');
        const filename = `${studentId}_${Date.now()}.png`;
        const imagePath = path.join(this.cardsDir, filename);
        
        fs.writeFileSync(imagePath, imageBuffer);
        imageUri = `/api/nft/idcards/${studentId}/image`;
        
        logger.info(`Saved ID card image for student ${studentId}`);
      } else {
        // Generate sample ID card
        const idCardData = {
          cardNumber,
          issueDate: cardData.issueDate || Date.now(),
          expiryDate: cardData.expiryDate || Date.now() + (4 * 365 * 24 * 60 * 60 * 1000), // 4 years by default
          cardType: cardData.cardType || 'STUDENT'
        };
        
        const imageBuffer = await idCardGenerator.generateIDCard(student, idCardData);
        const filename = `${studentId}_${Date.now()}.png`;
        const imagePath = path.join(this.cardsDir, filename);
        
        fs.writeFileSync(imagePath, imageBuffer);
        imageUri = `/api/nft/idcards/${studentId}/image`;
        
        logger.info(`Generated ID card image for student ${studentId}`);
      }
      
      // Create new ID card
      const idCard = new IDCard(
        studentId,
        cardNumber,
        cardData.issueDate || Date.now(),
        cardData.expiryDate || Date.now() + (4 * 365 * 24 * 60 * 60 * 1000), // 4 years by default
        cardData.cardType || 'STUDENT',
        imageUri
      );
      
      // Add to collection
      this.idCards.set(studentId, idCard);
      
      // Save to file
      this.saveIDCards();
      
      logger.info(`Created ID card for student ${studentId}`);
      return idCard;
    } catch (error) {
      logger.error(`Create ID card error: ${error.message}`);
      throw error;
    }
  }
  
  async mintNFT(studentId) {
    try {
      // Check if student has an ID card
      if (!this.idCards.has(studentId)) {
        throw new Error(`No ID card found for student ${studentId}`);
      }
      
      const idCard = this.idCards.get(studentId);
      
      // Check if this ID card is already minted as NFT
      if (idCard.nftTokenId) {
        throw new Error(`ID card for student ${studentId} is already minted as NFT ${idCard.nftTokenId}`);
      }
      
      // Create metadata JSON for the NFT
      const metadata = idCard.toMetadata();
      const metadataFilename = `${studentId}_metadata.json`;
      const metadataPath = path.join(this.cardsDir, metadataFilename);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      const metadataUri = `/api/nft/idcards/${studentId}/metadata`;
      
      // Create NFT
      const nft = new NFT(
        null, // Automatically generate tokenId
        studentId,
        'UNIVERSITY_REGISTRY', // Initial owner is the university
        metadataUri
      );
      
      // Record NFT minting on blockchain
      const mintTransaction = await this.recordNFTMintOnBlockchain(nft);
      nft.mintTxHash = mintTransaction.id;
      
      // Add NFT to collection
      this.nfts.set(nft.tokenId, nft);
      
      // Link NFT to ID card
      idCard.linkToNFT(nft.tokenId);
      
      // Save both collections
      this.saveNFTs();
      this.saveIDCards();
      
      logger.info(`Minted NFT ${nft.tokenId} for student ${studentId}`);
      return { nft, idCard };
    } catch (error) {
      logger.error(`Mint NFT error: ${error.message}`);
      throw error;
    }
  }
  
  async recordNFTMintOnBlockchain(nft) {
    try {
      // Create metadata for the transaction
      const metadata = {
        action: 'MINT_NFT',
        tokenId: nft.tokenId,
        studentId: nft.studentId,
        metadataUri: nft.metadataUri,
        type: 'ID_CARD',
        mintedAt: nft.mintedAt
      };
      
      // Create a special transaction for NFT minting
      const transaction = transactionService.createTransaction(
        'SYSTEM_NFT_REGISTRY',
        nft.ownerAddress,
        0, // Zero amount for NFT minting
        metadata
      );
      
      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);
      
      logger.info(`NFT minting recorded in blockchain for student ${nft.studentId}`);
      return transaction;
    } catch (error) {
      logger.error(`Failed to record NFT minting in blockchain: ${error.message}`);
      throw error;
    }
  }
  
  async transferNFT(tokenId, fromAddress, toAddress) {
    try {
      // Check if NFT exists
      if (!this.nfts.has(tokenId)) {
        throw new Error(`NFT with token ID ${tokenId} not found`);
      }
      
      const nft = this.nfts.get(tokenId);
      
      // Check ownership
      if (nft.ownerAddress !== fromAddress) {
        throw new Error(`NFT with token ID ${tokenId} is not owned by ${fromAddress}`);
      }
      
      // Update ownership
      nft.ownerAddress = toAddress;
      nft.lastTransferredAt = Date.now();
      nft.status = 'TRANSFERRED';
      
      // Record transfer on blockchain
      await this.recordNFTTransferOnBlockchain(nft, fromAddress, toAddress);
      
      // Save NFTs
      this.saveNFTs();
      
      logger.info(`Transferred NFT ${tokenId} from ${fromAddress} to ${toAddress}`);
      return nft;
    } catch (error) {
      logger.error(`Transfer NFT error: ${error.message}`);
      throw error;
    }
  }
  
  async recordNFTTransferOnBlockchain(nft, fromAddress, toAddress) {
    try {
      // Create metadata for the transaction
      const metadata = {
        action: 'TRANSFER_NFT',
        tokenId: nft.tokenId,
        studentId: nft.studentId,
        fromAddress,
        toAddress,
        transferredAt: nft.lastTransferredAt
      };
      
      // Create a transaction for NFT transfer
      const transaction = transactionService.createTransaction(
        fromAddress,
        toAddress,
        0, // Zero amount for NFT transfer
        metadata
      );
      
      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);
      
      logger.info(`NFT transfer recorded in blockchain for token ${nft.tokenId}`);
      return transaction;
    } catch (error) {
      logger.error(`Failed to record NFT transfer in blockchain: ${error.message}`);
      throw error;
    }
  }
  
  getNFTsByStudentId(studentId) {
    try {
      const studentNFTs = [];
      for (const [tokenId, nft] of this.nfts.entries()) {
        if (nft.studentId === studentId) {
          studentNFTs.push(nft);
        }
      }
      return studentNFTs;
    } catch (error) {
      logger.error(`Get NFTs by student ID error: ${error.message}`);
      throw error;
    }
  }
  
  getNFTByTokenId(tokenId) {
    const nft = this.nfts.get(tokenId);
    if (!nft) {
      throw new Error(`NFT with token ID ${tokenId} not found`);
    }
    return nft;
  }
  
  getIDCardByStudentId(studentId) {
    const idCard = this.idCards.get(studentId);
    if (!idCard) {
      throw new Error(`ID card for student ${studentId} not found`);
    }
    return idCard;
  }
  
  verifyNFT(tokenId) {
    try {
      // Check if NFT exists
      if (!this.nfts.has(tokenId)) {
        return { valid: false, reason: `NFT with token ID ${tokenId} not found` };
      }
      
      const nft = this.nfts.get(tokenId);
      
      // Check if linked to valid ID card
      if (!this.idCards.has(nft.studentId)) {
        return { valid: false, reason: `No ID card found for linked student ${nft.studentId}` };
      }
      
      const idCard = this.idCards.get(nft.studentId);
      
      // Check if NFT is linked to ID card
      if (idCard.nftTokenId !== tokenId) {
        return { valid: false, reason: `NFT token ID mismatch with ID card` };
      }
      
      // Check if ID card is active
      if (idCard.status !== 'ACTIVE') {
        return { valid: false, reason: `ID card is not active (status: ${idCard.status})` };
      }
      
      // Check if ID card is expired
      if (idCard.expiryDate < Date.now()) {
        return { valid: false, reason: `ID card has expired` };
      }
      
      // Verify on blockchain
      const isOnBlockchain = this.verifyNFTOnBlockchain(nft);
      if (!isOnBlockchain) {
        return { valid: false, reason: `NFT not found on blockchain` };
      }
      
      return { 
        valid: true, 
        nft: nft.toJSON(),
        idCard: idCard.toJSON()
      };
    } catch (error) {
      logger.error(`Verify NFT error: ${error.message}`);
      return { valid: false, reason: error.message };
    }
  }
  
  verifyNFTOnBlockchain(nft) {
    try {
      // Get transactions related to this NFT by token ID
      const transactions = blockchainService.blockchain.chain
        .flatMap(block => block.transactions)
        .filter(tx => 
          tx.metadata && 
          (tx.metadata.action === 'MINT_NFT' || tx.metadata.action === 'TRANSFER_NFT') &&
          tx.metadata.tokenId === nft.tokenId
        );
      
      // No transactions found for this NFT
      if (transactions.length === 0) {
        return false;
      }
      
      // Find the mint transaction
      const mintTx = transactions.find(tx => 
        tx.metadata.action === 'MINT_NFT' && tx.id === nft.mintTxHash
      );
      
      // Mint transaction not found or does not match
      if (!mintTx) {
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error(`Verify NFT on blockchain error: ${error.message}`);
      return false;
    }
  }
  
  async getIDCardImage(studentId) {
    try {
      logger.info(`Fetching ID card image for student ${studentId}`);
      const idCard = this.idCards.get(studentId);
      
      if (!idCard) {
        throw new Error(`ID card for student ${studentId} not found`);
      }
      
      // Get all files in the directory
      const files = fs.readdirSync(this.cardsDir);
      
      // Find any file that starts with the student ID
      const matchingFiles = files.filter(file => file.startsWith(`${studentId}_`));
      
      if (matchingFiles.length === 0) {
        throw new Error(`No image file found for student ${studentId}`);
      }
      
      // Use the first matching file (or sort by date if needed)
      const imageFile = matchingFiles[0];
      const imagePath = path.join(this.cardsDir, imageFile);
      
      logger.info(`Found image file: ${imageFile}`);
      
      // Return the image buffer
      return {
        buffer: fs.readFileSync(imagePath),
        contentType: 'image/png'
      };
    } catch (error) {
      logger.error(`Get ID card image error: ${error.message}`);
      throw error;
    }
  }
  
  getNFTMetadata(studentId) {
    try {
      // Check if student has an ID card
      if (!this.idCards.has(studentId)) {
        throw new Error(`No ID card found for student ${studentId}`);
      }
      
      const idCard = this.idCards.get(studentId);
      
      // Generate metadata
      return idCard.toMetadata();
    } catch (error) {
      logger.error(`Get NFT metadata error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new NFTService();