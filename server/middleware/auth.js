const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

// Validate JWT_SECRET strength in production
if (process.env.NODE_ENV === 'production' && JWT_SECRET.length < 32) {
  console.error('FATAL ERROR: JWT_SECRET must be at least 32 characters in production!');
  process.exit(1);
}

const authMiddleware = async (req, res, next) => {
  try {
    console.log('[Auth Debug] Starting auth middleware');
    console.log('[Auth Debug] Headers:', req.headers.authorization ? 'Bearer token present' : 'No Bearer token');
    console.log('[Auth Debug] Cookies:', req.cookies.inventory_auth_token ? 'Cookie present' : 'No cookie');
    
    // Check cookie first, then Authorization header
    const token = req.cookies.inventory_auth_token || 
                  (req.headers.authorization?.startsWith('Bearer ') 
                    ? req.headers.authorization.substring(7) 
                    : null);

    if (!token) {
      console.log('[Auth Debug] No token found');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('[Auth Debug] Token decoded successfully:', { userId: decoded.user_id, username: decoded.username, role: decoded.role });
      req.user = decoded;
      next();
    } catch (error) {
      console.log('[Auth Debug] Token verification failed:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    console.log('[Auth] requireRole middleware called');
    console.log('[Auth] req.user:', req.user);
    console.log('[Auth] allowedRoles:', allowedRoles);
    
    if (!req.user) {
      console.log('[Auth] No user found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    console.log('[Auth] User role:', req.user.role);
    console.log('[Auth] Role check:', allowedRoles.includes(req.user.role));

    if (!allowedRoles.includes(req.user.role)) {
      console.log('[Auth] Role check failed - insufficient permissions');
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    console.log('[Auth] Role authorization passed');
    next();
  };
};

module.exports = { 
  authMiddleware, 
  requireRole, 
  authenticate: authMiddleware,
  authorize: requireRole,
  JWT_SECRET 
};
