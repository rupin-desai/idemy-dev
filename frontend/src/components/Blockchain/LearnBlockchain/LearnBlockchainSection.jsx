import React from "react";
import { motion } from "framer-motion";

const LearnBlockchainSection = ({ title, children, variants }) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
    >
      <div className="p-6">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <div className="space-y-6">{children}</div>
      </div>
    </motion.div>
  );
};

export default LearnBlockchainSection;
