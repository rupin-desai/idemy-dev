import { motion } from "framer-motion";
import { Award, Shield, Eye, RefreshCcw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NftCard = ({ nft, handleVerify, verifying, verificationError }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg flex items-center">
            <Award size={18} className="text-indigo-600 mr-2" />
            ID Card #{nft.tokenId}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Minted on {new Date(nft.mintedAt).toLocaleDateString()}
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
            onClick={() => handleVerify(nft.tokenId)}
            disabled={verifying === nft.tokenId}
            className={`p-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors flex items-center ${
              verifying === nft.tokenId
                ? "opacity-75 cursor-wait"
                : ""
            }`}
          >
            {verifying === nft.tokenId ? (
              <RefreshCcw size={16} className="animate-spin mr-1" />
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
  );
};

export default NftCard;