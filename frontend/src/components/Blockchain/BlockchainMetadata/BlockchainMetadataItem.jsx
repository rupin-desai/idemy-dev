import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  METADATA_CONFIG,
  getIconComponent,
} from "../../../utils/blockchain.utils";

const BlockchainMetadataItem = ({
  item,
  isExpanded,
  toggleDetails,
  formatDateTime,
}) => {
  // Get config for this metadata type
  const config = METADATA_CONFIG[item.type] || METADATA_CONFIG.DEFAULT;

  // Render item details based on type
  const renderItemDetails = () => {
    const DetailComponent = config.detailComponent;
    return DetailComponent ? DetailComponent(item.details) : null;
  };

  // Render action links if available
  const renderActionLinks = () => {
    if (!config.actionLink) return null;

    const actionLink = config.actionLink(item.details);

    return (
      <Link
        to={actionLink.to}
        className={`inline-flex items-center px-3 py-1 rounded-md ${actionLink.bgColor} text-xs transition-colors`}
      >
        {actionLink.icon}
        {actionLink.text}
      </Link>
    );
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${config.bgColor}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 ${config.iconColor}`}>
              {getIconComponent(config.icon || item.icon)}
            </div>
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {formatDateTime(item.timestamp)}
              </p>

              {/* Display key details based on type */}
              <div className="mt-2">{renderItemDetails()}</div>
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
              {renderActionLinks()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainMetadataItem;
