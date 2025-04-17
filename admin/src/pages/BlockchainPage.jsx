import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlockchain } from "../hooks/useBlockchain";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Database,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Alert from "../components/UI/Alert";
import {
  pageVariants,
  tableRowVariants,
  listItemVariants,
  iconSizes,
} from "../utils/animations";

const BlockchainPage = () => {
  const { blockchain, loading, error, fetchBlockchain } = useBlockchain();
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [expandedTransactions, setExpandedTransactions] = useState({});
  const [copiedHash, setCopiedHash] = useState(null);

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

  // Copy text to clipboard with visual feedback
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Add polling for auto-refresh
  useEffect(() => {
    fetchBlockchain();

    const intervalId = setInterval(() => {
      fetchBlockchain();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchBlockchain]);

  if (loading && !blockchain.chain?.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw
          className="animate-spin text-blue-600 mr-2"
          size={iconSizes.lg}
        />
        <span className="text-lg">Loading blockchain data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load blockchain data"
        details={error}
        onClose={() => {}}
        show={true}
      />
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Database size={iconSizes.lg} className="mr-2 text-blue-600" />
          Blockchain Explorer
        </h1>
        <Button
          onClick={() => fetchBlockchain()}
          color="primary"
          loading={loading}
          icon={<RefreshCw size={iconSizes.sm} />}
        >
          {loading ? "Refreshing..." : "Refresh Blockchain"}
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {blockchain.chain?.map((block) => (
            <motion.div key={block.index} variants={listItemVariants} layout>
              <Card
                title={
                  block.index === 0 ? "Genesis Block" : `Block #${block.index}`
                }
                titleClass="flex items-center"
                headerRight={
                  <div className="flex items-center">
                    <Link
                      to={`/block/${block.index}`}
                      className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>View Details</span>
                      <ExternalLink size={iconSizes.sm} className="ml-1" />
                    </Link>
                    <span>
                      {expandedBlocks[block.index] ? (
                        <ChevronUp size={iconSizes.md} />
                      ) : (
                        <ChevronDown size={iconSizes.md} />
                      )}
                    </span>
                  </div>
                }
                onHeaderClick={() => toggleBlockExpansion(block.index)}
                interactive={false}
              >
                <div className="px-6 py-2 text-gray-500">
                  <span>{new Date(block.timestamp).toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <span>{block.transactions?.length || 0} Transactions</span>
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
                          <div className="flex items-center">
                            <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded flex-grow">
                              {block.hash}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                              onClick={() =>
                                copyToClipboard(
                                  block.hash,
                                  `hash-${block.index}`
                                )
                              }
                            >
                              {copiedHash === `hash-${block.index}` ? (
                                <Check
                                  size={iconSizes.sm}
                                  className="text-green-600"
                                />
                              ) : (
                                <Copy size={iconSizes.sm} />
                              )}
                            </motion.button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Previous Hash</p>
                          <div className="flex items-center">
                            <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded flex-grow">
                              {block.previousHash === "0"
                                ? "Genesis Block"
                                : block.previousHash}
                            </p>
                            {block.previousHash !== "0" && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="ml-2 p-1 hover:bg-gray-100 rounded"
                                onClick={() =>
                                  copyToClipboard(
                                    block.previousHash,
                                    `prevhash-${block.index}`
                                  )
                                }
                              >
                                {copiedHash === `prevhash-${block.index}` ? (
                                  <Check
                                    size={iconSizes.sm}
                                    className="text-green-600"
                                  />
                                ) : (
                                  <Copy size={iconSizes.sm} />
                                )}
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Timestamp</p>
                          <p>{new Date(block.timestamp).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Nonce</p>
                          <p>{block.nonce}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Transactions</p>
                          <p>{block.transactions?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Transactions */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Transactions</h3>
                      {block.transactions && block.transactions.length > 0 ? (
                        <div className="space-y-2">
                          {block.transactions.map((tx) => (
                            <motion.div
                              key={tx.id}
                              className="border border-gray-200 rounded-md overflow-hidden"
                              variants={tableRowVariants}
                              layout
                            >
                              {/* Transaction Header - Click to expand */}
                              <motion.div
                                className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  toggleTransactionExpansion(tx.id)
                                }
                                whileHover={{
                                  backgroundColor: "rgba(243, 244, 246, 1)",
                                }}
                              >
                                <div className="flex items-center">
                                  <span className="font-mono text-sm mr-2 text-gray-600">
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
                                  <span className="font-medium mr-3 text-green-600">
                                    {tx.amount}
                                  </span>
                                  <span>
                                    {expandedTransactions[tx.id] ? (
                                      <ChevronUp size={iconSizes.sm} />
                                    ) : (
                                      <ChevronDown size={iconSizes.sm} />
                                    )}
                                  </span>
                                </div>
                              </motion.div>

                              {/* Transaction Details - Expandable */}
                              <AnimatePresence>
                                {expandedTransactions[tx.id] && (
                                  <motion.div
                                    className="bg-white p-4 border-t border-gray-200"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Transaction ID
                                        </p>
                                        <div className="flex items-center">
                                          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded flex-grow">
                                            {tx.id}
                                          </p>
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="ml-2 p-1 hover:bg-gray-100 rounded"
                                            onClick={() =>
                                              copyToClipboard(
                                                tx.id,
                                                `txid-${tx.id}`
                                              )
                                            }
                                          >
                                            {copiedHash === `txid-${tx.id}` ? (
                                              <Check
                                                size={iconSizes.sm}
                                                className="text-green-600"
                                              />
                                            ) : (
                                              <Copy size={iconSizes.sm} />
                                            )}
                                          </motion.button>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Timestamp
                                        </p>
                                        <p>
                                          {new Date(
                                            tx.timestamp
                                          ).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          From Address
                                        </p>
                                        <div className="flex items-center">
                                          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded flex-grow">
                                            {tx.fromAddress ||
                                              "Coinbase (Mining Reward)"}
                                          </p>
                                          {tx.fromAddress && (
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.95 }}
                                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                                              onClick={() =>
                                                copyToClipboard(
                                                  tx.fromAddress,
                                                  `from-${tx.id}`
                                                )
                                              }
                                            >
                                              {copiedHash ===
                                              `from-${tx.id}` ? (
                                                <Check
                                                  size={iconSizes.sm}
                                                  className="text-green-600"
                                                />
                                              ) : (
                                                <Copy size={iconSizes.sm} />
                                              )}
                                            </motion.button>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          To Address
                                        </p>
                                        <div className="flex items-center">
                                          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded flex-grow">
                                            {tx.toAddress}
                                          </p>
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="ml-2 p-1 hover:bg-gray-100 rounded"
                                            onClick={() =>
                                              copyToClipboard(
                                                tx.toAddress,
                                                `to-${tx.id}`
                                              )
                                            }
                                          >
                                            {copiedHash === `to-${tx.id}` ? (
                                              <Check
                                                size={iconSizes.sm}
                                                className="text-green-600"
                                              />
                                            ) : (
                                              <Copy size={iconSizes.sm} />
                                            )}
                                          </motion.button>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-3">
                                      <p className="text-sm text-gray-500">
                                        Amount
                                      </p>
                                      <p className="text-lg font-medium text-green-600">
                                        {tx.amount}
                                      </p>
                                    </div>

                                    {tx.metadata && (
                                      <div className="mt-3">
                                        <p className="text-sm text-gray-500">
                                          Metadata
                                        </p>
                                        <pre className="bg-gray-100 p-2 rounded-md text-xs overflow-auto max-h-40">
                                          {JSON.stringify(tx.metadata, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 p-4 bg-gray-50 rounded-md">
                          No transactions in this block
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BlockchainPage;
