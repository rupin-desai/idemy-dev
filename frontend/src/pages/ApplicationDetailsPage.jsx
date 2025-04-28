import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Calendar,
  Building,
  BookOpen,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  Shield,
  FileText,
  Info,
  Eye,
  Download,
  Loader,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import * as applicationApi from "../api/application.api";
import { formatDate } from "../utils/date.utils";
import * as nftApi from "../api/nft.api";

const containerVariants = {
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [application, setApplication] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [idCard, setIdCard] = useState(null);
  const [idCardLoading, setIdCardLoading] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);

        // Fetch application details
        console.log("Fetching application details for ID:", applicationId);
        const appResponse = await axios.get(
          `http://localhost:3000/api/applications/${applicationId}`
        );
        if (!appResponse.data.success) {
          setError("Failed to load application details.");
          return;
        }

        const app = appResponse.data.application;
        console.log("Application data retrieved:", app);
        setApplication(app);

        // Fetch student data
        console.log("Fetching student data for ID:", app.studentId);
        const studentResponse = await axios.get(
          `http://localhost:3000/api/students/${app.studentId}`
        );
        if (studentResponse.data.success) {
          console.log("Student data retrieved:", studentResponse.data.student);
          setStudentData(studentResponse.data.student);
          
          // Once we have student data, fetch their ID card
          try {
            setIdCardLoading(true);
            console.log("Fetching ID card for student:", app.studentId);
            const idCardResponse = await fetch(`http://localhost:3000/api/nft/idcards/${app.studentId}`);
            if (idCardResponse.ok) {
              const idCardData = await idCardResponse.json();
              if (idCardData.success) {
                console.log("ID card data retrieved:", idCardData.idCard);
                setIdCard(idCardData.idCard);
              }
            }
          } catch (idCardError) {
            console.error("Error fetching ID card:", idCardError);
          } finally {
            setIdCardLoading(false);
          }
        } else {
          console.error("Failed to get student data:", studentResponse.data);
        }

        // Fetch NFT data
        if (app.nftTokenId) {
          console.log("Fetching NFT data for token ID:", app.nftTokenId);
          const nftResponse = await axios.get(
            `http://localhost:3000/api/nft/${app.nftTokenId}`
          );
          if (nftResponse.data.success) {
            console.log("NFT data retrieved:", nftResponse.data.nft);
            setNftData(nftResponse.data.nft);
          } else {
            console.error("Failed to get NFT data:", nftResponse.data);
          }
        } else {
          console.warn("No NFT token ID found in the application");
        }
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const handleApprove = async () => {
    try {
      setProcessingAction(true);

      // Create verification data
      const verificationData = {
        verifierNotes: `Approved by ${
          currentUser?.email || "institution administrator"
        }`,
        programConfirmed: true,
        startDate: new Date().toISOString(),
        endDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 4)
        ).toISOString(), // 4 years from now
        additionalDetails: {
          verifiedBy: currentUser?.email || "institution admin",
        },
      };

      const result = await applicationApi.updateApplicationStatus(
        applicationId,
        "APPROVED",
        verificationData
      );

      if (result.success) {
        setApplication({
          ...application,
          status: "APPROVED",
          verificationData,
        });
        setActionMessage({
          type: "success",
          text: "Application approved successfully!",
        });
      } else {
        setActionMessage({
          type: "error",
          text: result.error?.message || "Failed to approve application",
        });
      }
    } catch (err) {
      console.error("Error approving application:", err);
      setActionMessage({
        type: "error",
        text: "Failed to approve application",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessingAction(true);

      const result = await applicationApi.updateApplicationStatus(
        applicationId,
        "REJECTED"
      );

      if (result.success) {
        setApplication({ ...application, status: "REJECTED" });
        setActionMessage({ type: "success", text: "Application rejected." });
      } else {
        setActionMessage({
          type: "error",
          text: result.error?.message || "Failed to reject application",
        });
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
      setActionMessage({ type: "error", text: "Failed to reject application" });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleVerifyOnBlockchain = async () => {
    try {
      setProcessingAction(true);

      const result = await applicationApi.verifyApplication(applicationId);

      if (result.success) {
        setApplication({
          ...application,
          transactionId: result.transaction.id,
        });
        setActionMessage({
          type: "success",
          text: "Application verified on blockchain successfully!",
        });
      } else {
        setActionMessage({
          type: "error",
          text: result.error?.message || "Failed to verify on blockchain",
        });
      }
    } catch (err) {
      console.error("Error verifying on blockchain:", err);
      setActionMessage({
        type: "error",
        text: "Failed to verify on blockchain",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusDisplay = () => {
    switch (application?.status) {
      case "APPROVED":
        return {
          icon: <CheckCircle2 size={20} className="text-green-500 mr-2" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          text: "Approved",
        };
      case "REJECTED":
        return {
          icon: <X size={20} className="text-red-500 mr-2" />,
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          text: "Rejected",
        };
      default:
        return {
          icon: <Clock size={20} className="text-yellow-500 mr-2" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          text: "Pending Review",
        };
    }
  };

  // Function to get the NFT image URL using studentId and version
  const getNftImageUrl = () => {
    if (!nftData) {
      console.warn("getNftImageUrl: nftData is null");
      return null;
    }
    
    if (!nftData.studentId) {
      console.warn("getNftImageUrl: nftData.studentId is missing", nftData);
      
      // If studentId is missing but application has studentId, use that instead
      if (application && application.studentId) {
        console.log("Using application.studentId as fallback:", application.studentId);
        const url = `http://localhost:3000/api/nft/idcards/${application.studentId}/image?v=${nftData.version || 1}&t=${retryCount}`;
        console.log("Generated fallback URL:", url);
        return url;
      }
      
      return null;
    }
    
    const url = `http://localhost:3000/api/nft/idcards/${nftData.studentId}/image?v=${nftData.version || 1}&t=${retryCount}`;
    console.log("Generated NFT image URL:", url);
    return url;
  };

  // Add this before the return statement to debug nftData
  console.log("Before render - nftData:", nftData);
  console.log("Before render - studentData:", studentData);
  console.log("Before render - application:", application);

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

  const status = getStatusDisplay();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back
          </button>

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center">
              <FileText className="mr-3" size={28} />
              Application Details
            </h1>

            <div
              className={`px-4 py-2 rounded-md ${status.bgColor} ${status.textColor} flex items-center`}
            >
              {status.icon}
              <span>{status.text}</span>
            </div>
          </div>
        </motion.div>

        {actionMessage && (
          <motion.div
            variants={itemVariants}
            className={`mb-6 p-4 rounded-md ${
              actionMessage.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {actionMessage.type === "success" ? (
                <Check size={20} className="mr-2" />
              ) : (
                <AlertCircle size={20} className="mr-2" />
              )}
              <p>{actionMessage.text}</p>
            </div>
          </motion.div>
        )}

        {/* Student Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
        >
          <div className="border-b px-6 py-4 bg-gray-50">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="mr-2" size={20} />
              Student Information
            </h2>
          </div>

          <div className="p-6">
            {studentData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium">{studentData.studentId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {studentData.firstName} {studentData.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{studentData.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Institution</p>
                  <p className="font-medium">
                    {studentData.institution || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">
                    {studentData.department || "Not specified"}
                  </p>
                </div>

                {studentData.enrollmentYear && (
                  <div>
                    <p className="text-sm text-gray-500">Enrollment Year</p>
                    <p className="font-medium">{studentData.enrollmentYear}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Student data not available.</p>
            )}
          </div>
        </motion.div>

        {/* Application Details */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
        >
          <div className="border-b px-6 py-4 bg-gray-50">
            <h2 className="text-xl font-semibold flex items-center">
              <BookOpen className="mr-2" size={20} />
              Application Details
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Application ID</p>
                <p className="font-medium">{application.applicationId}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="font-medium">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Program Details</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Program</p>
                      <p className="font-medium">
                        {application.programDetails?.program ||
                          "General Application"}
                      </p>
                    </div>

                    {application.programDetails?.department && (
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">
                          {application.programDetails.department}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">
                        {application.programDetails?.year ||
                          new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {application.additionalInfo?.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>{application.additionalInfo.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* NFT Information */}
        {nftData && (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
          >
            <div className="border-b px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center">
                <Shield className="mr-2" size={20} />
                Digital ID (NFT) Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">NFT Token ID</p>
                  <p className="font-medium font-mono text-sm">
                    {nftData.tokenId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Minted Date</p>
                  <p className="font-medium">
                    {new Date(nftData.mintedAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{nftData.status}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Version</p>
                  <p className="font-medium">{nftData.version || 1}</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/nft/${nftData.tokenId}`)}
                className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md flex items-center w-max"
              >
                <Eye className="mr-2" size={16} />
                View Digital ID
              </button>
            </div>
          </motion.div>
        )}

        {/* NFT ID Card Preview */}
        {studentData && (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
          >
            <div className="border-b px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center">
                <Shield className="mr-2" size={20} />
                Student Digital ID Card
              </h2>
            </div>

            <div className="p-6">
              <div className="w-full max-w-md mx-auto">
                {/* NFT ID Card Image */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg mb-4">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
                    <h3 className="font-bold text-lg flex items-center">
                      <Shield size={20} className="mr-2" /> Student Digital ID
                    </h3>
                    <p className="text-xs opacity-80">Student ID: {studentData.studentId}</p>
                  </div>

                  {/* Actual NFT Image from API - direct URL */}
                  <div className="relative bg-gray-50 p-4">
                    {idCardLoading || imageLoading ? (
                      <div className="w-full h-64 flex items-center justify-center">
                        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
                      </div>
                    ) : (
                      <>
                        <img
                          src={`http://localhost:3000/api/nft/idcards/${studentData.studentId}/image?t=${Date.now()}`}
                          alt="Student ID Card"
                          className="w-full max-h-96 object-contain mx-auto"
                          onLoad={() => setImageLoading(false)}
                          onError={(e) => {
                            console.error("Failed to load image:", e.target.src);
                            setImageLoading(false);
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Student info at the bottom */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="text-center">
                      <h3 className="font-bold text-lg">
                        {studentData.firstName} {studentData.lastName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {studentData.studentId}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
                        <div>
                          <span className="text-gray-600">Program:</span>
                          <span className="font-medium ml-1">
                            {application.programDetails?.program || "General"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium ml-1">
                            {application.programDetails?.year ||
                              new Date().getFullYear()}
                          </span>
                        </div>
                      </div>
                      
                      {idCard && idCard.verificationStatus === "VERIFIED" && (
                        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-center text-green-600">
                          <CheckCircle2 size={16} className="mr-1" />
                          <span className="text-sm font-medium">Verified by {idCard.verifiedInstitution}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      fetch(`http://localhost:3000/api/nft/idcards/${studentData.studentId}/image?t=${Date.now()}`)
                        .then((res) => res.blob())
                        .then((blob) => {
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `ID_Card_${studentData.studentId}.png`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          a.remove();
                        })
                        .catch((err) => console.error("Download failed:", err));
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md flex items-center transition-colors"
                  >
                    <Download size={16} className="mr-2" />
                    Download ID Card
                  </button>
                  {nftData && (
                    <button
                      onClick={() => navigate(`/nft/${nftData.tokenId}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center transition-colors"
                    >
                      <Eye className="mr-2" size={16} />
                      View NFT Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {application.status === "PENDING" && (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="border-b px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold">Actions</h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleApprove}
                  disabled={processingAction}
                  className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  {processingAction ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2" size={18} />
                      Approve Application
                    </>
                  )}
                </button>

                <button
                  onClick={handleReject}
                  disabled={processingAction}
                  className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                >
                  {processingAction ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="mr-2" size={18} />
                      Reject Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {application.status === "APPROVED" && !application.transactionId && (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="border-b px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold">Blockchain Verification</h2>
            </div>

            <div className="p-6">
              <div className="bg-yellow-50 p-4 rounded-md mb-4">
                <div className="flex items-center">
                  <Info className="text-yellow-600 mr-2" size={18} />
                  <p className="text-yellow-700">
                    The application has been approved but not yet verified on
                    the blockchain.
                  </p>
                </div>
              </div>

              <button
                onClick={handleVerifyOnBlockchain}
                disabled={processingAction}
                className="px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center w-full"
              >
                {processingAction ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2" size={18} />
                    Verify on Blockchain
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {application.status === "APPROVED" && application.transactionId && (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="border-b px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold">Blockchain Verification</h2>
            </div>

            <div className="p-6">
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex items-center">
                  <Shield className="text-green-600 mr-2" size={18} />
                  <p className="text-green-700">
                    This application has been verified on the blockchain.
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                  <p className="bg-white p-2 rounded border border-green-100 font-mono text-xs break-all">
                    {application.transactionId}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsPage;
