import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

const NftVersionsList = ({ versions, currentTokenId }) => {
  const navigate = useNavigate();

  // Extract real version numbers from metadata URI if version field is incorrect
  const processedVersions = versions.map((v) => {
    let version = v.version;

    // If version is missing or equals 1, try to extract from metadataUri
    if (!version || version === 1) {
      if (v.metadataUri && v.metadataUri.includes("?v=")) {
        // Extract version number from URI
        const match = v.metadataUri.match(/\?v=(\d+)/);
        if (match && match[1]) {
          version = parseInt(match[1]);
        }
      }

      // If we have a previousVersionId, this is at least version 2
      if (v.previousVersionId && version === 1) {
        version = 2;
      }
    }

    return {
      ...v,
      version: version || 1,
    };
  });

  // Sort by version number (newest first)
  const sortedVersions = [...processedVersions].sort(
    (a, b) => b.version - a.version
  );

  // Mark only the first version (highest version number) as latest
  const versionsWithLatestFlag = sortedVersions.map((version, index) => ({
    ...version,
    isLatestVersion: index === 0, // Only the first item in sorted array is latest
  }));

  if (!versions || versions.length === 0) {
    return (
      <p className="text-gray-500 italic">No version history available.</p>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Version
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {versionsWithLatestFlag.map((version) => (
            <tr
              key={version.tokenId}
              className={
                currentTokenId === version.tokenId ? "bg-indigo-50" : ""
              }
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">Version {version.version}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {version.mintedAt
                  ? new Date(version.mintedAt).toLocaleDateString()
                  : "Unknown date"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    version.isLatestVersion
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {version.isLatestVersion ? "Latest" : "Previous"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {currentTokenId !== version.tokenId && (
                  <button
                    onClick={() => navigate(`/nft/${version.tokenId}`)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    View <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                )}
                {currentTokenId === version.tokenId && (
                  <span className="text-gray-500">Current</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NftVersionsList;
