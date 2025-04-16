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
  }
};