class Application {
  constructor(
    applicationId,
    studentId,
    institutionId,
    institutionName,
    programDetails,
    startDate
  ) {
    this.applicationId =
      applicationId ||
      require("../utils/idGenerator.utils").generateApplicationId();
    this.studentId = studentId;
    this.institutionId = institutionId;
    this.institutionName = institutionName;
    this.submittedAt = Date.now();
    this.status = "PENDING"; // PENDING, APPROVED, REJECTED
    this.programDetails = programDetails || {};
    this.startDate = startDate || Date.now();
    this.additionalInfo = {};
    this.verificationData = null;
    this.transactionId = null;
  }

  verify(isApproved, verificationData) {
    this.status = isApproved ? "APPROVED" : "REJECTED";
    this.verificationData = {
      verifiedAt: Date.now(),
      verifierNotes: verificationData.verifierNotes || "",
      programConfirmed: verificationData.programConfirmed,
      startDate: verificationData.startDate,
      endDate: verificationData.endDate,
      additionalDetails: verificationData.additionalDetails || {},
    };
  }

  recordTransactionId(txId) {
    this.transactionId = txId;
  }

  confirmAdmission() {
    this.status = "CONFIRMED";
    this.confirmedAt = Date.now();
  }

  completeStudies() {
    this.status = "COMPLETED";
    this.completedAt = Date.now();
  }

  withdraw() {
    this.status = "WITHDRAWN";
  }

  toJSON() {
    return {
      applicationId: this.applicationId,
      studentId: this.studentId,
      institutionId: this.institutionId,
      institutionName: this.institutionName,
      submittedAt: this.submittedAt,
      status: this.status,
      programDetails: this.programDetails,
      startDate: this.startDate,
      additionalInfo: this.additionalInfo,
      verificationData: this.verificationData,
      transactionId: this.transactionId,
      confirmedAt: this.confirmedAt,
      completedAt: this.completedAt
    };
  }
}

module.exports = Application;
