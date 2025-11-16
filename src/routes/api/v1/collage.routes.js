/**
 * @file collage.routes.js
 * @description API routes for managing collages and their departments.
 */

const express = require('express');
const router = express.Router();
const controller = require('@controllers/collage.controller');

/**
 * @route GET /collages
 * @description Retrieve all collages with optional pagination.
 * @access any (no authentication required)
 * @query {number} [offset] - Number of records to skip.
 * @query {number} [limit] - Maximum number of records to return.
 */
router.get('/', controller.getAll);

/**
 * @route GET /collages/:collageId
 * @description Retrieve a specific collage by ID.
 * @access any
 * @param {number} collageId - Unique identifier of the collage.
 */
router.get('/:collageId', controller.getByID);

/**
 * @route POST /collages
 * @description Create a new collage.
 * @access ahp (admin with permission)
 * @body {string} name - Name of the new collage.
 */
router.post('/', controller.create);

/**
 * @route DELETE /collages/:collageId
 * @description Permanently delete a collage by ID.
 * @access ahp (admin with permission)
 * @param {number} collageId - Unique identifier of the collage.
 */
router.delete('/:collageId', controller.deleteByID);

/**
 * @route PUT /collages/:collageId
 * @description Update a collage's name.
 * @access ahp (admin with permission)
 * @param {number} collageId - Unique identifier of the collage.
 * @body {string} name - Updated collage name.
 */
router.put('/:collageId', controller.update);

/**
 * @route GET /collages/:collageId/departments
 * @description Retrieve all departments inside a collage.
 * @access any
 * @param {number} collageId - Unique identifier of the collage.
 * @query {number} [offset] - Records to skip.
 * @query {number} [limit] - Max results to return.
 */
router.get('/:collageId/departments', controller.getDepartments);

/**
 * @route GET /collages/:collageId/departments/:departmentId
 * @description Retrieve a specific department within a collage.
 * @access any
 * @param {number} collageId - Collage ID.
 * @param {number} departmentId - Department ID.
 */
router.get('/:collageId/departments/:departmentId', controller.getDepartment);

/**
 * @route POST /collages/:collageId/departments
 * @description Create a new department inside a collage.
 * @access ahp (admin with permission)
 * @param {number} collageId - Collage ID.
 * @body {string} name - Department name.
 */
router.post('/:collageId/departments', controller.addDepartment);

/**
 * @route DELETE /collages/:collageId/departments/:departmentId
 * @description Delete a department from a collage.
 * @access ahp (admin with permission)
 * @param {number} collageId - Collage ID.
 * @param {number} departmentId - Department ID.
 */
router.delete('/:collageId/departments/:departmentId', controller.removeDepartment);

module.exports = router;