import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';
import { Users, PlusCircle, Eye, Edit, Trash, History, AlertCircle, RefreshCw } from 'lucide-react';
import { pageVariants, buttonVariants, tableRowVariants, cardVariants, iconSizes } from '../utils/animations';
import Alert from '../components/UI/Alert';
import Button from '../components/UI/Button';

const StudentsListPage = () => {
  const { students, loading, error, fetchAllStudents, deleteStudent } = useStudents();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteStudent(studentToDelete.studentId);
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={iconSizes.lg} />
        <span className="text-lg">Loading students data...</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Users size={iconSizes.lg} className="mr-3 text-blue-600" />
          Students Management
          {/* <img src="/logo_icon_blue.png" alt="IDEMY" className="h-8 ml-3" /> */}
        </h1>
        <Link to="/students/create">
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <PlusCircle size={iconSizes.sm} className="mr-2" />
            Add New Student
          </motion.button>
        </Link>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => {}} 
          show={true}
          details={
            <button
              className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              onClick={fetchAllStudents}
            >
              Retry
            </button>
          }
        />
      )}

      <motion.div 
        className="bg-white shadow-md rounded-lg overflow-hidden"
        variants={cardVariants}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo_icon_blue.png" alt="IDEMY" className="h-6 mr-3" />
            <h2 className="text-xl font-semibold">All Students ({students.length})</h2>
          </div>
          <Button
            onClick={fetchAllStudents}
            color="primary"
            size="sm"
            icon={<RefreshCw size={iconSizes.sm} />}
          >
            Refresh
          </Button>
        </div>

        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <motion.tr 
                    key={student.studentId}
                    className="hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(student.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/students/${student.studentId}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye size={iconSizes.sm} className="mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/students/${student.studentId}/edit`}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <Edit size={iconSizes.sm} className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash size={iconSizes.sm} className="mr-1" />
                          Delete
                        </button>
                        <Link
                          to={`/students/${student.studentId}/history`}
                          className="text-purple-600 hover:text-purple-900 flex items-center"
                        >
                          <History size={iconSizes.sm} className="mr-1" />
                          History
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-gray-500 flex items-center justify-center">
            <AlertCircle size={iconSizes.md} className="mr-2 text-gray-400" />
            No students found
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center mb-4">
                <img src="/logo_icon_blue.png" alt="IDEMY" className="h-6 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete student{' '}
                <span className="font-bold">
                  {studentToDelete?.firstName} {studentToDelete?.lastName}
                </span>{' '}
                ({studentToDelete?.studentId})? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  onClick={() => setShowDeleteModal(false)}
                  color="secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  color="danger"
                  loading={isDeleting}
                  icon={<Trash size={iconSizes.sm} />}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentsListPage;