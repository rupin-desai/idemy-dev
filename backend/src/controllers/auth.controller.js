const authService = require("../services/auth.service");
const firebaseAdminModule = require("../config/firebase.config");
const admin = firebaseAdminModule.admin;
const logger = require("../utils/logger.utils");
const studentService = require("../services/student.service");
const jwt = require("jsonwebtoken");

class AuthController {
  async registerUser(req, res) {
    try {
      const userData = req.body;
      logger.info(`Registration attempt for email: ${userData.email}`);

      if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
      ) {
        return res.status(400).json({
          success: false,
          message: "Email, password, first name, and last name are required",
        });
      }

      // Check Firebase initialization status
      if (!firebaseAdminModule.isInitialized) {
        logger.error(
          "Registration failed: Firebase Admin SDK is not initialized"
        );
        return res.status(500).json({
          success: false,
          message: "Firebase authentication system is currently unavailable",
        });
      }

      // Create Firebase user
      const userRecord = await authService.createUser(userData);

      // Generate JWT token
      const token = jwt.sign(
        {
          uid: userRecord.uid,
          email: userRecord.email,
          name: `${userData.firstName} ${userData.lastName}`,
          role: userData.role || "user",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || "24h" }
      );

      // Create student record if needed
      let student = null;
      if (userData.createStudent) {
        try {
          student = studentService.createStudent({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            additionalInfo: {
              firebaseUid: userRecord.uid,
            },
          });
        } catch (studentError) {
          logger.error(
            `Failed to create student record: ${studentError.message}`
          );
          // Continue even if student creation fails
        }
      }

      // Remove sensitive data before returning
      const result = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
      };

      if (student) {
        result.studentId = student.studentId;
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: result,
      });
    } catch (error) {
      logger.error(`User registration error: ${error.message}`);

      // Handle specific Firebase auth errors
      if (error.code === "auth/email-already-exists") {
        return res.status(400).json({
          success: false,
          message: "Email address is already in use",
        });
      }

      if (error.code === "auth/invalid-email") {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      if (error.code === "auth/invalid-password") {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      try {
        // Get user from Firebase
        const userRecord = await authService.getUserByEmail(email);

        // Generate JWT token
        const token = jwt.sign(
          {
            uid: userRecord.uid,
            email: userRecord.email,
            role: userRecord.customClaims?.role || "user",
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRY || "24h" }
        );

        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            emailVerified: userRecord.emailVerified,
          },
        });
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  }

  async getUserProfile(req, res) {
    try {
      const uid = req.user.uid;

      // Get user data from Firebase
      const userRecord = await authService.getUserById(uid);

      // Check if user has an associated student record
      let student = null;
      try {
        // Find student by email or by firebaseUid in additionalInfo
        const students = studentService.getAllStudents();
        student = students.find(
          (s) =>
            s.email === userRecord.email ||
            (s.additionalInfo && s.additionalInfo.firebaseUid === uid)
        );
      } catch (error) {
        logger.warn(
          `Failed to find student record for user ${uid}: ${error.message}`
        );
      }

      // Remove sensitive data before returning
      const result = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      };

      if (student) {
        result.student = {
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
        };
      }

      return res.status(200).json({
        success: true,
        user: result,
      });
    } catch (error) {
      logger.error(`Get user profile error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve user profile",
        error: error.message,
      });
    }
  }

  async verifyToken(req, res) {
    try {
      // The token has already been verified in the auth middleware
      return res.status(200).json({
        success: true,
        message: "Token is valid",
        user: {
          uid: req.user.uid,
          email: req.user.email,
          role: req.user.role || "user",
        },
      });
    } catch (error) {
      logger.error(`Token verification error: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: "Token verification failed",
        error: error.message,
      });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const uid = req.user.uid;
      const updates = req.body;

      // Update user data in Firebase
      const userRecord = await authService.updateUser(uid, updates);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          photoURL: userRecord.photoURL,
          emailVerified: userRecord.emailVerified,
        },
      });
    } catch (error) {
      logger.error(`Update user profile error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      });
    }
  }

  async logoutUser(req, res) {
    // JWT tokens are stateless, so we just return success
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Generate password reset link with Firebase
      await admin.auth().generatePasswordResetLink(email);

      return res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      logger.error(`Password reset error: ${error.message}`);

      // Don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: "If your email is registered, you will receive a reset link",
      });
    }
  }
}

module.exports = new AuthController();
