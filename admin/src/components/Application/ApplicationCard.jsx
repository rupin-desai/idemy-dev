import React from "react";
import { Link } from "react-router-dom";
import {
  Building, // Changed from BuildingLibrary to Building
  Calendar,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
} from "lucide-react";
import { iconSizes } from "../../utils/animations";

const ApplicationCard = ({ application }) => {
  // Status styles
  const getStatusStyle = () => {
    switch (application.status) {
      case "APPROVED":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle2 size={16} className="mr-1 text-green-600" />,
        };
      case "REJECTED":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <XCircle size={16} className="mr-1 text-red-600" />,
        };
      default: // PENDING
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          icon: <Clock size={16} className="mr-1 text-yellow-600" />,
        };
    }
  };

  const statusStyle = getStatusStyle();

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Building size={iconSizes.md} className="text-blue-600 mr-2" />
            <h3 className="font-semibold text-lg">
              {application.institutionName}
            </h3>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}
          >
            {statusStyle.icon}
            {application.status}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-gray-500">Program:</p>
            <p className="font-medium">
              {application.programDetails?.program || "N/A"}
            </p>
          </div>

          {application.programDetails?.department && (
            <div>
              <p className="text-gray-500">Department:</p>
              <p className="font-medium">
                {application.programDetails.department}
              </p>
            </div>
          )}

          <div className="flex items-center mt-1">
            <Calendar size={iconSizes.sm} className="text-gray-400 mr-1" />
            <span className="text-gray-600">
              Submitted: {formatDate(application.submittedAt)}
            </span>
          </div>

          {application.status === "APPROVED" &&
            application.verificationData && (
              <div className="flex items-center mt-1">
                <ClipboardCheck
                  size={iconSizes.sm}
                  className="text-green-500 mr-1"
                />
                <span className="text-green-700">
                  Verified:{" "}
                  {formatDate(application.verificationData.verifiedAt)}
                </span>
              </div>
            )}
        </div>

        <div className="mt-3 flex justify-between items-center">
          <Link
            to={`/applications/${application.applicationId}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>

          {application.status === "APPROVED" && application.transactionId && (
            <div className="flex items-center text-xs text-green-700">
              <Shield size={14} className="mr-1" />
              Blockchain Verified
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
