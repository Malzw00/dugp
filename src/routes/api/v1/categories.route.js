const express = require('express');
const router = express.Router();

/**
 * @route GET /categories
 * @description Get all categories with optional pagination.
 * @access any
 * @query {number} offset - The number of records to skip.
 * @query {number} limit - The number of records to return.
 */
router.get('/', );

/**
 * @route GET /categories/:categoryId
 * @description Get a single category by its ID.
 * @access any
 * @param {number} categoryId - The unique ID of the category.
 */
router.get('/:categoryId', );

/**
 * @route POST /categories
 * @description Create multiple categories.
 * @access ahp (admin has a permission)
 * @body {string[]} names - An array of category names to create.
 */
router.post('/', );

/**
 * @route DELETE /categories/:categoryId
 * @description Delete a single category by ID.
 * @access ahp (admin has a permission)
 * @param {number} categoryId - The unique ID of the category.
 */
router.delete('/:categoryId', );

/**
 * @route DELETE /categories
 * @description Delete multiple categories by their IDs.
 * @access ahp (admin has a permission)
 * @body {number[]} ids - An array of category IDs to delete.
 */
router.delete('/', );

/**
 * @route PUT /categories/:categoryId
 * @description Update a category name.
 * @access ahp (admin has a permission)
 * @param {number} categoryId - The unique ID of the category.
 * @body {string} name - The new category name.
 */
router.put('/:categoryId', );

/**
 * @route GET /categories/:categoryId/projects
 * @description Get all projects that belong to a specific category.
 * @access any
 * @param {number} categoryId - The category ID.
 */
router.get('/:categoryId/projects', );

/**
 * @route POST /categories/:categoryId/projects
 * @description Add a project to a category.
 * @access ahp (admin has a permission)
 * @param {number} categoryId - The category ID.
 * @body {number} projectId - The ID of the project to add.
 */
router.post('/:categoryId/projects', );

/**
 * @route DELETE /categories/:categoryId/projects
 * @description Remove multiple projects from a category.
 * @access ahp (admin has a permission)
 * @param {number} categoryId - The category ID.
 * @body {number[]} ids - Array of project IDs to remove.
 */
router.delete('/:categoryId/projects', );

/**
 * @route DELETE /categories/:categoryId/projects/:projectId
 * @description Remove a single project from a category.
 * @access ahp (admin has a permission)
 * @param {number} categoryId - The category ID.
 * @param {number} projectId - The project ID to remove.
 */
router.delete('/:categoryId/projects/:projectId', );



module.exports = router;