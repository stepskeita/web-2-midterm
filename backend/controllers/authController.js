const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {

    const { fullName, email, password, role, profilePhoto } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, password, role'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate role exists
    const userRole = await Role.findById(role).populate('permissions');
    if (!userRole) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided'
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      profilePhoto: profilePhoto || null
    });

    // Fetch user with populated role and permissions
    const populatedUser = await User.findById(user._id)
      .select('-password')
      .populate({
        path: 'role',
        populate: {
          path: 'permissions'
        }
      });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      roleId: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      roleId: user.role
    });

    // Prepare response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        _id: populatedUser._id,
        fullName: populatedUser.fullName,
        email: populatedUser.email,
        profilePhoto: populatedUser.profilePhoto,
        role: populatedUser.role.name,
        permissions: populatedUser.role.permissions.map(p => p.key)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and populate role with permissions
    const user = await User.findOne({ email }).populate({
      path: 'role',
      populate: {
        path: 'permissions'
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Handle case where user's role has been deleted
    if (!user.role) {
      // Find the most basic role (Viewer) and assign it to the user
      const viewerRole = await Role.findOne({ name: 'Viewer' }).populate('permissions');

      if (!viewerRole) {
        return res.status(500).json({
          success: false,
          message: 'System configuration error: No default role available. Please contact administrator.'
        });
      }

      // Update user with the default role
      user.role = viewerRole._id;
      await user.save();

      // Re-populate for response
      await user.populate({
        path: 'role',
        populate: {
          path: 'permissions'
        }
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      roleId: user.role._id
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      roleId: user.role._id
    });

    // Prepare response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role.name,
        permissions: user.role.permissions.map(p => p.key)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};
