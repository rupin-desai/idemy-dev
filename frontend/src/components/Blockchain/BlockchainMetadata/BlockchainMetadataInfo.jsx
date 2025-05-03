import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

const BlockchainMetadataInfo = () => {
  return (
    <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-start">
        <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
        <div>
          <h3 className="font-medium text-gray-700">
            Understanding Your Blockchain Data
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            This page shows all your activities recorded on the IDEMY
            blockchain. Each record represents a transaction that created,
            updated, or verified your digital identity information. These
            records are immutable and cryptographically secure, ensuring your
            digital identity remains tamper-proof.
          </p>
          <Link
            to="/learn/blockchain"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-2 text-sm"
          >
            Learn more about blockchain technology
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlockchainMetadataInfo;
