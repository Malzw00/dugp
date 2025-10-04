const express = require('express');
const projectKeywordsRouter  = express.Router();

/**
 * @route GET /keywords
 * @description Get a list of all keywords.
 * @access any (no authentication required)
 */
projectKeywordsRouter.get('/', );

/**
 * @route GET /keywords/:keywordId
 * @description Get details of a specific keyword by its ID.
 * @access any (no authentication required)
 * @param {string} keywordId - The unique identifier of the keyword.
 */
projectKeywordsRouter.get('/:keywordId', );

/**
 * @route DELETE /keywords/:keywordId
 * @description Delete a specific keyword by its ID.
 * @access ahp (admin with permission)
 * @param {string} keywordId - The unique identifier of the keyword.
 */
projectKeywordsRouter.delete('/:keywordId', );

/**
 * @route POST /keywords
 * @description Create a new keyword.
 * @access ahp (admin with permission)
 * @body {string} name - The name of the new keyword.
 */
projectKeywordsRouter.post('/', );

module.exports = projectKeywordsRouter;