import { useContext } from 'react';
import { StudentContext } from '../context/StudentContext';

export const useStudents = () => {
  const context = useContext(StudentContext);
  
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  
  return context;
};