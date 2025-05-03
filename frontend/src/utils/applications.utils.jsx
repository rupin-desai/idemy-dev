import React from "react";
import { CheckCircle2, X, Clock, AlertCircle, FileCheck } from "lucide-react";

/**
 * Animation variants for container elements
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

/**
 * Animation variants for child items
 */
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

/**
 * Get display configuration for application status
 * @param {string} status - The application status
 * @returns {Object} Display configuration with icon, colors, and text
 */
export const getApplicationStatusDisplay = (status) => {
  switch (status) {
    case "APPROVED":
      return {
        icon: <CheckCircle2 size={20} className="text-green-500 mr-2" />,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        text: "Approved",
        badgeClass: "bg-green-100 text-green-800",
      };
    case "REJECTED":
      return {
        icon: <X size={20} className="text-red-500 mr-2" />,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        text: "Rejected",
        badgeClass: "bg-red-100 text-red-800",
      };
    case "PENDING":
      return {
        icon: <Clock size={20} className="text-yellow-500 mr-2" />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        text: "Pending Review",
        badgeClass: "bg-yellow-100 text-yellow-800",
      };
    case "VERIFIED":
      return {
        icon: <FileCheck size={20} className="text-purple-500 mr-2" />,
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        text: "Blockchain Verified",
        badgeClass: "bg-purple-100 text-purple-800",
      };
    default:
      return {
        icon: <AlertCircle size={20} className="text-gray-500 mr-2" />,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        text: "Unknown Status",
        badgeClass: "bg-gray-100 text-gray-800",
      };
  }
};

/**
 * Format application data for display
 * @param {Object} application - The application object
 * @returns {Object} Formatted application data
 */
export const formatApplicationData = (application) => {
  if (!application) return null;

  return {
    ...application,
    formattedDate: application.createdAt
      ? new Date(application.createdAt).toLocaleDateString()
      : "Unknown date",
    statusDisplay: getApplicationStatusDisplay(application.status),
    programDetails: {
      program: application.programDetails?.program || "N/A",
      department: application.programDetails?.department || "N/A",
      year: application.programDetails?.year || new Date().getFullYear(),
    },
  };
};

/**
 * Initial form data for application
 */
export const initialApplicationFormData = {
  program: "",
  department: "",
  year: new Date().getFullYear(),
  additionalNotes: "",
};

/**
 * Validate application form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} Validation result with isValid flag and errors
 */
export const validateApplicationForm = (formData) => {
  const errors = {};

  if (!formData.program.trim()) {
    errors.program = "Program is required";
  }

  if (!formData.year || formData.year < new Date().getFullYear()) {
    errors.year = "Year must be current year or later";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate application action message based on status
 * @param {string} status - The application status
 * @returns {Object|null} Action message configuration or null
 */
export const getApplicationActionMessage = (status) => {
  switch (status) {
    case "APPROVED":
      return {
        type: "success",
        text: "Application has been approved successfully!",
      };
    case "REJECTED":
      return {
        type: "error",
        text: "Application has been rejected.",
      };
    case "VERIFIED":
      return {
        type: "success",
        text: "Application has been verified on the blockchain.",
      };
    default:
      return null;
  }
};

/**
 * Create verification data for an application approval
 * @param {Object} currentUser - The current user approving the application
 * @returns {Object} Verification data
 */
export const createApprovalVerificationData = (currentUser) => {
  const userEmail = currentUser?.email || "institution administrator";

  return {
    verifierNotes: `Approved by ${userEmail}`,
    programConfirmed: true,
    startDate: new Date().toISOString(),
    // Default to 4-year program
    endDate: new Date(
      new Date().setFullYear(new Date().getFullYear() + 4)
    ).toISOString(),
    additionalDetails: {
      verifiedBy: userEmail,
      verifiedAt: new Date().toISOString(),
    },
  };
};

/**
 * Check if user has permission to perform actions on application
 * @param {Object} currentUser - The current user
 * @param {Object} application - The application
 * @returns {Object} Permissions object
 */
export const getApplicationPermissions = (currentUser, application) => {
  if (!currentUser || !application) {
    return {
      canApprove: false,
      canReject: false,
      canVerifyOnBlockchain: false,
      isInstitutionAdmin: false,
      isStudentOwner: false,
    };
  }

  const isInstitutionAdmin =
    currentUser.role === "admin" ||
    (currentUser.institution &&
      currentUser.institution.institutionId === application.institutionId);

  const isStudentOwner =
    currentUser.student &&
    currentUser.student.studentId === application.studentId;

  return {
    canApprove: isInstitutionAdmin && application.status === "PENDING",
    canReject: isInstitutionAdmin && application.status === "PENDING",
    canVerifyOnBlockchain:
      isInstitutionAdmin &&
      application.status === "APPROVED" &&
      !application.transactionId,
    isInstitutionAdmin,
    isStudentOwner,
  };
};

/**
 * Format application dates for display
 * @param {Object} application - The application
 * @returns {Object} Formatted dates
 */
export const formatApplicationDates = (application) => {
  if (!application) return {};

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  return {
    createdAt: formatDate(application.createdAt),
    updatedAt: formatDate(application.updatedAt),
    startDate: formatDate(application.verificationData?.startDate),
    endDate: formatDate(application.verificationData?.endDate),
    verifiedAt: formatDate(
      application.verificationData?.additionalDetails?.verifiedAt
    ),
  };
};

/**
 * Get program details display text
 * @param {Object} application - The application
 * @returns {Object} Formatted program details
 */
export const getProgramDetailsDisplay = (application) => {
  if (!application?.programDetails) {
    return { program: "N/A", department: "N/A", year: "N/A" };
  }

  return {
    program: application.programDetails.program || "N/A",
    department: application.programDetails.department || "N/A",
    year: application.programDetails.year || "N/A",
    fullProgramDisplay: `${application.programDetails.program || ""} ${
      application.programDetails.department
        ? `(${application.programDetails.department})`
        : ""
    } ${
      application.programDetails.year
        ? `- ${application.programDetails.year}`
        : ""
    }`,
  };
};
