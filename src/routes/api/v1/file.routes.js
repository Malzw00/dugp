const express = require('express');
const router  = express.Router();
const controller = require('@controllers/file.controller');

/* -------------------------------------------------------------------------- */
/*                                   FILES                                    */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /files
 * @description Retrieve a list of all files.
 *              Supports pagination and filtering if implemented.
 * @access all (authenticated users only)
 * @query {number} [offset] - Offset number.
 * @query {number} [limit] - Number of items per page.
 */
router.get('/', controller.getAll);

/**
 * @route GET /files/:fileId
 * @description Retrieve a single file by its ID.
 * @access all (authenticated users only)
 * @param {string} fileId - The unique identifier of the file.
 */
router.get('/:fileId', controller.getByID);

/**
 * @route DELETE /files/:fileId
 * @description Delete a specific file by ID.
 * @access ahp (admin must have permission)
 * @param {string} fileId - The unique identifier of the file.
 */
router.delete('/:fileId', controller.deleteByID);

/**
 * @route POST /files
 * @description Upload a new file.
 * @access all (authenticated users only)
 * @body {File} file - The file to be uploaded (multipart/form-data).
 * @body {'book'|'presentation'|'reference'|'image'} [category] - Category of the uploaded file.
 */
router.post('/', controller.uploadFile);

module.exports = router;