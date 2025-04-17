import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ClipboardList, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useInstitutions } from '../hooks/useInstitutions';
import { useStudents } from '../hooks/useStudents';
import { pageVariants, cardVariants, iconSizes } from '../utils/animations';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import ApplicationCard from '../components/Application/ApplicationCard';

const ApplicationsListPage = () => {
  const { studentId, institutionId } = useParams();
  const { 
    applications, 
    loading, 
    error, 
    fetchAllApplications, 
    getApplicationsByStudent, 
    getApplicationsByInstitution
  } = useApplications();
  const { getInstitutionById } = useInstitutions();
  const { fetchStudentById } = useStudents();
  
  const [currentApplications, setCurrentApplications] = useState([]);
  const [filterEntity, setFilterEntity] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'student', or 'institution'

  useEffect(() => {
    const loadApplications = async () => {
      try {
        if (studentId) {
          // Load student applications
          const studentApps = await getApplicationsByStudent(studentId);
          setCurrentApplications(studentApps);
          setFilterType('student');
          
          // Load student details
          try {
            const student = await fetchStudentById(studentId);
            setFilterEntity(student);
          } catch (err) {
            console.error("Failed to load student:", err);
          }
        } else if (institutionId) {
          // Load institution applications
          const institutionApps = await getApplicationsByInstitution(institutionId);
          setCurrentApplications(institutionApps);
          setFilterType('institution');
          
          // Load institution details
          try {
            const institution = await getInstitutionById(institutionId);
            setFilterEntity(institution);
          } catch (err) {
            console.error("Failed to load institution:", err);
          }
        } else {
          // Load all applications
          const allApps = await fetchAllApplications();
          setCurrentApplications(allApps);
          setFilterType('all');
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    };

    loadApplications();
  }, [
    studentId, 
    institutionId, 
    getApplicationsByStudent, 
    getApplicationsByInstitution, 
    fetchAllApplications,
    fetchStudentById,
    getInstitutionById
  ]);

  const handleRefresh = async () => {
    if (studentId) {
      const apps = await getApplicationsByStudent(studentId);
      setCurrentApplications(apps);
    } else if (institutionId) {
      const apps = await getApplicationsByInstitution(institutionId);
      setCurrentApplications(apps);
    } else {
      await fetchAllApplications();
    }
  };

  if (loading && currentApplications.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={iconSizes.lg} />
        <span className="text-lg">Loading applications data...</span>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          {(studentId || institutionId) && (
            <Link 
              to={studentId ? "/students" : "/institutions"} 
              className="text-blue-600 hover:underline flex items-center mb-2"
            >
              <ArrowLeft size={iconSizes.sm} className="mr-1" />
              Back to {studentId ? "Students" : "Institutions"}
            </Link>
          )}
          
          <h1 className="text-3xl font-bold flex items-center">
            <ClipboardList size={iconSizes.lg} className="mr-3 text-blue-600" />
            {filterType === 'student' && filterEntity ? (
              <>Student Applications: {filterEntity.firstName} {filterEntity.lastName}</>
            ) : filterType === 'institution' && filterEntity ? (
              <>Institution Applications: {filterEntity.name}</>
            ) : (
              <>All Applications</>
            )}
          </h1>
        </div>
        
        <Button
          onClick={handleRefresh}
          color="primary"
          icon={<RefreshCw size={iconSizes.sm} />}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => {}} 
          show={true}
          details={
            <Button
              onClick={handleRefresh}
              color="danger"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          }
        />
      )}

      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        variants={cardVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Applications ({currentApplications.length})
          </h2>
        </div>

        {currentApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentApplications.map(application => (
              <ApplicationCard key={application.applicationId} application={application} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <AlertCircle size={iconSizes.xl} className="text-amber-500 mb-3" />
            <p className="mb-1">No applications found</p>
            <p className="text-sm text-gray-400">
              {filterType === 'student' ? 
                "This student has not applied to any institutions yet." : 
                filterType === 'institution' ?
                "This institution has not received any applications yet." :
                "There are no applications in the system yet."
              }
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ApplicationsListPage;