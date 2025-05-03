import React from "react";
import { motion } from "framer-motion";
import { Shield, Info } from "lucide-react";

const ApplicationDetailsBlockchainVerification = ({
  application,
  handleVerifyOnBlockchain,
  processingAction,
  itemVariants
}) => {
  // Pending blockchain verification
  if (application.status === "APPROVED" && !application.transactionId) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="border-b px-6 py-4 bg-gray-50">
          <h2 className="text-xl font-semibold">Blockchain Verification</h2>
        </div>

        <div className="p-6">
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <div className="flex items-center">
              <Info className="text-yellow-600 mr-2" size={18} />
              <p className="text-yellow-700">
                The application has been approved but not yet verified on
                the blockchain.
              </p>
            </div>
          </div>

          <button
            onClick={handleVerifyOnBlockchain}
            disabled={processingAction}
            className="px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center w-full disabled:opacity-70"
          >
            {processingAction ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Shield className="mr-2" size={18} />
                Verify on Blockchain
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // Already verified on blockchain
  if (application.status === "APPROVED" && application.transactionId) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="border-b px-6 py-4 bg-gray-50">
          <h2 className="text-xl font-semibold">Blockchain Verification</h2>
        </div>

        <div className="p-6">
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center">
              <Shield className="text-green-600 mr-2" size={18} />
              <p className="text-green-700">
                This application has been verified on the blockchain.
              </p>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
              <p className="bg-white p-2 rounded border border-green-100 font-mono text-xs break-all">
                {application.transactionId}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default ApplicationDetailsBlockchainVerification;