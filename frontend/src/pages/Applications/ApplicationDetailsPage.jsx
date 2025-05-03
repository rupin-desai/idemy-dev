import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNft } from "../../hooks/useNft";
import { useApplication } from "../../hooks/useApplication";
import {
  containerVariants,
  itemVariants,
  getApplicationStatusDisplay,
  getApplicationActionMessage,
  createApprovalVerificationData,
  getApplicationPermissions,
  formatApplicationDates,
  getProgramDetailsDisplay,
} from "../../utils/applications.utils";

import {
  ApplicationDetailsHeader,
  ApplicationDetailsActionMessage,
  ApplicationDetailsStudentInfo,
  ApplicationDetailsInfo,
  ApplicationDetailsNftInfo,
  ApplicationDetailsIdCard,
  ApplicationDetailsActions,
  ApplicationDetailsBlockchainVerification,
} from "../../components/Applications/ApplicationDetails";

const ApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getNftDetails } = useNft();
  const {
    loading,
    error: apiError,
    processingAction,
    getApplicationDetailsWithRelations,
    approveApplication,
    rejectApplication,
    verifyApplicationOnBlockchain,
  } = useApplication();

  const [application, setApplication] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [nftData, setNftData] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [permissions, setPermissions] = useState({
    canApprove: false,
    canReject: false,
    canVerifyOnBlockchain: false,
    isInstitutionAdmin: false,
    isStudentOwner: false,
  });

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const result = await getApplicationDetailsWithRelations(applicationId);

        if (result.success) {
          setApplication(result.application);
          setStudentData(result.studentData);
          setIdCard(result.idCard);
          setNftData(result.nftData);
        } else {
          setError(
            result.error?.message || "Failed to load application details"
          );
        }
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError("Failed to load application details.");
      }
    };

    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId, getApplicationDetailsWithRelations]);

  // Update permissions when application or user changes
  useEffect(() => {
    if (application && currentUser) {
      setPermissions(getApplicationPermissions(currentUser, application));
    }
  }, [application, currentUser]);

  // Use API error if available
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  const handleApprove = async () => {
    // Create verification data using utility
    const verificationData = createApprovalVerificationData(currentUser);
    const result = await approveApplication(applicationId, verificationData);

    if (result.success) {
      setApplication({
        ...application,
        status: "APPROVED",
        verificationData,
      });
      setActionMessage(getApplicationActionMessage("APPROVED"));
    } else {
      setActionMessage({
        type: "error",
        text: result.error?.message || "Failed to approve application",
      });
    }
  };

  const handleReject = async () => {
    const result = await rejectApplication(applicationId);

    if (result.success) {
      setApplication({ ...application, status: "REJECTED" });
      setActionMessage(getApplicationActionMessage("REJECTED"));
    } else {
      setActionMessage({
        type: "error",
        text: result.error?.message || "Failed to reject application",
      });
    }
  };

  const handleVerifyOnBlockchain = async () => {
    const result = await verifyApplicationOnBlockchain(applicationId);

    if (result.success) {
      setApplication({
        ...application,
        status: "VERIFIED",
        transactionId: result.transaction.id,
      });
      setActionMessage(getApplicationActionMessage("VERIFIED"));
    } else {
      setActionMessage({
        type: "error",
        text: result.error?.message || "Failed to verify on blockchain",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error || "Application not found"}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get status display from utilities
  const status = getApplicationStatusDisplay(application.status);

  // Format dates for display
  const formattedDates = formatApplicationDates(application);

  // Format program details
  const programDetails = getProgramDetailsDisplay(application);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and title */}
        <ApplicationDetailsHeader
          navigate={navigate}
          status={status}
          itemVariants={itemVariants}
        />

        {/* Action message for success/error notifications */}
        <ApplicationDetailsActionMessage
          actionMessage={actionMessage}
          itemVariants={itemVariants}
        />

        {/* Student information section */}
        <ApplicationDetailsStudentInfo
          studentData={studentData}
          itemVariants={itemVariants}
        />

        {/* Application details section */}
        <ApplicationDetailsInfo
          application={application}
          formattedDates={formattedDates}
          programDetails={programDetails}
          itemVariants={itemVariants}
        />

        {/* NFT information section if available */}
        <ApplicationDetailsNftInfo
          nftData={nftData}
          itemVariants={itemVariants}
        />

        {/* ID Card preview section */}
        <ApplicationDetailsIdCard
          studentData={studentData}
          application={application}
          idCard={idCard}
          nftData={nftData}
          itemVariants={itemVariants}
        />

        {/* Action buttons for pending applications */}
        {permissions.canApprove && (
          <ApplicationDetailsActions
            handleApprove={handleApprove}
            handleReject={handleReject}
            processingAction={processingAction}
            itemVariants={itemVariants}
          />
        )}

        {/* Blockchain verification section */}
        {permissions.canVerifyOnBlockchain && (
          <ApplicationDetailsBlockchainVerification
            application={application}
            handleVerifyOnBlockchain={handleVerifyOnBlockchain}
            processingAction={processingAction}
            itemVariants={itemVariants}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsPage;
