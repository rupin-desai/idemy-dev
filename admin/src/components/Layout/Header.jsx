// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useBlockchain } from '../../hooks/useBlockchain';
import { buttonVariants, iconSizes } from '../../utils/animations';

const Header = () => {
  const { saveBlockchain, validateBlockchain } = useBlockchain();
  const [savingStatus, setSavingStatus] = useState('');
  const [validationStatus, setValidationStatus] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSavingStatus('Saving...');
    
    try {
      const result = await saveBlockchain();
      setSavingStatus(result.success ? 'Saved!' : 'Failed!');
      setTimeout(() => setSavingStatus(''), 3000);
    } catch (error) {
      setSavingStatus('Error!');
      setTimeout(() => setSavingStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    if (isValidating) return;
    setIsValidating(true);
    setValidationStatus('Validating...');
    
    try {
      const result = await validateBlockchain();
      setValidationStatus(result.isValid ? 'Valid!' : 'Invalid!');
      setTimeout(() => setValidationStatus(''), 3000);
    } catch (error) {
      setValidationStatus('Error!');
      setTimeout(() => setValidationStatus(''), 3000);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Blockchain Control Panel</h2>
        <div className="flex space-x-4">
          <motion.button 
            onClick={handleValidate}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            disabled={isValidating}
          >
            {isValidating ? (
              <RefreshCw className="mr-2 animate-spin" size={iconSizes.sm} />
            ) : validationStatus === 'Valid!' ? (
              <CheckCircle className="mr-2" size={iconSizes.sm} />
            ) : validationStatus === 'Invalid!' ? (
              <AlertCircle className="mr-2" size={iconSizes.sm} />
            ) : (
              <CheckCircle className="mr-2" size={iconSizes.sm} />
            )}
            Validate Chain
            {validationStatus && (
              <span className={`ml-2 text-xs font-bold ${
                validationStatus === 'Valid!' ? 'text-green-200' : 
                validationStatus === 'Invalid!' ? 'text-red-200' : ''
              }`}>
                {validationStatus}
              </span>
            )}
          </motion.button>
          
          <motion.button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            disabled={isSaving}
          >
            {isSaving ? (
              <RefreshCw className="mr-2 animate-spin" size={iconSizes.sm} />
            ) : (
              <Save className="mr-2" size={iconSizes.sm} />
            )}
            Save Blockchain
            {savingStatus && (
              <span className="ml-2 text-xs font-bold">{savingStatus}</span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;