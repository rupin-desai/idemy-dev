import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const ApplyToInstitutionError = ({ error, itemVariants }) => {
  if (!error) return null;
  
  return (
    <motion.div
      variants={itemVariants}
      className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
    >
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
    </motion.div>
  );
};

export default ApplyToInstitutionError;