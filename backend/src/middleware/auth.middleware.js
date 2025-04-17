// backend/src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const config = require("../app.config");
const logger = require("../utils/logger.utils");

// Authentication middleware
exports.authenticate = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.error(`Token verification error: ${err.message}`);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Add decoded token to request for use in controllers
      req.user = decoded;
      next();
    });
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// For backward compatibility, add the authenticateToken function
exports.authenticateToken = exports.authenticate;

// Role authorization middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const userRole = req.user.role || "user";

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role ${userRole} is not allowed to access this resource`,
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

// Helper function to extract token from header
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
};

// Special admin bypass for development
exports.bypassAuthForAdmin = (req, res, next) => {
  // Set a default admin user for development environments
  if (process.env.NODE_ENV === "development") {
    req.user = {
      id: "admin",
      email: "admin@idemy.com",
      role: "admin",
    };
  }
  next();
};
