import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const HomePage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This would be used when we implement real authentication
    // If we need to redirect non-authenticated users
    // if (!isAuthenticated) {
    //   navigate("/login");
    // }
  }, [isAuthenticated, navigate]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-3xl mx-auto">
        {isAuthenticated ? (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg p-6 mb-6"
          >
            <div className="flex items-center space-x-3 mb-4 text-green-600">
              <CheckCircle size={24} />
              <h1 className="text-2xl font-bold">Successfully Logged In!</h1>
            </div>
            <p className="text-slate-600 mb-4">
              Welcome back, {currentUser?.firstName || currentUser?.email}! You are now logged into your account.
            </p>
            <div className="border-t pt-4 mt-4">
              <h2 className="font-semibold text-lg mb-2">Your ID Cards</h2>
              <p className="text-slate-500 italic">No ID cards found. Create your first ID card to get started.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-md rounded-lg p-6 mb-6"
          >
            <div className="flex items-center space-x-3 mb-4 text-amber-600">
              <AlertCircle size={24} />
              <h1 className="text-2xl font-bold">Not Logged In</h1>
            </div>
            <p className="text-slate-600 mb-4">
              Please log in to access your ID cards and account features.
            </p>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-md transition-colors"
              >
                Register
              </motion.button>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">IDEMY Platform Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Blockchain ID Cards</h3>
              <p className="text-slate-600 text-sm">
                Secure and tamper-proof ID cards backed by blockchain technology.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">NFT Verification</h3>
              <p className="text-slate-600 text-sm">
                Verify the authenticity of your ID cards with NFT proofs.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Universal ID System</h3>
              <p className="text-slate-600 text-sm">
                One ID for multiple services and institutions.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Easy Transfers</h3>
              <p className="text-slate-600 text-sm">
                Transfer or share your ID securely with other institutions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;