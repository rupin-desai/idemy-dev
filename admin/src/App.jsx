import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BlockchainProvider } from "./context/BlockchainContext";
import { TransactionProvider } from "./context/TransactionContext";
import { StudentProvider } from "./context/StudentContext";
import { NFTProvider } from "./context/NFTContext";
import { InstitutionProvider } from "./context/InstitutionContext";
import { ApplicationProvider } from "./context/ApplicationContext";
import { AuthProvider } from "./context/AuthContext"; 
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout/Layout";

// Import pages
import Dashboard from "./pages/Dashboard";
import BlockchainPage from "./pages/BlockchainPage";
import BlockDetailsPage from "./pages/BlockDetailsPage";
import TransactionsPage from "./pages/TransactionsPage";
import MinePage from "./pages/MinePage";
import StudentTransactionsPage from "./pages/StudentTransactionsPage";
import StudentsListPage from "./pages/StudentsListPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentCreatePage from "./pages/StudentCreatePage";
import StudentEditPage from "./pages/StudentEditPage";
import StudentHistoryPage from "./pages/StudentHistoryPage";
import NFTListPage from "./pages/NFTListPage";
import NFTDetailPage from "./pages/NFTDetailPage";
import StudentIDCardPage from "./pages/StudentIDCardPage";
import LoginPage from "./pages/LoginPage";
import InstitutionsListPage from "./pages/InstitutionsListPage";
import InstitutionDetailsPage from "./pages/InstitutionDetailsPage";
import InstitutionCreatePage from "./pages/InstitutionCreatePage";
import InstitutionEditPage from "./pages/InstitutionEditPage";
import ApplicationsListPage from "./pages/ApplicationsListPage";
import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Wrap routes with AnimatePresence for route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="blockchain" element={<BlockchainPage />} />
          <Route path="block/:index" element={<BlockDetailsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          {MinePage && <Route path="mine" element={<MinePage />} />}
          <Route path="student-transactions" element={<StudentTransactionsPage />} />
          <Route path="students" element={<StudentsListPage />} />
          <Route path="students/create" element={<StudentCreatePage />} />
          <Route path="students/:studentId" element={<StudentDetailsPage />} />
          <Route path="students/:studentId/edit" element={<StudentEditPage />} />
          <Route path="students/:studentId/history" element={<StudentHistoryPage />} />
          <Route path="students/:studentId/id-card" element={<StudentIDCardPage />} />
          <Route path="nfts" element={<NFTListPage />} />
          <Route path="nfts/:tokenId" element={<NFTDetailPage />} />
          
          {/* Institution Routes */}
          <Route path="institutions" element={<InstitutionsListPage />} />
          <Route path="institutions/create" element={<InstitutionCreatePage />} />
          <Route path="institutions/:institutionId" element={<InstitutionDetailsPage />} />
          <Route path="institutions/:institutionId/edit" element={<InstitutionEditPage />} />
          
          {/* Application Routes */}
          <Route path="applications" element={<ApplicationsListPage />} />
          <Route path="applications/:applicationId" element={<ApplicationDetailsPage />} />
          <Route path="institutions/:institutionId/applications" element={<ApplicationsListPage />} />
          <Route path="students/:studentId/applications" element={<ApplicationsListPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BlockchainProvider>
          <TransactionProvider>
            <StudentProvider>
              <NFTProvider>
                <InstitutionProvider>
                  <ApplicationProvider>
                    <AnimatedRoutes />
                  </ApplicationProvider>
                </InstitutionProvider>
              </NFTProvider>
            </StudentProvider>
          </TransactionProvider>
        </BlockchainProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
