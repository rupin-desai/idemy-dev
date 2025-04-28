// backend/src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger.utils");

// Standard JWT authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user info from decoded token
    req.user = {
      uid: decoded.uid,
      email: decoded.email, // Make sure email comes from the token
      role: decoded.role || null
    };
    
    // Log who's making the request
    logger.debug(`Authenticated request from user: ${req.user.email} with role: ${req.user.role || 'none'}`);
    
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// For backward compatibility, add the authenticate alias
const authenticate = authenticateToken;

// Role authorization middleware
const authorizeRoles = (...roles) => {
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
const checkOwnership = (req, res, next) => {
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

// Special admin bypass for development
const bypassAuthForAdmin = (req, res, next) => {
  try {
    // First try to get auth from token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        // If there's a valid token, use that information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          uid: decoded.uid,
          email: decoded.email,
          role: decoded.role || null
        };
        logger.debug(`Using token auth in dev mode: ${req.user.email}`);
        return next();
      } catch (tokenError) {
        // Token invalid, will fall back to bypass
        logger.warn(`Invalid token in dev mode: ${tokenError.message}`);
      }
    }
    
    // Only use default admin if no valid token is provided
    req.user = {
      uid: 'dev-admin',
      email: req.query.email || 'dev-admin@example.com', // Allow email override via query param
      role: 'admin'
    };
    
    logger.warn(`DEV MODE: Bypassing auth with admin credentials for ${req.user.email}`);
    next();
  } catch (error) {
    logger.error(`Bypass auth error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Authentication bypass failed' });
  }
};

// Export all middleware functions properly
module.exports = { 
  authenticateToken, 
  bypassAuthForAdmin,
  authenticate,
  authorizeRoles,
  checkOwnership
};
