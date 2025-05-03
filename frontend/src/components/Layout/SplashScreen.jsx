import React from "react";
import { motion } from "framer-motion";

const SplashScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-violet-600">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="text-white text-3xl font-bold"
    >
      IDEMY
    </motion.div>
  </div>
);

export default SplashScreen;
