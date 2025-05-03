import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const ApplyToInstitutionEmpty = ({ itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center"
    >
      <Info className="h-10 w-10 text-blue-500 mx-auto mb-3" />
      <h2 className="text-xl font-semibold text-blue-800">
        No Institutions Available
      </h2>
      <p className="text-blue-600">
        There are no verified institutions available for application at the
        moment.
      </p>
    </motion.div>
  );
};

export default ApplyToInstitutionEmpty;
