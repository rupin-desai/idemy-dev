import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Shield, Lock, Layers, CheckCircle, AlertCircle, Clock, RefreshCcw, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import * as blockchainApi from "../api/blockchain.api.js";

const BlockchainPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Improve the transaction type detection
  const getTransactionType = (tx) => {
    if (tx.metadata?.action === "MINT_NFT") return "ID Card Created";
    if (tx.metadata?.action === "UPDATE_NFT") return "ID Card Updated";
    if (tx.metadata?.action === "CREATE") return "Student Registration";
    if (tx.metadata?.action === "UPDATE") return "Profile Updated";
    if (tx.metadata?.type === "STUDENT_REGISTRATION") return "Student Registration";
    if (tx.metadata?.type === "ID_CARD") return "ID Card";
    if (tx.metadata?.type === "VERIFICATION") return "ID Verification";
    if (tx.type === "STUDENT_REGISTRATION") return "Student Registration";
    
    // If we can't determine a specific type, check the content
    if (tx.metadata?.studentId || tx.metadata?.studentData) return "Student Record";
    if (tx.metadata?.tokenId) return "NFT Operation";
    
    return "Transaction";
  };

  // Format transaction hash for display
  const formatHash = (hash) => {
    if (!hash || hash.length < 12) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!isAuthenticated || !currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get basic blockchain info
        const infoResponse = await blockchainApi.getBlockchainInfo();
        setBlockchainInfo(infoResponse);
        
        // Try to get student ID
        let studentId = null;
        try {
          const studentResponse = await blockchainApi.getStudentByEmail(currentUser.email);
          if (studentResponse.success) {
            studentId = studentResponse.studentInfo.studentId;
          }
        } catch (studentError) {
          console.warn("Could not find student by email:", studentError);
          // If currentUser has a studentId field, use that instead
          if (currentUser.studentId) {
            studentId = currentUser.studentId;
          }
        }
        
        // Get transactions using the new API function
        try {
          const txResponse = await blockchainApi.getUserTransactionsByEmailOrId(
            currentUser.email, 
            studentId
          );
          
          if (txResponse.success) {
            setTransactions(txResponse.transactions);
          } else {
            setError("Failed to load user transactions");
          }
        } catch (txError) {
          console.error("Transaction fetch error:", txError);
          setError("Failed to load transactions: " + txError.message);
        }
      } catch (err) {
        console.error("Blockchain data fetch error:", err);
        setError(err.message || "Failed to load blockchain data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
  }, [isAuthenticated, currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-5 text-indigo-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              <Database size={24} className="mr-2" />
              Your Blockchain
            </h1>
            <p className="opacity-80 mt-1">
              Explore the power of blockchain securing your digital identity
            </p>
          </div>

          <div className="p-6">
            {/* Blockchain info cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">Security</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your digital identity is secured using advanced cryptography
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium">Immutability</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Records cannot be altered once added to the blockchain
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <Layers className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-medium">Transparency</h3>
                </div>
                <p className="text-sm text-gray-600">
                  All transactions are transparent and verifiable
                </p>
              </div>
            </div>

            {/* Blockchain stats */}
            {blockchainInfo && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Blockchain Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Blocks:</span>
                    <div className="font-medium">{blockchainInfo.blockCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Difficulty:</span>
                    <div className="font-medium">{blockchainInfo.difficulty}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Latest Block:</span>
                    <div className="font-medium">{formatHash(blockchainInfo.latestBlock?.hash)}</div>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">Your Blockchain Activity</h2>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <RefreshCcw className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error loading blockchain data</p>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-4 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>No blockchain transactions found for your account</p>
              </div>
            ) : (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getTransactionType(tx)}
                          </div>
                          {tx.metadata?.studentId && (
                            <div className="text-xs text-gray-500">
                              {tx.metadata.studentId}
                            </div>
                          )}
                          {tx.metadata?.studentData?.email === currentUser.email && (
                            <div className="text-xs text-green-500 mt-1">
                              Includes your email
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">
                            {formatHash(tx.id)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tx.confirmed ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <CheckCircle size={14} className="mr-1" /> Confirmed
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              <Clock size={14} className="mr-1" /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-700">What is Blockchain?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Blockchain is a distributed ledger technology that enables secure, transparent, and tamper-proof 
                    record-keeping. At IDEMY, we leverage blockchain to ensure your digital identity credentials 
                    are verifiable and secure. Each modification to your digital ID is recorded as a transaction, 
                    creating an immutable audit trail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlockchainPage;