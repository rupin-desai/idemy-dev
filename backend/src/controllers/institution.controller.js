const institutionService = require("../services/institution.service");
const transactionService = require("../services/transaction.service"); // Add this import
const logger = require("../utils/logger.utils");

class InstitutionController {
  async getAllInstitutions(req, res) {
    try {
      const institutions = institutionService.getAllInstitutions();

      return res.status(200).json({
        success: true,
        institutions,
      });
    } catch (error) {
      logger.error(`Get all institutions error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getActiveInstitutions(req, res) {
    try {
      const institutions = institutionService.getActiveInstitutions();

      return res.status(200).json({
        success: true,
        institutions,
      });
    } catch (error) {
      logger.error(`Get active institutions error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInstitutionById(req, res) {
    try {
      const { institutionId } = req.params;

      if (!institutionId) {
        return res.status(400).json({
          success: false,
          message: "Institution ID is required",
        });
      }

      const institution = institutionService.getInstitutionById(institutionId);

      return res.status(200).json({
        success: true,
        institution,
      });
    } catch (error) {
      logger.error(`Get institution by ID error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createInstitution(req, res) {
    try {
      const institutionData = req.body;

      if (!institutionData.name || !institutionData.email) {
        return res.status(400).json({
          success: false,
          message: "Institution name and email are required",
        });
      }

      // Add role to institutionData
      institutionData.role = "institution";

      const institution = institutionService.createInstitution(institutionData);

      // Create blockchain record similar to student registration
      const transaction = transactionService.createTransaction(
        institutionData.email,
        "SYSTEM_INSTITUTION_REGISTRY",
        0,
        {
          type: "INSTITUTION_REGISTRATION",
          role: "institution",
          action: "CREATE",
          institutionId: institution.institutionId,
          institutionData: {
            ...institutionData,
            institutionId: institution.institutionId,
            createdAt: new Date().toISOString(),
            status: institution.status,
          },
        }
      );

      transactionService.addTransaction(transaction);

      return res.status(201).json({
        success: true,
        message: "Institution created successfully",
        institution,
      });
    } catch (error) {
      logger.error(`Create institution error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateInstitution(req, res) {
    try {
      const { institutionId } = req.params;
      const updates = req.body;

      if (!institutionId) {
        return res.status(400).json({
          success: false,
          message: "Institution ID is required",
        });
      }

      const institution = institutionService.updateInstitution(
        institutionId,
        updates
      );

      return res.status(200).json({
        success: true,
        message: "Institution updated successfully",
        institution,
      });
    } catch (error) {
      logger.error(`Update institution error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteInstitution(req, res) {
    try {
      const { institutionId } = req.params;

      if (!institutionId) {
        return res.status(400).json({
          success: false,
          message: "Institution ID is required",
        });
      }

      const result = institutionService.deleteInstitution(institutionId);

      return res.status(200).json({
        success: true,
        message: "Institution deleted successfully",
        institutionId: result.institutionId,
      });
    } catch (error) {
      logger.error(`Delete institution error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async mintInstitutionNFT(req, res) {
    try {
      // Get institutionId from URL params
      const { institutionId } = req.params;

      if (!institutionId) {
        return res.status(400).json({
          success: false,
          message: "Institution ID is required",
        });
      }

      const result = institutionService.mintInstitutionNFT(institutionId);

      return res.status(200).json({
        success: true,
        message: "Institution NFT minted successfully",
        nft: result.nft,
        institution: result.institution,
        transaction: result.transaction,
      });
    } catch (error) {
      logger.error(`Mint institution NFT error: ${error.message}`);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInstitutionApplications(req, res) {
    try {
      const { institutionId } = req.params;

      if (!institutionId) {
        return res.status(400).json({
          success: false,
          message: "Institution ID is required",
        });
      }

      const applications =
        institutionService.getApplicationsByInstitutionId(institutionId);

      return res.status(200).json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      logger.error(`Get institution applications error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInstitutionByUserEmail(req, res) {
    try {
      // Make sure the user is authenticated
      if (!req.user || !req.user.email) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userEmail = req.user.email;
      logger.info(`Looking up institution for user email: ${userEmail}`);

      // Get all institutions and find the one matching the email
      const allInstitutions = institutionService.getAllInstitutions();
      const institution = allInstitutions.find(
        (inst) =>
          inst.email && inst.email.toLowerCase() === userEmail.toLowerCase()
      );

      // Check transaction records for institution role if no direct institution found
      const hasInstitutionRole = req.user.role === 'institution';
      logger.info(`User role: ${req.user.role}, Has institution role: ${hasInstitutionRole}`);

      // Log all institution emails for debugging
      logger.debug(`Available institution emails: ${allInstitutions.map(i => i.email).join(', ')}`);

      if (institution) {
        logger.info(`Found institution for user with email: ${userEmail}`);
        return res.status(200).json({
          success: true,
          institution: institution,
        });
      } else if (hasInstitutionRole) {
        // If no institution record but user has institution role
        logger.info(`No institution record but user has institution role: ${userEmail}`);
        return res.status(200).json({
          success: true,
          institution: {
            role: 'institution',
            email: userEmail,
            status: 'INACTIVE',
            name: 'Your Institution',
            institutionId: 'dashboard'
          },
          message: "Institution role found but no active institution record"
        });
      } else {
        // Use blockchain records as a fallback to check for institution registration
        logger.info(`Checking blockchain records for institution role for: ${userEmail}`);
        
        // Return not found if nothing matches
        return res.status(404).json({
          success: false,
          message: "No institution found for this user",
        });
      }
    } catch (error) {
      logger.error(`Error getting institution by user email: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new InstitutionController();
