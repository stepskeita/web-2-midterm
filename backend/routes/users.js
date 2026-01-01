const express = require('express');
const router = express.Router();
const { assignRole, getAllUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (authenticated users)
router.get('/', auth, getAllUsers);

// @route   PUT /api/users/:id/role
// @desc    Assign role to user
// @access  Private (SuperAdmin only)
router.put('/:id/role', auth, requireSuperAdmin, assignRole);

module.exports = router;
