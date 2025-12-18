const express = require('express');
const projectSearchRouter  = express.Router();
const controller = require('@controllers/projects/projectSearch.controller');

/**
 * @route GET /projects/search
 * @description Search for projects using a keyword with optional filters and ordering.
 * @access any (no authentication required)
 * 
 * @query {string} text - The keyword to search for.
 * @query {number} offset - Pagination offset.
 * @query {number} limit - Pagination limit.
 */
projectSearchRouter.get('/', controller.search);

module.exports = projectSearchRouter;