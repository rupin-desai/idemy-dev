import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  School,
  Loader,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNft } from "../hooks/useNft";
import axios from "axios";
import * as institutionApi from "../api/institution.api";
import { toast } from "react-hot-toast";

// Animation variants
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

const InstitutionDetailsPage = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const { updateNftAndCreateVersion } = useNft();

  const [institution, setInstitution] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch institution and application details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch institution details
        const instResponse = await institutionApi.getInstitutionById(
          institutionId
        );
        if (instResponse.success) {
          setInstitution(instResponse.institution);
        } else {
          throw new Error("Failed to load institution details");
        }

        // Fetch student's applications and filter for this institution
        if (currentUser?.student?.studentId) {
          const studentId = currentUser.student.studentId;
          console.log(`Fetching applications for student ${studentId}`);

          // Get all applications for the student
          const appResponse = await axios.get(
            `http://localhost:3000/api/applications/student/${studentId}`
          );

          if (appResponse.data.success) {
            // Filter applications for this specific institution
            const filteredApps = appResponse.data.applications.filter(
              (app) => app.institutionId === institutionId
            );

            console.log(
              `Found ${appResponse.data.applications.length} total applications`
            );
            console.log(
              `Filtered to ${filteredApps.length} applications for institution ${institutionId}`
            );

            setApplications(filteredApps);

            // If there's an approved application, fetch the NFT data
            const approvedApp = filteredApps.find(
              (app) => app.status === "APPROVED"
            );
            if (approvedApp) {
              try {
                // Fetch student's NFTs
                const nftResponse = await axios.get(
                  `http://localhost:3000/api/nft/student/${studentId}/latest`
                );

                if (nftResponse.data.success && nftResponse.data.nft) {
                  setNftData(nftResponse.data.nft);
                }
              } catch (nftError) {
                console.error("Error fetching NFT data:", nftError);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    if (institutionId && currentUser) {
      fetchData();
    }
  }, [institutionId, currentUser]);

  const getApplicationStatus = () => {
    if (!applications || applications.length === 0) return null;

    // Return the most recent application status (based on submittedAt)
    const sortedApps = [...applications].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    return sortedApps[0].status;
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          icon: <CheckCircle2 size={20} className="text-green-500 mr-2" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          text: "Approved",
        };
      case "REJECTED":
        return {
          icon: <XCircle size={20} className="text-red-500 mr-2" />,
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

  const handleUpdateNft = async () => {
    if (!nftData || !institution) return;

    try {
      setProcessing(true);

      // Prepare data for NFT update
      const updateData = {
        institution: institution.name,
        institutionId: institution.institutionId,
        cardType: "VERIFIED_STUDENT",
        verificationDetails: {
          verifiedBy: institution.name,
          verifiedAt: new Date().toISOString(),
          institutionType: institution.institutionType,
        },
      };

      // Find approved application if any
      const approvedApp = applications.find((app) => app.status === "APPROVED");

      if (approvedApp) {
        // Include program details from the approved application
        updateData.program =
          approvedApp.programDetails?.program || "General Program";
        updateData.enrollmentYear =
          approvedApp.programDetails?.year || new Date().getFullYear();
      }

      // Update the NFT with institution verification
      const result = await updateNftAndCreateVersion(
        nftData.tokenId,
        updateData
      );

      if (result.success) {
        setUpdateSuccess(true);
        setTimeout(() => {
          navigate(`/nft/${result.newVersion.tokenId}`);
        }, 2000);
      } else {
        setError(result.message || "Failed to update NFT");
      }
    } catch (err) {
      console.error("Error updating NFT:", err);
      setError(err.message || "Failed to update NFT with institution details");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmAdmission = async (applicationId) => {
    if (!currentUser?.student?.studentId) return;
    
    try {
      setProcessing(true);
      setError(null);
      
      const response = await axios.post(
        `http://localhost:3000/api/applications/${applicationId}/confirm`,
        { studentId: currentUser.student.studentId },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('authToken')}` 
          }
        }
      );
      
      if (response.data.success) {
        // Update applications list
        setApplications(prev => 
          prev.map(app => {
            if (app.applicationId === applicationId) {
              return { 
                ...app, 
                status: "CONFIRMED",
                confirmedAt: Date.now()
              };
            }
            // Mark others as withdrawn
            if (app.status === "PENDING" || app.status === "APPROVED") {
              return {
                ...app,
                status: "WITHDRAWN"
              };
            }
            return app;
          })
        );
        
        // Show success message and refresh user profile
        toast.success("Admission confirmed successfully!");
        if (updateProfile) {
          await updateProfile({
            ...currentUser,
            student: {
              ...currentUser.student,
              currentInstitution: {
                institutionId: institutionId,
                institutionName: institution.name,
                applicationId: applicationId
              }
            }
          });
        }
      } else {
        setError("Failed to confirm admission");
      }
    } catch (err) {
      console.error("Error confirming admission:", err);
      setError(err.response?.data?.message || "Failed to confirm admission");
    } finally {
      setProcessing(false);
    }
  };
  
  const handleCompleteStudies = async (applicationId) => {
    if (!currentUser?.student?.studentId) return;
    
    try {
      setProcessing(true);
      setError(null);
      
      const response = await axios.post(
        `http://localhost:3000/api/applications/${applicationId}/complete`,
        { studentId: currentUser.student.studentId },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('authToken')}` 
          }
        }
      );
      
      if (response.data.success) {
        // Update applications list
        setApplications(prev => 
          prev.map(app => {
            if (app.applicationId === applicationId) {
              return { 
                ...app, 
                status: "COMPLETED",
                completedAt: Date.now()
              };
            }
            return app;
          })
        );
        
        // Show success message and refresh user profile
        toast.success("Studies marked as completed!");
        if (updateProfile) {
          await updateProfile({
            ...currentUser,
            student: {
              ...currentUser.student,
              currentInstitution: null
            }
          });
        }
      } else {
        setError("Failed to mark studies as completed");
      }
    } catch (err) {
      console.error("Error completing studies:", err);
      setError(err.response?.data?.message || "Failed to mark studies as completed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Loading institution details...</p>
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
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const applicationStatus = getApplicationStatus();
  const status = applicationStatus ? getStatusDisplay(applicationStatus) : null;

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

          <h1 className="text-3xl font-bold flex items-center">
            <Building className="mr-3" size={28} />
            {institution.name}
          </h1>

          {status && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full ${status.bgColor} ${status.textColor} text-sm mt-2`}
            >
              {status.icon}
              <span>{status.text}</span>
            </div>
          )}
        </motion.div>

        {updateSuccess && (
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-md flex items-center"
          >
            <CheckCircle2 size={20} className="mr-2" />
            <p>
              Your NFT has been successfully updated with institution
              verification! Redirecting...
            </p>
          </motion.div>
        )}

        {/* Institution Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <School className="mr-2" size={20} />
              Institution Information
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Institution Type</p>
                <p className="font-medium">{institution.institutionType}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{institution.location}</p>
              </div>

              {institution.foundingYear && (
                <div>
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-medium">{institution.foundingYear}</p>
                </div>
              )}

              {institution.website && (
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="font-medium">
                    <a
                      href={
                        institution.website.startsWith("http")
                          ? institution.website
                          : `https://${institution.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {institution.website.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {institution.nftTokenId && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-md flex items-center">
                <Shield className="text-green-600 mr-2" size={18} />
                <div>
                  <p className="font-medium text-green-700">
                    Blockchain Verified Institution
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    This institution is verified on the blockchain with NFT ID:
                    <span className="font-mono ml-1">
                      {institution.nftTokenId}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Application Details */}
        {applications.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
          >
            <div className="border-b px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold">
                Your Application to {institution.name}
              </h2>
            </div>

            <div className="p-6">
              {applications.map((app) => (
                <div key={app.applicationId} className="mb-4 last:mb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Application ID</p>
                      <p className="font-medium">{app.applicationId}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Program Details</p>
                    <div className="bg-gray-50 p-4 rounded-md mt-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Program</p>
                          <p className="font-medium">
                            {app.programDetails?.program ||
                              "General Application"}
                          </p>
                        </div>

                        {app.programDetails?.department && (
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">
                              {app.programDetails.department}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-500">Year</p>
                          <p className="font-medium">
                            {app.programDetails?.year ||
                              new Date().getFullYear()}
                          </p>
                        </div>
                      </div>

                      {app.additionalInfo?.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">
                            Additional Notes
                          </p>
                          <p className="mt-1">{app.additionalInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        getStatusDisplay(app.status).bgColor
                      } ${
                        getStatusDisplay(app.status).textColor
                      } flex items-center`}
                    >
                      {getStatusDisplay(app.status).icon}
                      <span>{app.status}</span>
                    </div>

                    {app.status === "APPROVED" && !app.transactionId && (
                      <p className="text-sm text-yellow-600">
                        Pending blockchain verification
                      </p>
                    )}

                    {app.transactionId && (
                      <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <Shield size={16} className="mr-1" />
                        <span>Verified on Blockchain</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Update NFT Section - Only show for approved applications that haven't been updated yet */}
        {applicationStatus === "APPROVED" && nftData && (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="border-b px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center">
                <Shield className="mr-2" size={20} />
                Update Your Digital ID
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Your application to {institution.name} has been approved. You
                can now update your digital ID to include this institution's
                verification.
              </p>

              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex items-start">
                  <School
                    className="text-blue-600 mt-1 mr-3 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="font-medium text-blue-800">
                      Benefits of updating your ID
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-blue-700">
                      <li>
                        • Your digital ID will show {institution.name} as your
                        verified institution
                      </li>
                      <li>
                        • Your academic credentials will be blockchain-verified
                      </li>
                      <li>
                        • Employers and other organizations can verify your
                        institutional affiliation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdateNft}
                disabled={processing}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2" size={18} />
                    Update Digital ID with Institution Verification
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Display approved applications */}
        {applications.filter(app => app.status === "APPROVED").map(app => (
          <div key={app.applicationId} className="mb-4 last:mb-0 border border-green-100 bg-green-50 rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <CheckCircle2 size={20} className="text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Application Approved!</h3>
              </div>
              <div className="text-sm text-green-600">
                {app.verificationData?.verifiedAt ? new Date(app.verificationData.verifiedAt).toLocaleDateString() : 'Recently approved'}
              </div>
            </div>
            
            <p className="text-sm text-green-700 mb-4">
              Your application to {institution.name} has been approved. You can now confirm your admission.
            </p>
            
            <div className="bg-white p-3 rounded-md border border-green-200 mb-4">
              <p className="text-sm font-medium text-gray-700">Program: {app.programDetails?.program || 'Not specified'}</p>
              {app.programDetails?.department && (
                <p className="text-sm text-gray-600">Department: {app.programDetails.department}</p>
              )}
              {app.verificationData?.startDate && (
                <p className="text-sm text-gray-600">
                  Start Date: {new Date(app.verificationData.startDate).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-700 mb-4">
              <p className="flex items-center">
                <AlertCircle size={16} className="mr-2" />
                <strong>Important:</strong> Confirming this admission will withdraw all your other pending applications.
              </p>
            </div>
            
            <button
              onClick={() => handleConfirmAdmission(app.applicationId)}
              disabled={processing}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2" size={18} />
                  Confirm Admission
                </>
              )}
            </button>
          </div>
        ))}

        {/* Display confirmed applications */}
        {applications.filter(app => app.status === "CONFIRMED").map(app => (
          <div key={app.applicationId} className="mb-4 last:mb-0 border border-blue-100 bg-blue-50 rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <School size={20} className="text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Current Institution</h3>
              </div>
              <div className="text-sm text-blue-600">
                Confirmed on {app.confirmedAt ? new Date(app.confirmedAt).toLocaleDateString() : 'Recently confirmed'}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md border border-blue-200 mb-4">
              <p className="text-sm font-medium text-gray-700">Program: {app.programDetails?.program || 'Not specified'}</p>
              {app.programDetails?.department && (
                <p className="text-sm text-gray-600">Department: {app.programDetails.department}</p>
              )}
              {app.verificationData?.startDate && (
                <p className="text-sm text-gray-600">
                  Started: {new Date(app.verificationData.startDate).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <button
              onClick={() => handleCompleteStudies(app.applicationId)}
              disabled={processing}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2" size={18} />
                  Mark Studies as Completed
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default InstitutionDetailsPage;
