import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
  Award,
  Shield,
  Eye,
  Plus,
  RefreshCcw,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNft } from "../hooks/useNft";
import StudentInfo from '../components/StudentInfo';

// Animation variants remain unchanged
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
  const { isAuthenticated, currentUser, loading: authLoading, profileLoaded } = useAuth();
  const { 
    userNfts, 
    loading: nftLoading, 
    error, 
    clearError, 
    fetchUserNfts, 
    verifyUserNft 
  } = useNft();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  
  // Force refresh NFTs when profile is loaded
  useEffect(() => {
    if (isAuthenticated && currentUser && profileLoaded) {
      console.log("Profile loaded in HomePage, fetching NFTs");
      fetchUserNfts(true); // Force fetch
    }
  }, [isAuthenticated, currentUser, profileLoaded, fetchUserNfts]);

  // Combined loading state - consider profile loading too
  const isLoading = authLoading || nftLoading || (isAuthenticated && !profileLoaded);

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
        message: err.message || "Verification failed"
      });
    } finally {
      setVerifying(null);
    }
  };

  // Render appropriate error message based on error type
  const renderError = () => {
    if (!error) return null;
    
    // Different error components based on type
    const errorComponents = {
      'not_student': {
        icon: <AlertTriangle size={24} className="text-amber-500" />,
        title: 'Student Registration Required',
        message: 'You need to be registered as a student to create and view NFTs.',
        action: (
          <button
            onClick={() => navigate('/create-student')}  // Make sure this links to the new page
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Register as Student
          </button>
        )
      },
      'network': {
        icon: <AlertCircle size={24} className="text-amber-500" />,
        title: 'Connection Error',
        message: 'Unable to connect to the NFT service. Please check your internet connection.'
      },
      'data': {
        icon: <AlertCircle size={24} className="text-red-500" />,
        title: 'Data Error',
        message: error.message || 'Unable to load your NFTs.'
      },
      'unknown': {
        icon: <AlertCircle size={24} className="text-red-500" />,
        title: 'Unknown Error',
        message: 'An unexpected error occurred.'
      }
    };
    
    // Default to unknown if type not recognized
    const errorInfo = errorComponents[error.type] || errorComponents.unknown;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 my-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {errorInfo.icon}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-gray-800">{errorInfo.title}</h3>
            <p className="text-gray-600 mt-1">{errorInfo.message}</p>
            <div className="mt-3 flex space-x-2">
              {error.type !== 'not_student' && (
                <button
                  onClick={() => fetchUserNfts()}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md flex items-center text-sm hover:bg-indigo-200 transition-colors"
                >
                  <RefreshCcw size={16} className="mr-1.5" />
                  Retry
                </button>
              )}
              <button
                onClick={clearError}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Dismiss
              </button>
              {errorInfo.action}
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCcw className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
            <p className="text-slate-600">Loading your profile data...</p>
          </div>
        ) : isAuthenticated ? (
          <>
            <motion.div
              variants={itemVariants}
              className="bg-white shadow-md rounded-lg p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 text-green-600">
                  <CheckCircle size={24} />
                  <h1 className="text-2xl font-bold">Welcome!</h1>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/create-id")}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={18} className="mr-1" />
                  {userNfts && userNfts.length > 0 ? "Update ID" : "Create New ID"}
                </motion.button>
              </div>
              <p className="text-slate-600 mb-4">
                Welcome back, {currentUser?.displayName || currentUser?.email}!
              </p>

              {/* Add student info component */}
              {isAuthenticated && <StudentInfo currentUser={currentUser} />}

              {/* Display any errors */}
              {renderError()}
              
              {/* Display NFTs section */}
              <div className="border-t pt-4 mt-4">
                <h2 className="font-semibold text-lg mb-2">Your Digital ID Cards</h2>
                
                {nftLoading ? ( // Change from loading to nftLoading
                  <div className="flex flex-col items-center justify-center py-8">
                    <RefreshCcw className="animate-spin h-8 w-8 text-indigo-600 mb-3" />
                    <p className="text-slate-500">Loading your ID cards...</p>
                  </div>
                ) : (!error && userNfts && userNfts.length > 0) ? (
                  <div className="space-y-4">
                    {userNfts.map((nft) => (
                      <motion.div
                        key={nft.tokenId}
                        variants={itemVariants}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg flex items-center">
                              <Award
                                size={18}
                                className="text-indigo-600 mr-2"
                              />
                              ID Card #{nft.tokenId}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              Minted on{" "}
                              {new Date(nft.mintedAt).toLocaleDateString()}
                            </p>
                            <div className="mt-2">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  nft.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : nft.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {nft.status}
                              </span>
                            </div>
                            
                            {/* Show verification error if any */}
                            {verificationError && verificationError.tokenId === nft.tokenId && (
                              <div className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {verificationError.message}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVerifyNft(nft.tokenId)}
                              disabled={verifying === nft.tokenId}
                              className={`p-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors flex items-center ${
                                verifying === nft.tokenId
                                  ? "opacity-75 cursor-wait"
                                  : ""
                              }`}
                            >
                              {verifying === nft.tokenId ? (
                                <RefreshCcw
                                  size={16}
                                  className="animate-spin mr-1"
                                />
                              ) : (
                                <Shield size={16} className="mr-1" />
                              )}
                              Verify
                            </button>
                            <button
                              onClick={() => navigate(`/nft/${nft.tokenId}`)}
                              className="p-2 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors flex items-center"
                            >
                              <Eye size={16} className="mr-1" />
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : !error ? (
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
                      <Plus size={18} className="mr-2" />
                      Create Your Digital ID
                    </motion.button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        ) : (
          // Not logged in view remains unchanged
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg p-6"
          >
            {/* Your existing not-logged-in UI */}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;
