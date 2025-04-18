import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNft } from "../hooks/useNft";
import { User, Eye, Database, ChevronRight, Shield, FileText } from "lucide-react";
import StudentInfo from "../components/StudentInfo";
import LoadingState from "../components/home/LoadingState";
import WelcomeHeader from "../components/home/WelcomeHeader";
import ErrorDisplay from "../components/home/ErrorDisplay";
import NftCard from "../components/home/NftCard";
import FeatureMenu from "../components/UI/FeatureMenu";

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
  const isLoading = authLoading || (isAuthenticated && !profileLoaded);

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
    
    return userNfts
      .sort((a, b) => new Date(b.mintedAt) - new Date(a.mintedAt))
      .find(nft => nft.isLatestVersion === true) || userNfts[0];
  };

  // Get latest NFT ID
  const getLatestNftId = () => {
    const latestNft = getLatestNft();
    return latestNft ? latestNft.tokenId : null;
  };

  const latestNft = getLatestNft();
  
  // Define features for the FeatureMenu component
  const homeFeatures = [
    {
      icon: <Eye size={20} className="text-white" />,
      title: "View Your NFT ID",
      description: "Access and manage your digital ID cards secured by blockchain",
      path: userNfts && userNfts.length > 0 ? `/nft/${getLatestNftId()}` : '/create-id',
      bgColorClass: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColorClass: "border border-indigo-200",
      iconBgClass: "bg-indigo-600",
      arrowColorClass: "text-indigo-600"
    },
    // {
    //   icon: <Database size={20} className="text-white" />,
    //   title: "Your Blockchain",
    //   description: "Explore blockchain technology securing your digital identity",
    //   path: '/blockchain',
    //   bgColorClass: "bg-gradient-to-br from-purple-50 to-purple-100",
    //   borderColorClass: "border border-purple-200",
    //   iconBgClass: "bg-purple-600",
    //   arrowColorClass: "text-purple-600"
    // },
    {
      title: "Learn",
      icon: <Shield size={20} className="text-white" />,
      description: "Learn how blockchain technology secures your digital identity",
      path: '/learn/blockchain', 
      bgColorClass: "bg-gradient-to-br from-green-50 to-green-100",
      borderColorClass: "border border-green-200",
      iconBgClass: "bg-green-600",
      arrowColorClass: "text-green-600"
    },
    {
      icon: <FileText size={20} className="text-white" />,
      title: "Your Blockchain Data",
      description: "View your complete digital identity history on the blockchain",
      path: '/blockchain-data',
      bgColorClass: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColorClass: "border border-amber-200",
      iconBgClass: "bg-amber-600",
      arrowColorClass: "text-amber-600"
    },
    {
      icon: <User size={20} className="text-white" />,
      title: "Your Profile Data",
      description: "View your blockchain-verified personal information",
      path: '/profile-data',
      bgColorClass: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      borderColorClass: "border border-cyan-200",
      iconBgClass: "bg-cyan-600",
      arrowColorClass: "text-cyan-600"
    }
  ];

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
              <WelcomeHeader
                currentUser={currentUser}
                hasNfts={userNfts && userNfts.length > 0}
                latestNftId={getLatestNftId()}
              />

              <p className="text-slate-600 mb-4">
                Welcome back, {currentUser?.displayName || currentUser?.email}!
              </p>

              {/* Student info component */}
              {isAuthenticated && <StudentInfo currentUser={currentUser} />}

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
                    <h2 className="font-semibold text-lg">Your Latest ID Card</h2>
                    {userNfts && userNfts.length > 1 && (
                      <button 
                        onClick={() => navigate(`/nft/${getLatestNftId()}`)}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View All Cards <ChevronRight size={16} className="ml-1" />
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
            </motion.div>

            {/* Use the new FeatureMenu component */}
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
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;
