const Permission = require('../models/Permission');

/**
 * Get all permissions
 * GET /api/permissions
 */
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ key: 1 });

    res.status(200).json({
      success: true,
      count: permissions.length,
      permissions: permissions
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permissions',
      error: error.message
    });
  }
};

/**
 * Get single permission by ID
 * GET /api/permissions/:id
 */
const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findById(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    res.status(200).json({
      success: true,
      permission: permission
    });
  } catch (error) {
    console.error('Get permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permission',
      error: error.message
    });
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById
};
