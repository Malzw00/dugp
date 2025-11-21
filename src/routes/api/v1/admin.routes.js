/**
 * @file admins.route.js
 * @description API routes for managing admin roles and permissions within the system.
 */

const express = require('express');
const adminsRouter = express.Router();
const controller = require('@controllers/admin.controller');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');



/**
 * @route PUT /admins/accounts/:accountId/role
 * @description Assign or remove the admin role from a specific account.
 * @access Manager account or admin with appropriate permission (AHP).
 * @body {string} role - The new role to assign to the account ('admin' | 'user').
 */
adminsRouter.put(
    '/accounts/:accountId/role', 
    authenticate,
    requireRole('manager'),
    controller.updateRole,
);

/**
 * @route GET /admins/accounts
 * @description Retrieve a paginated list of all administrator accounts.
 * @access Manager account or admin with appropriate permission (AHP).
 * @query {number} [limit] - Maximum number of records to return.
 * @query {number} [offset] - Number of records to skip.
 */
adminsRouter.get(
    '/accounts', 
    authenticate,
    requireRole('admin'),
    controller.getAdmins,
);

/**
 * @route GET /admins/accounts/:accountId/permissions
 * @description Retrieve all permissions assigned to a specific account.
 * @access Manager account or admin with appropriate permission (AHP).
 */
adminsRouter.get(
    '/accounts/:accountId/permissions', 
    authenticate,
    requireRole('admin'),
    controller.getAccountPermissions,
);

/**
 * @route POST /admins/accounts/:accountId/permissions
 * @description Grant a new permission to an account.
 * @access Manager account or admin with appropriate permission (AHP).
 * @body {string} permissionId - The unique identifier of the permission to assign.
 */
adminsRouter.post(
    '/accounts/:accountId/permissions', 
    authenticate,
    requireRole('manager'),
    controller.grantPermission,
);

/**
 * @route DELETE /admins/accounts/:accountId/permissions/:permissionId
 * @description Remove a specific permission from an account.
 * @access Manager account or admin with appropriate permission (AHP).
 */
adminsRouter.delete(
    '/accounts/:accountId/permissions/:permissionId', 
    authenticate,
    requireRole('manager'),
    controller.removePermission,
);



module.exports = adminsRouter;