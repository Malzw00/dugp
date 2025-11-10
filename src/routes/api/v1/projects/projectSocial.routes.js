const express = require('express');
const projectSocialRouter   = express.Router();
const commentsRouter = express.Router();
const likesRouter    = express.Router();
const ratingsRouter  = express.Router();

/**
 * @route GET /projects/:projectId/likes
 * @description Get all likes for a specific project.
 * @access all (only authenticated users can access)
 */
likesRouter.get('/', );

/**
 * @route GET /projects/:projectId/likes/count
 * @description Get the total number of likes for a project.
 * @access any (no authentication required)
 */
likesRouter.get('/count', );

/**
 * @route GET /projects/:projectId/likes/me
 * @description Check if the authenticated user has liked the project.
 * @access all (only authenticated users can access)
 */
likesRouter.get('/me', );

/**
 * @route POST /projects/:projectId/likes
 * @description Add a like to the project by the authenticated user.
 * @access all (only authenticated users can access)
 */
likesRouter.post('/', );

/**
 * @route DELETE /projects/:projectId/likes/me
 * @description Remove the like of the authenticated user from the project.
 * @access all (only authenticated users can access)
 */
likesRouter.delete('/', );


/**
 * @route GET /projects/:projectId/comments
 * @description Get all comments for a specific project.
 * @query {string} offset
 * @query {string} limit
 * @access any (no authentication required)
 */
commentsRouter.get('/', );

/**
 * @route GET /projects/:projectId/comments/count
 * @description Get the total number of comments for a project.
 * @access any (no authentication required)
 */
commentsRouter.get('/count', );

/**
 * @route POST /projects/:projectId/comments
 * @description Add a new comment to the project.
 * @access all (only authenticated users can access)
 * @body {string} content - The content of the comment.
 */
commentsRouter.post('/', );

/**
 * @route DELETE /projects/:projectId/comments/:commentId
 * @description Delete a specific comment. If it's the user's own comment, delete directly. 
 * If not, requires delete-comment permission.
 * @access owner | ahp (owner or admin with permission)
 * @param {string} commentId - The unique identifier of the comment.
 */
commentsRouter.delete('/:commentId', );


/**
 * @route GET /projects/:projectId/ratings
 * @description Get all ratings for a project.
 * @access any (no authentication required)
 */
ratingsRouter.get('/', );

/**
 * @route GET /projects/:projectId/ratings/average
 * @description Get the average rating of the project.
 * @access any (no authentication required)
 */
ratingsRouter.get('/average', );

/**
 * @route GET /projects/:projectId/ratings/me
 * @description Get the rating given by the authenticated user for this project.
 * @access all (only authenticated users can access)
 */
ratingsRouter.get('/me', );

/**
 * @route POST /projects/:projectId/ratings
 * @description Add a new rating to the project by the authenticated user.
 * @access all (only authenticated users can access)
 * @body {number} rate - The rating value (e.g., 1–5).
 */
ratingsRouter.post('/', );

/**
 * @route PUT /projects/:projectId/ratings
 * @description Update the rating of the authenticated user.
 * @access all (only authenticated users can access)
 * @query {number} rate - The new rating value.
 */
ratingsRouter.put('/', );

/**
 * @route DELETE /projects/:projectId/ratings
 * @description Delete the rating of the authenticated user for this project.
 * @access all (only authenticated users can access)
 */
ratingsRouter.delete('/', );


projectSocialRouter.use('/likes', likesRouter);
projectSocialRouter.use('/comments', commentsRouter);
projectSocialRouter.use('/ratings', ratingsRouter);



module.exports = projectSocialRouter;