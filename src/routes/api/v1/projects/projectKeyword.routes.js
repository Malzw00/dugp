const express = require('express');
const projectKeywordsRouter  = express.Router();

/**
 * @route GET /keywords
 * @description Get a list of all keywords.
 * @access any (no authentication required)
 */
projectKeywordsRouter.get('/', );

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
 * @body {Array<String>} keywords - the new keywords.
 */
projectKeywordsRouter.post('/', );

/**
 * @route PUT /keywords
 * @description Update a keyword.
 * @access ahp (admin with permission)
 * @body {string} name - The name of keyword.
 */
projectKeywordsRouter.put('/', );

module.exports = projectKeywordsRouter;