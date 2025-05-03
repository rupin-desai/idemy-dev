import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const ApplicationDetailsInfo = ({ application, itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
    >
      <div className="border-b px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-semibold flex items-center">
          <BookOpen className="mr-2" size={20} />
          Application Details
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Application ID</p>
            <p className="font-medium">{application.applicationId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Submitted Date</p>
            <p className="font-medium">
              {new Date(application.submittedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Program Details</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium">
                    {application.programDetails?.program ||
                      "General Application"}
                  </p>
                </div>

                {application.programDetails?.department && (
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">
                      {application.programDetails.department}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">
                    {application.programDetails?.year ||
                      new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {application.additionalInfo?.notes && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>{application.additionalInfo.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsInfo;
