import React from "react";
import { motion } from "framer-motion";

const ApplyToInstitutionHeader = ({ navigate, itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="mb-6">
      <button
        onClick={() => navigate("/")}
        className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
      >
        &larr; Back to Home
      </button>

      <h1 className="text-3xl font-bold">Apply to Institutions</h1>
      <p className="text-gray-600 mt-2">
        Apply to verified institutions with your blockchain-secured digital ID
      </p>
    </motion.div>
  );
};

export default ApplyToInstitutionHeader;
