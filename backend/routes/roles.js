const express = require('express');
const router = express.Router();
const {
  createRole,
  updateRole,
  getAllRoles,
  getAccessMatrix,
  deleteRole
} = require('../controllers/roleController');
const auth = require('../middleware/auth');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');

// @route   GET /api/roles/access-matrix
// @desc    Get access matrix (all roles with permissions)
// @access  Private (authenticated users)
router.get('/access-matrix', auth, getAccessMatrix);

// @route   GET /api/roles
// @desc    Get all roles
// @access  Public (needed for registration)
router.get('/', getAllRoles);

// @route   POST /api/roles
// @desc    Create a new role
// @access  Private (SuperAdmin only)
router.post('/', auth, requireSuperAdmin, createRole);

// @route   PUT /api/roles/:id
// @desc    Update role permissions
// @access  Private (SuperAdmin only)
router.put('/:id', auth, requireSuperAdmin, updateRole);

// @route   DELETE /api/roles/:id
// @desc    Delete a role
// @access  Private (SuperAdmin only)
router.delete('/:id', auth, requireSuperAdmin, deleteRole);

module.exports = router;
