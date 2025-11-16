/**
 * @file comment.routes.js
 * @description Routes for managing comments and their likes.
 */

const express = require('express');
const router = express.Router();
const controller = require('@controllers/comment.controller');

/* -------------------------------------------------------------------------- */
/*                                Comment CRUD                                */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /comments/:commentId
 * @description Retrieve a specific comment by its ID.
 * @access any (public)
 * @param {number} commentId - Unique identifier of the comment.
 */
router.get('/:commentId', controller.getByID);

/**
 * @route DELETE /comments/:commentId
 * @description Delete a specific comment.
 * @access owner | ahp (comment owner or admin with permission)
 * @param {number} commentId - Unique identifier of the comment.
 */
router.delete('/:commentId', controller.deleteByID);

/**
 * @route PUT /comments/:commentId
 * @description Update a specific comment.
 * @access owner (comment owner only)
 * @param {number} commentId - Unique identifier of the comment.
 * @body {string} content - Updated comment content.
 */
router.put('/:commentId', controller.update);

/* -------------------------------------------------------------------------- */
/*                                Comment Likes                               */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /comments/:commentId/likes
 * @description Retrieve likes for a specific comment.
 * @access any (public)
 * @param {number} commentId - Comment ID.
 * @query {number} [offset] - Pagination offset.
 * @query {number} [limit] - Pagination limit.
 */
router.get('/:commentId/likes', controller.getLikes);

/**
 * @route GET /comments/:commentId/likes/count
 * @description Retrieve likes count for a specific comment.
 * @access any (public)
 * @param {number} commentId - Comment ID.
 */
router.get('/:commentId/likes/count', controller.getLikesCount);

/**
 * @route GET /comments/:commentId/likes/me
 * @description Check if the authenticated user liked the comment.
 * @access owner (authenticated user)
 * @param {number} commentId - Comment ID.
 */
router.get('/:commentId/likes/me', controller.amILiked);

/**
 * @route POST /comments/:commentId/likes
 * @description Add a like to a comment.
 * @access all (authenticated users only)
 * @param {number} commentId - Comment ID.
 */
router.post('/:commentId/likes', controller.createLike);

/**
 * @route DELETE /comments/:commentId/likes
 * @description Remove the authenticated user's like from a comment.
 * @access all (authenticated users only)
 * @param {number} commentId - Comment ID.
 */
router.delete('/:commentId/likes', controller.deleteLike);


/* -------------------------------------------------------------------------- */
/*                               Comment Replies                              */
/* -------------------------------------------------------------------------- */

// /**
//  * @route GET /comments/:commentId/replies
//  * @description Retrieve all replies for a specific comment.
//  * @param {string} commentId - Unique identifier of the parent comment.
//  * @access any (public)
//  */
// router.get('/:commentId/replies', );

// /**
//  * @route GET /comments/:commentId/replies/count
//  * @description Get the total number of replies for a specific comment.
//  * @param {string} commentId - Unique identifier of the parent comment.
//  * @access any (public)
//  */
// router.get('/:commentId/replies/count', );


// /**
//  * @route POST /comments/:commentId/replies
//  * @description Create a new reply for a specific comment.
//  * @param {string} commentId - Unique identifier of the parent comment.
//  * @body {string} content - The content of the reply.
//  * @access all (authenticated users only)
//  */
// router.post('/:commentId/replies', );

// /**
//  * @route GET /comments/:commentId/replies/:index
//  * @description Retrieve a single reply by index.
//  * @param {string} commentId - Unique identifier of the parent comment.
//  * @param {string} index - Index of the reply in the list.
//  * @access any (public)
//  */
// router.get('/:commentId/replies/:index', );

module.exports = router;