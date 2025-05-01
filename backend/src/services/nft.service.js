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
    this.institutionNftsDir = path.join(this.dataDir, "institution_nfts");
    
    // Ensure directories exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.cardsDir)) {
      fs.mkdirSync(this.cardsDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.institutionNftsDir)) {
      fs.mkdirSync(this.institutionNftsDir, { recursive: true });
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
      
      // Extract version from query params if available
      const version = parseInt(this.req?.query?.v) || null;
      
      // Check if ID card exists
      if (!this.idCards.has(studentId)) {
        throw new Error(`ID card for student ${studentId} not found`);
      }
      
      const idCard = this.idCards.get(studentId);
      
      // Get all files in the directory
      const files = fs.readdirSync(this.cardsDir);
      let imageFile = null;
      
      // Try to find version-specific image first
      if (version) {
        // Look for version-specific pattern: STU123_v2_timestamp.png
        const versionFiles = files.filter(file => 
          file.startsWith(`${studentId}_v${version}_`) && 
          (file.endsWith('.png') || file.endsWith('.jpg'))
        );
        
        if (versionFiles.length > 0) {
          imageFile = versionFiles[0];
          logger.info(`Found version ${version} image file: ${imageFile}`);
        }
      }
      
      // If no version-specific image found, try any image for this student
      if (!imageFile) {
        // Look for any image matching this student ID
        const studentFiles = files.filter(file => 
          file.startsWith(`${studentId}_`) && 
          (file.endsWith('.png') || file.endsWith('.jpg')) && 
          !file.endsWith('_metadata.json')
        );
        
        if (studentFiles.length > 0) {
          imageFile = studentFiles[0];
          logger.info(`Found image file: ${imageFile}`);
        }
      }
      
      if (imageFile) {
        const imagePath = path.join(this.cardsDir, imageFile);
        return {
          buffer: fs.readFileSync(imagePath),
          contentType: imageFile.endsWith('.png') ? 'image/png' : 'image/jpeg'
        };
      }
      
      // If no image file exists, generate one dynamically based on card data
      logger.info(`No image file found for student ${studentId}, generating dynamically`);
      
      // Get student data
      const student = studentService.getStudentById(studentId);
      
      // Generate a card with the appropriate version data
      let cardData = idCard;
      
      // If a specific version was requested, try to get that NFT version
      if (version && version > 1) {
        const versionNfts = this.getAllNFTVersionsByStudentId(studentId)
          .filter(nft => nft.version === version);
        
        if (versionNfts.length > 0) {
          // Get metadata for this specific version
          const metadataFilename = `${studentId}_v${version}_metadata.json`;
          const metadataPath = path.join(this.cardsDir, metadataFilename);
          
          if (fs.existsSync(metadataPath)) {
            const versionMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            
            // Use this metadata to influence the generated image
            cardData = {
              ...idCard,
              expiryDate: versionMetadata.attributes.find(a => a.trait_type === "Expiry Date")?.value || idCard.expiryDate,
              cardType: versionMetadata.attributes.find(a => a.trait_type === "Card Type")?.value || idCard.cardType
            };
          }
        }
      }
      
      // Generate dynamic ID card
      const imageBuffer = await idCardGenerator.generateIDCard(student, cardData);
      
      return {
        buffer: imageBuffer,
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

  /**
   * Update an existing ID card and create a new NFT version
   */
  async updateIDCardAndCreateNewVersion(tokenId, updateData, imageBase64 = null) {
    try {
      // Find the current NFT by token ID
      if (!this.nfts.has(tokenId)) {
        throw new Error(`NFT with token ID ${tokenId} not found`);
      }
      
      const currentNft = this.nfts.get(tokenId);
      const studentId = currentNft.studentId;
      
      // Find the ID card
      if (!this.idCards.has(studentId)) {
        throw new Error(`ID card for student ${studentId} not found`);
      }
      
      const idCard = this.idCards.get(studentId);
      
      // Find all versions of this student's NFTs to determine the correct next version number
      const studentNfts = this.getAllNFTVersionsByStudentId(studentId);
      const highestVersion = studentNfts.reduce((max, nft) => Math.max(max, nft.version || 0), 0);
      
      // Mark the current version as not latest
      currentNft.isLatestVersion = false;
      
      // Calculate the new version number using the highest existing version
      const newVersion = highestVersion + 1;
      
      logger.info(`Creating new NFT version ${newVersion} for student ${studentId} (previous highest: ${highestVersion})`);
      
      // Update the ID card with new data, preserving institution verification
      if (updateData.expiryDate) idCard.expiryDate = updateData.expiryDate;
      if (updateData.cardType) idCard.cardType = updateData.cardType;
      if (updateData.status) idCard.status = updateData.status;
      
      // Handle institution verification - only update if provided
      if (updateData.institution && updateData.institutionId) {
        idCard.setVerification(
          updateData.institutionId,
          updateData.institution,
          updateData.verificationDetails || {
            program: updateData.program || "General Program",
            admissionDate: updateData.enrollmentYear ? `${updateData.enrollmentYear}-01-01` : new Date().toISOString(),
            institutionType: updateData.verificationDetails?.institutionType || "University",
            verifiedAt: updateData.verificationDetails?.verifiedAt || new Date().toISOString(),
            verifiedBy: updateData.verificationDetails?.verifiedBy || updateData.institution
          }
        );
        
        logger.info(`Updated ID card with institution verification: ${updateData.institution}`);
      }
      
      // Important: Don't remove institution verification if not provided in update
      
      idCard.updatedAt = Date.now();
      
      // Save new image if provided
      let imageUri = null;
      if (imageBase64) {
        // User provided an image - save it with version marker
        // ...existing code...
      } else {
        // No image provided - generate one with the updated data
        const student = studentService.getStudentById(studentId);
        
        // Create updated card data for image generation
        const idCardData = {
          cardNumber: idCard.cardNumber,
          issueDate: idCard.issueDate, 
          expiryDate: updateData.expiryDate || idCard.expiryDate,
          cardType: updateData.cardType || idCard.cardType,
          status: updateData.status || idCard.status,
          version: newVersion,  // Use the correct new version
          
          // Institution verification data for the ID card image with proper fallbacks
          institution: updateData.institution || idCard.verifiedInstitution,
          program: updateData.program || idCard.verificationData?.program || "General Program",
          enrollmentYear: updateData.enrollmentYear || 
                         (idCard.verificationData?.admissionDate ? new Date(idCard.verificationData.admissionDate).getFullYear() : null),
          verificationDetails: updateData.verificationDetails || idCard.verificationData || {}
        };
        
        // Add debug info
        logger.info(`ID Card Data for image generation: 
          - Institution: ${idCardData.institution}
          - Program: ${idCardData.program}
          - Version: ${idCardData.version}
          - Card Type: ${idCardData.cardType}
        `);
        
        // Generate a new image with updated data
        const imageBuffer = await idCardGenerator.generateIDCard(student, idCardData);
        const filename = `${studentId}_v${newVersion}_${Date.now()}.png`;
        const imagePath = path.join(this.cardsDir, filename);
        
        fs.writeFileSync(imagePath, imageBuffer);
        imageUri = `/api/nft/idcards/${studentId}/image?v=${newVersion}`;
        
        logger.info(`Generated updated ID card image with institution verification for student ${studentId} (version ${newVersion})`);
      }
      
      // Create metadata JSON for the new NFT version
      const metadata = idCard.toMetadata(newVersion);
      const metadataFilename = `${studentId}_v${newVersion}_metadata.json`;
      const metadataPath = path.join(this.cardsDir, metadataFilename);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      const metadataUri = `/api/nft/idcards/${studentId}/metadata?v=${newVersion}`;
      
      // Create a new NFT version
      const newNft = new NFT(
        null, // Auto-generate new token ID
        studentId,
        currentNft.ownerAddress,
        metadataUri,
        idCard.cardNumber, // Keep the same card number
        newVersion,
        currentNft.tokenId // Reference the previous version
      );
      
      // Record NFT minting on blockchain
      const mintTransaction = await this.recordNFTVersionOnBlockchain(newNft, currentNft.tokenId);
      newNft.mintTxHash = mintTransaction.id;
      
      // Add NFT to collection
      this.nfts.set(newNft.tokenId, newNft);
      
      // MODIFICATION HERE: Make sure to properly update nftVersions
      if (!idCard.nftVersions) {
        idCard.nftVersions = [];
      }
      if (!idCard.nftVersions.includes(currentNft.tokenId)) {
        idCard.nftVersions.push(currentNft.tokenId); 
      }
      
      // Link NFT to ID card
      idCard.linkToNFT(newNft.tokenId);
      
      // Explicitly mark the new version as latest
      newNft.isLatestVersion = true;
      
      // Save both collections
      this.saveNFTs();
      this.saveIDCards();
      
      logger.info(`Created NFT version ${newVersion} (${newNft.tokenId}) for student ${studentId}`);
      
      return { 
        newVersion: newNft, 
        previousVersion: currentNft,
        idCard 
      };
    } catch (error) {
      logger.error(`Update ID card and create new version error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Record NFT version creation on blockchain
   */
  async recordNFTVersionOnBlockchain(nft, previousVersionId) {
    try {
      // Create metadata for the transaction
      const metadata = {
        action: 'UPDATE_NFT',
        tokenId: nft.tokenId,
        studentId: nft.studentId,
        metadataUri: nft.metadataUri,
        previousVersionId: previousVersionId,
        version: nft.version,
        cardNumber: nft.cardNumber,
        type: 'ID_CARD',
        updatedAt: nft.mintedAt
      };
      
      // Create a transaction for NFT version update
      const transaction = transactionService.createTransaction(
        'SYSTEM_NFT_REGISTRY',
        nft.ownerAddress,
        0, // Zero amount for NFT version update
        metadata
      );
      
      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);
      
      logger.info(`NFT version ${nft.version} creation recorded in blockchain for student ${nft.studentId}`);
      return transaction;
    } catch (error) {
      logger.error(`Failed to record NFT version in blockchain: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all versions of NFTs for a student
   */
  getAllNFTVersionsByStudentId(studentId) {
    try {
      const studentNfts = Array.from(this.nfts.values())
        .filter(nft => nft.studentId === studentId)
        .sort((a, b) => b.version - a.version); // Sort by version, newest first
      
      return studentNfts;
    } catch (error) {
      logger.error(`Get all NFT versions error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the latest NFT version for a student
   */
  getLatestNFTVersionByStudentId(studentId) {
    try {
      const latestNft = Array.from(this.nfts.values())
        .find(nft => nft.studentId === studentId && nft.isLatestVersion);
      
      if (!latestNft) {
        throw new Error(`No NFT found for student ${studentId}`);
      }
      
      return latestNft;
    } catch (error) {
      logger.error(`Get latest NFT version error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a specific NFT version
   */
  getNFTVersion(tokenId) {
    try {
      if (!this.nfts.has(tokenId)) {
        throw new Error(`NFT with token ID ${tokenId} not found`);
      }
      
      return this.nfts.get(tokenId);
    } catch (error) {
      logger.error(`Get NFT version error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get metadata for a specific NFT version
   */
  getNFTVersionMetadata(studentId, version = null) {
    try {
      // Check if student has an ID card
      if (!this.idCards.has(studentId)) {
        throw new Error(`No ID card found for student ${studentId}`);
      }
      
      const idCard = this.idCards.get(studentId);
      
      // If version is not specified, get the latest version
      if (version === null) {
        const latestNft = this.getLatestNFTVersionByStudentId(studentId);
        version = latestNft.version;
      }
      
      // Try to find metadata file with specific version
      const metadataFilename = `${studentId}_v${version}_metadata.json`;
      const metadataPath = path.join(this.cardsDir, metadataFilename);
      
      if (fs.existsSync(metadataPath)) {
        return JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      }
      
      // Fallback to generating metadata if file doesn't exist
      return idCard.toMetadata(version);
    } catch (error) {
      logger.error(`Get NFT version metadata error: ${error.message}`);
      throw error;
    }
  }

  async createInstitutionNFTFiles(institution, nftTokenId) {
    try {
      // Create directory if it doesn't exist - use the class property instead
      if (!fs.existsSync(this.institutionNftsDir)) {
        fs.mkdirSync(this.institutionNftsDir, { recursive: true });
      }
      
      // Generate metadata
      const metadata = {
        name: `${institution.name} - Official Institution NFT`,
        description: `This NFT certifies that ${institution.name} is a verified institution on the IDEMY platform.`,
        image: `/api/nft/institution/${institution.institutionId}/image`, // URL to image
        attributes: [
          {
            trait_type: "Institution Type",
            value: institution.institutionType || "Unknown",
          },
          {
            trait_type: "Founded",
            value: institution.foundingYear ? institution.foundingYear.toString() : "Unknown",
          },
          {
            trait_type: "Location",
            value: institution.location || "Unknown",
          },
          {
            trait_type: "Verification Status",
            value: "VERIFIED",
          },
          {
            trait_type: "Verified At",
            value: new Date().toISOString(),
          }
        ]
      };
      
      // Save metadata file
      const metadataFilename = `${institution.institutionId}_metadata.json`;
      const metadataPath = path.join(this.institutionNftsDir, metadataFilename);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      // Generate image
      const { createCanvas } = require('canvas');
      const canvas = createCanvas(800, 600);
      const ctx = canvas.getContext('2d');
      
      // Fill background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 800, 600);
      
      // Add border
      ctx.strokeStyle = '#1a5fb4';
      ctx.lineWidth = 15;
      ctx.strokeRect(20, 20, 760, 560);
      
      // Add header
      ctx.fillStyle = '#1a5fb4';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('INSTITUTION VERIFICATION', 400, 80);
      
      // Add institution name
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 50px Arial';
      const nameLines = this.wrapText(ctx, institution.name, 700);
      let yPos = 160;
      nameLines.forEach(line => {
        ctx.fillText(line, 400, yPos);
        yPos += 50;
      });
      
      // Add verified text
      ctx.fillStyle = '#27ae60';
      ctx.font = '36px Arial';
      ctx.fillText('VERIFIED INSTITUTION', 400, yPos + 30);
      
      // Add NFT ID
      ctx.fillStyle = '#7f8c8d';
      ctx.font = '24px Arial';
      ctx.fillText(`NFT ID: ${nftTokenId}`, 400, yPos + 80);
      
      // Add verification date
      ctx.fillText(`Verified on: ${new Date().toLocaleDateString()}`, 400, yPos + 120);
      
      // Add IDEMY logo/text
      ctx.fillStyle = '#1a5fb4';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('IDEMY VERIFICATION', 400, 520);
      
      // Save the image
      const imageFilename = `${institution.institutionId}_${Date.now()}.png`;
      const imagePath = path.join(this.institutionNftsDir, imageFilename);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(imagePath, buffer);
      
      logger.info(`Created NFT files for institution ${institution.institutionId}`);
      
      return {
        metadataPath,
        metadataUri: `/api/nft/institution/${institution.institutionId}/metadata`,
        imagePath,
        imageUri: `/api/nft/institution/${institution.institutionId}/image`
      };
    } catch (error) {
      logger.error(`Create institution NFT files error: ${error.message}`);
      throw error;
    }
  }

  // Add a helper function for text wrapping
  wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    
    lines.push(currentLine);
    return lines;
  }

  // Add this method to NFT service
  saveNFT(nft) {
    try {
      // Add this NFT to the collection
      this.nfts.set(nft.tokenId, nft);
      
      // Save to file
      this.saveNFTs();
      
      logger.info(`NFT ${nft.tokenId} saved successfully`);
      return nft;
    } catch (error) {
      logger.error(`Save NFT error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new NFTService();
