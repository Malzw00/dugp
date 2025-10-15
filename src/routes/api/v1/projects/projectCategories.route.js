const express = require('express');
const projectCategoriesRouter  = express.Router();

/**
 * @route GET /categories
 * @description Get a list of all categories.
 * @access any (no authentication required)
 */
projectCategoriesRouter.get('/', );

/**
 * @route GET /categories/:categoryId
 * @description Get details of a specific category by its ID.
 * @access any (no authentication required)
 * @param {string} categoryId - The unique identifier of the category.
 */
projectCategoriesRouter.get('/:categoryId', );

/**
 * @route DELETE /categories/:categoryId
 * @description Delete a specific category by its ID.
 * @access ahp (admin with permission)
 * @param {string} categoryId - The unique identifier of the category.
 */
projectCategoriesRouter.delete('/:categoryId', );

/**
 * @route POST /categories
 * @description Create a new category.
 * @access ahp (admin with permission)
 * @body {string} name - The name of the new category.
 */
projectCategoriesRouter.post('/', );

/**
 * @route PUT /categories
 * @description update category data.
 * @access ahp (admin with permission)
 * @body {string} name - The name of the category.
 */
projectCategoriesRouter.put('/', );

module.exports = projectCategoriesRouter;
