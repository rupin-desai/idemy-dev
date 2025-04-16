// backend/src/services/auth.service.js
const firebaseAdminModule = require("../config/firebase.config");
const admin = firebaseAdminModule.admin;
const isFirebaseInitialized = firebaseAdminModule.isInitialized;
const logger = require("../utils/logger.utils");
const Student = require("../models/student.model");

class AuthService {
  async verifyToken(token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      throw new Error("Invalid or expired token");
    }
  }

  async createUser(userData) {
    try {
      // Check if Firebase is initialized
      if (!isFirebaseInitialized) {
        logger.error(`Firebase user creation failed: Firebase Admin SDK is not initialized`);
        throw new Error('Firebase Admin SDK is not initialized');
      }
      
      // Create Firebase user
      const userRecord = await admin.auth().createUser({
        email: userData.email,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      // Set custom claims if needed
      if (userData.role) {
        await admin.auth().setCustomUserClaims(userRecord.uid, {
          role: userData.role,
        });
      }

      logger.info(`Firebase user created: ${userRecord.uid}`);
      return userRecord;
    } catch (error) {
      logger.error(`Firebase user creation failed: ${error.message}`);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return userRecord;
    } catch (error) {
      logger.error(`Get user by email failed: ${error.message}`);
      throw error;
    }
  }

  async getUserById(uid) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      logger.error(`Get user by ID failed: ${error.message}`);
      throw error;
    }
  }

  async updateUser(uid, userData) {
    try {
      const updateData = {};

      if (userData.email) updateData.email = userData.email;
      if (userData.firstName && userData.lastName) {
        updateData.displayName = `${userData.firstName} ${userData.lastName}`;
      }
      if (userData.photoURL) updateData.photoURL = userData.photoURL;
      if (userData.emailVerified !== undefined)
        updateData.emailVerified = userData.emailVerified;
      
      // Handle custom claims (including student role and ID)
      if (userData.customClaims) {
        await admin.auth().setCustomUserClaims(uid, userData.customClaims);
        logger.info(`Updated custom claims for user ${uid}`);
      }

      const userRecord = await admin.auth().updateUser(uid, updateData);
      return userRecord;
    } catch (error) {
      logger.error(`User update failed: ${error.message}`);
      throw error;
    }
  }

  async deleteUser(uid) {
    try {
      await admin.auth().deleteUser(uid);
      logger.info(`Firebase user deleted: ${uid}`);
      return true;
    } catch (error) {
      logger.error(`User deletion failed: ${error.message}`);
      throw error;
    }
  }

  async listUsers(limit = 1000) {
    try {
      const listUsersResult = await admin.auth().listUsers(limit);
      return listUsersResult.users;
    } catch (error) {
      logger.error(`List users failed: ${error.message}`);
      throw error;
    }
  }

  async verifyEmail(uid) {
    try {
      await admin.auth().updateUser(uid, {
        emailVerified: true,
      });
      return true;
    } catch (error) {
      logger.error(`Email verification failed: ${error.message}`);
      throw error;
    }
  }

  async generateJWT(userData) {
    const jwt = require("jsonwebtoken");

    return jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "24h",
    });
  }

  async verifyJWT(token) {
    const jwt = require("jsonwebtoken");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      logger.error(`JWT verification failed: ${error.message}`);
      throw new Error("Invalid or expired JWT token");
    }
  }

  async generatePasswordResetLink(email) {
    try {
      const link = await admin.auth().generatePasswordResetLink(email);
      return link;
    } catch (error) {
      logger.error(`Password reset link generation failed: ${error.message}`);
      throw error;
    }
  }

  async generateEmailVerificationLink(email) {
    try {
      const link = await admin.auth().generateEmailVerificationLink(email);
      return link;
    } catch (error) {
      logger.error(
        `Email verification link generation failed: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = new AuthService();
