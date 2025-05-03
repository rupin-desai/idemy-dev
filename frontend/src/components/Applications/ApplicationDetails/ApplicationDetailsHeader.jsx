import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

const ApplicationDetailsHeader = ({ navigate, status, itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="mb-6">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-3" size={28} />
          Application Details
        </h1>

        <div
          className={`px-4 py-2 rounded-md ${status.bgColor} ${status.textColor} flex items-center`}
        >
          {status.icon}
          <span>{status.text}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsHeader;