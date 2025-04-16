import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';

const StudentDetailsPage = () => {
  const { studentId } = useParams();
  const { currentStudent, loading, error, fetchStudentById } = useStudents();

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }
  }, [studentId, fetchStudentById]);

  if (loading && !currentStudent) {
    return <div className="text-center py-10">Loading student data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{error}</p>
        <Link to="/students" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">
          Back to Students
        </Link>
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <p>Student not found</p>
        <Link to="/students" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/students" className="text-blue-600 hover:text-blue-900">
            ← Back to Students
          </Link>
          <h1 className="text-3xl font-bold">Student Profile</h1>
        </div>
        <div className="space-x-2">
          <Link
            to={`/students/${currentStudent.studentId}/edit`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Edit
          </Link>
          <Link
            to={`/students/${currentStudent.studentId}/history`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            View History
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">Basic Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">{currentStudent.studentId}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{currentStudent.firstName} {currentStudent.lastName}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{currentStudent.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{new Date(currentStudent.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {currentStudent.additionalInfo && Object.keys(currentStudent.additionalInfo).length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">Additional Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStudent.additionalInfo.program && (
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium">{currentStudent.additionalInfo.program}</p>
                </div>
              )}
              
              {currentStudent.additionalInfo.year && (
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{currentStudent.additionalInfo.year}</p>
                </div>
              )}
              
              {currentStudent.additionalInfo.department && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{currentStudent.additionalInfo.department}</p>
                </div>
              )}
            </div>
            
            {currentStudent.additionalInfo.notes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="bg-gray-50 p-3 rounded mt-1">{currentStudent.additionalInfo.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailsPage;