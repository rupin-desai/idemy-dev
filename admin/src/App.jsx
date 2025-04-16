import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlockchainProvider } from './context/BlockchainContext';
import { TransactionProvider } from './context/TransactionContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import BlockchainPage from './pages/BlockchainPage';
import BlockDetailsPage from './pages/BlockDetailsPage';
import TransactionsPage from './pages/TransactionsPage';
import CreateTransactionPage from './pages/CreateTransactionPage';
import MinePage from './pages/MinePage';
import WalletPage from './pages/WalletPage';

const App = () => {
  return (
    <BlockchainProvider>
      <TransactionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="blockchain" element={<BlockchainPage />} />
              <Route path="block/:index" element={<BlockDetailsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="create-transaction" element={<CreateTransactionPage />} />
              <Route path="mine" element={<MinePage />} />
              <Route path="wallet" element={<WalletPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TransactionProvider>
    </BlockchainProvider>
  );
};

export default App;