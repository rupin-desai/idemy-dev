import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplicationDetailsNftInfo = ({ nftData, itemVariants }) => {
  const navigate = useNavigate();

  if (!nftData) return null;

  return (
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
            <p className="font-medium font-mono text-sm">{nftData.tokenId}</p>
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
  );
};

export default ApplicationDetailsNftInfo;
