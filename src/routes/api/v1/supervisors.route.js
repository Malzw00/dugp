const express = require('express');
const router = express.Router();

/**
 * @route GET /supervisors
 * @description Retrieve a paginated list of all supervisors.
 * @query {number} offset - Starting index for pagination.
 * @query {number} limit - Number of results to return.
 * @access Public
 */
router.get('/', );

/**
 * @route GET /supervisors/projects
 * @description Retrieve all projects supervised or co-supervised by supervisors.
 * @access Public
 */
router.get('/projects', );

/**
 * @route GET /supervisors/:supervisorId
 * @description Retrieve details of a specific supervisor by ID.
 * @param {string} supervisorId - Unique identifier of the supervisor.
 * @access Public
 */
router.get('/:supervisorId', );

/**
 * @route POST /supervisors
 * @description Create a new supervisor record.
 * @body {string} name - Name of the supervisor.
 * @body {string} department - Department of the supervisor.
 * @access Admin (requires permission)
 */
router.post('/', );

/**
 * @route PUT /supervisors/:supervisorId
 * @description Update information of a supervisor by ID.
 * @param {string} supervisorId - Unique identifier of the supervisor.
 * @body {object} updates - Fields to update.
 * @access Admin (requires permission)
 */
router.put('/:supervisorId', );

/**
 * @route DELETE /supervisors/:supervisorId
 * @description Delete a supervisor record by ID.
 * @param {string} supervisorId - Unique identifier of the supervisor.
 * @access Admin (requires permission)
 */
router.delete('/:supervisorId', );

/**
 * @route GET /supervisors/account
 * @description Retrieve account link information for a supervisor.
 * @access Admin (requires permission)
 */
router.get('/account', );

/**
 * @route POST /supervisors/account
 * @description Link a supervisor to a platform account.
 * @body {string} supervisorId - Supervisor to link.
 * @body {string} accountId - Platform account to link with.
 * @access Admin (requires permission)
 */
router.post('/account', );

/**
 * @route DELETE /supervisors/account
 * @description Unlink a supervisor from a platform account.
 * @body {string} supervisorId - Supervisor to unlink.
 * @access Admin (requires permission)
 */
router.delete('/account', );


module.exports = router;