const express = require('express');

const projectFilesRouter = express.Router();
const bookRouter  = express.Router();
const presentationRouter  = express.Router();
const referencesRouter  = express.Router();

/**
 * @route GET /files/book
 * @description Get the book file of a project.
 * @access any (no authentication required)
 */
bookRouter.get('/', );

/**
 * @route POST /files/book
 * @description Upload or replace the book file of a project.
 * @access all (only authenticated users can access)
 * @body {File} file - The book file to upload.
 */
bookRouter.post('/', );

/**
 * @route DELETE /files/book
 * @description Delete the book file of a project.
 * @access ahp (admin with permission)
 */
bookRouter.delete('/', );


/**
 * @route GET /files/presentation
 * @description Get the presentation file of a project.
 * @access any (no authentication required)
 */
presentationRouter.get('/', );

/**
 * @route POST /files/presentation
 * @description Upload or replace the presentation file of a project.
 * @access all (only authenticated users can access)
 * @body {File} file - The presentation file to upload.
 */
presentationRouter.post('/', );

/**
 * @route DELETE /files/presentation
 * @description Delete the presentation file of a project.
 * @access ahp (admin with permission)
 */
presentationRouter.delete('/', );


/**
 * @route GET /files/references
 * @description Get a list of all references linked to a project.
 * @access any (no authentication required)
 */
referencesRouter.get('/', );

/**
 * @route POST /files/references
 * @description Add a new reference to the project.
 * @access all (only authenticated users can access)
 * @body {string} title - The title of the reference.
 * @body {string} link - The link of the reference (local:{path} or network:{path}).
 * @body {string} author
 */
referencesRouter.post('/', );

/**
 * @route DELETE /files/references
 * @description Delete all references linked to the project.
 * @access ahp (admin with permission)
 */
referencesRouter.delete('/', );

/**
 * @route DELETE /files/references/:index
 * @description Delete a reference by its index in the list.
 * @access ahp (admin with permission)
 * @param {number} index - The index of the reference in the list.
 */
referencesRouter.delete('/:index', );

/**
 * @route DELETE /files/references/:referenceId
 * @description Delete a specific reference by its ID.
 * @access ahp (admin with permission)
 * @param {string} referenceId - The unique identifier of the reference.
 */
referencesRouter.delete('/:referenceId', );



projectFilesRouter.use('/book', bookRouter);
projectFilesRouter.use('/presentation', presentationRouter);
projectFilesRouter.use('/references', referencesRouter);

module.exports = projectFilesRouter;