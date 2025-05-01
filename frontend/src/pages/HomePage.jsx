import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNft } from "../hooks/useNft";
import { useInstitution } from "../hooks/useInstitution";
import {
  User,
  Eye,
  Database,
  ChevronRight,
  Shield,
  FileText,
  BookOpenCheck,
  Building,
  Info,
  ArrowRight,
  School,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import StudentInfo from "../components/StudentInfo";
import LoadingState from "../components/home/LoadingState";
import WelcomeHeader from "../components/home/WelcomeHeader";
import ErrorDisplay from "../components/home/ErrorDisplay";
import NftCard from "../components/home/NftCard";
import FeatureMenu from "../components/UI/FeatureMenu";
import axios from "axios";
import * as applicationApi from "../api/application.api";

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
  hidden: { opacity: 0, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const HomePage = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    currentUser,
    loading: authLoading,
    profileLoaded,
  } = useAuth();
  const {
    userNfts,
    loading: nftLoading,
    error,
    clearError,
    fetchUserNfts,
    verifyUserNft,
  } = useNft();
  const { currentInstitution, loading: institutionLoading } = useInstitution();
  const [verifying, setVerifying] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [studentApplications, setStudentApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  // Force refresh NFTs when profile is loaded
  useEffect(() => {
    if (isAuthenticated && currentUser && profileLoaded) {
      console.log("Profile loaded in HomePage, fetching NFTs");
      fetchUserNfts(true); // Force fetch
    }
  }, [isAuthenticated, currentUser, profileLoaded, fetchUserNfts]);

  // Debug user role and institution status
  useEffect(() => {
    if (currentUser) {
      console.log("Current user role:", currentUser.role);
      console.log("Current institution:", currentInstitution);
    }
  }, [currentUser, currentInstitution]);

  // Combined loading state - consider profile loading too
  const isLoading =
    authLoading || (isAuthenticated && !profileLoaded) || institutionLoading;

  const handleVerifyNft = async (tokenId) => {
    try {
      setVerifying(tokenId);
      setVerificationError(null);
      const result = await verifyUserNft(tokenId);
      alert(`NFT verification: ${result.valid ? "Valid ✓" : "Invalid ✗"}`);
    } catch (err) {
      console.error("Verification failed:", err);
      setVerificationError({
        tokenId,
        message: err.message || "Verification failed",
      });
    } finally {
      setVerifying(null);
    }
  };

  // Get the latest NFT (with isLatestVersion=true or most recent if not flagged)
  const getLatestNft = () => {
    if (!userNfts || userNfts.length === 0) return null;

    return (
      userNfts
        .sort((a, b) => new Date(b.mintedAt) - new Date(a.mintedAt))
        .find((nft) => nft.isLatestVersion === true) || userNfts[0]
    );
  };

  // Get latest NFT ID
  const getLatestNftId = () => {
    const latestNft = getLatestNft();
    return latestNft ? latestNft.tokenId : null;
  };

  const latestNft = getLatestNft();

  // Check if user is registered as a student
  const isRegisteredStudent =
    currentUser?.student?.studentId || currentUser?.role === "student";

  // Check if user is registered as an institution - check both the context and the user role
  const isRegisteredInstitution =
    !!currentInstitution || currentUser?.role === "institution";

  // Define features for the FeatureMenu component
  const homeFeatures = [];

  // Add student-specific features if registered as student
  if (isRegisteredStudent) {
    homeFeatures.push({
      icon: <Eye size={20} className="text-white" />,
      title: "View Your NFT ID",
      description:
        "Access and manage your digital ID cards secured by blockchain",
      path:
        userNfts && userNfts.length > 0
          ? `/nft/${getLatestNftId()}`
          : "/create-id",
      bgColorClass: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColorClass: "border border-indigo-200",
      iconBgClass: "bg-indigo-600",
      arrowColorClass: "text-indigo-600",
    });

    // New feature: Apply to Institution
    homeFeatures.push({
      icon: <School size={20} className="text-white" />,
      title: "Apply to Institution",
      description:
        "Apply to verified institutions with your blockchain credentials",
      path: "/apply-to-institution",
      bgColorClass: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColorClass: "border border-emerald-200",
      iconBgClass: "bg-emerald-600",
      arrowColorClass: "text-emerald-600",
    });
  }

  // Add institution-specific features if registered as institution
  if (isRegisteredInstitution) {
    const institutionId = currentInstitution?.institutionId || "dashboard";
    homeFeatures.unshift({
      icon: <Building size={20} className="text-white" />,
      title: "Institution Dashboard",
      description: "Manage your institution and issue credentials",
      path: `/institution/${institutionId}`,
      bgColorClass: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColorClass: "border border-purple-200",
      iconBgClass: "bg-purple-600",
      arrowColorClass: "text-purple-600",
    });
  }

  // Add common features that everyone gets
  homeFeatures.push(
    {
      title: "Learn",
      icon: <Shield size={20} className="text-white" />,
      description:
        "Learn how blockchain technology secures your digital identity",
      path: "/learn/blockchain",
      bgColorClass: "bg-gradient-to-br from-green-50 to-green-100",
      borderColorClass: "border border-green-200",
      iconBgClass: "bg-green-600",
      arrowColorClass: "text-green-600",
    },
    {
      icon: <FileText size={20} className="text-white" />,
      title: "Your Blockchain Data",
      description:
        "View your complete digital identity history on the blockchain",
      path: "/blockchain-data",
      bgColorClass: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColorClass: "border border-amber-200",
      iconBgClass: "bg-amber-600",
      arrowColorClass: "text-amber-600",
    },
    {
      icon: <User size={20} className="text-white" />,
      title: "Your Profile Data",
      description: "View your blockchain-verified personal information",
      path: "/profile-data",
      bgColorClass: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      borderColorClass: "border border-cyan-200",
      iconBgClass: "bg-cyan-600",
      arrowColorClass: "text-cyan-600",
    }
  );

  useEffect(() => {
    const fetchStudentApplications = async () => {
      if (
        !isAuthenticated ||
        !isRegisteredStudent ||
        !currentUser?.student?.studentId
      ) {
        return;
      }

      try {
        setLoadingApplications(true);
        const studentId = currentUser.student.studentId;
        const result = await applicationApi.getApplicationsByStudentId(
          studentId
        );

        if (result.success) {
          console.log("Student applications:", result.applications);
          setStudentApplications(result.applications);
        }
      } catch (error) {
        console.error("Error fetching student applications:", error);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchStudentApplications();
  }, [isAuthenticated, isRegisteredStudent, currentUser?.student?.studentId]);

  // Update the getStatusIcon function to include new statuses
  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "PENDING":
        return <Clock size={16} className="text-yellow-500" />;
      case "REJECTED":
        return <XCircle size={16} className="text-red-500" />;
      case "WITHDRAWN":
        return <XCircle size={16} className="text-gray-500" />;
      case "CONFIRMED":
        return <Shield size={16} className="text-blue-500" />;
      case "COMPLETED":
        return <CheckCircle2 size={16} className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <LoadingState />
        ) : isAuthenticated ? (
          <>
            <motion.div
              variants={itemVariants}
              className="bg-white shadow-md rounded-lg p-6 mb-6"
            >
              {isRegisteredStudent ? (
                // Student-specific content
                <>
                  <WelcomeHeader
                    currentUser={currentUser}
                    hasNfts={userNfts && userNfts.length > 0}
                    latestNftId={getLatestNftId()}
                  />

                  <p className="text-slate-600 mb-4">
                    Welcome back,{" "}
                    {currentUser?.displayName || currentUser?.email}!
                  </p>

                  {/* Student info component */}
                  <StudentInfo currentUser={currentUser} />

                  {/* Display any errors */}
                  <ErrorDisplay
                    error={error}
                    clearError={clearError}
                    fetchUserNfts={fetchUserNfts}
                  />

                  {/* Latest ID Card Section */}
                  {!error && !nftLoading && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-lg">
                          Your Latest ID Card
                        </h2>
                        {userNfts && userNfts.length > 1 && (
                          <button
                            onClick={() => navigate(`/nft/${getLatestNftId()}`)}
                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            View All Cards{" "}
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        )}
                      </div>

                      {nftLoading ? (
                        <LoadingState message="Loading your ID cards..." />
                      ) : userNfts && userNfts.length > 0 && latestNft ? (
                        <NftCard
                          nft={latestNft}
                          handleVerify={handleVerifyNft}
                          verifying={verifying}
                          verificationError={verificationError}
                        />
                      ) : (
                        <div className="bg-blue-50 p-6 rounded-md text-center">
                          <p className="text-slate-700 mb-4">
                            You don't have any ID cards yet.
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/create-id")}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center mx-auto"
                          >
                            <Eye size={18} className="mr-2" />
                            Create Your Digital ID
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Student Applications Section */}
                  {!error && !nftLoading && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="font-semibold text-lg flex items-center">
                          <Building size={18} className="mr-2 text-gray-600" />
                          Your Institution Applications
                        </h2>
                      </div>

                      {loadingApplications ? (
                        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          <p className="text-gray-600 text-sm">
                            Loading your applications...
                          </p>
                        </div>
                      ) : studentApplications.length > 0 ? (
                        <div className="space-y-2">
                          {studentApplications.map((app) => {
                            // Get institution name from the application
                            const institutionName =
                              app.institutionName ||
                              app.metadata?.institutionName ||
                              `Institution ${app.institutionId.substring(
                                0,
                                8
                              )}`;

                            return (
                              <div
                                key={app.applicationId}
                                className={`
                                  p-3 rounded-md flex justify-between items-center
                                  ${
                                    app.status === "APPROVED"
                                      ? "bg-green-50 border border-green-100"
                                      : ""
                                  }
                                  ${
                                    app.status === "PENDING"
                                      ? "bg-yellow-50 border border-yellow-100"
                                      : ""
                                  }
                                  ${
                                    app.status === "REJECTED"
                                      ? "bg-red-50 border border-red-100"
                                      : ""
                                  }
                                  ${
                                    app.status === "WITHDRAWN"
                                      ? "bg-gray-50 border border-gray-200"
                                      : ""
                                  }
                                  ${
                                    app.status === "CONFIRMED"
                                      ? "bg-blue-50 border border-blue-100"
                                      : ""
                                  }
                                  ${
                                    app.status === "COMPLETED"
                                      ? "bg-purple-50 border border-purple-100"
                                      : ""
                                  }
                                  ${
                                    !app.status
                                      ? "bg-gray-50 border border-gray-100"
                                      : ""
                                  }
                                `}
                              >
                                <div className="flex items-center">
                                  <div className="mr-3">
                                    {getStatusIcon(app.status)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800">
                                      {institutionName}
                                    </h4>
                                    <div className="text-xs text-gray-500 flex items-center">
                                      <span>
                                        Program:{" "}
                                        {app.programDetails?.program ||
                                          "General"}
                                      </span>
                                      <span className="mx-2">•</span>
                                      <span>
                                        Year: {app.programDetails?.year}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`
                                      text-xs font-medium px-2 py-1 rounded-full
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
                                      ${
                                        !app.status
                                          ? "bg-gray-100 text-gray-800"
                                          : ""
                                      }
                                    `}
                                  >
                                    {app.status || "UNKNOWN"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/institution-details/${app.institutionId}`
                                      )
                                    }
                                    className="ml-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {/* Show a view all link if there are many applications */}
                          {studentApplications.length > 3 && (
                            <button
                              onClick={() => navigate("/my-applications")}
                              className="text-center w-full py-2 text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              View All Applications
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                          <p className="text-gray-600 mb-3">
                            You haven't applied to any institutions yet.
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/apply-to-institution")}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Apply to an Institution
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : isRegisteredInstitution ? (
                // Institution-specific content
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold flex items-center">
                        <Building className="mr-2" size={24} />
                        {currentInstitution?.name || "Institution Dashboard"}
                      </h1>
                      <p className="text-slate-600 mt-1">
                        {currentInstitution?.status === "INACTIVE"
                          ? "Your institution record was deactivated or removed"
                          : "Manage your institution and credentials"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                      <h3 className="text-lg font-medium mb-2 text-purple-800">
                        Quick Overview
                      </h3>
                      {currentInstitution?.status === "INACTIVE" ? (
                        <p className="text-red-600">
                          Your institution record appears to have been deleted
                          or deactivated. If this was not intentional, please
                          contact support.
                        </p>
                      ) : (
                        <p className="text-slate-700">
                          Your institution is{" "}
                          {currentInstitution?.status || "pending verification"}
                          .
                        </p>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          navigate(
                            `/institution/${
                              currentInstitution?.institutionId || "dashboard"
                            }`
                          )
                        }
                        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
                      >
                        {currentInstitution?.status === "INACTIVE"
                          ? "Register New Institution"
                          : "Go to Dashboard"}
                        <ArrowRight size={16} className="ml-2" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                // Content for users who are neither students nor institutions
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">Welcome to IDEMY!</h1>
                      <p className="text-slate-600 mt-1">
                        Get started with your blockchain-verified digital
                        identity
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
                    <div className="flex items-start">
                      <Info className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-blue-800">
                          Complete your registration
                        </h3>
                        <p className="mt-1 text-sm text-blue-700">
                          To create and manage digital IDs, you need to register
                          as either a student or an institution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-5 rounded-lg">
                      <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        <BookOpenCheck size={24} />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Register as Student
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        Create your student profile to get a blockchain-verified
                        digital ID card for your academic credentials.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/create-student")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        Register Now
                        <ArrowRight size={16} className="ml-2" />
                      </motion.button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-5 rounded-lg">
                      <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        <Building size={24} />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Register as Institution
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        Establish your institution's profile to issue and verify
                        digital credentials for your students.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/create-institution")}
                        className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-900 transition-colors flex items-center"
                      >
                        Register an Institution
                        <ArrowRight size={16} className="ml-2" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Feature menu is displayed for all authenticated users */}
            <FeatureMenu
              title="Features"
              features={homeFeatures}
              className="mb-6"
            />
          </>
        ) : (
          // Not logged in view
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg p-6"
          >
            {/* Your existing not-logged-in UI */}
            <h1 className="text-2xl font-bold mb-4">Welcome to IDEMY</h1>
            <p className="text-slate-600 mb-6">
              The blockchain-powered platform for secure digital identity and
              credentials.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 transition-colors"
              >
                Register
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;
