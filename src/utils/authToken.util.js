// utils/authToken.util.js
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Environment secrets
const AT_SK = process.env.ACCESS_TOKEN_SECRET;
const RT_SK = process.env.REFRESH_TOKEN_SECRET;
const RPT_SK = process.env.RESET_TOKEN_SECRET;

// Validate secrets on load
if (!AT_SK || !RT_SK || !RPT_SK) {
  throw new Error("JWT secret keys are missing from environment variables.");
}

// Token expiration durations (in seconds)
const AccessTokenExpIn  = 15 * 60;            // 15 minutes
const RefreshTokenExpIn = 30 * 24 * 60 * 60;  // 30 days
const ResetTokenExpIn   = 15 * 60;            // 15 minutes


/**
 * @module TokenUtil
 * @description Utility functions for generating and verifying JWT tokens.
 */

function generateAccessToken(payload, expiresIn = AccessTokenExpIn) {
  return {
    token: jwt.sign(payload, AT_SK, { expiresIn }),
    expiresAt: new Date(Date.now() + expiresIn * 1000),
  };
}

function generateRefreshToken(payload, expiresIn = RefreshTokenExpIn) {
  return {
    token: jwt.sign({ ...payload, token_id: uuidv4() }, RT_SK, { expiresIn }),
    expiresAt: new Date(Date.now() + expiresIn * 1000),
  };
}

function generateResetToken(payload, expiresIn = ResetTokenExpIn) {
  return {
    token: jwt.sign(payload, RPT_SK, { expiresIn }),
    expiresAt: new Date(Date.now() + expiresIn * 1000),
  };
}


// ------------------- VERIFY FUNCTIONS -------------------

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, AT_SK);
  } catch (error) {
    if (error.name === "TokenExpiredError")
      throw { ...error, code: "TOKEN_EXPIRED", message: "Access token has expired" };

    if (error.name === "JsonWebTokenError" && error.message === "invalid signature")
      throw { ...error, code: "INVALID_SIGN", message: "Access token signature is invalid" };

    throw { ...error, code: "UNKNOWN_ERROR", message: "Access token verification failed" };
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, RT_SK);
  } catch (error) {
    if (error.name === "TokenExpiredError")
      throw { ...error, code: "TOKEN_EXPIRED", message: "Refresh token has expired", };

    if (error.name === "JsonWebTokenError" && error.message === "invalid signature")
      throw { ...error, code: "INVALID_SIGN", message: "Refresh token signature is invalid", };

    throw { ...error, code: "UNKNOWN_ERROR", message: "Refresh token verification failed", };
  }
}

function verifyResetPasswordToken(token) {
  try {
    return jwt.verify(token, RPT_SK);
  } catch (error) {
    if (error.name === "TokenExpiredError")
      throw { ...error, code: "TOKEN_EXPIRED", message: "Reset token has expired", };

    if (error.name === "JsonWebTokenError" && error.message === "invalid signature")
      throw { ...error, code: "INVALID_SIGN", message: "Reset token signature is invalid", };

    throw { ...error, code: "UNKNOWN_ERROR", message: "Reset token verification failed", };
  }
}


// ------------------- PAYLOAD BUILDERS -------------------

function buildATPayload({ accountID, accountRole }) {
  return { accountID: accountID, accountRole };
}

function buildRTPayload({ accountID }) {
  return { accountID: accountID };
}

function buildRPTPayload({ accountID }) {
  return { accountID: accountID };
}


// ------------------- EXPORT -------------------

module.exports = {
  AccessTokenExpIn,
  RefreshTokenExpIn,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetPasswordToken,
  buildATPayload,
  buildRTPayload,
  buildRPTPayload,
};