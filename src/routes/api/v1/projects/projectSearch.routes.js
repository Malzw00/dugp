const express = require('express');
const projectSearchRouter  = express.Router();

/**
 * @route GET /projects/search/:keyword
 * @description Search for projects using a keyword with optional filters and ordering.
 * @access any (no authentication required)
 * 
 * @query {string} keyword - The keyword to search for.
 * @query {Array<string>} collages - Filter by collage IDs.
 * @query {Array<string>} departments - Filter by department IDs.
 * @query {Array<string>} categories - Filter by category IDs.
 * @query {string} orderBy - Field to order by: 'date' | 'ratingAverage' | 'likesCount'.
 * @query {string} orderDir - Direction: 'desc' | 'asc'.
 * @query {string} offset.
 * @query {string} limit.
 */
projectSearchRouter.get('/', );

module.exports = projectSearchRouter;