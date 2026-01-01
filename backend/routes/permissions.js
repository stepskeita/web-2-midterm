const express = require('express');
const router = express.Router();
const { getAllPermissions, getPermissionById } = require('../controllers/permissionController');
const auth = require('../middleware/auth');

// @route   GET /api/permissions
// @desc    Get all permissions
// @access  Private (authenticated users)
router.get('/', auth, getAllPermissions);

// @route   GET /api/permissions/:id
// @desc    Get single permission by ID
// @access  Private (authenticated users)
router.get('/:id', auth, getPermissionById);

module.exports = router;
