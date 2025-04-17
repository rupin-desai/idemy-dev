import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Building, RefreshCw } from 'lucide-react';
import { useInstitutions } from '../hooks/useInstitutions';
import InstitutionForm from '../components/Institution/InstitutionForm';
import Alert from '../components/UI/Alert';
import { pageVariants, iconSizes } from '../utils/animations';

const InstitutionEditPage = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const { getInstitutionById, updateInstitution, loading, error } = useInstitutions();
  const [institution, setInstitution] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const data = await getInstitutionById(institutionId);
        setInstitution(data);
      } catch (err) {
        console.error("Failed to fetch institution:", err);
      }
    };

    if (institutionId) {
      fetchInstitution();
    }
  }, [institutionId, getInstitutionById]);

  const handleSubmit = async (formData) => {
    try {
      await updateInstitution(institutionId, formData);
      navigate(`/institutions/${institutionId}`);
    } catch (err) {
      setUpdateError("Failed to update institution. Please try again.");
    }
  };

  if (loading && !institution) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={iconSizes.lg} />
        <span className="text-lg">Loading institution data...</span>
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
      <div className="mb-6">
        <Link to={`/institutions/${institutionId}`} className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft size={iconSizes.sm} className="mr-1" />
          Back to Institution
        </Link>
      </div>

      <div className="flex items-center mb-6">
        <Building size={iconSizes.lg} className="mr-3 text-blue-600" />
        <h1 className="text-3xl font-bold">Edit Institution</h1>
      </div>

      {(error || updateError) && (
        <Alert
          type="error"
          message={updateError || error}
          onClose={() => setUpdateError(null)}
          show={!!(error || updateError)}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {institution ? (
          <InstitutionForm
            institution={institution}
            onSubmit={handleSubmit}
            submitButtonText={loading ? "Saving..." : "Save Changes"}
          />
        ) : (
          <div className="text-center py-4">Institution not found</div>
        )}
      </div>
    </motion.div>
  );
};

export default InstitutionEditPage;