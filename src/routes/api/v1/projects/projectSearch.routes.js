const express = require('express');
const projectSearchRouter  = express.Router();
const controller = require('@controllers/projects/projectSearch.controller');

/**
 * @route GET /projects/search
 * @description Search for projects using a keyword with optional filters and ordering.
 * @access any (no authentication required)
 * 
 * @query {string} keyword - The keyword to search for.
 * @query {Array<string>} collages - Filter by collage IDs.
 * @query {Array<string>} departments - Filter by department IDs.
 * @query {Array<string>} categories - Filter by category IDs.
 * @query {string} orderBy - Field to order by: 'date' | 'ratingAverage' | 'likesCount'.
 * @query {string} orderDir - Direction: 'desc' | 'asc'.
 * @query {number} offset - Pagination offset.
 * @query {number} limit - Pagination limit.
 */
projectSearchRouter.get('/', (req, res, next) => {
    
    const filters = {
        keyword: req.query.keyword || '',
        categories: req.query.categories ? req.query.categories.split(',') : [],
        collages: req.query.collages ? req.query.collages.split(',') : [],
        departments: req.query.departments ? req.query.departments.split(',') : [],
        orderBy: req.query.orderBy || 'date',
        orderDir: req.query.orderDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        offset: parseInt(req.query.offset) || 0,
        limit: parseInt(req.query.limit) || 20,
    };
    
    req.filters = filters;
    
    next();

}, controller.search);

module.exports = projectSearchRouter;