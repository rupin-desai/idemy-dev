import { useContext } from 'react';
import { InstitutionContext } from '../context/InstitutionContext';

export const useInstitutions = () => {
  const context = useContext(InstitutionContext);
  
  if (!context) {
    throw new Error('useInstitutions must be used within an InstitutionProvider');
  }
  
  return context;
};