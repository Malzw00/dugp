/**
 * @file reference.routes.js
 * @description Routes for managing project references (create/update/delete/get)
 * including access control for administrators with project permissions.
 */

const express = require('express');
const router  = express.Router();
const controller = require('@controllers/reference.controller');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');
const requirePermission = require('@middlewares/permission.middleware');

/**
 * @route POST /references
 * @description Create a new reference entry.
 * @access Admin (requires authentication, admin role, and "projects" permission)
 * 
 * @body {string} title - Title of the reference.
 * @body {string} link - URL or local/network path of the reference.
 * @body {string} [author] - Name of the author (optional).
 * 
 * @returns {object} success - Operation status.
 * @returns {object} result - Created reference record.
 */
router.post(
    '/',
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.create
);

/**
 * @route DELETE /references/:referenceId
 * @description Delete a reference by its ID.
 * @access Admin (requires authentication, admin role, and "projects" permission)
 * 
 * @param {number} referenceId - Unique identifier of the reference.
 * 
 * @returns {object} success - Operation status.
 */
router.delete(
    '/:referenceId',
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.deleteByID
);

/**
 * @route PUT /references/:referenceId
 * @description Update a reference entry by ID.
 * @access Admin (requires authentication, admin role, and "projects" permission)
 * 
 * @param {number} referenceId - Unique identifier of the reference.
 * @body {string} [title] - Updated title.
 * @body {string} [link] - Updated link.
 * @body {string} [author] - Updated author name.
 * 
 * @returns {object} success - Operation status.
 * @returns {object} result - Updated reference record.
 */
router.put(
    '/:referenceId',
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.update
);

/**
 * @route GET /references
 * @description Retrieve a paginated list of all references.
 * @access Public
 * 
 * @query {number} [limit] - Number of results per page.
 * @query {number} [offset] - Pagination offset.
 * 
 * @returns {object} success - Operation status.
 * @returns {object[]} result - List of references.
 */
router.get('/', controller.getAll);

/**
 * @route GET /references/:referenceId
 * @description Retrieve single reference information by ID.
 * @access Public
 * 
 * @param {number} referenceId - Unique reference identifier.
 * 
 * @returns {object} success - Operation status.
 * @returns {object} result - Reference record.
 */
router.get('/:referenceId', controller.getByID);


module.exports = router;