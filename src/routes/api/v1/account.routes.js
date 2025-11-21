const express = require('express');
const router  = express.Router();
const controller = require('@controllers/account.contoller');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');
const requirePermission = require('@middlewares/permission.middleware');


/**
 * @route GET /accounts/search
 * @description Search accounts by keyword, role, offset and limit.
 * @access any (no authentication required)
 * @query {string} keyword - Search keyword to match accounts.
 * @query {string} role - Filter by role (e.g., admin, user).
 * @query {number} offset
 * @query {number} limit
 */
router.get('/search', controller.search);


/* ------------------------------- Me Endpoints ------------------------------- */

/**
 * @route GET /accounts/me
 * @description Retrieve details of the authenticated user's account.
 * @access owner (authenticated user)
 */
router.get('/me', authenticate, controller.getMe);

/**
 * @route DELETE /accounts/me
 * @description Delete the authenticated user's account.
 * @access owner (authenticated user)
 */
router.delete('/me', authenticate, controller.deleteMe);

/**
 * @route PUT /accounts/me
 * @description Update the authenticated user's account.
 * @access owner (authenticated user)
 */
router.put('/me', authenticate, controller.updateMe);


/* ------------------------ Account By ID ------------------------ */

/**
 * @route GET /accounts/:accountId
 * @description Retrieve details of an account by its ID.
 * @access any (no authentication required)
 * @param {string} accountId - The ID of the account.
 */
router.get('/:accountId', controller.getByID);

/**
 * @route DELETE /accounts/:accountId
 * @description Delete an account by ID.
 * @access ahp (admin with required permission)
 * @param {string} accountId - The ID of the account to delete.
 */
router.delete(
    '/:accountId', 
    authenticate, 
    requireRole('admin'), 
    requirePermission('delete_account'), 
    controller.deleteByID
);


module.exports = router;