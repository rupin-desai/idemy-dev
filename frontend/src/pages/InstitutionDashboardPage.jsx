import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building,
  Shield,
  AlertCircle,
  Users,
  FileCheck,
  Award,
  CheckCircle2,
  School,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import * as institutionApi from "../api/institution.api"; // Import the institution API service
import * as applicationApi from "../api/application.api";

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

const InstitutionDashboardPage = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mintingNft, setMintingNft] = useState(false);
  const [nftData, setNftData] = useState(null); // Add state for NFT metadata
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      try {
        setLoading(true);
        const response = await institutionApi.getInstitutionById(institutionId);
        if (response.success) {
          setInstitution(response.institution);

          // If institution has NFT, fetch NFT metadata
          if (response.institution.nftTokenId) {
            try {
              const nftResponse = await fetch(
                `http://localhost:3000/api/nft/institution/${institutionId}/metadata`
              );
              if (nftResponse.ok) {
                const metadata = await nftResponse.json();
                setNftData(metadata);
              }
            } catch (nftErr) {
              console.error("Failed to fetch NFT metadata:", nftErr);
            }
          }
        } else {
          setError(
            response.error?.message || "Failed to load institution details."
          );
        }
      } catch (err) {
        console.error("Error fetching institution data:", err);
        setError("Failed to load institution details.");
      } finally {
        setLoading(false);
      }
    };

    if (institutionId) {
      fetchInstitutionData();
    }
  }, [institutionId]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!institutionId) return;

      try {
        setLoadingApplications(true);
        const result = await applicationApi.getApplicationsByInstitutionId(
          institutionId
        );
        if (result.success) {
          setApplications(result.applications);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoadingApplications(false);
      }
    };

    if (institution?.nftTokenId) {
      fetchApplications();
    }
  }, [institutionId, institution]);

  const handleMintNFT = async () => {
    try {
      setMintingNft(true);
      const response = await institutionApi.mintInstitutionNFT(institutionId);

      if (response.success) {
        // Update institution data with newly minted NFT
        setInstitution((prev) => ({
          ...prev,
          nftTokenId: response.nft.tokenId,
        }));

        // Fetch NFT metadata after minting
        try {
          const nftResponse = await fetch(
            `http://localhost:3000/api/nft/institution/${institutionId}/metadata`
          );

          if (nftResponse.ok) {
            const metadata = await nftResponse.json();
            setNftData(metadata);
          }
        } catch (nftErr) {
          console.error("Failed to fetch NFT metadata after minting:", nftErr);
        }

        alert("Institution NFT minted successfully!");
      } else {
        alert(
          response.error?.message ||
            "Failed to mint Institution NFT. Please try again."
        );
      }
    } catch (err) {
      console.error("Error minting NFT:", err);
      alert("Failed to mint Institution NFT. Please try again.");
    } finally {
      setMintingNft(false);
    }
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      // Create required verification data
      const verificationData = {
        verifierNotes: "Approved by institution administrator",
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
        // Update the application in the list
        setApplications((apps) =>
          apps.map((app) =>
            app.applicationId === applicationId
              ? { ...app, status: "APPROVED", verificationData }
              : app
          )
        );
        alert("Application approved successfully");
      } else {
        alert(result.error?.message || "Failed to approve application");
      }
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Error approving application");
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      const result = await applicationApi.updateApplicationStatus(
        applicationId,
        "REJECTED"
      );
      if (result.success) {
        // Update the application in the list
        setApplications((apps) =>
          apps.map((app) =>
            app.applicationId === applicationId
              ? { ...app, status: "REJECTED" }
              : app
          )
        );
        alert("Application rejected");
      } else {
        alert("Failed to reject application");
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Error rejecting application");
    }
  };

  const handleVerifyApplication = async (applicationId) => {
    try {
      const result = await applicationApi.verifyApplication(applicationId);
      if (result.success) {
        // Update the application in the list
        setApplications((apps) =>
          apps.map((app) =>
            app.applicationId === applicationId
              ? { ...app, transactionId: result.transaction.id }
              : app
          )
        );
        alert("Application verified on blockchain successfully!");
      } else {
        alert("Failed to verify application on blockchain");
      }
    } catch (err) {
      console.error("Error verifying application:", err);
      alert("Error verifying application");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading institution information...</p>
        </div>
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error || "Institution not found"}</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Building className="mr-2" size={24} />
                  {institution.name}
                </h1>
                <p className="opacity-80 mt-1">{institution.location}</p>

                {/* Display NFT information at the top */}
                {institution.nftTokenId ? (
                  <div className="mt-2 flex items-center bg-purple-500  bg-opacity-20 px-3 py-1.5 rounded-md text-sm">
                    <Award className="mr-1" size={16} />
                    <span>Verified NFT: </span>
                    <span className="font-mono ml-1">
                      {institution.nftTokenId.substring(0, 8)}...
                    </span>
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:3000/api/nft/institution/${institutionId}/image`
                        )
                      }
                      className="ml-2 underline hover:text-blue-200 transition-colors"
                    >
                      View
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center bg-yellow-400 bg-opacity-20 px-3 py-1.5 rounded-md text-sm">
                    <AlertCircle className="mr-1" size={16} />
                    <span>Institution not yet verified</span>
                  </div>
                )}
              </div>

              <div className="bg-white text-purple-700 px-3 py-1 rounded-md text-sm font-medium">
                {institution.status}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Institution Details</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500">Institution Type</p>
                <p className="font-medium">{institution.institutionType}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Founding Year</p>
                <p className="font-medium">{institution.foundingYear}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{institution.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium">
                  {institution.website ? (
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {institution.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>

            {institution.contactInfo && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">
                  Contact Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {institution.contactInfo.phone && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{institution.contactInfo.phone}</p>
                    </div>
                  )}

                  {institution.contactInfo.address && (
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{institution.contactInfo.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Updated Blockchain Verification Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <Shield size={18} className="mr-2" />
                Blockchain Verification
              </h3>

              {institution.nftTokenId ? (
                <div className="bg-green-50 p-4 rounded-md border border-green-100">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-4">
                    {/* NFT Image */}
                    <div className="mb-4 lg:mb-0 w-full lg:w-1/3 flex justify-center">
                      <img
                        src={`http://localhost:3000/api/nft/institution/${institutionId}/image?t=${Date.now()}`}
                        alt="Institution Verification NFT"
                        className="border rounded-lg shadow-sm max-w-full h-auto"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-nft.png";
                          console.error("Failed to load NFT image");
                        }}
                      />
                    </div>

                    {/* NFT Details */}
                    <div className="w-full lg:w-2/3">
                      <div className="flex items-start">
                        <Award className="text-green-600 h-5 w-5 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-green-800">
                            Institution Verified
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            This institution has been verified on the blockchain
                            with NFT:
                            <span className="font-mono ml-1">
                              {institution.nftTokenId}
                            </span>
                          </p>

                          {nftData && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                              <h4 className="font-medium text-sm mb-2">
                                NFT Information
                              </h4>
                              <div className="text-xs text-gray-700">
                                <p>
                                  <span className="font-medium">Name:</span>{" "}
                                  {nftData.name}
                                </p>
                                {nftData.attributes?.map((attr, idx) => (
                                  <p key={idx} className="mt-1">
                                    <span className="font-medium">
                                      {attr.trait_type}:
                                    </span>{" "}
                                    {attr.value}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() =>
                                window.open(
                                  `http://localhost:3000/api/nft/institution/${institutionId}/image`
                                )
                              }
                              className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-100"
                            >
                              View Full Image
                            </button>
                            <button
                              onClick={() =>
                                window.open(
                                  `http://localhost:3000/api/nft/institution/${institutionId}/metadata`
                                )
                              }
                              className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded hover:bg-indigo-100"
                            >
                              View Metadata
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                  <div className="flex items-start">
                    <AlertCircle className="text-yellow-600 h-5 w-5 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Institution Not Yet Verified
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This institution needs to be verified on the blockchain.
                      </p>
                      <button
                        onClick={handleMintNFT}
                        disabled={mintingNft}
                        className={`mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors flex items-center ${
                          mintingNft ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {mintingNft ? "Minting..." : "Mint Verification NFT"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Placeholder for student applications (future feature) */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <Users size={18} className="mr-2" />
                Student Applications
              </h3>

              {loadingApplications ? (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-center">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mb-2"></div>
                  <p className="text-blue-700 text-sm">
                    Loading applications...
                  </p>
                </div>
              ) : applications.length === 0 ? (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <p className="text-blue-700 text-sm">
                    No student applications yet. Once students apply to your
                    institution, you'll be able to review and verify their
                    applications here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.applicationId}
                      className={`bg-white p-4 shadow-sm rounded-md border ${
                        app.status === "APPROVED"
                          ? "border-green-200"
                          : app.status === "PENDING"
                          ? "border-yellow-200"
                          : app.status === "REJECTED"
                          ? "border-red-200"
                          : app.status === "WITHDRAWN"
                          ? "border-gray-200"
                          : app.status === "CONFIRMED"
                          ? "border-blue-200"
                          : app.status === "COMPLETED"
                          ? "border-purple-200"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{app.studentId}</h4>
                          <p className="text-sm text-gray-600">
                            Application ID: {app.applicationId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Program: {app.programDetails?.program || "General"}
                          </p>
                          {app.status === "CONFIRMED" && (
                            <p className="text-sm text-blue-600 font-medium mt-1">
                              <School className="inline-block mr-1 h-4 w-4" />
                              Student confirmed admission
                            </p>
                          )}
                          {app.status === "COMPLETED" && app.completedAt && (
                            <p className="text-sm text-purple-600 font-medium mt-1">
                              <CheckCircle2 className="inline-block mr-1 h-4 w-4" />
                              Studies completed on{" "}
                              {new Date(app.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`
                            mr-3 px-3 py-1 rounded-full text-xs
                            ${
                              app.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                            ${
                              app.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                            }
                            ${
                              app.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : ""
                            }
                            ${
                              app.status === "WITHDRAWN"
                                ? "bg-gray-100 text-gray-700"
                                : ""
                            }
                            ${
                              app.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                            }
                            ${
                              app.status === "COMPLETED"
                                ? "bg-purple-100 text-purple-800"
                                : ""
                            }
                          `}
                          >
                            {app.status}
                          </span>
                          <button
                            onClick={() =>
                              navigate(`/application/${app.applicationId}`)
                            }
                            className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {/* Show appropriate action buttons based on status */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {app.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                handleApproveApplication(app.applicationId)
                              }
                              className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleRejectApplication(app.applicationId)
                              }
                              className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {app.status === "APPROVED" && !app.transactionId && (
                          <button
                            onClick={() =>
                              handleVerifyApplication(app.applicationId)
                            }
                            className="bg-purple-600 text-white text-xs px-3 py-1 rounded hover:bg-purple-700"
                          >
                            Verify on Blockchain
                          </button>
                        )}

                        {app.status === "APPROVED" && app.transactionId && (
                          <div className="flex items-center text-xs text-green-600">
                            <Shield className="h-4 w-4 mr-1" />
                            <span>Verified on blockchain</span>
                          </div>
                        )}

                        {app.status === "CONFIRMED" && (
                          <div className="bg-blue-50 p-2 rounded-md w-full mt-1 text-xs text-blue-700">
                            Student has confirmed admission to your institution
                          </div>
                        )}

                        {app.status === "COMPLETED" && (
                          <div className="bg-purple-50 p-2 rounded-md w-full mt-1 text-xs text-purple-700">
                            Student has completed their studies at your
                            institution
                          </div>
                        )}

                        {app.status === "WITHDRAWN" && (
                          <div className="bg-gray-50 p-2 rounded-md w-full mt-1 text-xs text-gray-700">
                            This application was withdrawn by the student
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Placeholder for credential issuance (future feature) */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FileCheck size={18} className="mr-2" />
                Credential Issuance
              </h3>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <p className="text-blue-700 text-sm">
                  This feature will allow you to issue blockchain-verified
                  credentials to students once your institution is verified.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstitutionDashboardPage;
