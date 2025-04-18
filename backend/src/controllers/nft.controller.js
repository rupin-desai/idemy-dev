const nftService = require("../services/nft.service");
const studentService = require("../services/student.service");
const institutionService = require("../services/institution.service");
const logger = require("../utils/logger.utils");
const path = require("path");
const fs = require("fs");

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

      // Pass the request object to allow access to query parameters
      nftService.req = req;

      const { buffer, contentType } = await nftService.getIDCardImage(
        studentId
      );

      // Clear the reference after use
      nftService.req = null;

      // Set headers
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=86400"); // Cache for 24 hours

      return res.send(buffer);
    } catch (error) {
      logger.error(`Get ID card image error: ${error.message}`);
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
        nft.toJSON ? nft.toJSON() : nft
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

  async updateNFTVersion(req, res) {
    try {
      const { tokenId } = req.params;
      const { cardData, imageBase64 } = req.body;

      const result = await nftService.updateIDCardAndCreateNewVersion(
        tokenId,
        cardData,
        imageBase64
      );

      return res.status(201).json({
        success: true,
        message: "NFT version created successfully",
        newVersion: result.newVersion,
        previousVersion: result.previousVersion,
        idCard: result.idCard,
      });
    } catch (error) {
      logger.error(`Update NFT version error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getNFTVersionsByStudentId(req, res) {
    try {
      const { studentId } = req.params;

      const nftVersions = nftService.getAllNFTVersionsByStudentId(studentId);

      return res.status(200).json({
        success: true,
        versions: nftVersions,
      });
    } catch (error) {
      logger.error(`Get NFT versions error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getLatestNFTVersionByStudentId(req, res) {
    try {
      const { studentId } = req.params;

      const latestNft = nftService.getLatestNFTVersionByStudentId(studentId);

      return res.status(200).json({
        success: true,
        nft: latestNft,
      });
    } catch (error) {
      logger.error(`Get latest NFT version error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getNFTVersionMetadata(req, res) {
    try {
      const { studentId } = req.params;
      const { version } = req.query;

      const metadata = nftService.getNFTVersionMetadata(
        studentId,
        version ? parseInt(version) : null
      );

      return res.status(200).json(metadata);
    } catch (error) {
      logger.error(`Get NFT version metadata error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getNFTVersionImage(req, res) {
    try {
      const { studentId } = req.params;
      const { v: version } = req.query;

      // Try to find image file with specific version
      let imageFile = null;

      if (version) {
        // Look for version-specific image
        const files = fs.readdirSync(nftService.cardsDir);
        imageFile = files.find(
          (file) =>
            file.startsWith(`${studentId}_v${version}_`) &&
            !file.endsWith("_metadata.json")
        );
      }

      // If no version-specific image, find any image for this student
      if (!imageFile) {
        const files = fs.readdirSync(nftService.cardsDir);
        imageFile = files.find(
          (file) =>
            file.startsWith(`${studentId}_`) && !file.endsWith("_metadata.json")
        );
      }

      if (imageFile) {
        const imagePath = path.join(nftService.cardsDir, imageFile);
        return res.sendFile(imagePath);
      }

      // If no image found, generate one (you would need a similar method as in your existing code)
      throw new Error(`Image file not found for student ${studentId}`);
    } catch (error) {
      logger.error(`Get NFT version image error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInstitutionNFTMetadata(req, res) {
    try {
      const { institutionId } = req.params;

      // Look for the metadata file
      const institutionNftDir = path.join(
        __dirname,
        "../../data/institution_nfts"
      );

      // Create directory if it doesn't exist
      if (!fs.existsSync(institutionNftDir)) {
        fs.mkdirSync(institutionNftDir, { recursive: true });
      }

      const metadataFilename = `${institutionId}_metadata.json`;
      const metadataPath = path.join(institutionNftDir, metadataFilename);

      if (fs.existsSync(metadataPath)) {
        // Return the metadata file
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
        return res.status(200).json(metadata);
      }

      // If metadata file doesn't exist, try to get institution and generate metadata on the fly
      const institution = institutionService.getInstitutionById(institutionId);

      if (!institution.nftTokenId) {
        return res.status(404).json({
          success: false,
          message: `Institution ${institutionId} has no NFT`,
        });
      }

      // Generate metadata on the fly
      const metadata = {
        name: `${institution.name} - Official Institution NFT`,
        description: `This NFT certifies that ${institution.name} is a verified institution on the IDEMY platform.`,
        image: `/api/nft/institution/${institutionId}/image`,
        attributes: [
          {
            trait_type: "Institution Type",
            value: institution.institutionType || "Unknown",
          },
          {
            trait_type: "Founded",
            value: institution.foundingYear
              ? institution.foundingYear.toString()
              : "Unknown",
          },
          {
            trait_type: "Location",
            value: institution.location || "Unknown",
          },
          {
            trait_type: "Verification Status",
            value: "VERIFIED",
          },
        ],
      };

      return res.status(200).json(metadata);
    } catch (error) {
      logger.error(`Get institution NFT metadata error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInstitutionNFTImage(req, res) {
    try {
      const { institutionId } = req.params;

      // Create directory if it doesn't exist
      const institutionNftDir = path.join(
        __dirname,
        "../../data/institution_nfts"
      );
      if (!fs.existsSync(institutionNftDir)) {
        fs.mkdirSync(institutionNftDir, { recursive: true });
      }

      // Look for image file
      const files = fs.readdirSync(institutionNftDir);
      const imageFile = files.find(
        (file) =>
          file.startsWith(`${institutionId}_`) &&
          (file.endsWith(".png") || file.endsWith(".jpg")) &&
          !file.endsWith("_metadata.json")
      );

      if (imageFile) {
        const imagePath = path.join(institutionNftDir, imageFile);
        return res.sendFile(imagePath);
      }

      // If no image file, generate a default one
      const institution = institutionService.getInstitutionById(institutionId);

      // Generate image dynamically
      const { createCanvas } = require("canvas");
      const canvas = createCanvas(800, 600);
      const ctx = canvas.getContext("2d");

      // Fill background
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, 800, 600);

      // Add border
      ctx.strokeStyle = "#1a5fb4";
      ctx.lineWidth = 15;
      ctx.strokeRect(20, 20, 760, 560);

      // Add header
      ctx.fillStyle = "#1a5fb4";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("INSTITUTION VERIFICATION", 400, 80);

      // Add institution name
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 50px Arial";
      ctx.fillText(institution.name, 400, 180);

      // Add verification text
      ctx.fillStyle = "#27ae60";
      ctx.font = "36px Arial";
      ctx.fillText("VERIFIED INSTITUTION", 400, 300);

      // Add IDEMY logo/text
      ctx.fillStyle = "#1a5fb4";
      ctx.font = "bold 32px Arial";
      ctx.fillText("IDEMY VERIFICATION", 400, 520);

      // Send the canvas as PNG
      res.set("Content-Type", "image/png");
      canvas.createPNGStream().pipe(res);
    } catch (error) {
      logger.error(`Get institution NFT image error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

// Export an instance of the controller
module.exports = new NFTController();
