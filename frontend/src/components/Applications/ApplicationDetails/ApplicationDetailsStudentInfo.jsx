import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const ApplicationDetailsStudentInfo = ({ studentData, itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
    >
      <div className="border-b px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-semibold flex items-center">
          <User className="mr-2" size={20} />
          Student Information
        </h2>
      </div>

      <div className="p-6">
        {studentData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">{studentData.studentId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">
                {studentData.firstName} {studentData.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{studentData.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Institution</p>
              <p className="font-medium">
                {studentData.institution || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">
                {studentData.department || "Not specified"}
              </p>
            </div>

            {studentData.enrollmentYear && (
              <div>
                <p className="text-sm text-gray-500">Enrollment Year</p>
                <p className="font-medium">{studentData.enrollmentYear}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Student data not available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsStudentInfo;
