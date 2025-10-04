const express = require('express');
const router  = express.Router();

/**
 * @route GET /accounts/search
 * @description Search accounts by keyword, role, and page number.
 *              Supports pagination via `offset` and `limit`.
 * @access any (no authentication required)
 * @query {string} keyword - Search keyword to match accounts.
 * @query {string} role - Filter results by role (e.g., admin, user).
 * @query {number} page - Page number for pagination.
 */
router.get('/search', );         

/**
 * @route GET /accounts/:accountId
 * @description Retrieve details of a single account by ID.
 * @access any (no authentication required)
 * @param {string} accountId - The ID of the account.
 */
router.get('/:accountId', );     

/**
 * @route DELETE /accounts/:accountId
 * @description Delete a specific account by ID.
 * @access ahp (admin must have permission)
 * @param {string} accountId - The ID of the account to delete.
 */
router.delete('/:accountId', );  

/**
 * @route DELETE /accounts/me
 * @description Delete the authenticated user's own account.
 * @access owner (only the account owner can perform this action)
 */
router.delete('/me', );          

/**
 * @route PUT /accounts/me
 * @description Update the authenticated user's own account.
 * @access owner (only the account owner can perform this action)
 */
router.put('/me', );             


module.exports = router;