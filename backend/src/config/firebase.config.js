// backend/src/config/firebase.config.js
const admin = require('firebase-admin');
const logger = require('../utils/logger.utils');

// Track initialization status
let isInitialized = false;

try {
  // Check if Firebase is already initialized
  if (admin.apps.length === 0) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is missing');
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // Verify essential fields exist
      if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error('Firebase service account is missing required fields');
      }
    } catch (parseError) {
      logger.error(`Failed to parse Firebase service account JSON: ${parseError.message}`);
      throw new Error('Invalid Firebase service account JSON format');
    }

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    
    isInitialized = true;
    logger.info('Firebase Admin SDK initialized successfully');
  } else {
    isInitialized = true;
    logger.info('Firebase Admin SDK already initialized');
  }
} catch (error) {
  logger.error(`Firebase initialization failed: ${error.message}`);
  // Log more details about the environment
  logger.error(`Firebase environment check: 
    FIREBASE_DATABASE_URL: ${process.env.FIREBASE_DATABASE_URL ? 'Set' : 'Not set'}
    FIREBASE_SERVICE_ACCOUNT: ${process.env.FIREBASE_SERVICE_ACCOUNT ? 'Set (length: ' + process.env.FIREBASE_SERVICE_ACCOUNT.length + ')' : 'Not set'}`
  );
}

// Export the admin object with initialization status
module.exports = {
  admin,
  isInitialized
};