import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearnBlockchainHeader = ({ sectionVariants }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="mb-5 text-indigo-600 flex items-center"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Home
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold flex items-center">
            <Database size={28} className="mr-3" />
            Blockchain Technology Explained
          </h1>
          <p className="text-xl opacity-90 mt-3">
            Understanding the power behind your secure digital identity
          </p>
        </div>

        <div className="p-6">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="prose max-w-none"
          >
            <p className="text-lg">
              At IDEMY, we leverage blockchain technology to create secure,
              verifiable digital identities and credentials that you can trust.
              This page explains what blockchain is and why it's revolutionizing
              digital identity management.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LearnBlockchainHeader;
