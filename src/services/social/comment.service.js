const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");
const { models } = require('@config/database.config');
const { fn, col } = require("sequelize");



/**
 * @class CommentService
 * @classdesc Service layer for managing comments in the database.  
 * 
 * 📌 **General Notes:**
 * - Only top-level comments (`parent_id = null`) are considered as main comments.  
 * - Replies are fetched through a Sequelize association named `Replies`.  
 * - Each comment or reply includes the associated account (Account) details.  
 * - Results are ordered in descending order by creation date (`created_at DESC`).  
 */
class CommentService {

    static #logger = new ServiceErrorLogger({ module: 'CommentService' });

    /**
     * Create a new comment or reply on a project.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.account_id - The account ID posting the comment.
     * @param {number|null} [params.parent_id=null] - The parent comment ID if this is a reply.
     * @param {string} params.comment_content - The content of the comment.
     * @returns {Promise<Object>} The created Comment instance.
     * @throws {AppError} If creation fails.
     */
    static async create ({ project_id, account_id, parent_id = null, comment_content }) {
        try {
            const created = await models.Comment.create({
                project_id:         project_id,
                account_id:         account_id,
                parent_id:          parent_id?? null,
                comment_content:    comment_content,
            });

            return created;

        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }

    /**
     * Update an existing comment.
     * @param {Object} params
     * @param {number} params.account_id - The account ID.
     * @param {number} params.comment_id - The comment ID.
     * @param {string} params.comment_content - The new content for the comment.
     * @returns {Promise<number>} Number of updated rows (0 or 1).
     * @throws {AppError} If update fails.
     */
    static async update({ account_id, comment_id, comment_content }) {
        try {
            const [affectedRows] = await models.Comment.update(
                { comment_content: comment_content },
                { where: { comment_id: comment_id, account_id: account_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.update.name, error);
        }
    }

    /**
     * Get all top-level comments for a project (with nested replies).  
     * Includes account details for each comment and reply.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} [params.offset=0] - Number of records to skip.
     * @param {number} [params.limit=10] - Maximum number of records to return.
     * @returns {Promise<Object[]>} An array of Comment instances with nested replies.
     * @throws {AppError} If fetching fails.
     */
    static async getProjectComments({ project_id, offset = 0, limit = 10 }) {
        try {
            const comments = await models.Comment.findAll({
                where: { project_id: project_id, parent_id: null },
                attributes: [ 
                    'comment_id', 
                    'comment_content', 
                    'parent_id', 
                    'account_id',
                    [fn("COUNT", col('CommentLike.comment_like_id')), 'likes_count']
                ],
                include: [
                    {
                        model: models.Comment,
                        as: 'Replies',
                        required: false,
                        include: [{
                            model: models.Account,
                            required: true,
                            attributes: [ 'account_id', 'account_name', 'profile_image_id', 'created_at' ],
                        }]
                    },
                    { 
                        model: models.CommentLike, 
                        attributes: [] 
                    },
                    {
                        model: models.Account,
                        required: true,
                        attributes: [ 'account_id', 'account_name', 'profile_image_id', 'created_at' ],
                    }
                ],
                offset: offset,
                limit: limit,
                order: [ [ 'created_at', 'DESC' ] ],
            });

            return comments;
            
        } catch (error) {
            this.#logger.log(this.getProjectComments.name, error);
        }
    }

    /**
     * Get the total number of top-level comments for a project.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @returns {Promise<number>} The total number of comments.
     * @throws {AppError} If counting fails.
     */
    static async getProjectCommentsCount({ project_id }) {
        try {
            const count = await models.Comment.count({ 
                where: { project_id, parent_id: null } 
            });

            return count;
            
        } catch (error) {
            throw this.#logger.log(this.getProjectCommentsCount.name, error);
        }
    }

    /**
     * Delete a comment by its ID (including replies if cascades are set in DB).
     * @param {Object} params
     * @param {number} params.comment_id - The comment ID.
     * @returns {Promise<number>} Number of deleted rows (0 or 1).
     * @throws {AppError} If deletion fails.
     */
    static async delete({ comment_id }) {
        try {
            const deletedRows = await models.Comment.destroy({
                where: { comment_id: comment_id, }
            });
            return deletedRows;

        } catch (error) {
            throw this.#logger.log(this.delete.name, error);
        }
    }

    /**
     * Delete a comment by its ID (including replies if cascades are set in DB).
     * @param {Object} params
     * @param {number} params.comment_id - The comment ID.
     * @param {number} params.account_id - The account ID.
     * @returns {Promise<number>} Number of deleted rows (0 or 1).
     * @throws {AppError} If deletion fails.
     */
    static async deleteUserComment({ comment_id, account_id }) {
        try {
            const deletedRows = await models.Comment.destroy({
                where: { comment_id: comment_id, account_id: account_id, }
            });
            return deletedRows;

        } catch (error) {
            throw this.#logger.log(this.deleteUserComment.name, error);
        }
    }

    /**
     * Get all comments of a specific account on a project (with replies).  
     * Includes account details for each comment and reply.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.account_id - The account ID.
     * @param {number} [params.offset=0] - Number of records to skip.
     * @param {number} [params.limit=10] - Maximum number of records to return.
     * @returns {Promise<Object[]>} An array of Comment instances.
     * @throws {AppError} If fetching fails.
     */
    static async getAccountComments({ project_id, account_id, offset = 0, limit = 10 }) {
        try {
            const comments = await models.Comment.findAll({
                where: { project_id: project_id, account_id: account_id },
                attributes: [ 'comment_id', 'comment_content', 'parent_id', 'account_id' ],
                include: [
                    {   
                        model: models.Comment,
                        as: 'Replies',
                        required: false,
                        include: [{
                            model: models.Account,
                            required: true,
                            attributes: [ 'account_id', 'account_name', 'profile_image_id', 'created_at' ],
                        }]
                    },
                    {
                        model: models.Account,
                        required: true,
                        attributes: [ 'account_id', 'account_name', 'profile_image_id', 'created_at' ],
                    }
                ],
                offset: offset,
                limit: limit,
                order: [ [ 'created_at', 'DESC' ] ],
            });

            return comments;

        } catch (error) {
            throw this.#logger.log(this.getAccountComments.name, error);
        }
    }
    
    /**
     * Get a specific comment by its ID (without nested replies).  
     * Includes account details of the author.
     * @param {Object} params
     * @param {number} params.comment_id - The comment ID.
     * @returns {Promise<Object|null>} The Comment instance or null if not found.
     * @throws {AppError} If fetching fails.
     */
    static async getCommentByID({ comment_id }) {
        try {
            const comment = await models.Comment.findOne({
                where: { comment_id: comment_id },
                attributes: [ 'comment_id', 'comment_content', 'parent_id', 'account_id' ],
                include: [
                    {
                        model: models.Account,
                        required: true,
                        attributes: [ 'account_id', 'account_name', 'profile_image_id', 'created_at' ],
                    }
                ],
            });

            return comment;
        } catch (error) {
            throw this.#logger.log(this.getCommentByID.name, error);
        }
    }
}

module.exports = CommentService;
