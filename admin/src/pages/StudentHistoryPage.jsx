import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';

const StudentHistoryPage = () => {
  const { studentId } = useParams();
  const { currentStudent, studentHistory, loading, error, fetchStudentById, fetchStudentHistory } = useStudents();

  useEffect(() => {
    if (studentId) {
      // Fetch both student details and history
      fetchStudentById(studentId);
      fetchStudentHistory(studentId);
    }
  }, [studentId, fetchStudentById, fetchStudentHistory]);

  if (loading && (!currentStudent || studentHistory.length === 0)) {
    return <div className="text-center py-10">Loading student history...</div>;
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

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/students/${studentId}`} className="text-blue-600 hover:text-blue-900">
          ← Back to Student
        </Link>
        <h1 className="text-3xl font-bold">Student History</h1>
      </div>

      {currentStudent && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentStudent.firstName} {currentStudent.lastName} - {currentStudent.studentId}
          </h2>
          <p className="text-gray-500">View the complete history of changes for this student record.</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">Change History</h2>
        </div>

        {studentHistory.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {studentHistory.map((item, index) => (
              <div key={index} className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      item.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                      item.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.action}
                    </span>
                    <span className="ml-3 text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Link to={`/block/${item.blockIndex}`} className="text-blue-600 hover:text-blue-900">
                      View in Block #{item.blockIndex}
                    </Link>
                  </div>
                </div>

                {item.action === 'UPDATE' && item.previousState && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-700">Previous State</h3>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(item.previousState, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-gray-700">New State</h3>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(item.studentData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {(item.action === 'CREATE' || item.action === 'DELETE') && (
                  <div>
                    <h3 className="font-medium mb-2 text-gray-700">Student Data</h3>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(item.studentData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-gray-500">No history found for this student</div>
        )}
      </div>
    </div>
  );
};

export default StudentHistoryPage;