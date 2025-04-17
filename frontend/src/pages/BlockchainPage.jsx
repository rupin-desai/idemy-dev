import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Shield, Lock, Layers, CheckCircle, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const BlockchainPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [blockData, setBlockData] = useState([
    { id: 1, type: 'ID Creation', timestamp: '2023-12-01T09:15:30Z', hash: '0x7fde...2a41' },
    { id: 2, type: 'Verification', timestamp: '2023-12-05T14:22:11Z', hash: '0x3a92...8c61' },
    { id: 3, type: 'Update', timestamp: '2023-12-15T11:05:44Z', hash: '0x9d67...3f22' }
  ]);

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

            <h2 className="text-xl font-semibold mb-4">Your Blockchain Activity</h2>
            
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
                  {blockData.map((block) => (
                    <tr key={block.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{block.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(block.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{block.hash}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle size={14} className="mr-1" /> Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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