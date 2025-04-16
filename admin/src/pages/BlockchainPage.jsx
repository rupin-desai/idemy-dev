import React, { useEffect, useState } from "react";
import { useBlockchain } from "../hooks/useBlockchain";
import { Link } from "react-router-dom";

const BlockchainPage = () => {
  const { blockchain, loading, error, fetchBlockchain } = useBlockchain();
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [expandedTransactions, setExpandedTransactions] = useState({});

  // Toggle block expansion
  const toggleBlockExpansion = (index) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Toggle transaction expansion
  const toggleTransactionExpansion = (txId) => {
    setExpandedTransactions((prev) => ({
      ...prev,
      [txId]: !prev[txId],
    }));
  };

  // Add polling for auto-refresh
  useEffect(() => {
    fetchBlockchain();

    const intervalId = setInterval(() => {
      fetchBlockchain();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchBlockchain]);

  if (loading && !blockchain.chain?.length) {
    return <div className="text-center py-10">Loading blockchain data...</div>;
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
        role="alert"
      >
        <p>{error}</p>
        <button
          className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
          onClick={fetchBlockchain}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
        <button
          onClick={() => fetchBlockchain()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Blockchain"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Chain Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500">Total Blocks</p>
            <p className="text-2xl font-semibold">
              {blockchain.chain?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Mining Difficulty</p>
            <p className="text-2xl font-semibold">
              {blockchain.difficulty || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Mining Reward</p>
            <p className="text-2xl font-semibold">
              {blockchain.miningReward || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {blockchain.chain?.map((block) => (
          <div
            key={block.index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Block Header - Always visible */}
            <div
              className="px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-50"
              onClick={() => toggleBlockExpansion(block.index)}
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {block.index === 0
                    ? "Genesis Block"
                    : `Block #${block.index}`}
                </h2>
                <p className="text-gray-500">
                  {new Date(block.timestamp).toLocaleString()} •
                  {block.transactions?.length || 0} Transactions
                </p>
              </div>
              <div className="flex items-center">
                <Link
                  to={`/block/${block.index}`}
                  className="text-blue-600 hover:text-blue-800 mr-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Link>
                <span>{expandedBlocks[block.index] ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Block Details - Expandable */}
            {expandedBlocks[block.index] && (
              <div className="border-t border-gray-200 p-6">
                {/* Block Metadata */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    Block Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Hash</p>
                      <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">
                        {block.hash}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Previous Hash</p>
                      <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">
                        {block.previousHash === "0"
                          ? "Genesis Block"
                          : block.previousHash}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nonce</p>
                      <p className="font-medium">{block.nonce}</p>
                    </div>
                  </div>

                  {/* Block Metadata Object */}
                  {block.metadata && Object.keys(block.metadata).length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Block Metadata</p>
                      <pre className="font-mono text-sm bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(block.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Transactions */}
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Transactions ({block.transactions?.length || 0})
                  </h3>

                  {block.transactions && block.transactions.length > 0 ? (
                    <div className="space-y-4">
                      {block.transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="border border-gray-200 rounded-md overflow-hidden"
                        >
                          {/* Transaction Header - Click to expand */}
                          <div
                            className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleTransactionExpansion(tx.id)}
                          >
                            <div className="flex items-center">
                              <span className="font-mono text-sm mr-2">
                                {tx.id.substring(0, 8)}...
                              </span>
                              <span className="text-gray-500 text-sm">
                                {tx.fromAddress
                                  ? `From: ${tx.fromAddress.substring(
                                      0,
                                      10
                                    )}...`
                                  : "Mining Reward"}{" "}
                                → To: {tx.toAddress.substring(0, 10)}...
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-3">
                                {tx.amount}
                              </span>
                              <span>
                                {expandedTransactions[tx.id] ? "▲" : "▼"}
                              </span>
                            </div>
                          </div>

                          {/* Transaction Details - Expandable */}
                          {expandedTransactions[tx.id] && (
                            <div className="px-4 py-3 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Transaction ID
                                  </p>
                                  <p className="font-mono text-sm">{tx.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Timestamp
                                  </p>
                                  <p className="text-sm">
                                    {new Date(tx.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    From Address
                                  </p>
                                  <p className="font-mono text-sm">
                                    {tx.fromAddress ||
                                      "Mining Reward (Coinbase)"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    To Address
                                  </p>
                                  <p className="font-mono text-sm">
                                    {tx.toAddress}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Amount
                                  </p>
                                  <p className="font-medium">{tx.amount}</p>
                                </div>
                              </div>

                              {/* Transaction Metadata */}
                              {tx.metadata &&
                                Object.keys(tx.metadata).length > 0 && (
                                  <div className="mt-4">
                                    <p className="text-sm text-gray-500">
                                      Transaction Metadata
                                    </p>
                                    <pre className="font-mono text-sm bg-gray-100 p-2 rounded overflow-auto mt-1">
                                      {JSON.stringify(tx.metadata, null, 2)}
                                    </pre>
                                  </div>
                                )}

                              {/* Signature */}
                              {tx.signature && (
                                <div className="mt-4">
                                  <p className="text-sm text-gray-500">
                                    Signature
                                  </p>
                                  <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">
                                    {tx.signature}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      No transactions in this block
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainPage;
