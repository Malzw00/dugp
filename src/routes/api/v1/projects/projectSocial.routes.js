const express = require('express');
const projectSocialRouter = express.Router({ mergeParams: true });
const controller = require('@controllers/projects/projectSocial.controller');

/* -------------------------------- Likes Router -------------------------------- */
const likesRouter = express.Router({ mergeParams: true });

/**
 * @route GET /projects/:projectId/likes
 * @description Get all likes for a specific project.
 * @access all (only authenticated users can access)
 */
likesRouter.get('/', controller.getAllLikes);

/**
 * @route GET /projects/:projectId/likes/count
 * @description Get the total number of likes for a project.
 * @access any (no authentication required)
 */
likesRouter.get('/count', controller.getLikesCount);

/**
 * @route GET /projects/:projectId/likes/me
 * @description Check if the authenticated user has liked the project.
 * @access all (only authenticated users can access)
 */
likesRouter.get('/me', controller.amILike);

/**
 * @route POST /projects/:projectId/likes
 * @description Add a like to the project by the authenticated user.
 * @access all (only authenticated users can access)
 */
likesRouter.post('/', controller.addLike);

/**
 * @route DELETE /projects/:projectId/likes/me
 * @description Remove like of the authenticated user.
 * @access all (only authenticated users can access)
 */
likesRouter.delete('/me', controller.removeLike);


/* -------------------------------- Comments Router -------------------------------- */
const commentsRouter = express.Router({ mergeParams: true });

/**
 * @route GET /projects/:projectId/comments
 * @description Get all comments for a specific project.
 * @query {string} offset
 * @query {string} limit
 * @access any (no authentication required)
 */
commentsRouter.get('/', controller.getAllComments);

/**
 * @route GET /projects/:projectId/comments/count
 * @description Get the total number of comments for a project.
 * @access any (no authentication required)
 */
commentsRouter.get('/count', controller.getCommentsCount);

/**
 * @route POST /projects/:projectId/comments
 * @description Add a new comment to the project.
 * @access all (only authenticated users can access)
 * @body {string} content - The comment text.
 */
commentsRouter.post('/', controller.addComment);

/**
 * @route DELETE /projects/:projectId/comments/:commentId
 * @description Delete a specific comment. If it's the user's comment → delete directly.
 *              Else → requires delete-comment permission.
 * @access owner | ahp
 * @param {string} commentId
 */
commentsRouter.delete('/:commentId', controller.removeComment);


/* -------------------------------- Ratings Router -------------------------------- */
const ratingsRouter = express.Router({ mergeParams: true });

/**
 * @route GET /projects/:projectId/ratings
 * @description Get all ratings for a project.
 * @access any (no authentication required)
 */
ratingsRouter.get('/', controller.getAllRatings);

/**
 * @route GET /projects/:projectId/ratings/average
 * @description Get the project average rating.
 * @access any (no authentication required)
 */
ratingsRouter.get('/average', controller.getRatingAverage);

/**
 * @route GET /projects/:projectId/ratings/me
 * @description Get my own rating for this project.
 * @access all (only authenticated users can access)
 */
ratingsRouter.get('/me', controller.getMyRating);

/**
 * @route POST /projects/:projectId/ratings
 * @description Add a new rating to the project by the authenticated user.
 * @access all (only authenticated users can access)
 * @body {number} rate - The rating value.
 */
ratingsRouter.post('/', controller.rateProject);

/**
 * @route PUT /projects/:projectId/ratings
 * @description Update the rating of the authenticated user.
 * @access all (only authenticated users can access)
 * @body {number} rate - The new rating value.
 */
ratingsRouter.put('/', controller.updateRating);


/* -------------------------------- Mount Routers -------------------------------- */
projectSocialRouter.use('/likes', likesRouter);
projectSocialRouter.use('/comments', commentsRouter);
projectSocialRouter.use('/ratings', ratingsRouter);

module.exports = projectSocialRouter;