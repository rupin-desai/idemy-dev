const institutionService = require("../services/institution.service");
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

      const institution = institutionService.createInstitution(institutionData);

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

      const applications = institutionService.getApplicationsByInstitutionId(institutionId);

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
}

module.exports = new InstitutionController();
