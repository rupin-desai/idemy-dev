import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UpdateNftPage from "./pages/UpdateNftPage";
import Header from "./components/Layout/Header";
import { AuthProvider } from "./context/AuthContext";
import { NftProvider } from "./context/NftContext";
import NftDetailsPage from "./pages/NftDetailsPage";
import CreateIdPage from "./pages/CreateIdPage";
import StudentRegistrationPage from "./pages/StudentRegistrationPage";
import { useAuth } from "./hooks/useAuth";
import { useNft } from "./hooks/useNft";
import BlockchainPage from "./pages/BlockchainPage";
import LearnBlockchainPage from "./pages/LearnBlockchainPage";
import BlockchainMetadataPage from "./pages/BlockchainMetadataPage";
import UserMetadataPage from "./pages/UserMetadataPage";
// Add the import for InstitutionRegistrationPage
import InstitutionRegistrationPage from "./pages/InstitutionRegistrationPage";
import InstitutionDashboardPage from "./pages/InstitutionDashboardPage";
// Add import for the new context provider
import { InstitutionProvider } from "./context/InstitutionContext";

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
  const { 
    isAuthenticated, 
    currentUser, 
    isStudent, 
    loading: authLoading, 
    profileLoaded 
  } = useAuth();
  const { fetchUserNfts } = useNft();
  
  // Wait for auth to be fully checked and profile loaded
  const isLoading = authLoading || (isAuthenticated && !profileLoaded);
  
  // Force refresh data when auth state is ready
  useEffect(() => {
    if (isAuthenticated && profileLoaded && currentUser) {
      fetchUserNfts(true); // Always force fetch on route change
    }
  }, [isAuthenticated, profileLoaded, currentUser, fetchUserNfts]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2">Loading your profile...</span>
      </div>
    );
  }

  // Additional check for student status
  const checkStudentStatus = () => {
    if (!isAuthenticated) return false;

    // Check for student ID in current user
    if (currentUser?.student?.studentId) return true;

    // Check for student role
    if (currentUser?.role === "student") return true;

    return false;
  };

  const userIsStudent = isStudent || checkStudentStatus();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/nft/:tokenId"
        element={
          isAuthenticated ? (
            <NftDetailsPage />
          ) : (
            <Navigate to="/login" state={{ from: window.location.pathname }} />
          )
        }
      />
      <Route path="/update-nft/:tokenId" element={<UpdateNftPage />} />

      {/* Protected routes */}
      <Route
        path="/create-id"
        element={
          isAuthenticated ? (
            userIsStudent ? (
              <CreateIdPage />
            ) : (
              <Navigate to="/create-student" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/create-student"
        element={
          isAuthenticated ? (
            userIsStudent ? (
              <Navigate to="/create-id" replace />
            ) : (
              <StudentRegistrationPage />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/blockchain"
        element={
          isAuthenticated ? (
            <BlockchainPage />
          ) : (
            <Navigate to="/login" state={{ from: "/blockchain" }} />
          )
        }
      />

      <Route path="/learn/blockchain" element={<LearnBlockchainPage />} />
      {/* Add this route inside your Routes component */}
      <Route path="/blockchain-data" element={<BlockchainMetadataPage />} />
      <Route path="/profile-data" element={<UserMetadataPage />} />
      <Route
        path="/create-institution"
        element={
          isAuthenticated ? (
            <InstitutionRegistrationPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/institution/:institutionId"
        element={
          isAuthenticated ? (
            <InstitutionDashboardPage />
          ) : (
            <Navigate to="/login" replace />
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
        {/* Wrap with the new InstitutionProvider */}
        <InstitutionProvider>
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
        </InstitutionProvider>
      </NftProvider>
    </AuthProvider>
  );
}

export default App;
