const Role = require('../models/Role');
const Permission = require('../models/Permission');

/**
 * Create a new role (SuperAdmin only)
 * POST /api/roles
 */
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Validate required fields
    if (!name || !permissions) {
      return res.status(400).json({
        success: false,
        message: 'Please provide role name and permissions'
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Validate permissions exist
    const validPermissions = await Permission.find({
      _id: { $in: permissions }
    });

    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more invalid permission IDs provided'
      });
    }

    // Create role
    const role = await Role.create({ name, permissions });
    const populatedRole = await Role.findById(role._id).populate('permissions');

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      role: populatedRole
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};

/**
 * Update role permissions (SuperAdmin only)
 * PUT /api/roles/:id
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    // Find role
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Validate permissions if provided
    if (permissions) {
      const validPermissions = await Permission.find({
        _id: { $in: permissions }
      });

      if (validPermissions.length !== permissions.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more invalid permission IDs provided'
        });
      }

      role.permissions = permissions;
    }

    // Update name if provided
    if (name) {
      role.name = name;
    }

    await role.save();
    const populatedRole = await Role.findById(role._id).populate('permissions');

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      role: populatedRole
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};

/**
 * Get all roles (for Access Matrix)
 * GET /api/roles
 */
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions').sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: roles.length,
      roles: roles
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

/**
 * Get access matrix (all roles with their permissions)
 * GET /api/roles/access-matrix
 */
const getAccessMatrix = async (req, res) => {
  try {
    // Get all roles with populated permissions
    const roles = await Role.find().populate('permissions').sort({ name: 1 });

    // Get all available permissions
    const allPermissions = await Permission.find().sort({ key: 1 });

    // Format access matrix
    const accessMatrix = roles.map(role => ({
      roleId: role._id,
      roleName: role.name,
      permissions: role.permissions.map(p => ({
        key: p.key,
        _id: p._id
      }))
    }));

    res.status(200).json({
      success: true,
      accessMatrix,
      availablePermissions: allPermissions.map(p => ({
        key: p.key,
        _id: p._id
      }))
    });
  } catch (error) {
    console.error('Get access matrix error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching access matrix',
      error: error.message
    });
  }
};

/**
 * Delete a role (SuperAdmin only)
 * DELETE /api/roles/:id
 */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    await role.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message
    });
  }
};

module.exports = {
  createRole,
  updateRole,
  getAllRoles,
  getAccessMatrix,
  deleteRole
};
