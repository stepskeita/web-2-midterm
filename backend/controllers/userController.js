const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Assign role to user (SuperAdmin only)
 * PUT /api/users/:id/role
 */
const assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    // Validate roleId provided
    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roleId'
      });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Update user role
    user.role = roleId;
    await user.save();

    // Fetch updated user with populated role
    const updatedUser = await User.findById(id)
      .select('-password')
      .populate({
        path: 'role',
        populate: {
          path: 'permissions'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Role assigned successfully',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto,
        role: updatedUser.role.name,
        permissions: updatedUser.role.permissions.map(p => p.key)
      }
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning role',
      error: error.message
    });
  }
};

/**
 * Get all users (with roles and permissions)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate({
        path: 'role',
        populate: {
          path: 'permissions'
        }
      })
      .sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePhoto: user.profilePhoto,
      role: user.role.name,
      roleId: user.role._id,
      permissions: user.role.permissions.map(p => p.key),
      createdAt: user.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

module.exports = {
  assignRole,
  getAllUsers
};
