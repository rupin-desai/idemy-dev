import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, BookOpen, UserCircle, Briefcase, Calendar, BookOpenCheck, GraduationCap } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const StudentRegistrationPage = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: currentUser?.displayName?.split(' ')[0] || '',
    lastName: currentUser?.displayName?.split(' ')[1] || '',
    dateOfBirth: "",
    educationLevel: "undergraduate",
    bio: "",
    skills: ""
  });
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      setError("First and last name are required");
      return;
    }
    
    // Add validation for date of birth
    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Format date to ensure consistency
      const formattedDate = formData.dateOfBirth;
      
      // Call API to register student with personal information
      const response = await axios.post('http://localhost:3000/api/students/register', {
        uid: currentUser?.uid,
        email: currentUser?.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formattedDate,
        educationLevel: formData.educationLevel,
        bio: formData.bio,
        skills: formData.skills,
        // Add these required fields to satisfy API validation
        institution: "Pending", // Default value since institutions are handled via applications now
        department: "Pending", // Default value
        // Add explicit metadata for blockchain transaction
        metadata: {
          role: 'student',
          transactionType: 'STUDENT_REGISTRATION',
          dateOfBirth: formattedDate // Add dateOfBirth explicitly in metadata
        }
      });
      
      if (response.data.success && response.data.student) {
        // Store generated student ID
        setGeneratedId(response.data.student.studentId);
        
        // Update user profile with student information
        await updateProfile({
          ...currentUser,
          student: {
            studentId: response.data.student.studentId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            educationLevel: formData.educationLevel
          },
          role: 'student'
        });
        
        setSuccess(true);
        
        // Force reload user profile to ensure all changes are reflected
        setTimeout(() => {
          window.location.href = '/create-id';  // Use window.location for full refresh
        }, 3000);
      }
    } catch (err) {
      console.error("Student registration error:", err);
      setError(err.response?.data?.message || "Failed to register as student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
            <GraduationCap size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Student Registration</h1>
          <p className="text-gray-600 mt-2">
            Register as a student to create your digital ID and apply to institutions
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  <span className="font-medium">Successfully registered as a student!</span>
                </div>
                {generatedId && (
                  <div className="mt-2 ml-7">
                    <p>Your student ID: <span className="font-medium text-indigo-700">{generatedId}</span></p>
                    <p className="text-sm mt-1">Please save this ID for your records.</p>
                  </div>
                )}
                <p className="ml-7 mt-2 text-sm">Redirecting to create your first ID card...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    placeholder="Your first name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="educationLevel" className="block text-sm font-medium text-slate-700 mb-1">
                  Education Level
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                >
                  <option value="high_school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">
                About Me
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                placeholder="Brief introduction about yourself"
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-1">
                Skills & Interests
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Programming, design, research, etc. (comma separated)"
                />
              </div>
            </div>

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || success}
                className={`w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-md ${
                  (isSubmitting || success) ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <BookOpenCheck size={18} className="mr-2" />
                    Register as Student
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentRegistrationPage;