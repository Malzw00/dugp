const express = require('express');
const categoriesRouter = require('./projectCategory.routes');
const projectFilesRouter = require('./projectFile.routes');
const projectKeywordsRouter = require('./projectKeyword.routes');
const projectSearchRouter = require('./projectSearch.routes');
const projectPeopleRouter = require('./projectPeople.routes');
const projectSocialRouter = require('./projectSocial.routes');
const router  = express.Router();

/**
 * @route GET /projects
 * @description Get a list of projects with optional pagination, filters, and ordering.
 * @access any (no authentication required)
 * @query {number} offset - Pagination offset.
 * @query {number} limit - Pagination limit.
 * @query {Object} filters - Optional filters { categories, startDate, endDate, collage, departments }.
 * @query {Object} order - Optional ordering { by, dir }.
 */
router.get('/', );

/**
 * @route GET /projects/:projectId
 * @description Get details of a specific project by its ID.
 * @access any (no authentication required)
 * @param {string} projectId - The unique identifier of the project.
 */
router.get('/:projectId', );

/**
 * @route POST /projects
 * @description Create a new project.
 * @access all (only authenticated users can create)
 * @body {string} title - The title of the project.
 * @body {string} description - The description of the project.
 * @body {date} date
 * @body {'Winter'|'Spring'|'Summer'|'Autumn'} semester
 * @body {number} departmentId
 * @body {number} supervisorId
 */
router.post('/', );

/**
 * @route DELETE /projects/:projectId
 * @description Delete a specific project by its ID.
 * @access ahp (admin with permission)
 * @param {string} projectId - The unique identifier of the project.
 */
router.delete('/:projectId', );

/**
 * @route PUT /projects/:projectId
 * @description Update a specific project by its ID.
 * @access all (authenticated users with permission)
 * @param {string} projectId - The unique identifier of the project.
 * @body {string} title - The title of the project.
 * @body {string} description - The description of the project.
 * @body {date} date
 * @body {'Winter'|'Spring'|'Summer'|'Autumn'} semester
 * @body {number} departmentId
 * @body {number} supervisorId
 * @body {number} grade
 * @body {number} imageId
 * @body {number} bookId
 * @body {number} presentationId
 * @body {boolean} available
 */
router.put('/:projectId');

/**
 * @route /projects/:projectId/categories
 * @description Manage categories related to a project.
 * @access varies by sub-routes.
 */
router.use('/:projectId/categories', categoriesRouter);

/**
 * @route /projects/:projectId/keywords
 * @description Manage keywords related to a project.
 * @access varies by sub-routes.
 */
router.use('/:projectId/keywords', projectKeywordsRouter);

/**
 * @route /projects/:projectId/search
 * @description Search within a specific project.
 * @access varies by sub-routes.
 */
router.use('/search', projectSearchRouter);

/**
 * @route /projects/:projectId/files
 * @description Manage files related to a project (book, presentation, references).
 * @access varies by sub-routes.
 */
router.use('/:projectId', projectFilesRouter);

/**
 * @route /projects/:projectId/people
 * @description Manage students and supervisors related to a project.
 * @access varies by sub-routes.
 */
router.use('/:projectId', projectPeopleRouter);

/**
 * @route /projects/:projectId/social
 * @description Manage likes, comments, and ratings for a project.
 * @access varies by sub-routes.
 */
router.use('/:projectId', projectSocialRouter);

module.exports = router;