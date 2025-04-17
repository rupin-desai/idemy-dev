const institutionService = require("../services/institution.service");
const logger = require("../utils/logger.utils");

class ApplicationController {
  async getAllApplications(req, res) {
    try {
      const applications = institutionService.getAllApplications();

      return res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      logger.error(`Get all applications error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getApplicationById(req, res) {
    try {
      const { applicationId } = req.params;

      if (!applicationId) {
        return res.status(400).json({
          success: false,
          message: "Application ID is required",
        });
      }

      const application = institutionService.getApplicationById(applicationId);

      return res.status(200).json({
        success: true,
        application,
      });
    } catch (error) {
      logger.error(`Get application by ID error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getApplicationsByStudent(req, res) {
    try {
      const { studentId } = req.params;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const applications =
        institutionService.getApplicationsByStudentId(studentId);

      return res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      logger.error(`Get applications by student error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getApplicationsByInstitution(req, res) {
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
        applications,
      });
    } catch (error) {
      logger.error(`Get applications by institution error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createApplication(req, res) {
    try {
      const applicationData = req.body;

      if (!applicationData.studentId || !applicationData.institutionId) {
        return res.status(400).json({
          success: false,
          message: "Student ID and Institution ID are required",
        });
      }

      const application = institutionService.createApplication(applicationData);

      return res.status(201).json({
        success: true,
        message: "Application created successfully",
        application,
      });
    } catch (error) {
      logger.error(`Create application error: ${error.message}`);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status, verificationData } = req.body;

      if (!applicationId || !status) {
        return res.status(400).json({
          success: false,
          message: "Application ID and status are required",
        });
      }

      if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be PENDING, APPROVED, or REJECTED",
        });
      }

      const application = institutionService.updateApplicationStatus(
        applicationId,
        status,
        verificationData || {}
      );

      return res.status(200).json({
        success: true,
        message: `Application ${status.toLowerCase()} successfully`,
        application,
      });
    } catch (error) {
      logger.error(`Update application status error: ${error.message}`);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyApplication(req, res) {
    try {
      const { applicationId } = req.params;

      if (!applicationId) {
        return res.status(400).json({
          success: false,
          message: "Application ID is required",
        });
      }

      const result =
        institutionService.verifyApplicationOnBlockchain(applicationId);

      return res.status(200).json({
        success: true,
        message: "Application verified on blockchain successfully",
        application: result.application,
        transaction: result.transaction,
      });
    } catch (error) {
      logger.error(`Verify application on blockchain error: ${error.message}`);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ApplicationController();
