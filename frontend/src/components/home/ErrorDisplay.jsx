import { RefreshCcw, AlertTriangle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorDisplay = ({ error, clearError, fetchUserNfts }) => {
  const navigate = useNavigate();
  
  if (!error) return null;
  
  // Different error components based on type
  const errorComponents = {
    'not_student': {
      icon: <AlertTriangle size={24} className="text-amber-500" />,
      title: 'Student Registration Required',
      message: 'You need to be registered as a student to create and view NFTs.',
      action: (
        <button
          onClick={() => navigate('/create-student')}  
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Register as Student
        </button>
      )
    },
    'network': {
      icon: <AlertCircle size={24} className="text-amber-500" />,
      title: 'Connection Error',
      message: 'Unable to connect to the NFT service. Please check your internet connection.'
    },
    'data': {
      icon: <AlertCircle size={24} className="text-red-500" />,
      title: 'Data Error',
      message: error.message || 'Unable to load your NFTs.'
    },
    'unknown': {
      icon: <AlertCircle size={24} className="text-red-500" />,
      title: 'Unknown Error',
      message: 'An unexpected error occurred.'
    }
  };
  
  // Default to unknown if type not recognized
  const errorInfo = errorComponents[error.type] || errorComponents.unknown;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {errorInfo.icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-gray-800">{errorInfo.title}</h3>
          <p className="text-gray-600 mt-1">{errorInfo.message}</p>
          <div className="mt-3 flex space-x-2">
            {error.type !== 'not_student' && (
              <button
                onClick={() => fetchUserNfts()}
                className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md flex items-center text-sm hover:bg-indigo-200 transition-colors"
              >
                <RefreshCcw size={16} className="mr-1.5" />
                Retry
              </button>
            )}
            <button
              onClick={clearError}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
            >
              Dismiss
            </button>
            {errorInfo.action}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;