/**
 * Format a date string to a human-readable format
 * @param {string} dateString - The date string to format
 * @param {object} options - Optional formatting options
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(undefined, { ...defaultOptions, ...options });
  } catch (err) {
    console.error("Error formatting date:", err);
    return "Error";
  }
};

/**
 * Format a date to YYYY-MM-DD for input fields
 * @param {string} dateString - The date string to format
 * @returns {string} Date formatted as YYYY-MM-DD
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    return date.toISOString().split('T')[0];
  } catch (err) {
    console.error("Error formatting date for input:", err);
    return "";
  }
};