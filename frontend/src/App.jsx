import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Header from "./components/Layout/Header";
import { AuthProvider } from "./context/AuthContext";
import { NftProvider } from "./context/NftContext";
import NftDetailsPage from "./pages/NftDetailsPage";
import CreateIdPage from "./pages/CreateIdPage";
import StudentRegistrationPage from "./pages/StudentRegistrationPage";
import { useAuth } from "./hooks/useAuth";

// 1. Create a splash screen component
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

// 2. Create a separate component for the routes that uses useAuth
const AppRoutes = () => {
  // Now useAuth is used inside the AuthProvider context
  const { isAuthenticated, isStudent } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/nft/:tokenId" element={<NftDetailsPage />} />

      {/* Protected routes */}
      <Route
        path="/create-id"
        element={
          isAuthenticated && isStudent ? (
            <CreateIdPage />
          ) : (
            <Navigate to="/create-student" replace />
          )
        }
      />

      <Route
        path="/create-student"
        element={
          isAuthenticated && isStudent ? (
            <Navigate to="/create-id" replace />
          ) : (
            <StudentRegistrationPage />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// 3. Main App component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <NftProvider>
        <Router>
          <div className="min-h-screen bg-slate-50">
            <Header />
            <main>
              <AnimatePresence mode="wait">
                <AppRoutes />
              </AnimatePresence>
            </main>
          </div>
        </Router>
      </NftProvider>
    </AuthProvider>
  );
}

export default App;
