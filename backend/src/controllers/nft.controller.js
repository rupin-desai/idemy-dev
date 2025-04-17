const nftService = require("../services/nft.service");
const studentService = require("../services/student.service");
const logger = require("../utils/logger.utils");

class NFTController {
  async createIDCard(req, res) {
    try {
      const { studentId } = req.params;
      const { imageBase64, ...cardData } = req.body;

      // Check if student exists
      try {
        await studentService.getStudentById(studentId);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${studentId} not found`,
        });
      }

      const idCard = await nftService.createIDCard(
        studentId,
        cardData,
        imageBase64
      );

      return res.status(201).json({
        success: true,
        message: "ID card created successfully",
        idCard,
      });
    } catch (error) {
      logger.error(`Create ID card error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async mintNFT(req, res) {
    try {
      const { studentId } = req.params;

      const result = await nftService.mintNFT(studentId);

      return res.status(201).json({
        success: true,
        message: "NFT minted successfully",
        nft: result.nft,
        idCard: result.idCard,
      });
    } catch (error) {
      logger.error(`Mint NFT error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async transferNFT(req, res) {
    try {
      const { tokenId } = req.params;
      const { fromAddress, toAddress } = req.body;

      if (!fromAddress || !toAddress) {
        return res.status(400).json({
          success: false,
          message: "From address and to address are required",
        });
      }

      const nft = await nftService.transferNFT(tokenId, fromAddress, toAddress);

      return res.status(200).json({
        success: true,
        message: "NFT transferred successfully",
        nft,
      });
    } catch (error) {
      logger.error(`Transfer NFT error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getNFTsByStudent(req, res) {
    try {
      const { studentId } = req.params;

      const nfts = nftService.getNFTsByStudentId(studentId);

      return res.status(200).json({
        success: true,
        count: nfts.length,
        nfts,
      });
    } catch (error) {
      logger.error(`Get NFTs by student error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getNFTByTokenId(req, res) {
    try {
      const { tokenId } = req.params;

      const nft = nftService.getNFTByTokenId(tokenId);

      return res.status(200).json({
        success: true,
        nft,
      });
    } catch (error) {
      logger.error(`Get NFT error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getIDCardByStudent(req, res) {
    try {
      const { studentId } = req.params;

      const idCard = nftService.getIDCardByStudentId(studentId);

      return res.status(200).json({
        success: true,
        idCard,
      });
    } catch (error) {
      logger.error(`Get ID card error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getIDCardImage(req, res) {
    try {
      const { studentId } = req.params;

      // Add await here - this was missing
      const { buffer, contentType } = await nftService.getIDCardImage(
        studentId
      );

      // Set the correct content type and cache control headers
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=86400"); // Cache for 24 hours

      // Send the image buffer
      return res.send(buffer);
    } catch (error) {
      logger.error(`Get ID card image error: ${error.message}`);

      // Return a 404 error
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getNFTMetadata(req, res) {
    try {
      const { studentId } = req.params;

      const metadata = nftService.getNFTMetadata(studentId);

      return res.status(200).json(metadata);
    } catch (error) {
      logger.error(`Get NFT metadata error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyNFT(req, res) {
    try {
      const { tokenId } = req.params;

      const verification = nftService.verifyNFT(tokenId);

      return res.status(200).json({
        success: true,
        ...verification,
      });
    } catch (error) {
      logger.error(`Verify NFT error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllNFTs(req, res) {
    try {
      const nftsArray = Array.from(nftService.nfts.values()).map((nft) =>
        nft.toJSON()
      );

      return res.status(200).json({
        success: true,
        count: nftsArray.length,
        nfts: nftsArray,
      });
    } catch (error) {
      logger.error(`Get all NFTs error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCurrentUserNFTs(req, res) {
    try {
      // Get the current user from req (added by auth middleware)
      const user = req.user;

      // Check if user has a student ID
      if (!user || !user.student || !user.student.studentId) {
        return res.status(404).json({
          success: false,
          message: "No student ID associated with the current user",
        });
      }

      const studentId = user.student.studentId;

      // Use existing method to get NFTs by student ID
      const nfts = nftService.getNFTsByStudentId(studentId);

      return res.status(200).json({
        success: true,
        count: nfts.length,
        nfts,
      });
    } catch (error) {
      logger.error(`Get current user NFTs error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new NFTController();
