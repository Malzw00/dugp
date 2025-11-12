const express = require('express');
const router = express.Router();

/**
 * @route GET /collages
 * @description Retrieve a list of all collages with optional pagination.
 * @query {number} offset - Starting index for pagination.
 * @query {number} limit - Number of results to return.
 * @access Public
 */
router.get('/', );

/**
 * @route GET /collages/:collageId
 * @description Retrieve details of a specific collage by ID.
 * @param {string} collageId - Unique identifier of the collage.
 * @access Public
 */
router.get('/:collageId', );

/**
 * @route POST /collages
 * @description Create a new collage.
 * @query {string} collageName - Name of the new collage.
 * @access Admin (requires permission)
 */
router.post('/', );

/**
 * @route DELETE /collages/:collageId
 * @description Permanently delete a collage by ID.
 * @param {string} collageId - Unique identifier of the collage.
 * @access Admin (requires permission)
 */
router.delete('/:collageId', );

/**
 * @route PUT /collages/:collageId
 * @description Update an existing collage name.
 * @body {string} collageName - New collage name.
 * @param {string} collageId - Unique identifier of the collage.
 * @access Admin (requires permission)
 */
router.put('/:collageId', );

/**
 * @route GET /collages/:collageId/departments
 * @description Retrieve all departments belonging to a collage.
 * @param {string} collageId - Unique identifier of the collage.
 * @param {string} limit
 * @param {string} offset
 * @access Public
 */
router.get('/:collageId/departments', );

/**
 * @route GET /collages/:collageId/departments/:departmentId
 * @description Retrieve a specific department by ID within a collage.
 * @param {string} collageId - Unique identifier of the collage.
 * @param {string} departmentId - Unique identifier of the department.
 * @access Public
 */
router.get('/:collageId/departments/:departmentId', );

/**
 * @route POST /collages/:collageId/departments
 * @description Create a new department inside a specific collage.
 * @param {string} collageId - Unique identifier of the collage.
 * @body {string} name - Name of the new department.
 * @access Admin (requires permission)
 */
router.post('/:collageId/departments', );

/**
 * @route DELETE /collages/:collageId/departments/:departmentId
 * @description Delete a department from a collage.
 * @param {string} collageId - Unique identifier of the collage.
 * @param {string} departmentId - Unique identifier of the department.
 * @access Admin (requires permission)
 */
router.delete('/:collageId/departments/:departmentId', );



module.exports = router;
