import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-bold text-2xl text-indigo-600"
            >
              IDEMY
            </motion.div>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-slate-600" />
                  <span className="text-slate-700">
                    {currentUser?.firstName || currentUser?.email}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-indigo-700 font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ translateY: -20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="md:hidden mt-4 py-4 border-t"
          >
            {isAuthenticated ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 px-2">
                  <User size={20} className="text-slate-600" />
                  <span className="text-slate-700">
                    {currentUser?.firstName || currentUser?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-1 w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link
                  to="/login"
                  className="block text-center text-slate-700 hover:bg-slate-100 font-medium px-4 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;