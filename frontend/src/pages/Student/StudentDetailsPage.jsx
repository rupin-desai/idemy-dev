// OR filepath: /c:/Users/rupin/Desktop/Dev_Files/Git_Repos/Development/idemy-dev/admin/src/pages/StudentDetailsPage.jsx

// IMPORT the InstitutionHistory component at the top of the file
import InstitutionHistory from "../../components/InstitutionHistory";

// ADD this section to display institution history, typically after the student's personal information
{currentStudent?.institutionHistory && currentStudent.institutionHistory.length > 0 && (
  <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
    <div className="px-6 py-4 border-b bg-gray-50">
      <h2 className="text-xl font-semibold">Institution History</h2>
    </div>
    
    <div className="p-6">
      <InstitutionHistory institutionHistory={currentStudent.institutionHistory} />
    </div>
  </div>
)}