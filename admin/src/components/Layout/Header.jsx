// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';

const Header = () => {
  const { saveBlockchain, validateBlockchain } = useBlockchain();
  const [savingStatus, setSavingStatus] = useState('');
  const [validationStatus, setValidationStatus] = useState('');

  const handleSave = async () => {
    setSavingStatus('Saving...');
    try {
      const result = await saveBlockchain();
      setSavingStatus(result.success ? 'Saved!' : 'Failed!');
      setTimeout(() => setSavingStatus(''), 3000);
    } catch (error) {
      setSavingStatus('Error!');
      setTimeout(() => setSavingStatus(''), 3000);
    }
  };

  const handleValidate = async () => {
    setValidationStatus('Validating...');
    try {
      const result = await validateBlockchain();
      setValidationStatus(result.isValid ? 'Valid!' : 'Invalid!');
      setTimeout(() => setValidationStatus(''), 3000);
    } catch (error) {
      setValidationStatus('Error!');
      setTimeout(() => setValidationStatus(''), 3000);
    }
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blockchain Control Panel</h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleValidate}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            Validate Chain
            {validationStatus && (
              <span className="ml-2 text-xs font-bold">{validationStatus}</span>
            )}
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            Save Blockchain
            {savingStatus && (
              <span className="ml-2 text-xs font-bold">{savingStatus}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;