const CommentService = require("@services/social/comment.service");
const CommentLikeService = require("../services/social/commentLike.service");

/**
 * @controller commentController
 * @description Handles comment CRUD operations and likes management.
 */
const commentController = {

    /**
     * Get a comment by its ID.
     * 
     * @route GET /comments/:commentId
     * @access Protected
     * @param {import("express").Request} req - Express request object
     * @param {import("express").Response} res - Express response object
     */
    async getByID(req, res) {
        try {
            const { commentId } = req.params;
            const commentIdNum = parseInt(commentId);

            const comment = await CommentService.getCommentByID({ comment_id: commentIdNum });

            if (!comment) {
                return res.status(404).json({ success: false });
            }

            res.status(200).json({ success: true, result: comment });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Delete a comment by its ID.
     * 
     * @route DELETE /comments/:commentId
     * @access Protected
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async deleteByID(req, res) {
        try {
            const { commentId } = req.params;
            const commentIdNum = parseInt(commentId);

            const deleted = await CommentService.delete({ comment_id: commentIdNum });

            if (!deleted) {
                return res.status(404).json({ success: false });
            }

            res.status(200).json({ success: true });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Update a comment's content.
     * 
     * @route PATCH /comments/:commentId
     * @access Protected
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async update(req, res) {
        try {
            const { accountID } = req.user;
            const { commentId } = req.params;
            const { content } = req.body;
            
            const commentIdNum = parseInt(commentId);
            const accountIdNum = parseInt(accountID);

            const updated = await CommentService.update({ 
                comment_id: commentIdNum,
                comment_content: content,
                account_id: accountIdNum,
            });

            if (!updated) {
                return res.status(400).json({ success: false });
            }

            res.status(200).json({ success: true });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Get likes of a comment.
     * 
     * @route GET /comments/:commentId/likes
     * @access Protected
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getLikes(req, res) {
        try {
            const { commentId } = req.params;
            const { offset, limit } = req.query;
            const commentIdNum = parseInt(commentId);
            const offsetNum = parseInt(offset);
            const limitNum = parseInt(limit);

            const commentLikes = await CommentLikeService.getCommentLikes({ 
                comment_id: commentIdNum,
                offset: offsetNum,
                limit: limitNum,
            });

            if (!commentLikes) {
                return res.status(404).json({ success: false });
            }

            res.status(200).json({ success: true, result: commentLikes });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Get count of likes for a comment.
     * 
     * @route GET /comments/:commentId/likes/count
     * @access Protected
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async getLikesCount(req, res) {
        try {
            const { commentId } = req.params;
            const commentIdNum = parseInt(commentId);

            const commentLikesCount = await CommentLikeService.getCommentLikesCount({ 
                comment_id: commentIdNum 
            });

            if (!commentLikesCount) {
                return res.status(404).json({ success: false });
            }

            res.status(200).json({ success: true, result: commentLikesCount });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Check if the current user liked a comment.
     * 
     * @route GET /comments/:commentId/am-i-liked
     * @access Protected
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async amILiked(req, res) {
        try {
            const { commentId } = req.params;
            const { accountID } = req.user;
            const commentIdNum = parseInt(commentId);

            const hasLike = await CommentLikeService.hasLike({ 
                comment_id: commentIdNum,
                account_id: accountID,
            });

            if (!hasLike) {
                return res.status(404).json({ success: false });
            }

            res.status(200).json({ success: true, result: hasLike });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Like a comment.
     * 
     * @route POST /comments/:commentId/likes
     * @access Protected
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async createLike(req, res) {
        try {
            const { commentId } = req.params;
            const { accountID } = req.user;
            const commentIdNum = parseInt(commentId);

            const created = await CommentLikeService.create({ 
                comment_id: commentIdNum,
                account_id: accountID,
            });

            if (!created) {
                return res.status(404).json({ success: false });
            }

            res.status(200).json({ success: true });

        } catch {
            res.status(500).json({ success: false });
        }
    },

    /**
     * Remove a like from a comment.
     * 
     * @route DELETE /comments/:commentId/likes
     * @access Protected
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async deleteLike(req, res) {
        try {
            const { commentId } = req.params;
            const { accountID } = req.user;
            const commentIdNum = parseInt(commentId);

            const deleted = await CommentLikeService.delete({ 
                comment_id: commentIdNum,
                account_id: accountID,
            });

            if (!deleted) {
                return res.status(400).json({ success: false });
            }

            res.status(200).json({ success: true });

        } catch {
            res.status(500).json({ success: false });
        }
    },
}

module.exports = commentController;