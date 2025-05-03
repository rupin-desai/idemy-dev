import React from "react";
import InstitutionHistory from "../../components/InstitutionHistory";

const StudentDetailsPage = ({ currentStudent }) => {
  return (
    <div>
      {/* Student details would go here */}

      {/* Institution History Section */}
      {currentStudent?.institutionHistory &&
        currentStudent.institutionHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold">Institution History</h2>
            </div>

            <div className="p-6">
              <InstitutionHistory
                institutionHistory={currentStudent.institutionHistory}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default StudentDetailsPage;
