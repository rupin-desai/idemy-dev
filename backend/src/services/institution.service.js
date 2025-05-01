const fs = require("fs");
const path = require("path");
const Institution = require("../models/institution.model");
const Application = require("../models/application.model");
const nftService = require("./nft.service");
const transactionService = require("./transaction.service");
const studentService = require("./student.service");
const logger = require("../utils/logger.utils");

class InstitutionService {
  constructor() {
    this.dataDir = path.join(__dirname, "../../data");
    this.institutionsFile = path.join(this.dataDir, "institutions.json");
    this.applicationsFile = path.join(this.dataDir, "applications.json");

    // Ensure directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    // Initialize collection
    this.institutions = new Map();
    this.applications = new Map();

    // Load existing data
    this.loadInstitutions();
    this.loadApplications();
  }

  loadInstitutions() {
    try {
      if (fs.existsSync(this.institutionsFile)) {
        const data = fs.readFileSync(this.institutionsFile, "utf8");
        const institutionsArray = JSON.parse(data);

        institutionsArray.forEach((institutionData) => {
          const institution = new Institution(
            institutionData.institutionId,
            institutionData.name,
            institutionData.email,
            institutionData.location,
            institutionData.institutionType,
            institutionData.foundingYear,
            institutionData.website,
            institutionData.contactInfo
          );
          institution.status = institutionData.status;
          institution.createdAt = institutionData.createdAt;
          institution.updatedAt = institutionData.updatedAt;
          institution.nftTokenId = institutionData.nftTokenId;
          institution.verifiedStudents = institutionData.verifiedStudents || [];

          this.institutions.set(institutionData.institutionId, institution);
        });

        logger.info(`Loaded ${this.institutions.size} institutions from file`);
      } else {
        logger.info(
          "No institutions file found. Starting with empty institution database."
        );
      }
    } catch (error) {
      logger.error(`Failed to load institutions: ${error.message}`);
    }
  }

  loadApplications() {
    try {
      if (fs.existsSync(this.applicationsFile)) {
        const data = fs.readFileSync(this.applicationsFile, "utf8");
        const applicationsArray = JSON.parse(data);

        applicationsArray.forEach((applicationData) => {
          const application = new Application(
            applicationData.applicationId,
            applicationData.studentId,
            applicationData.institutionId,
            applicationData.institutionName,
            applicationData.programDetails,
            applicationData.startDate
          );

          application.submittedAt = applicationData.submittedAt;
          application.status = applicationData.status;
          application.additionalInfo = applicationData.additionalInfo || {};
          application.verificationData = applicationData.verificationData;
          application.transactionId = applicationData.transactionId;

          this.applications.set(application.applicationId, application);
        });

        logger.info(`Loaded ${this.applications.size} applications from file`);
      } else {
        logger.info(
          "No applications file found. Starting with empty applications database."
        );
      }
    } catch (error) {
      logger.error(`Failed to load applications: ${error.message}`);
    }
  }

  saveInstitutions() {
    try {
      const institutionsArray = Array.from(this.institutions.values()).map(
        (institution) => institution.toJSON()
      );
      fs.writeFileSync(
        this.institutionsFile,
        JSON.stringify(institutionsArray, null, 2)
      );
      logger.info("Institutions saved to file successfully");
      return true;
    } catch (error) {
      logger.error(`Failed to save institutions: ${error.message}`);
      return false;
    }
  }

  saveApplications() {
    try {
      const applicationsArray = Array.from(this.applications.values()).map(
        (app) => app.toJSON()
      );
      fs.writeFileSync(
        this.applicationsFile,
        JSON.stringify(applicationsArray, null, 2)
      );
      logger.info("Applications saved to file successfully");
      return true;
    } catch (error) {
      logger.error(`Failed to save applications: ${error.message}`);
      return false;
    }
  }

  getInstitutionById(institutionId) {
    const institution = this.institutions.get(institutionId);
    if (!institution) {
      throw new Error(`Institution with ID ${institutionId} not found`);
    }
    return institution;
  }

  getInstitutionByEmail(email) {
    const institutions = Array.from(this.institutions.values());
    return institutions.find(inst => inst.email.toLowerCase() === email.toLowerCase()) || null;
  }

  getAllInstitutions() {
    return Array.from(this.institutions.values());
  }

  getActiveInstitutions() {
    return Array.from(this.institutions.values()).filter(
      (institution) => institution.status === "ACTIVE"
    );
  }

  createInstitution(institutionData) {
    try {
      // Create new institution object
      const institution = new Institution(
        null, // Auto-generate ID
        institutionData.name,
        institutionData.email,
        institutionData.location,
        institutionData.institutionType,
        institutionData.foundingYear,
        institutionData.website,
        institutionData.contactInfo
      );

      // Add to collection
      this.institutions.set(institution.institutionId, institution);

      // Save to file
      this.saveInstitutions();

      // Record institution creation in blockchain
      this.recordInstitutionChange(institution, "CREATE");

      logger.info(`Created institution: ${institution.institutionId}`);
      return institution;
    } catch (error) {
      logger.error(`Create institution error: ${error.message}`);
      throw error;
    }
  }

  updateInstitution(institutionId, updates) {
    try {
      const institution = this.getInstitutionById(institutionId);

      // Store previous state for the blockchain record
      const previousState = { ...institution.toJSON() };

      // Update institution
      institution.update(updates);

      // Save to file
      this.saveInstitutions();

      // Record update in blockchain
      this.recordInstitutionChange(institution, "UPDATE", previousState);

      return institution;
    } catch (error) {
      logger.error(`Update institution error: ${error.message}`);
      throw error;
    }
  }

  deleteInstitution(institutionId) {
    try {
      const institution = this.getInstitutionById(institutionId);

      // Remove from collection
      this.institutions.delete(institutionId);

      // Save to file
      this.saveInstitutions();

      // Record deletion in blockchain
      this.recordInstitutionChange(institution, "DELETE");

      return { success: true, institutionId };
    } catch (error) {
      logger.error(`Delete institution error: ${error.message}`);
      throw error;
    }
  }

  mintInstitutionNFT(institutionId) {
    try {
      const institution = this.getInstitutionById(institutionId);

      // Check if institution already has an NFT
      if (institution.nftTokenId) {
        throw new Error(
          `Institution already has an NFT: ${institution.nftTokenId}`
        );
      }

      // Generate NFT ID
      const nftTokenId = require("../utils/idGenerator.utils").generateNftId();
      
      // Create NFT files (metadata and image)
      const nftFiles = nftService.createInstitutionNFTFiles(institution, nftTokenId);
      
      // Create NFT object
      const nft = {
        tokenId: nftTokenId,
        institutionId: institution.institutionId,
        ownerAddress: `INSTITUTION_${institution.institutionId}`,
        metadata: nftFiles.metadataUri,
        imageUri: nftFiles.imageUri,
        mintedAt: Date.now(),
        status: 'MINTED'
      };

      // Record NFT minting on blockchain
      const mintTransaction = this.recordInstitutionNFTMint(institution, nft);

      // Save NFT to database
      nftService.saveNFT(nft);

      // Link NFT to institution
      institution.nftTokenId = nft.tokenId;

      // Update status to ACTIVE if it was PENDING
      if (institution.status === "PENDING") {
        institution.status = "ACTIVE";
      }

      // Save to file
      this.saveInstitutions();

      logger.info(`Minted NFT ${nft.tokenId} for institution ${institutionId}`);
      return { nft, institution, transaction: mintTransaction };
    } catch (error) {
      logger.error(`Mint institution NFT error: ${error.message}`);
      throw error;
    }
  }

  recordInstitutionChange(institution, action, previousState = null) {
    try {
      // Create metadata for the transaction
      const metadata = {
        action,
        type: 'INSTITUTION_REGISTRATION',  // Add this type field
        role: 'institution',               // Add the role field
        institutionId: institution.institutionId,
        institutionData: institution.toJSON(),
        previousState,
        timestamp: Date.now(),
      };

      // Create a special transaction to record institution data change
      const systemAddress = "SYSTEM_INSTITUTION_REGISTRY";
      const transaction = transactionService.createTransaction(
        institution.email || systemAddress,  // Use institution email if available
        systemAddress,
        0,
        metadata
      );

      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);

      logger.info(
        `Institution ${action} recorded in blockchain for ${institution.institutionId}`
      );
      return transaction;
    } catch (error) {
      logger.error(
        `Failed to record institution change in blockchain: ${error.message}`
      );
      return null;
    }
  }

  recordInstitutionNFTMint(institution, nft) {
    try {
      // Create metadata for the transaction
      const metadata = {
        type: "INSTITUTION_NFT_MINT",
        institutionId: institution.institutionId,
        institutionName: institution.name,
        nftTokenId: nft.tokenId,
        nftMetadata: nft.metadata,
        timestamp: Date.now(),
      };

      // Create a special transaction for NFT minting
      const systemAddress = "SYSTEM_NFT_REGISTRY";
      const transaction = transactionService.createTransaction(
        systemAddress,
        `INSTITUTION_${institution.institutionId}`,
        0,
        metadata
      );

      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);

      logger.info(
        `Institution NFT mint recorded in blockchain for ${institution.institutionId}`
      );
      return transaction;
    } catch (error) {
      logger.error(
        `Failed to record institution NFT mint in blockchain: ${error.message}`
      );
      return null;
    }
  }

  // Application management
  getApplicationById(applicationId) {
    const application = this.applications.get(applicationId);
    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }
    return application;
  }

  getAllApplications() {
    return Array.from(this.applications.values());
  }

  getApplicationsByStudentId(studentId) {
    return Array.from(this.applications.values()).filter(
      (app) => app.studentId === studentId
    );
  }

  getApplicationsByInstitutionId(institutionId) {
    return Array.from(this.applications.values()).filter(
      (app) => app.institutionId === institutionId
    );
  }

  createApplication(applicationData) {
    try {
      // Validate institution and student exist
      const institution = this.getInstitutionById(
        applicationData.institutionId
      );
      const student = studentService.getStudentById(applicationData.studentId);

      // Check if already applied
      const existingApplications = this.getApplicationsByStudentId(
        applicationData.studentId
      ).filter(
        (app) =>
          app.institutionId === applicationData.institutionId &&
          (app.status === "PENDING" || app.status === "APPROVED")
      );

      if (existingApplications.length > 0) {
        throw new Error(
          `Student already has an ${existingApplications[0].status} application to this institution`
        );
      }

      // Create new application
      const application = new Application(
        null, // Auto-generate ID
        applicationData.studentId,
        applicationData.institutionId,
        institution.name,
        applicationData.programDetails,
        applicationData.startDate
      );

      // Add additional info if provided
      if (applicationData.additionalInfo) {
        application.additionalInfo = applicationData.additionalInfo;
      }

      // Add to collection
      this.applications.set(application.applicationId, application);

      // Save to file
      this.saveApplications();

      // Record application creation in blockchain
      this.recordApplicationChange(application, "CREATE");

      logger.info(`Created application: ${application.applicationId}`);
      return application;
    } catch (error) {
      logger.error(`Create application error: ${error.message}`);
      throw error;
    }
  }

  updateApplicationStatus(applicationId, status, verificationData = {}) {
    try {
      const application = this.getApplicationById(applicationId);

      // Check if we're trying to approve with no verification data
      if (status === "APPROVED" && Object.keys(verificationData).length === 0) {
        throw new Error(
          "Verification data is required to approve an application"
        );
      }

      // Store previous state for the blockchain record
      const previousState = { ...application.toJSON() };

      // Update application status
      application.verify(status === "APPROVED", verificationData);

      // Save to file
      this.saveApplications();

      // Record update in blockchain
      this.recordApplicationChange(application, "UPDATE_STATUS", previousState);

      // If approved, also update ID Card if student has one
      if (status === "APPROVED") {
        try {
          this.verifyApplicationOnBlockchain(applicationId);
        } catch (error) {
          logger.error(
            `Failed to verify application on blockchain: ${error.message}`
          );
          // Continue - we don't want to fail the status update if this fails
        }
      }

      return application;
    } catch (error) {
      logger.error(`Update application status error: ${error.message}`);
      throw error;
    }
  }

  verifyApplicationOnBlockchain(applicationId) {
    try {
      const application = this.getApplicationById(applicationId);

      // Check if already verified
      if (application.transactionId) {
        throw new Error(
          `Application already verified with transaction ID: ${application.transactionId}`
        );
      }

      // Check if application is approved
      if (application.status !== "APPROVED") {
        throw new Error(
          "Only approved applications can be verified on blockchain"
        );
      }

      // Get institution and student
      const institution = this.getInstitutionById(application.institutionId);

      // Check if institution has an NFT
      if (!institution.nftTokenId) {
        throw new Error(
          `Institution ${institution.institutionId} does not have a verification NFT`
        );
      }

      // Create metadata for verification transaction
      const metadata = {
        type: "STUDENT_VERIFICATION",
        applicationId: application.applicationId,
        studentId: application.studentId,
        institutionId: application.institutionId,
        institutionName: application.institutionName,
        programDetails: application.programDetails,
        verificationData: application.verificationData,
        timestamp: Date.now(),
      };

      // Create verification transaction
      const transaction = transactionService.createTransaction(
        `INSTITUTION_${application.institutionId}`,
        `STUDENT_${application.studentId}`,
        0, // Zero amount transaction
        metadata
      );

      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);

      // Record transaction ID in application
      application.recordTransactionId(transaction.id);
      this.saveApplications();

      // Add student to institution's verified list
      institution.verifyStudent(application.studentId);
      this.saveInstitutions();

      // Update ID card if student has one
      try {
        const idCards = nftService.idCards;
        if (idCards && idCards.has(application.studentId)) {
          const idCard = idCards.get(application.studentId);
          idCard.setVerification(
            application.institutionId,
            application.institutionName,
            {
              program: application.programDetails.program,
              admissionDate: application.verificationData.startDate,
              expectedGraduation: application.verificationData.endDate,
            }
          );
          nftService.saveIDCards();
          logger.info(
            `Updated ID card verification for student ${application.studentId}`
          );
        }
      } catch (idCardError) {
        logger.error(`Failed to update ID card: ${idCardError.message}`);
        // Continue - we don't want the overall verification to fail
      }

      logger.info(
        `Verified application ${applicationId} on blockchain with transaction ${transaction.id}`
      );
      return { application, transaction };
    } catch (error) {
      logger.error(`Verify application on blockchain error: ${error.message}`);
      throw error;
    }
  }

  recordApplicationChange(application, action, previousState = null) {
    try {
      // Create metadata for the transaction
      const metadata = {
        action,
        applicationId: application.applicationId,
        studentId: application.studentId,
        institutionId: application.institutionId,
        applicationData: application.toJSON(),
        previousState,
        timestamp: Date.now(),
      };

      // Create a special transaction to record application data change
      const systemAddress = "SYSTEM_APPLICATION_REGISTRY";
      const transaction = transactionService.createTransaction(
        systemAddress,
        systemAddress,
        0,
        metadata
      );

      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);

      logger.info(
        `Application ${action} recorded in blockchain for ${application.applicationId}`
      );
      return transaction;
    } catch (error) {
      logger.error(
        `Failed to record application change in blockchain: ${error.message}`);
      return null;
    }
  }

  confirmApplicationAndWithdrawOthers(applicationId, studentId) {
    try {
      // Get the application to confirm
      const application = this.getApplicationById(applicationId);
      
      // Check if it belongs to the student
      if (application.studentId !== studentId) {
        throw new Error("Application does not belong to this student");
      }
      
      // Check if it's in APPROVED status
      if (application.status !== "APPROVED") {
        throw new Error("Only approved applications can be confirmed");
      }
      
      // Store previous state for blockchain record
      const previousState = { ...application.toJSON() };
      
      // Confirm this application
      application.confirmAdmission();
      
      // Get all other pending or approved applications for this student
      const otherApplications = this.getApplicationsByStudentId(studentId).filter(
        app => app.applicationId !== applicationId && 
               (app.status === "PENDING" || app.status === "APPROVED")
      );
      
      // Withdraw all other applications
      const withdrawnApplications = [];
      for (const app of otherApplications) {
        const appPreviousState = { ...app.toJSON() };
        app.withdraw();
        withdrawnApplications.push(app);
        
        // Record the withdrawal in blockchain
        this.recordApplicationChange(
          app,
          "WITHDRAW",
          appPreviousState
        );
      }
      
      // Save changes
      this.saveApplications();
      
      // Record confirmation in blockchain
      this.recordApplicationChange(
        application,
        "CONFIRM",
        previousState
      );
      
      // Update student record with institution history
      try {
        const student = studentService.getStudentById(studentId);
        
        if (!student.institutionHistory) {
          student.institutionHistory = [];
        }
        
        // Add this institution to history
        student.institutionHistory.push({
          institutionId: application.institutionId,
          institutionName: application.institutionName,
          program: application.programDetails.program,
          department: application.programDetails.department,
          startDate: application.verificationData?.startDate || new Date().toISOString(),
          status: "CURRENT",
          confirmedAt: application.confirmedAt
        });
        
        // Set this as the current institution
        student.currentInstitution = {
          institutionId: application.institutionId,
          institutionName: application.institutionName,
          applicationId: application.applicationId
        };
        
        // Save student changes
        studentService.updateStudent(studentId, {
          institutionHistory: student.institutionHistory,
          currentInstitution: student.currentInstitution
        });
        
      } catch (studentError) {
        logger.error(`Failed to update student history: ${studentError.message}`);
        // Continue - we don't want to fail the confirmation if student history update fails
      }
      
      return {
        confirmedApplication: application,
        withdrawnApplications
      };
    } catch (error) {
      logger.error(`Confirm application error: ${error.message}`);
      throw error;
    }
  }

  completeStudies(applicationId, studentId) {
    try {
      // Get the application
      const application = this.getApplicationById(applicationId);
      
      // Check if it belongs to the student
      if (application.studentId !== studentId) {
        throw new Error("Application does not belong to this student");
      }
      
      // Check if it's in CONFIRMED status
      if (application.status !== "CONFIRMED") {
        throw new Error("Only confirmed applications can be completed");
      }
      
      // Store previous state for blockchain record
      const previousState = { ...application.toJSON() };
      
      // Mark studies as completed
      application.completeStudies();
      
      // Save changes
      this.saveApplications();
      
      // Record completion in blockchain
      this.recordApplicationChange(
        application,
        "COMPLETE",
        previousState
      );
      
      // Update student record
      try {
        const student = studentService.getStudentById(studentId);
        
        // Update institution history status
        if (student.institutionHistory) {
          const currentInstitution = student.institutionHistory.find(
            inst => inst.institutionId === application.institutionId &&
                   inst.status === "CURRENT"
          );
          
          if (currentInstitution) {
            currentInstitution.status = "COMPLETED";
            currentInstitution.completedAt = application.completedAt;
          }
        }
        
        // Clear current institution
        student.currentInstitution = null;
        
        // Save student changes
        studentService.updateStudent(studentId, {
          institutionHistory: student.institutionHistory,
          currentInstitution: null
        });
        
      } catch (studentError) {
        logger.error(`Failed to update student history: ${studentError.message}`);
        // Continue execution
      }
      
      return application;
    } catch (error) {
      logger.error(`Complete studies error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new InstitutionService();