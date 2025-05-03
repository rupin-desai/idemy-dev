import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  FileCheck,
  User,
  Building,
  Shield,
  UserPlus,
  UserCheck,
  RefreshCw,
  Database,
} from "lucide-react";

const BlockchainMetadataItem = ({
  item,
  isExpanded,
  toggleDetails,
  formatDateTime,
}) => {
  // Get the appropriate icon component
  const getIcon = (iconName) => {
    switch (iconName) {
      case "file-plus":
        return <FileCheck size={20} />;
      case "refresh-cw":
        return <RefreshCw size={20} />;
      case "user-plus":
        return <UserPlus size={20} />;
      case "user-check":
        return <UserCheck size={20} />;
      case "building":
        return <Building size={20} />;
      default:
        return <Database size={20} />;
    }
  };

  // Determine background color based on metadata type
  const getBgColor = () => {
    switch (item.type) {
      case "ID_CREATION":
        return "bg-green-50 border-green-100";
      case "ID_UPDATE":
        return "bg-blue-50 border-blue-100";
      case "PROFILE_CREATED":
        return "bg-purple-50 border-purple-100";
      case "PROFILE_UPDATED":
        return "bg-indigo-50 border-indigo-100";
      case "INSTITUTION_VERIFIED":
        return "bg-amber-50 border-amber-100";
      case "STUDENT_APPLICATION":
        return "bg-teal-50 border-teal-100";
      case "APPLICATION_APPROVED":
        return "bg-green-50 border-green-100";
      case "APPLICATION_BLOCKCHAIN_VERIFIED":
        return "bg-purple-50 border-purple-100";
      case "ID_INSTITUTION_VERIFIED":
        return "bg-indigo-50 border-indigo-200";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  // Get icon color based on metadata type
  const getIconColor = () => {
    switch (item.type) {
      case "ID_CREATION":
        return "text-green-600 bg-green-100";
      case "ID_UPDATE":
        return "text-blue-600 bg-blue-100";
      case "PROFILE_CREATED":
        return "text-purple-600 bg-purple-100";
      case "PROFILE_UPDATED":
        return "text-indigo-600 bg-indigo-100";
      case "INSTITUTION_VERIFIED":
        return "text-amber-600 bg-amber-100";
      case "STUDENT_APPLICATION":
        return "text-teal-600 bg-teal-100";
      case "APPLICATION_APPROVED":
        return "text-green-600 bg-green-100";
      case "APPLICATION_BLOCKCHAIN_VERIFIED":
        return "text-purple-600 bg-purple-100";
      case "ID_INSTITUTION_VERIFIED":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${getBgColor()}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 ${getIconColor()}`}>
              {getIcon(item.icon)}
            </div>
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {formatDateTime(item.timestamp)}
              </p>

              {/* Display key details based on type */}
              <div className="mt-2">
                {item.type === "ID_CREATION" && (
                  <div className="text-sm">
                    <p>
                      ID Card Created:{" "}
                      <span className="font-mono">{item.details.tokenId}</span>
                    </p>
                  </div>
                )}

                {item.type === "ID_UPDATE" && (
                  <div className="text-sm">
                    <p>ID Card Updated to Version: {item.details.version}</p>
                  </div>
                )}

                {item.type === "PROFILE_CREATED" && (
                  <div className="text-sm">
                    <p>Profile created for: {item.details.name}</p>
                  </div>
                )}

                {item.type === "PROFILE_UPDATED" && (
                  <div className="text-sm">
                    <p>Profile updated for: {item.details.name}</p>
                  </div>
                )}

                {item.type === "INSTITUTION_VERIFIED" && (
                  <div className="text-sm">
                    <p>Institution verified: {item.details.institutionName}</p>
                  </div>
                )}

                {item.type === "STUDENT_APPLICATION" && (
                  <div className="text-sm">
                    <p>Application to: {item.details.institutionName}</p>
                    <p>Program: {item.details.program}</p>
                    <p>
                      Status:{" "}
                      <span className="font-medium">{item.details.status}</span>
                    </p>
                  </div>
                )}

                {item.type === "APPLICATION_APPROVED" && (
                  <div className="text-sm">
                    <p>Application to: {item.details.institutionName}</p>
                    <p>Program: {item.details.program}</p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-green-600">
                        APPROVED
                      </span>
                    </p>
                    <p>Verified by: {item.details.verifier}</p>
                  </div>
                )}

                {item.type === "APPLICATION_BLOCKCHAIN_VERIFIED" && (
                  <div className="text-sm">
                    <p>Application to: {item.details.institutionName}</p>
                    <p>Program: {item.details.program}</p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-purple-600">
                        BLOCKCHAIN VERIFIED
                      </span>
                    </p>
                    <p>Verified by: {item.details.verifier}</p>
                    <p className="mt-1 text-xs text-purple-500 flex items-center">
                      <Shield size={12} className="mr-1" /> Secured on
                      blockchain
                    </p>
                  </div>
                )}

                {item.type === "ID_INSTITUTION_VERIFIED" && (
                  <div className="text-sm">
                    <p>
                      ID Card verified by institution:{" "}
                      {item.details.institution}
                    </p>
                    <p>Updated to version: {item.details.version}</p>
                    <p className="flex items-center mt-1 text-xs text-indigo-600">
                      <Shield size={12} className="mr-1" /> Institution Verified
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => toggleDetails(item.transactionId)}
            className={`ml-2 px-2 py-1 rounded text-xs flex items-center ${
              isExpanded
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isExpanded ? (
              <>
                Hide <ChevronUp size={14} className="ml-1" />
              </>
            ) : (
              <>
                Details <ChevronDown size={14} className="ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div>
                <span className="text-gray-500 text-xs">Transaction ID:</span>
                <div className="font-mono text-xs break-all">
                  {item.transactionId}
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-xs">Block:</span>
                <div className="text-xs">#{item.blockIndex}</div>
              </div>

              <div>
                <span className="text-gray-500 text-xs">Block Hash:</span>
                <div className="font-mono text-xs break-all">
                  {item.blockHash?.substring(0, 16)}...
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-xs">Timestamp:</span>
                <div className="text-xs">{formatDateTime(item.timestamp)}</div>
              </div>
            </div>

            {/* Metadata details based on type */}
            <div className="bg-white p-3 rounded-md border border-gray-200 mb-3">
              <h4 className="text-sm font-medium mb-2">Details</h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(item.details).map(([key, value], idx) => (
                  <div key={idx} className="flex">
                    <span className="text-xs text-gray-500 min-w-[120px]">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <span className="text-xs ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw metadata (collapsible) */}
            <details className="text-xs">
              <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                View Raw Metadata
              </summary>
              <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto mt-2 max-h-60 whitespace-pre-wrap">
                {JSON.stringify(item.rawMetadata, null, 2)}
              </pre>
            </details>

            {/* Action links based on type */}
            <div className="mt-4 flex flex-wrap gap-2">
              {item.type === "ID_CREATION" && (
                <Link
                  to={`/nft/${item.details.tokenId}`}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs hover:bg-green-200 transition-colors"
                >
                  <FileCheck size={14} className="mr-1" />
                  View ID Card
                </Link>
              )}

              {item.type === "ID_UPDATE" && (
                <Link
                  to={`/nft/${item.details.tokenId}?v=${item.details.version}`}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-xs hover:bg-blue-200 transition-colors"
                >
                  <FileCheck size={14} className="mr-1" />
                  View Updated ID
                </Link>
              )}

              {(item.type === "PROFILE_CREATED" ||
                item.type === "PROFILE_UPDATED") && (
                <Link
                  to="/profile-data"
                  className="inline-flex items-center px-3 py-1 rounded-md bg-purple-100 text-purple-700 text-xs hover:bg-purple-200 transition-colors"
                >
                  <User size={14} className="mr-1" />
                  View Profile
                </Link>
              )}

              {item.type === "STUDENT_APPLICATION" && (
                <Link
                  to={`/institution-details/${item.details.institutionId}`}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-teal-100 text-teal-700 text-xs hover:bg-teal-200 transition-colors"
                >
                  <Building size={14} className="mr-1" />
                  View Institution
                </Link>
              )}

              {item.type === "ID_INSTITUTION_VERIFIED" && (
                <Link
                  to={`/nft/${item.details.tokenId}`}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs hover:bg-indigo-200 transition-colors"
                >
                  <Shield size={14} className="mr-1" />
                  View Verified ID
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainMetadataItem;
