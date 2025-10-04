const express = require('express');
const projectSearchRouter  = express.Router();

/**
 * @route GET /projects/search/:keyword
 * @description Search for projects using a keyword with optional filters and ordering.
 * @access any (no authentication required)
 * 
 * @param {string} keyword - The keyword to search for.
 * @query {Object} filters - Optional filters for the search.
 * @query {Array<string>} filters.collages - Filter by collage IDs.
 * @query {Array<string>} filters.departments - Filter by department IDs.
 * @query {Array<string>} filters.categories - Filter by category IDs.
 * @query {Object} filters.ratingRange - Filter by rating range {min, max}.
 * @query {Object} order - Optional ordering settings.
 * @query {string} order.by - Field to order by: 'date' | 'ratingAverage' | 'likesCount'.
 * @query {string} order.dir - Direction: 'desc' | 'asc'.
 */
projectSearchRouter.get('/:keyword', );

module.exports = projectSearchRouter;