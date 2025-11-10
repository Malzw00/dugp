const express = require('express');
const projectCategoriesRouter  = express.Router();

/**
 * @route GET /categories
 * @description Get a list of all categories.
 * @access any (no authentication required)
 */
projectCategoriesRouter.get('/', );

/**
 * @route DELETE /categories/:categoryId
 * @description remove a specific category by its ID.
 * @access ahp (admin with permission)
 * @param {string} categoryId - The unique identifier of the category.
 */
projectCategoriesRouter.delete('/:categoryId', );

/**
 * @route POST /categories
 * @description add category to project.
 * @access ahp (admin with permission)
 * @body  {string} categoryId
 * @param {string} projectId
 */
projectCategoriesRouter.post('/', );


module.exports = projectCategoriesRouter;
