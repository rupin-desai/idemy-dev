import { motion } from "framer-motion";
import { CheckCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WelcomeHeader = ({ currentUser, hasNfts }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3 text-green-600">
        <CheckCircle size={24} />
        <h1 className="text-2xl font-bold">Welcome!</h1>
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/create-id")}
        className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        <Plus size={18} className="mr-1" />
        {hasNfts ? "Update ID" : "Create New ID"}
      </motion.button>
    </div>
  );
};

export default WelcomeHeader;
