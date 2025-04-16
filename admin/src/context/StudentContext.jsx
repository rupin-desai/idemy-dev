import { createContext, useState, useCallback } from 'react';
import studentApi from '../api/student.api';

export const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getAllStudents();
      setStudents(data.students || []);
      return data;
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentById = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getStudentById(studentId);
      setCurrentStudent(data.student);
      return data;
    } catch (err) {
      setError(`Failed to fetch student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.createStudent(studentData);
      await fetchAllStudents(); // Refresh list after creation
      return data;
    } catch (err) {
      setError('Failed to create student');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllStudents]);

  const updateStudent = useCallback(async (studentId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.updateStudent(studentId, updates);
      await fetchAllStudents(); // Refresh list after update
      if (currentStudent && currentStudent.studentId === studentId) {
        setCurrentStudent(data.student);
      }
      return data;
    } catch (err) {
      setError(`Failed to update student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllStudents, currentStudent]);

  const deleteStudent = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.deleteStudent(studentId);
      await fetchAllStudents(); // Refresh list after deletion
      if (currentStudent && currentStudent.studentId === studentId) {
        setCurrentStudent(null);
      }
      return data;
    } catch (err) {
      setError(`Failed to delete student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllStudents, currentStudent]);

  const fetchStudentHistory = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getStudentHistory(studentId);
      setStudentHistory(data.history || []);
      return data;
    } catch (err) {
      setError(`Failed to fetch history for student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    students,
    currentStudent,
    studentHistory,
    loading,
    error,
    fetchAllStudents,
    fetchStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStudentHistory
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}