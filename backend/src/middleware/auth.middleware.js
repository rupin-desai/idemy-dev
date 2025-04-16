// backend/src/middleware/auth.middleware.js
const authService = require("../services/auth.service");
const logger = require("../utils/logger.utils");
const jwt = require('jsonwebtoken');

// Firebase authentication middleware
exports.authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error(`JWT verification failed: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Role-based access control middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRole = req.user.role || "user";

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role '${userRole}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

// Check if a user is acting on their own resource
exports.checkOwnership = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const resourceUserId = req.params.userId || req.body.userId;

  if (resourceUserId && resourceUserId !== req.user.uid) {
    // Allow admins to override ownership check
    if (req.user.role === "admin") {
      next();
      return;
    }

    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource",
    });
  }

  next();
};
