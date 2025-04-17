import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader,
  Download,
} from "lucide-react";
import { useNft } from "../hooks/useNft";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const NftDetailsPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { verifyUserNft } = useNft();
  const { isAuthenticated, loading: authLoading, currentUser } = useAuth();

  const [nft, setNft] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Direct API call to avoid state conflicts
  const fetchNftDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/nft/${id}`);
      console.log("NFT Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching NFT:", error);
      throw error;
    }
  };

  // Fetch NFT metadata to get the image URL
  const fetchNftMetadata = async (metadataUri) => {
    if (!metadataUri) return null;

    try {
      setImageLoading(true);
      const url = `http://localhost:3000${metadataUri}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  // Get student data if available
  const fetchStudentData = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/students/${studentId}`
      );
      console.log("Student Response:", response.data);
      return response.data.student;
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!isAuthenticated && !authLoading) {
        navigate("/login", { state: { from: `/nft/${tokenId}` } });
        return;
      }

      if (!isAuthenticated || authLoading) {
        return; // Wait for auth to complete
      }

      try {
        setLoading(true);
        setError(null);

        // Direct API call
        const result = await fetchNftDetails(tokenId);

        if (!result || !result.success) {
          throw new Error("Failed to load NFT data");
        }

        let student = null;
        if (result.nft?.studentId) {
          student = await fetchStudentData(result.nft.studentId);
        }

        // Fetch metadata to get the image URL
        const nftMetadata = await fetchNftMetadata(result.nft.metadataUri);

        if (mounted) {
          setNft(result.nft);
          setStudentData(student);
          setMetadata(nftMetadata);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in loadData:", err);
        if (mounted) {
          setError(err.message || "Failed to load NFT details");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [tokenId, navigate, isAuthenticated, authLoading]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const result = await verifyUserNft(tokenId);
      setVerificationResult(result);
    } catch (err) {
      setError(`Verification failed: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  // Function to get the full image URL - directly use the studentId endpoint
  const getImageUrl = () => {
    if (!nft || !nft.studentId) return null;
    
    // Always use the direct image endpoint with cache busting
    return `http://localhost:3000/api/nft/idcards/${nft.studentId}/image?v=${retryCount}`;
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2">Loading NFT details...</span>
      </div>
    );
  }

  // Prepare display data
  const getStudentName = () => {
    if (studentData?.firstName && studentData?.lastName) {
      return `${studentData.firstName} ${studentData.lastName}`;
    } else if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    } else if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    return "Unknown Student";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <button
        onClick={() => navigate("/")}
        className="mb-5 text-indigo-600 flex items-center"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Home
      </button>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg flex items-start">
          <AlertCircle className="mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Error Loading NFT</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : nft ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Digital ID Card NFT</h1>
            <p className="opacity-80">TokenID: {tokenId}</p>
          </div>

          <div className="p-6">
            {/* NFT ID Card Image */}
            {nft && (
              <div className="mb-6 flex flex-col items-center">
                <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 mb-3">
                  {imageLoading ? (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                      <Loader className="animate-spin h-8 w-8 text-indigo-600" />
                    </div>
                  ) : (
                    <img 
                      src={getImageUrl()} 
                      alt="Student ID Card" 
                      className="w-full max-w-md mx-auto"
                      onLoad={() => setImageLoading(false)}
                      onError={(e) => {
                        console.error("Failed to load image:", e);
                        setImageLoading(false);
                        // Increment retry count to trigger a URL change
                        setTimeout(() => setRetryCount(prev => prev + 1), 500);
                      }}
                    />
                  )}
                </div>
                <button
                  onClick={() => {
                    // Use the more reliable fetch and download method
                    fetch(getImageUrl())
                      .then(res => res.blob())
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ID_Card_${nft.studentId}.png`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();
                      })
                      .catch(err => console.error("Download failed:", err));
                  }}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Download ID Card
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Student Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{getStudentName()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium">{nft.studentId}</p>
                  </div>
                  {(studentData?.institution ||
                    currentUser?.student?.institution) && (
                    <div>
                      <p className="text-sm text-gray-500">Institution</p>
                      <p>
                        {studentData?.institution ||
                          currentUser?.student?.institution}
                      </p>
                    </div>
                  )}
                  {(studentData?.department ||
                    currentUser?.student?.department) && (
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p>
                        {studentData?.department ||
                          currentUser?.student?.department}
                      </p>
                    </div>
                  )}
                  {metadata && metadata.attributes && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Issue Date</p>
                        <p>
                          {new Date(
                            metadata.attributes.find(
                              (attr) => attr.trait_type === "Issue Date"
                            )?.value || ""
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expiry Date</p>
                        <p>
                          {new Date(
                            metadata.attributes.find(
                              (attr) => attr.trait_type === "Expiry Date"
                            )?.value || ""
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Blockchain Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Minted On</p>
                    <p>{new Date(nft.mintedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction Hash</p>
                    <p className="font-mono text-sm break-all">
                      {nft.mintTxHash}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner Address</p>
                    <p className="font-mono text-sm break-all">
                      {nft.ownerAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-600">{nft.status}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      verifying
                        ? "bg-gray-300 text-gray-600"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } transition-colors`}
                  >
                    {verifying ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield size={16} className="mr-2" />
                        Verify Authentication
                      </>
                    )}
                  </button>

                  {verificationResult && (
                    <div
                      className={`mt-3 p-3 rounded-md ${
                        verificationResult.valid
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <div className="flex items-center">
                        {verificationResult.valid ? (
                          <CheckCircle size={18} className="mr-2" />
                        ) : (
                          <AlertCircle size={18} className="mr-2" />
                        )}
                        <span>
                          {verificationResult.valid
                            ? "NFT verified! This is an authentic digital ID."
                            : "Verification failed. This NFT may not be authentic."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default NftDetailsPage;
