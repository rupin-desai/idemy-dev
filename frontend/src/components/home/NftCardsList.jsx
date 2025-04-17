import { RefreshCcw, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NftCard from "./NftCard";

const NftCardsList = ({ 
  nfts, 
  loading, 
  error, 
  handleVerify, 
  verifying, 
  verificationError 
}) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <RefreshCcw className="animate-spin h-8 w-8 text-indigo-600 mb-3" />
        <p className="text-slate-500">Loading your ID cards...</p>
      </div>
    );
  }
  
  if (!error && (!nfts || nfts.length === 0)) {
    return (
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
    );
  }
  
  return (
    <div className="space-y-4">
      {nfts.map((nft) => (
        <NftCard
          key={nft.tokenId}
          nft={nft}
          handleVerify={handleVerify}
          verifying={verifying}
          verificationError={verificationError}
        />
      ))}
    </div>
  );
};

export default NftCardsList;