import React from "react";
import { Clock } from "lucide-react";

const BlockchainMetadataLoading = () => {
  return (
    <div className="flex justify-center p-8">
      <Clock className="animate-spin h-8 w-8 text-indigo-600" />
    </div>
  );
};

export default BlockchainMetadataLoading;
