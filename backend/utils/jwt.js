const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload containing userId and roleId
 * @returns {String} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      roleId: payload.roleId
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload containing userId and roleId
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      roleId: payload.roleId
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify access token
 * @param {String} token - JWT access token
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * Verify refresh token
 * @param {String} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
