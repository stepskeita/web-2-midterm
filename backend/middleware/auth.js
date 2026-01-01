const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

/**
 * Authentication middleware
 * Validates JWT token and attaches user, role, and permissions to request
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user with role and permissions
    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate({
        path: 'role',
        populate: {
          path: 'permissions'
        }
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Authorization denied.'
      });
    }

    // Attach user data to request
    req.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePhoto: user.profilePhoto,
      role: {
        _id: user.role._id,
        name: user.role.name
      },
      permissions: user.role.permissions.map(p => p.key)
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

module.exports = auth;
