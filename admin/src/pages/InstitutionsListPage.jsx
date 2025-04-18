import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useInstitutions } from '../hooks/useInstitutions';
import { pageVariants, buttonVariants, cardVariants, iconSizes } from '../utils/animations';
import InstitutionCard from '../components/Institution/InstitutionCard';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';

const InstitutionsListPage = () => {
  const { institutions, loading, error, fetchAllInstitutions } = useInstitutions();

  useEffect(() => {
    fetchAllInstitutions();
  }, [fetchAllInstitutions]);

  if (loading && institutions.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={iconSizes.lg} />
        <span className="text-lg">Loading institutions data...</span>
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
          <Building size={iconSizes.lg} className="mr-3 text-blue-600" />
          Institution Management
          {/* <img src="/logo_icon_blue.png" alt="IDEMY" className="h-8 ml-3" /> */}
        </h1>
        <Link to="/institutions/create">
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <PlusCircle size={iconSizes.sm} className="mr-2" />
            Add New Institution
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
            <Button
              onClick={fetchAllInstitutions}
              color="danger"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          }
        />
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Institutions ({institutions.length})</h2>
          <Button
            onClick={fetchAllInstitutions}
            color="primary"
            size="sm"
            icon={<RefreshCw size={iconSizes.sm} />}
          >
            Refresh
          </Button>
        </div>

        {institutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map(institution => (
              <motion.div
                key={institution.institutionId}
                variants={cardVariants}
              >
                <InstitutionCard institution={institution} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle size={iconSizes.lg} className="mx-auto mb-4 text-amber-500" />
            <h3 className="text-xl font-medium mb-2">No Institutions Found</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first institution.
            </p>
            <Link to="/institutions/create">
              <Button color="primary" icon={<PlusCircle size={iconSizes.sm} />}>
                Add Institution
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InstitutionsListPage;