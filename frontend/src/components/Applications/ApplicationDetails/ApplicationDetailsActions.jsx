import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const ApplicationDetailsActions = ({
  handleApprove,
  handleReject,
  processingAction,
  itemVariants,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white shadow-md rounded-lg overflow-hidden"
    >
      <div className="border-b px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-semibold">Actions</h2>
      </div>

      <div className="p-6">
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleApprove}
            disabled={processingAction}
            className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center disabled:opacity-70"
          >
            {processingAction ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2" size={18} />
                Approve Application
              </>
            )}
          </button>

          <button
            onClick={handleReject}
            disabled={processingAction}
            className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center disabled:opacity-70"
          >
            {processingAction ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <X className="mr-2" size={18} />
                Reject Application
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsActions;
