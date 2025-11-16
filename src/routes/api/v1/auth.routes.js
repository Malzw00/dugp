/**
 * @file auth.routes.js
 * @description Authentication and account access routes for the system.
 * Provides registration, login, logout, and password reset operations.
 */

const express = require('express');
const router  = express.Router();
const controller = require('@controllers/auth.controller');

/**
 * @route POST /auth/register
 * @description Register a new account in the system.
 * @access any (no authentication required)
 * @body {string} firstName - The first name of the user.
 * @body {string} lastName - The last name of the user.
 * @body {string} email - The email address of the new account.
 * @body {string} password - The password for the new account.
 */
router.post('/register', controller.register);

/**
 * @route POST /auth/login
 * @description Authenticate a user and return an access token.
 * @access any (no authentication required)
 * @body {string} email - The email of the account.
 * @body {string} password - The password of the account.
 */
router.post('/login', controller.login);

/**
 * @route POST /auth/logout
 * @description Log out the authenticated user and invalidate their session/token.
 * @access authenticated users only
 */
router.post('/logout', controller.logout);

/**
 * @route POST /auth/forgot-password
 * @description Send a password reset link or verification code to the user's email.
 * @access any (no authentication required)
 * @body {string} email - The email address linked to the account.
 */
router.post('/forgot-password', controller.forgetPassword);

/**
 * @route POST /auth/reset-password
 * @description Reset the account password using a valid reset token or code.
 * @access any (no authentication required)
 * @body {string} token - The password reset token/code.
 * @body {string} newPassword - The new password to set.
 */
router.post('/reset-password', controller.resetPassword);

/**
 * @route POST /auth/refresh
 * @description Refresh the access token using a valid refresh token.
 * @access authenticated users only
 * @body {string} refreshToken - A valid refresh token.
 */
router.post('/refresh', controller.refresh);

module.exports = router;