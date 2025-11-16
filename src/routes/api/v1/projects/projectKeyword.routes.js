const express = require('express');
const projectKeywordsRouter  = express.Router();
const controller = require('@controllers/projects/projectKeyword.controller');

/**
 * @route GET /projects/:projectId/keywords
 * @description Get all keywords linked to a specific project.
 * @access any (no authentication required)
 * @param {string} projectId - The ID of the project.
 */
projectKeywordsRouter.get('/', controller.getAll);

/**
 * @route POST /projects/:projectId/keywords
 * @description Add one or more keywords to a specific project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @body {Array<string>} keywords - A list of keyword strings to be added.
 */
projectKeywordsRouter.post('/', controller.create);

/**
 * @route DELETE /projects/:projectId/keywords/:keywordId
 * @description Delete a specific keyword from a project.
 * @access ahp (admin with permission)
 * @param {string} projectId - The ID of the project.
 * @param {string} keywordId - The ID of the keyword to remove.
 */
projectKeywordsRouter.delete('/:keywordId', controller.delete);

module.exports = projectKeywordsRouter;