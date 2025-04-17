import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Building } from 'lucide-react';
import { useInstitutions } from '../hooks/useInstitutions';
import InstitutionForm from '../components/Institution/InstitutionForm';
import Alert from '../components/UI/Alert';
import { pageVariants, iconSizes } from '../utils/animations';

const InstitutionCreatePage = () => {
  const { createInstitution, loading } = useInstitutions();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const result = await createInstitution(formData);
      navigate(`/institutions/${result.institutionId}`);
    } catch (err) {
      setError('Failed to create institution. Please try again.');
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="mb-6">
        <Link to="/institutions" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft size={iconSizes.sm} className="mr-1" />
          Back to Institutions
        </Link>
      </div>

      <div className="flex items-center mb-6">
        <Building size={iconSizes.lg} className="mr-3 text-blue-600" />
        <h1 className="text-3xl font-bold">Add New Institution</h1>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          show={!!error}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <InstitutionForm
          onSubmit={handleSubmit}
          submitButtonText={loading ? "Creating..." : "Create Institution"}
        />
      </div>
    </motion.div>
  );
};

export default InstitutionCreatePage;