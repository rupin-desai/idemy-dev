// src/pages/BlockDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlockchain } from "../hooks/useBlockchain";

const BlockDetailsPage = () => {
  const { index } = useParams();
  const { getBlockByIndex } = useBlockchain();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBlock() {
      setLoading(true);
      try {
        const response = await getBlockByIndex(index);
        setBlock(response.block);
        setError(null);
      } catch (err) {
        setError(`Failed to load block #${index}`);
      } finally {
        setLoading(false);
      }
    }

    if (index) {
      loadBlock();
    }
  }, [index, getBlockByIndex]);

  if (loading) {
    return <div className="text-center py-10">Loading block data...</div>;
  }

  if (error || !block) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
        role="alert"
      >
        <p>{error || `Block #${index} not found`}</p>
        <Link
          to="/blockchain"
          className="inline-block mt-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
        >
          Back to Blockchain
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/blockchain" className="text-blue-600 hover:text-blue-900">
          ← Back to Blockchain
        </Link>
        <h1 className="text-3xl font-bold">Block #{block.index}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Block Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Block Index</p>
            <p className="font-medium">{block.index}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Timestamp</p>
            <p className="font-medium">
              {new Date(block.timestamp).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nonce</p>
            <p className="font-medium">{block.nonce}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Hash</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">
            {block.hash}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Previous Hash</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">
            {block.previousHash === "0" ? "Genesis Block" : block.previousHash}
          </p>
        </div>

        {block.metadata && Object.keys(block.metadata).length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Metadata</p>
            <pre className="font-mono text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(block.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            Transactions ({block.transactions?.length || 0})
          </h2>
        </div>

        {block.transactions && block.transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {block.transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {tx.id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.fromAddress || "Mining Reward"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.toAddress.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-gray-500">No transactions in this block</div>
        )}
      </div>
    </div>
  );
};

export default BlockDetailsPage;
