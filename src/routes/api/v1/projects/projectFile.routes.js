const express = require('express');

const projectFilesRouter = express.Router();
const bookRouter  = express.Router();
const presentationRouter  = express.Router();
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

projectFilesRouter.use('/book', bookRouter);
projectFilesRouter.use('/presentation', presentationRouter);

module.exports = projectFilesRouter;