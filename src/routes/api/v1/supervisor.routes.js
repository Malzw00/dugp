const express = require('express');
const router = express.Router();
const controller = require('@controllers/supervisor.controller');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');
const requirePermission = require('@middlewares/permission.middleware');

/* -------------------------------------------------------------------------- */
/*                                SUPERVISORS                                  */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /supervisors
 * @description Retrieve a paginated list of all supervisors.
 * @query {number} offset - Starting index for pagination.
 * @query {number} limit - Number of results to return.
 * @access Public
 */
router.get('/', controller.getAll);

/**
 * @route GET /supervisors/search
 * @description search for supervisors.
 * @query {string} text 
 * @query {number} offset - Starting index for pagination.
 * @query {number} limit - Number of results to return.
 * @access Public
 */
router.get('/search', controller.search);

/**
 * @route GET /supervisors/:supervisorId
 * @description Retrieve details of a specific supervisor by ID.
 * @param {string} supervisorId - Unique identifier of the supervisor.
 * @access Public
 */
router.get('/:supervisorId', controller.getByID);

/**
 * @route GET /supervisors/:supervisorId/projects
 * @description Retrieve all projects supervised or co-supervised by the supervisor.
 * @param {string} supervisorId - Supervisor ID.
 * @access Public
 */
router.get('/:supervisorId/projects', controller.getProjects);

/**
 * @route POST /supervisors
 * @description Create a new supervisor record.
 * @body {string} name
 * @body {string} fatherName
 * @body {string} grandFatherName
 * @body {string} familyName
 * @body {number} departmentId
 * @body {string} title
 * @body {string} email
 * @access Admin (requires permission)
 */
router.post(
    '/', 
    authenticate,
    requireRole('admin'),
    requirePermission('people'),    
    controller.create,
);

/**
 * @route PUT /supervisors/:supervisorId
 * @description Update information of a supervisor by ID.
 * @param {string} supervisorId - Unique identifier of the supervisor.
 * @body {string} name
 * @body {string} fatherName
 * @body {string} grandFatherName
 * @body {string} familyName
 * @body {number} departmentId
 * @body {number} accountId
 * @body {number} imageId
 * @body {string} title
 * @body {string} email
 * @access Admin (requires permission)
 */
router.put(
    '/:supervisorId',
    authenticate,
    requireRole('admin'),
    requirePermission('people'), 
    controller.update,
);

/**
 * @route DELETE /supervisors/:supervisorId
 * @description Delete a supervisor record by ID.
 * @param {string} supervisorId - Unique identifier of the supervisor.
 * @access Admin (requires permission)
 */
router.delete(
    '/:supervisorId',
    authenticate,
    requireRole('admin'),
    requirePermission('people'), 
    controller.delete,
);

/* -------------------------------------------------------------------------- */
/*                              SUPERVISOR ACCOUNT                             */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /supervisors/:supervisorId/account
 * @description Retrieve account link information for a specific supervisor.
 * @param {string} supervisorId - ID of the supervisor.
 * @access Public
 */
router.get('/:supervisorId/account', controller.getAccount);

/**
 * @route POST /supervisors/:supervisorId/account
 * @description Link a supervisor to a platform account.
 * @param {string} supervisorId - Supervisor ID.
 * @body {number} accountId - Platform account ID.
 * @access Admin (requires permission)
 */
router.post(
    '/:supervisorId/account', 
    authenticate,
    requireRole('admin'),
    requirePermission('people'),
    controller.addAccount,
);

/**
 * @route DELETE /supervisors/:supervisorId/account
 * @description Unlink a supervisor from a platform account.
 * @param {string} supervisorId - Supervisor ID.
 * @access Admin (requires permission)
 */
router.delete(
    '/:supervisorId/account',
    authenticate,
    requireRole('admin'),
    requirePermission('people'), 
    controller.removeAccount,
);

module.exports = router;