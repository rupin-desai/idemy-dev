// src/pages/NFTListPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNFTs } from "../hooks/useNFTs";

const NFTListPage = () => {
  const { nfts, loading, error, fetchAllNFTs } = useNFTs();

  useEffect(() => {
    fetchAllNFTs();
  }, [fetchAllNFTs]);

  if (loading && nfts.length === 0) {
    return <div className="text-center py-10">Loading NFTs data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">NFT Management</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
            onClick={fetchAllNFTs}
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">All NFTs ({nfts.length})</h2>
        </div>

        {nfts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nfts.map((nft) => (
                  <tr key={nft.tokenId}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {nft.tokenId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/students/${nft.studentId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {nft.studentId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {nft.ownerAddress.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(nft.mintedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          nft.status === "MINTED"
                            ? "bg-green-100 text-green-800"
                            : nft.status === "TRANSFERRED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {nft.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/nfts/${nft.tokenId}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/nfts/${nft.tokenId}/verify`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-gray-500">No NFTs found</div>
        )}
      </div>
    </div>
  );
};

export default NFTListPage;
