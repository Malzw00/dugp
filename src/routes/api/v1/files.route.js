const express = require('express');
const router  = express.Router();

/**
 * @route GET /files
 * @description Retrieve a list of all files.
 *              Supports pagination and filtering if implemented.
 * @access all (only authenticated users can access, no guests)
 * @query {number} [page] - Page number for pagination.
 * @query {number} [limit] - Number of items per page.
 */
router.get('/files', );

/**
 * @route GET /files/:fileId
 * @description Retrieve a single file by its ID.
 * @access all (only authenticated users can access, no guests)
 * @param {string} fileId - The unique identifier of the file.
 */
router.get('/files/:fileId', );

/**
 * @route DELETE /files/:fileId
 * @description Delete a specific file by ID.
 * @access ahp (admin must have permission)
 * @param {string} fileId - The unique identifier of the file.
 */
router.delete('/files/:fileId', );

/**
 * @route PUT /files/:fileId
 * @description Update a specific file's metadata or information by ID.
 * @access ahp (admin must have permission)
 * @param {string} fileId - The unique identifier of the file.
 * @body {string} [name] - Updated file name.
 * @body {string} [description] - Updated description of the file.
 */
router.put('/files/:fileId', );

/**
 * @route POST /files
 * @description Upload a new file.
 * @access all (only authenticated users can access, no guests)
 * @body {File} file - The file to be uploaded (multipart/form-data).
 * @body {string} [description] - Description of the uploaded file.
 */
router.post('/files', );

module.exports = router;
