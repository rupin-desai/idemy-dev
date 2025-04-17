import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useNft } from "../hooks/useNft";
import StudentInfo from "../components/StudentInfo";
import LoadingState from "../components/home/LoadingState";
import WelcomeHeader from "../components/home/WelcomeHeader";
import ErrorDisplay from "../components/home/ErrorDisplay";
import NftCardsList from "../components/home/NftCardsList";

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

  // Find the latest NFT (should be the one with the most recent mintedAt date)
  const getLatestNftId = () => {
    if (!userNfts || userNfts.length === 0) return null;
    
    // Sort NFTs by mintedAt (descending) and find the one marked as latest version
    const latestNft = userNfts
      .sort((a, b) => new Date(b.mintedAt) - new Date(a.mintedAt))
      .find(nft => nft.isLatestVersion === true) || userNfts[0];
    
    return latestNft.tokenId;
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
              <WelcomeHeader
                currentUser={currentUser}
                hasNfts={userNfts && userNfts.length > 0}
                latestNftId={getLatestNftId()}
              />

              <p className="text-slate-600 mb-4">
                Welcome back, {currentUser?.displayName || currentUser?.email}!
              </p>

              {/* Add student info component */}
              {isAuthenticated && <StudentInfo currentUser={currentUser} />}

              {/* Display any errors */}
              <ErrorDisplay
                error={error}
                clearError={clearError}
                fetchUserNfts={fetchUserNfts}
              />

              {/* Display NFTs section */}
              <div className="border-t pt-4 mt-4">
                <h2 className="font-semibold text-lg mb-2">
                  Your Digital ID Cards
                </h2>

                <NftCardsList
                  nfts={userNfts}
                  loading={nftLoading}
                  error={error}
                  handleVerify={handleVerifyNft}
                  verifying={verifying}
                  verificationError={verificationError}
                />
              </div>
            </motion.div>
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
