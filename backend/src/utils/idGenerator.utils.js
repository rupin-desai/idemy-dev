const crypto = require('crypto');

module.exports = {
  generateStudentId(prefix = 'STU') {
    // Generate an 8-character unique ID for students
    const randomPart = crypto.randomBytes(4).toString('hex');
    return `${prefix}${randomPart.toUpperCase()}`;
  },

  generateTransactionId() {
    // Generate a unique transaction ID with a timestamp component
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(8).toString('hex');
    return `TX${timestamp}${randomPart}`;
  },

  generateBlockId(index) {
    // Generate a unique block ID based on index and random value
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(4).toString('hex');
    return `BLK${index.toString().padStart(6, '0')}${timestamp}${randomPart}`;
  },
  
  generateUniqueId(prefix = '') {
    // Generic unique ID generator
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(6).toString('hex');
    return `${prefix}${timestamp}${randomPart}`;
  },

  generateStudentId() {
    // Generate random 8-character alphanumeric ID
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `STU${randomPart}`;
  },

  validateStudentId(id) {
    return /^STU[A-Z0-9]{8}$/i.test(id);
  },

  generateNftId() {
    // Generate a unique NFT token ID with IDM (ID Management) prefix
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(6).toString('hex');
    return `IDM${timestamp}${randomPart}`;
  },

  generateIdCardFilename(studentId) {
    // Generate a filename for the ID card image
    return `${studentId}_${Date.now()}.png`;
  }
};