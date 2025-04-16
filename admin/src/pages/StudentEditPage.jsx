import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStudents } from "../hooks/useStudents";
import StudentForm from "../components/StudentForm";

const StudentEditPage = () => {
  const { studentId } = useParams();
  const { currentStudent, loading, error, fetchStudentById, updateStudent } =
    useStudents();
  const [updateError, setUpdateError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }
  }, [studentId, fetchStudentById]);

  const handleSubmit = async (formData) => {
    try {
      await updateStudent(studentId, formData);
      navigate(`/students/${studentId}`);
    } catch (err) {
      setUpdateError("Failed to update student. Please try again.");
    }
  };

  if (loading && !currentStudent) {
    return <div className="text-center py-10">Loading student data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{error}</p>
        <Link
          to="/students"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
        >
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={`/students/${studentId}`}
          className="text-blue-600 hover:text-blue-900"
        >
          ← Back to Student
        </Link>
        <h1 className="text-3xl font-bold">Edit Student</h1>
      </div>

      {updateError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{updateError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {currentStudent ? (
          <StudentForm
            student={currentStudent}
            onSubmit={handleSubmit}
            submitButtonText={loading ? "Saving..." : "Save Changes"}
          />
        ) : (
          <div className="text-center py-4">Student not found</div>
        )}
      </div>
    </div>
  );
};

export default StudentEditPage;
