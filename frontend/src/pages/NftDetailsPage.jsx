// src/pages/NftDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Award, RefreshCcw, Share2 } from "lucide-react";
import { useNft } from "../hooks/useNft";
import { useAuth } from "../hooks/useAuth";

const NftDetailsPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { getNftDetails, verifyUserNft, transferUserNft } = useNft();
  const { isAuthenticated } = useAuth();
  
  const [nftDetails, setNftDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [recipientId, setRecipientId] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadNftDetails = async () => {
      setLoading(true);
      try {
        const response = await getNftDetails(tokenId);
        setNftDetails(response.nft);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load NFT details');
      } finally {
        setLoading(false);
      }
    };
    
    loadNftDetails();
  }, [tokenId, getNftDetails, isAuthenticated, navigate]);
  
  const handleVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyUserNft(tokenId);
      setVerificationResult(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };
  
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipientId.trim()) {
      setError('Recipient ID is required');
      return;
    }
    
    try {
      await transferUserNft(tokenId, recipientId);
      setShowTransfer(false);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin h-8 w-8 text-indigo-600">
          <RefreshCcw size={32} />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-3 text-indigo-600 flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  if (!nftDetails) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">NFT not found</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-3 text-indigo-600 flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-5 text-indigo-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </button>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Award size={24} className="mr-2" />
              Digital ID NFT #{tokenId}
            </h1>
            <p className="opacity-80 mt-1">
              Blockchain-secured digital identification
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-500">Token ID</p>
                <p className="font-medium">{nftDetails.tokenId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  nftDetails.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                  nftDetails.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {nftDetails.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Minted On</p>
                <p className="font-medium">{new Date(nftDetails.mintedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Student ID</p>
                <p className="font-medium">{nftDetails.studentId}</p>
              </div>
            </div>
            
            {/* Blockchain details */}
            <div className="bg-slate-50 p-4 rounded-md mb-6">
              <h2 className="font-medium mb-2">Blockchain Details</h2>
              <div className="text-sm">
                <p><span className="text-slate-500">Transaction Hash:</span> {nftDetails.transactionHash}</p>
                <p className="mt-1"><span className="text-slate-500">Block Number:</span> {nftDetails.blockNumber}</p>
              </div>
            </div>
            
            {/* Verification results */}
            {verificationResult && (
              <div className={`p-4 rounded-md mb-6 ${
                verificationResult.isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <h2 className="font-medium mb-2">Verification Results</h2>
                <p>{verificationResult.isValid ? 'This NFT is valid and authentic' : 'Invalid NFT'}</p>
                {verificationResult.details && (
                  <p className="mt-2 text-sm">{verificationResult.details}</p>
                )}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center"
              >
                <Shield size={18} className="mr-2" />
                {verifying ? 'Verifying...' : 'Verify Authenticity'}
              </button>
              
              <button
                onClick={() => setShowTransfer(!showTransfer)}
                className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition-colors flex items-center"
              >
                <Share2 size={18} className="mr-2" />
                Transfer Ownership
              </button>
            </div>
            
            {/* Transfer form */}
            {showTransfer && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleTransfer}
                className="mt-6 border-t pt-4"
              >
                <h2 className="font-medium mb-2">Transfer Ownership</h2>
                <div className="mb-4">
                  <label htmlFor="recipientId" className="block text-sm font-medium text-slate-700 mb-1">
                    Recipient Student ID
                  </label>
                  <input
                    type="text"
                    id="recipientId"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Confirm Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransfer(false)}
                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NftDetailsPage;