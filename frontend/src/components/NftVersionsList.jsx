import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Eye, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NftVersionsList = ({ versions, currentTokenId }) => {
  const navigate = useNavigate();

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-4">
        <AlertCircle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
        <p className="text-gray-600">No version history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        Version History
      </h3>

      {versions.map((version) => (
        <motion.div
          key={version.tokenId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 border rounded-lg flex items-center justify-between ${
            version.tokenId === currentTokenId
              ? "border-indigo-300 bg-indigo-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center">
            {version.isLatestVersion ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
            )}
            <div>
              <p className="font-medium">
                Version {version.version}
                {version.isLatestVersion && (
                  <span className="text-xs text-green-600 ml-2 font-normal">
                    Latest
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(version.mintedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/nft/${version.tokenId}`)}
            className="p-2 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors flex items-center"
          >
            <Eye size={16} className="mr-1" />
            View
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default NftVersionsList;
