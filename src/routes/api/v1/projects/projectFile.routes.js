const express = require('express');

const projectFilesRouter = express.Router();
const bookRouter  = express.Router();
const presentationRouter  = express.Router();
const referencesRouter  = express.Router();
const controller = require('@controllers/projects/projectFile.controller');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');
const requirePermission = require('@middlewares/permission.middleware');
const { upload } = require('@middlewares/upload.middleware');

/**
 * ---------------------------------------
 * BOOK ROUTES
 * ---------------------------------------
 */

/**
 * @route GET /projects/:projectId/files/book
 * @description Get the book file of a specific project.
 * @access any (no authentication required)
 * @param {string} projectId - The ID of the project.
 */
bookRouter.get('/', controller.getBook);

/**
 * @route POST /projects/:projectId/files/book
 * @description Upload or replace the book file of a specific project.
 * @access all (only authenticated users can access)
 * @param {string} projectId - The ID of the project.
 * @body {File} file - The book file to upload.
 */
bookRouter.post(
    '/',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    upload,
    controller.setBook
);

/**
 * @route DELETE /projects/:projectId/files/book
 * @description Delete the book file of a specific project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 */
bookRouter.delete(
    '/',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.deleteBook,
);


/**
 * ---------------------------------------
 * PRESENTATION ROUTES
 * ---------------------------------------
 */

/**
 * @route GET /projects/:projectId/files/presentation
 * @description Get the presentation file of a specific project.
 * @access any (no authentication required)
 * @param {string} projectId - The ID of the project.
 */
presentationRouter.get('/', controller.getPresentation);

/**
 * @route POST /projects/:projectId/files/presentation
 * @description Upload or replace the presentation file of a specific project.
 * @access all (only authenticated users can access)
 * @param {string} projectId - The ID of the project.
 * @body {File} file - The presentation file to upload.
 */
presentationRouter.post(
    '/',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    upload,
    controller.setPresentation
);

/**
 * @route DELETE /projects/:projectId/files/presentation
 * @description Delete the presentation file of a specific project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 */
presentationRouter.delete(
    '/',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.deletePresentation
);


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
    upload,
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


projectFilesRouter.use('/book', bookRouter);
projectFilesRouter.use('/presentation', presentationRouter);
projectFilesRouter.use('/references', referencesRouter);

module.exports = projectFilesRouter;