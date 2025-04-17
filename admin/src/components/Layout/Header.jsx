// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';
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
        <div className="flex items-center">
          <img 
            src="/logo_full_blue.png" 
            alt="IDEMY" 
            className="h-8 md:h-10 hidden md:block" 
          />
          <img 
            src="/logo_icon_blue.png" 
            alt="IDEMY" 
            className="h-8 md:hidden" 
          />
          <div className="h-6 w-px bg-gray-300 mx-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Database size={iconSizes.md} className="mr-2 text-blue-600" />
            Blockchain Admin
          </h2>
        </div>
        
      </div>
    </header>
  );
};

export default Header;