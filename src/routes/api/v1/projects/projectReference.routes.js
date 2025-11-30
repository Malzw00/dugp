const express = require('express');

const referencesRouter  = express.Router();
const controller = require('@controllers/projects/projectReference.controller');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');
const requirePermission = require('@middlewares/permission.middleware');


/**
 * ---------------------------------------
 * REFERENCES ROUTES
 * ---------------------------------------
 */

/**
 * @route GET /projects/:projectId/files/references
 * @description Get all references associated with a project.
 * @access any (no authentication required)
 * @param {string} projectId - The ID of the project.
 */
referencesRouter.get('/', controller.getReferences);

/**
 * @route POST /projects/:projectId/files/references
 * @description Add a new reference to the project.
 * @access all (only authenticated users can access)
 * @param {string} projectId - The ID of the project.
 * @body {string} title - The title of the reference.
 * @body {string} link - The link of the reference (local:{path} or network:{path}).
 * @body {string} author - Author of the reference.
 */
referencesRouter.post(
    '/',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.addReference,
);

/**
 * @route DELETE /projects/:projectId/files/references/:referenceId
 * @description Delete a specific reference by its ID.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @param {string} referenceId - The unique identifier of the reference.
 */
referencesRouter.delete(
    '/:referenceId',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.removeReferenceByID,
);



module.exports = referencesRouter;