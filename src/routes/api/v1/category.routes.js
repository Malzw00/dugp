/**
 * @file category.routes.js
 * @description Routes for managing project categories and linking projects to categories.
 */

const express = require('express');
const router = express.Router();
const controller = require('@controllers/category.controller');

/**
 * @route GET /categories
 * @description Retrieve all categories with optional filtering and pagination.
 * @access any (no authentication required)
 * @query {number} [collageId] - Filter categories by a specific collage ID.
 * @query {number} [offset] - Number of records to skip.
 * @query {number} [limit] - Maximum number of records to return.
 */
router.get('/', controller.getAll);

/**
 * @route POST /categories
 * @description Create multiple categories at once.
 * @access ahp (admin must have create-category permission)
 * @body {Array<string>} names - Array of category names to create.
 * @body {number} collageId - The collage ID these categories belong to.
 */
router.post('/', controller.create);

/**
 * @route DELETE /categories/:categoryId
 * @description Delete a single category by its ID.
 * @access ahp (admin must have delete-category permission)
 * @param {number} categoryId - The unique ID of the category.
 */
router.delete('/:categoryId', controller.deleteByID);

/**
 * @route PUT /categories/:categoryId
 * @description Update a category's name or its associated collage.
 * @access ahp (admin must have update-category permission)
 * @param {number} categoryId - The ID of the category to update.
 * @body {string} name - The new name of the category.
 * @body {number} collageId - The updated collage ID.
 */
router.put('/:categoryId', controller.update);

/**
 * @route GET /categories/:categoryId/projects
 * @description Retrieve all projects associated with a specific category.
 * @access any
 * @param {number} categoryId - The category ID.
 * @query {number} [offset] - Number of records to skip.
 * @query {number} [limit] - Maximum number of records to return.
 */
router.get('/:categoryId/projects', controller.getProjects);

/**
 * @route POST /categories/:categoryId/projects
 * @description Add a project to a category.
 * @access ahp (admin must have update-category permission)
 * @param {number} categoryId - The category ID.
 * @body {number} projectId - The ID of the project to add to this category.
 */
router.post('/:categoryId/projects', controller.addProject);

/**
 * @route DELETE /categories/:categoryId/projects/:projectId
 * @description Remove a project from a category.
 * @access ahp (admin must have update-category permission)
 * @param {number} categoryId - The category ID.
 * @param {number} projectId - The ID of the project to remove.
 */
router.delete('/:categoryId/projects/:projectId', controller.removeProject);

module.exports = router;
