// src/pages/NFTListPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNFTs } from "../hooks/useNFTs";
import { Shield, RefreshCw, AlertCircle, Eye, CheckCircle } from "lucide-react";
import { pageVariants, cardVariants, tableRowVariants, iconSizes } from "../utils/animations";
import Button from "../components/UI/Button";
import Alert from "../components/UI/Alert";

const NFTListPage = () => {
  const { nfts, loading, error, fetchAllNFTs } = useNFTs();

  useEffect(() => {
    fetchAllNFTs();
  }, [fetchAllNFTs]);

  if (loading && nfts.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={iconSizes.lg} />
        <span className="text-lg">Loading NFTs data...</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Shield size={iconSizes.lg} className="mr-3 text-blue-600" />
          NFT Management
          {/* <img src="/logo_icon_blue.png" alt="IDEMY" className="h-8 ml-3" /> */}
        </h1>
        <Button
          onClick={fetchAllNFTs}
          color="primary"
          icon={<RefreshCw size={iconSizes.sm} />}
        >
          Refresh NFTs
        </Button>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => {}} 
          show={true}
          details={
            <button
              className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              onClick={fetchAllNFTs}
            >
              Retry
            </button>
          }
        />
      )}

      <motion.div 
        className="bg-white shadow-md rounded-lg overflow-hidden"
        variants={cardVariants}
      >
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">All NFTs ({nfts.length})</h2>
        </div>

        {nfts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nfts.map((nft) => (
                  <motion.tr 
                    key={nft.tokenId}
                    className="hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {nft.tokenId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/students/${nft.studentId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {nft.studentId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {nft.ownerAddress.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(nft.mintedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          nft.status === "MINTED"
                            ? "bg-green-100 text-green-800"
                            : nft.status === "TRANSFERRED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {nft.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/nfts/${nft.tokenId}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye size={iconSizes.sm} className="mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/nfts/${nft.tokenId}/verify`}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <CheckCircle size={iconSizes.sm} className="mr-1" />
                          Verify
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-gray-500 flex items-center justify-center">
            <AlertCircle size={iconSizes.md} className="mr-2 text-gray-400" />
            No NFTs found
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NFTListPage;
