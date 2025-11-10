/**
 * @file admins.route.js
 * @description API routes for managing admin roles and permissions within the system.
 * Provides endpoints for promoting/demoting accounts, managing permissions, and listing administrators.
 */

const express = require('express');
const adminsRouter = express.Router();

/**
 * @route PUT /admins/accounts/:accountId/role
 * @description Assign or remove the admin role from a specific account.
 * @access Manager account or admin with appropriate permission (AHP).
 * @body {string} role - The new role to assign to the account (e.g., 'admin', 'user').
 */
adminsRouter.put('/:accountId/role', );

/**
 * @route GET /admins/accounts
 * @description Retrieve a paginated list of all administrator accounts.
 * @access Manager account or admin with appropriate permission (AHP).
 * @query {number} [limit] - Maximum number of records to return.
 * @query {number} [offset] - Number of records to skip.
 */
adminsRouter.get('/', );

/**
 * @route GET /admins/accounts/:accountId/permissions
 * @description Retrieve all permissions assigned to a specific account.
 * @access Manager account or admin with appropriate permission (AHP).
 * @returns {Array<Object>} List of permissions.
 */
adminsRouter.get('/:accountId/permissions', );

/**
 * @route POST /admins/accounts/:accountId/permissions
 * @description Grant a new permission to an account.
 * @access Manager account or admin with appropriate permission (AHP).
 * @body {string} permissionId - The unique identifier of the permission to assign.
 */
adminsRouter.post('/:accountId/permissions', );

/**
 * @route DELETE /admins/accounts/:accountId/permissions/:permissionId
 * @description Remove a specific permission from an account.
 * @access Manager account or admin with appropriate permission (AHP).
 */
adminsRouter.delete('/:accountId/permissions/:permissionId', );


module.exports = adminsRouter;