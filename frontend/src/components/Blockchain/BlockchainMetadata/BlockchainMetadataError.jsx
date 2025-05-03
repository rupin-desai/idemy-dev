import React from "react";
import { AlertCircle } from "lucide-react";

const BlockchainMetadataError = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg flex items-start">
      <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
      <div>
        <p className="font-medium">Error loading metadata</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    </div>
  );
};

export default BlockchainMetadataError;
