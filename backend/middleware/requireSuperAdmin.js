/**
 * SuperAdmin authorization middleware
 * Ensures only users with SuperAdmin role can access the route
 */
const requireSuperAdmin = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user has SuperAdmin role
  if (req.user.role.name !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only SuperAdmin can perform this action.',
      userRole: req.user.role.name
    });
  }

  // User is SuperAdmin, proceed
  next();
};

module.exports = requireSuperAdmin;
