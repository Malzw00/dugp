const express = require('express');
const router = express.Router();



/**
 * @route GET /comments/:commentId
 * @description Retrieve a specific comment by its ID.
 * @param {string} commentId - Unique identifier of the comment.
 * @access any (public)
 */
router.get('/:commentId', );

/**
 * @route DELETE /comments/:commentId
 * @description Delete a specific comment.
 * @param {string} commentId - Unique identifier of the comment.
 * @access owner | ahp (admin with permission or comment owner)
 */
router.delete('/:commentId', );

/**
 * @route PUT /comments/:commentId
 * @description Update a specific comment.
 * @param {string} commentId - Unique identifier of the comment.
 * @access owner (comment owner only)
 */
router.put('/:commentId', );

/* -------------------------------------------------------------------------- */
/*                               Comment Replies                              */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /comments/:commentId/replies
 * @description Retrieve all replies for a specific comment.
 * @param {string} commentId - Unique identifier of the parent comment.
 * @access any (public)
 */
router.get('/:commentId/replies', );

/**
 * @route GET /comments/:commentId/replies/count
 * @description Get the total number of replies for a specific comment.
 * @param {string} commentId - Unique identifier of the parent comment.
 * @access any (public)
 */
router.get('/:commentId/replies/count', );


/**
 * @route POST /comments/:commentId/replies
 * @description Create a new reply for a specific comment.
 * @param {string} commentId - Unique identifier of the parent comment.
 * @body {string} content - The content of the reply.
 * @access all (authenticated users only)
 */
router.post('/:commentId/replies', );

/**
 * @route GET /comments/:commentId/replies/:index
 * @description Retrieve a single reply by index.
 * @param {string} commentId - Unique identifier of the parent comment.
 * @param {number} index - Index of the reply in the list.
 * @access any (public)
 */
router.get('/:commentId/replies/:index', );

/* -------------------------------------------------------------------------- */
/*                                Comment Likes                               */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /comments/:commentId/likes
 * @description Retrieve likes for a specific comment.
 * @param {string} commentId - Unique identifier of the comment.
 * @query {number} offset - Starting index for pagination.
 * @query {number} limit - Number of results to return.
 * @access any (public)
 */
router.get('/:commentId/likes', );

/**
 * @route GET /comments/:commentId/likes/count
 * @description Retrieve comment likes count.
 * @param {string} commentId - Unique identifier of the comment.
 * @access any (public)
 */
router.get('/:commentId/likes/count', );

/**
 * @route GET /comments/:commentId/likes/me
 * @description Retrieve if i set like comment.
 * @param {string} commentId - Unique identifier of the comment.
 * @access Owner
 */
router.get('/:commentId/likes/me', );

/**
 * @route POST /comments/:commentId/likes
 * @description Like a specific comment.
 * @param {string} commentId - Unique identifier of the comment.
 * @access all (authenticated users only)
 */
router.post('/:commentId/likes', );

/**
 * @route DELETE /comments/:commentId/likes
 * @description Remove a like from a specific comment.
 * @param {string} commentId - Unique identifier of the comment.
 * @access all (authenticated users only)
 */
router.delete('/:commentId/likes', );


module.exports = router;