const express = require('express');
const projectCategoriesRouter  = express.Router();
const controller = require('@controllers/projects/projectCategory.controller');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');
const requirePermission = require('@middlewares/permission.middleware');

/**
 * @route GET /projects/:projectId/categories
 * @description Get all categories linked to a specific project.
 * @access any (no authentication required)
 * @param {string} projectId - The ID of the project.
 */
projectCategoriesRouter.get('/', controller.getAll);

/**
 * @route POST /projects/:projectId/categories
 * @description Add a category to a specific project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @body {number} categoryId - The ID of the category to be linked.
 */
projectCategoriesRouter.post(
    '/',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.add,
);

/**
 * @route DELETE /projects/:projectId/categories/:categoryId
 * @description Remove a category from a specific project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @param {string} categoryId - The ID of the category to remove.
 */
projectCategoriesRouter.delete(
    '/:categoryId',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.remove,
);

module.exports = projectCategoriesRouter;