import React from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

const ApplicationDetailsActionMessage = ({ actionMessage, itemVariants }) => {
  if (!actionMessage) return null;

  return (
    <motion.div
      variants={itemVariants}
      className={`mb-6 p-4 rounded-md ${
        actionMessage.type === "success"
          ? "bg-green-50 text-green-800"
          : "bg-red-50 text-red-800"
      }`}
    >
      <div className="flex items-center">
        {actionMessage.type === "success" ? (
          <Check size={20} className="mr-2" />
        ) : (
          <AlertCircle size={20} className="mr-2" />
        )}
        <p>{actionMessage.text}</p>
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsActionMessage;
