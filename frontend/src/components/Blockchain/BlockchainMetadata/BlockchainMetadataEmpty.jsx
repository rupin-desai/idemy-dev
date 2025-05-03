import React from "react";
import { Info } from "lucide-react";

const BlockchainMetadataEmpty = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-4 rounded-lg flex items-center justify-center">
      <Info className="h-5 w-5 mr-2" />
      <p>No blockchain metadata found for your account</p>
    </div>
  );
};

export default BlockchainMetadataEmpty;
