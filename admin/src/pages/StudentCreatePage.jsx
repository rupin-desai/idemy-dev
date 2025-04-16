import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';
import StudentForm from '../components/StudentForm';

const StudentCreatePage = () => {
  const { createStudent, loading } = useStudents();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const result = await createStudent(formData);
      navigate(`/students/${result.student.studentId}`);
    } catch (err) {
      setError('Failed to create student. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/students" className="text-blue-600 hover:text-blue-900">
          ← Back to Students
        </Link>
        <h1 className="text-3xl font-bold">Add New Student</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <StudentForm
          onSubmit={handleSubmit}
          submitButtonText={loading ? 'Creating...' : 'Create Student'}
        />
      </div>
    </div>
  );
};

export default StudentCreatePage;