const express = require('express');
const projectCategoriesRouter = require('./projectCategory.routes');
const projectFilesRouter = require('./projectFile.routes');
const projectKeywordsRouter = require('./projectKeyword.routes');
const projectSearchRouter = require('./projectSearch.routes');
const projectPeopleRouter = require('./projectPeople.routes');
const projectSocialRouter = require('./projectSocial.routes');
const projectReferenceRouter = require('./projectReference.routes');
const router  = express.Router();
const controller = require('@controllers/projects/project.controller');
const requirePermission = require('@middlewares/permission.middleware');
const authenticate = require('@middlewares/auth.middleware');
const requireRole = require('@middlewares/role.middleware');

/**
 * @route GET /projects
 * @description Get a list of projects with optional pagination, filters, and ordering.
 * @access any (no authentication required)
 * @query {number} offset - Pagination offset.
 * @query {number} limit - Pagination limit.
 * @query {Array<number>} categories - Filter by category IDs.
 * @query {number} departmentId - Filter by department.
 * @query {number} collageId - Filter by collage ID.
 * @query {"date" | "rating" | "likes" | "grade"} sortBy - Sorting field.
 * @query {"ASC"|"DESC"} order - Sorting direction.
 * @query {"spring"|"autumn"|"winter"|"summer"} semester.
 */
router.get('/', controller.getAll);


/**
 * @route GET /projects/search
 * @description Search across all projects.
 * @access any (no authentication required)
 */
router.use('/search', projectSearchRouter);

/**
 * @route /projects/:projectId/categories
 * @description Manage categories related to a project.
 * @access depends on the specific sub-route.
 */
router.use('/:projectId/categories', projectCategoriesRouter);

/**
 * @route /projects/:projectId/keywords
 * @description Manage keywords related to a project.
 * @access depends on the specific sub-route.
 */
router.use('/:projectId/keywords', projectKeywordsRouter);

/**
 * @route /projects/:projectId/files
 * @description Manage files related to a project (book, presentation).
 * @access depends on the specific sub-route.
 */
router.use('/:projectId/files', projectFilesRouter);

/**
 * @route /projects/:projectId/people
 * @description Manage students and supervisors related to a project.
 * @access depends on the specific sub-route.
 */
router.use('/:projectId/people', projectPeopleRouter);

/**
 * @route /projects/:projectId/social
 * @description Manage likes, comments, and ratings for a project.
 * @access depends on the specific sub-route.
 */
router.use('/:projectId/social', projectSocialRouter);

/**
 * @route /projects/:projectId/references
 * @description Manage references for a project.
 * @access depends on the specific sub-route.
 */
router.use('/:projectId/references', projectReferenceRouter);


/**
 * @route GET /projects/:projectId
 * @description Get details of a specific project by its ID.
 * @access any (no authentication required)
 * @param {number} projectId - The unique identifier of the project.
 */
router.get('/:projectId', controller.getByID);

/**
 * @route POST /projects
 * @description Create a new project.
 * @access all (only authenticated users can create)
 * @body {string} title - The title of the project.
 * @body {string} description - The description of the project.
 * @body {date} date - The project creation date.
 * @body {'Winter'|'Spring'|'Summer'|'Autumn'} semester - Academic semester.
 * @body {number} departmentId - Department ID.
 * @body {number} supervisorId - Supervisor ID.
 */
router.post(
    '/', 
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.create,
);

/**
 * @route DELETE /projects/:projectId
 * @description Delete a specific project by its ID.
 * @access ahp (admin with permission)
 * @param {number} projectId - The unique identifier of the project.
 */
router.delete(
    '/:projectId',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.delete,
);

/**
 * @route PUT /projects/:projectId
 * @description Update a specific project by its ID.
 * @access all (authenticated users with permission)
 * @param {number} projectId - The unique identifier of the project.
 * @body {string} title - The title of the project.
 * @body {string} description - The description of the project.
 * @body {date} date
 * @body {'Winter'|'Spring'|'Summer'|'Autumn'} semester
 * @body {number} departmentId
 * @body {number} supervisorId
 * @body {number} grade
 * @body {number} imageId
 * @body {boolean} available
 */
router.put(
    '/:projectId',  
    authenticate,
    requireRole('admin'),
    requirePermission('projects'),
    controller.update,
);


module.exports = router;