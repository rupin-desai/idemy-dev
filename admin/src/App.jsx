import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BlockchainProvider } from "./context/BlockchainContext";
import { TransactionProvider } from "./context/TransactionContext";
import { StudentProvider } from "./context/StudentContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import BlockchainPage from "./pages/BlockchainPage";
import BlockDetailsPage from "./pages/BlockDetailsPage";
import TransactionsPage from "./pages/TransactionsPage";
import CreateTransactionPage from "./pages/CreateTransactionPage";
import MinePage from "./pages/MinePage";
import WalletPage from "./pages/WalletPage";
import StudentTransactionsPage from "./pages/StudentTransactionsPage";
import StudentsListPage from "./pages/StudentsListPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentCreatePage from "./pages/StudentCreatePage";
import StudentEditPage from "./pages/StudentEditPage";
import StudentHistoryPage from "./pages/StudentHistoryPage";

const App = () => {
  return (
    <BlockchainProvider>
      <TransactionProvider>
        <StudentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="blockchain" element={<BlockchainPage />} />
                <Route path="block/:index" element={<BlockDetailsPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route
                  path="create-transaction"
                  element={<CreateTransactionPage />}
                />
                <Route path="mine" element={<MinePage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route
                  path="student-transactions"
                  element={<StudentTransactionsPage />}
                />
                <Route path="students" element={<StudentsListPage />} />
                <Route path="students/create" element={<StudentCreatePage />} />
                <Route
                  path="students/:studentId"
                  element={<StudentDetailsPage />}
                />
                <Route
                  path="students/:studentId/edit"
                  element={<StudentEditPage />}
                />
                <Route
                  path="students/:studentId/history"
                  element={<StudentHistoryPage />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </StudentProvider>
      </TransactionProvider>
    </BlockchainProvider>
  );
};

export default App;
