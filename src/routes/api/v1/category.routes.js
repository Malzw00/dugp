const express = require('express');
const router = express.Router();

/**
 * @route GET /categories
 * @description Get all categories with optional pagination.
 * @access any
 * @query {string} collageId
 */
router.get('/', );

/**
 * @route POST /categories
 * @description Create multiple categories.
 * @access ahp (admin has a permission)
 * @body {string} name - An array of category name to create.
 * @body {number} collageId 
 */
router.post('/', );

/**
 * @route DELETE /categories/:categoryId
 * @description Delete a single category by ID.
 * @access ahp (admin has a permission)
 * @param {string} categoryId - The unique ID of the category.
 */
router.delete('/:categoryId', );

/**
 * @route PUT /categories/:categoryId
 * @description Update a category name.
 * @access ahp (admin has a permission)
 * @param {string} categoryId - The unique ID of the category.
 * @body  {string} name - The new category name.
 * @body  {string} collageId - The new category name.
 */
router.put('/:categoryId', );

/**
 * @route GET /categories/:categoryId/projects
 * @description Get all projects that belong to a specific category.
 * @access any
 * @param {string} categoryId - The category ID.
 * @query {string} limit
 * @query {string} offset
 */
router.get('/:categoryId/projects', );

/**
 * @route POST /categories/:categoryId/projects
 * @description Add a project to a category.
 * @access ahp (admin has a permission)
 * @param {string} categoryId - The category ID.
 * @body {number} projectId - The ID of the project to add.
 */
router.post('/:categoryId/projects', );

/**
 * @route DELETE /categories/:categoryId/projects/:projectId
 * @description Remove a single project from a category.
 * @access ahp (admin has a permission)
 * @param {string} categoryId - The category ID.
 * @param {string} projectId - The project ID to remove.
 */
router.delete('/:categoryId/projects/:projectId', );

module.exports = router;