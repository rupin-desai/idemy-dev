import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { alertVariants, iconSizes } from '../../utils/animations';

const Alert = ({
  type = 'info', // info, success, warning, error
  message,
  details = null,
  onClose = null,
  show = true
}) => {
  if (!show || !message) return null;
  
  const alertStyles = {
    info: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', icon: <Info size={iconSizes.md} /> },
    success: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', icon: <CheckCircle size={iconSizes.md} /> },
    warning: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', icon: <AlertCircle size={iconSizes.md} /> },
    error: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', icon: <AlertCircle size={iconSizes.md} /> },
  };
  
  const { bg, border, text, icon } = alertStyles[type];
  
  return (
    <AnimatePresence>
      <motion.div
        className={`${bg} border-l-4 ${border} ${text} p-4 mb-6 relative`}
        role="alert"
        variants={alertVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">{icon}</div>
          <div className="flex-1">
            {typeof message === 'string' ? (
              <p className="font-medium">{message}</p>
            ) : (
              message
            )}
            {details && <p className="mt-1 text-sm">{details}</p>}
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-auto -mr-1 -mt-1 bg-transparent text-current p-1 rounded-full hover:bg-gray-200/50"
            >
              <X size={iconSizes.sm} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;