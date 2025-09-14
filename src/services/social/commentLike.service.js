const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");
const { models } = require("@config/database.config");


/**
 * @class CommentLikeService
 * @classdesc Service layer for managing likes on comments in the database.  
 * Provides methods to create, delete, toggle, and query likes for comments using Sequelize ORM.
 * 
 * 📌 **General Notes:**
 * - Each like is associated with both an account and a comment.  
 * - Duplicate likes are prevented (an account can only like a comment once).  
 * - The `toggle` method switches between like and unlike states.  
 * - Pagination is supported for fetching comment likes.  
 */
class CommentLikeService {
    
    static #logger = new ServiceErrorLogger({ module: 'CommentLikeService' });
    
    /**
     * Create a new like for a comment if it does not already exist.
     * @param {Object} params
     * @param {number} params.comment_id - The ID of the liked comment.
     * @param {number} params.account_id - The ID of the account liking the comment.
     * @returns {Promise<Object|boolean>} The created CommentLike instance, or `false` if the like already exists.
     * @throws {AppError} If creation fails.
     */
    static async create ({ comment_id, account_id }) {
        try {
            if (await this.hasLike({ account_id, comment_id }))
                return false;
            const created = await await models.CommentLike.create({
                comment_id, account_id
            });
            return created;

        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }

    /**
     * Get likes for a specific comment with pagination.
     * @param {Object} params
     * @param {number} params.comment_id - The comment ID.
     * @param {number} [params.offset=0] - Number of records to skip.
     * @param {number} [params.limit=10] - Maximum number of records to return.
     * @returns {Promise<Object[]>} An array of CommentLike instances.
     * @throws {AppError} If fetching fails.
     */
    static async getCommentLikes({ comment_id, offset = 0, limit = 10 }) {
        try {
            const likes = await models.CommentLike.findAll({
                where: { comment_id },
                offset, limit
            });
            return likes;
        } catch (error) {
            throw this.#logger.log(this.getCommentLikes.name, error);
        }
    }

    /**
     * Get the total number of likes for a specific comment.
     * @param {Object} params
     * @param {number} params.comment_id - The comment ID.
     * @returns {Promise<number>} The total number of likes.
     * @throws {AppError} If counting fails.
     */
    static async getCommentLikesCount({ comment_id }) {
        try {
            const count = await models.CommentLike.count({
                where: { comment_id }
            });
            return count;
        } catch (error) {
            throw this.#logger.log(this.getCommentLikesCount.name, error);
        }
    }

    /**
     * Toggle the like status for a comment.  
     * If the account already liked the comment, the like is removed; otherwise, a new like is created.
     * @param {Object} params
     * @param {number} params.comment_id - The comment ID.
     * @param {number} params.account_id - The account ID.
     * @returns {Promise<{result: Object|number, hasLike: boolean}>}  
     * An object containing the operation result (created instance or deleted rows) and the new like status.
     * @throws {AppError} If toggling fails.
     */
    static async toggle({ comment_id, account_id }) {
        try {
            const hasLike = await this.hasLike({ account_id, comment_id });
            return { 
                result: (
                    hasLike
                        ? await this.delete({ account_id, comment_id })
                        : await this.create({ comment_id, account_id })
                ),
                hasLike: !hasLike,
            };
        } catch (error) {
            throw this.#logger.log(this.toggle.name, error);
        }
    }

    /**
     * Delete a like by its ID.
     * @param {Object} params
     * @param {number} params.like_id - The ID of the like to delete.
     * @returns {Promise<number>} Number of deleted rows (0 or 1).
     * @throws {AppError} If deletion fails.
     */
    static async deleteByID({ like_id }) {
        try {
            const deletedRows = await models.CommentLike.destroy({
                where: { comment_like_id: like_id }
            });
            return deletedRows;
        } catch (error) {
            throw this.#logger.log(this.delete.name, error);
        }
    }

    /**
     * Delete a like by account and comment IDs.
     * @param {Object} params
     * @param {number} params.account_id - The account ID.
     * @param {number} params.comment_id - The comment ID.
     * @returns {Promise<number>} Number of deleted rows (0 or 1).
     * @throws {AppError} If deletion fails.
     */
    static async delete({ account_id, comment_id }) {
        try {
            const deletedRows = await models.CommentLike.destroy({
                where: { account_id, comment_id }
            });
            return deletedRows;
        } catch (error) {
            throw this.#logger.log(this.delete.name, error);
        }
    }

    /**
     * Check whether an account has already liked a comment.
     * @param {Object} params
     * @param {number} params.account_id - The account ID.
     * @param {number} params.comment_id - The comment ID.
     * @returns {Promise<boolean>} True if the account has liked the comment, false otherwise.
     * @throws {AppError} If checking fails.
     */
    static async hasLike({ account_id, comment_id }) {
        try {
            const like = await models.CommentLike.findOne({
                where: { account_id, comment_id }
            });
            return !!like;
        } catch (error) {
            throw this.#logger.log(this.hasLike.name, error);
        }
    }
}


module.exports = CommentLikeService;
