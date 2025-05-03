import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNft } from "../../hooks/useNft";
import ProtectedRoute from "./ProtectedRoute";

// Import components from pages using the barrel exports
import {
  HomePage,
  LoginPage,
  RegisterPage,
  UpdateNftPage,
  NftDetailsPage,
  CreateIdPage,
  StudentRegistrationPage,
  LearnBlockchainPage,
  BlockchainMetadataPage,
  UserMetadataPage,
  InstitutionRegistrationPage,
  InstitutionDashboardPage,
  ApplyToInstitutionPage,
  ApplicationDetailsPage,
  InstitutionDetailsPage,
} from "../../pages";

const AppRoutes = () => {
  const {
    isAuthenticated,
    currentUser,
    isStudent,
    loading: authLoading,
    profileLoaded,
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
  const userIsStudent =
    isStudent ||
    Boolean(currentUser?.student?.studentId) ||
    currentUser?.role === "student";

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/learn/blockchain" element={<LearnBlockchainPage />} />

      {/* Protected routes with different auth requirements */}
      <Route
        path="/nft/:tokenId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <NftDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/update-nft/:tokenId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UpdateNftPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-id"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isAuthorized={userIsStudent}
            redirectPath="/create-student"
          >
            <CreateIdPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-student"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isAuthorized={!userIsStudent}
            redirectPath="/create-id"
          >
            <StudentRegistrationPage />
          </ProtectedRoute>
        }
      />

      <Route path="/blockchain-data" element={<BlockchainMetadataPage />} />

      <Route path="/profile-data" element={<UserMetadataPage />} />

      <Route
        path="/create-institution"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InstitutionRegistrationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/institution/:institutionId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InstitutionDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply-to-institution"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isAuthorized={userIsStudent}
            redirectPath="/create-student"
          >
            <ApplyToInstitutionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/application/:applicationId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ApplicationDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/institution-details/:institutionId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InstitutionDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
