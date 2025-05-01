// Create a new file with this content

import React from "react";
import { Link } from "react-router-dom";
import { School, CheckCircle, Clock, Calendar } from "lucide-react";

const InstitutionHistory = ({ institutionHistory = [] }) => {
  if (!institutionHistory || institutionHistory.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No institution history found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {institutionHistory.map((institution, index) => {
        const statusColors = {
          CURRENT: "bg-blue-100 text-blue-800",
          COMPLETED: "bg-green-100 text-green-800",
        };

        const statusColor =
          statusColors[institution.status] || "bg-gray-100 text-gray-800";

        return (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white"
          >
            <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
              <div className="flex items-center">
                <School size={18} className="text-gray-600 mr-2" />
                <h3 className="font-medium">{institution.institutionName}</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
                {institution.status}
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-start">
                  <div className="w-24 flex-shrink-0 text-gray-500">
                    Program:
                  </div>
                  <div className="font-medium">
                    {institution.program || "N/A"}
                  </div>
                </div>

                {institution.department && (
                  <div className="flex items-start">
                    <div className="w-24 flex-shrink-0 text-gray-500">
                      Department:
                    </div>
                    <div>{institution.department}</div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="w-24 flex-shrink-0 text-gray-500">
                    Start Date:
                  </div>
                  <div>
                    {institution.startDate
                      ? new Date(institution.startDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>

                {institution.status === "COMPLETED" &&
                  institution.completedAt && (
                    <div className="flex items-start">
                      <div className="w-24 flex-shrink-0 text-gray-500">
                        Completed:
                      </div>
                      <div>
                        {new Date(institution.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
              </div>

              <Link
                to={`/institution-details/${institution.institutionId}`}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View Institution Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InstitutionHistory;
