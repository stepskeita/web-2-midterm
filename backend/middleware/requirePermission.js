/**
 * Permission authorization middleware
 * Checks if authenticated user has required permission
 * @param {String} permissionKey - Required permission key (create, edit, delete, publish, view)
 * @returns {Function} Express middleware function
 */
const requirePermission = (permissionKey) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has permissions array
    if (!req.user.permissions || !Array.isArray(req.user.permissions)) {
      return res.status(403).json({
        success: false,
        message: 'No permissions found for user'
      });
    }

    // Check if user has the required permission
    if (!req.user.permissions.includes(permissionKey)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You do not have the '${permissionKey}' permission.`,
        requiredPermission: permissionKey,
        userPermissions: req.user.permissions
      });
    }

    // User has permission, proceed
    next();
  };
};

module.exports = requirePermission;
