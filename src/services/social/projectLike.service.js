const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");

/**
 * @class ProjectLikeService
 * @classdesc Service layer for managing project likes in the database.  
 * Provides methods to create, delete, toggle likes, and query project likes using Sequelize ORM.
 */
class ProjectLikeService {

    static logger = new ServiceErrorLogger({ module: 'ProjectLike' });

    /**
     * Create a new like for a project if it does not already exist.
     * @param {Object} params
     * @param {number} params.project_id - The ID of the liked project.
     * @param {number} params.account_id - The ID of the account liking the project.
     * @returns {Promise<Object|boolean>} The created ProjectLike instance, or `false` if the like already exists.
     * @throws {AppError} If creation fails.
     */
    static async create({ project_id, account_id }) {
        try {
            if (await this.hasLike({ account_id, project_id }))
                return false;

            const created = await models.ProjectLike.create({ 
                project_id, account_id 
            });

            return created;
            
        } catch (error) {
            throw this.logger.log(this.create.name, error);   
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
            const deletedRows = await models.ProjectLike.destroy({
                where: { project_like_id: like_id }
            });

            return deletedRows;

        } catch (error) {
            throw this.logger.log(this.delete.name, error);
        }
    }
    
    
    /**
     * Delete a like by project ID and account ID.
     * @param {Object} params
     * @param {number} params.like_id - The ID of the like to delete.
     * @returns {Promise<number>} Number of deleted rows (0 or 1).
     * @throws {AppError} If deletion fails.
     */
    static async delete({ account_id, project_id }) {
        try {
            const deletedRows = await models.ProjectLike.destroy({
                where: { account_id, project_id }
            });

            return deletedRows;

        } catch (error) {
            throw this.logger.log(this.delete.name, error);
        }
    }

    /**
     * Toggle the like status for a project.  
     * If the account already liked the project, the like is removed; otherwise, a new like is created.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.account_id - The account ID.
     * @returns {Promise<{result: Object|number, hasLike: boolean}>}  
     * An object containing the operation result (created instance or deleted rows) and the new like status.
     * @throws {AppError} If toggling fails.
     */
    static async toggle({ project_id, account_id }) {
        try {
            const hasLike = await this.hasLike({ account_id, project_id });
            return { 
                result: (
                    hasLike
                        ? await this.delete({ account_id, project_id })
                        : await this.create({ project_id, account_id })
                ),
                hasLike: !hasLike,
            };
        } catch (error) {
            throw this.logger.log(this.toggle.name, error);
        }
    }



    /**
     * Get likes for a specific project with pagination.
     *
     * @param {Object} params - Query parameters.
     * @param {number} params.project_id - The project ID.
     * @param {number} [params.offset=0] - Number of records to skip (for pagination).
     * @param {number} [params.limit=20] - Maximum number of records to return.
     * @returns {Promise<Object[]>} An array of ProjectLike instances with account details.
     *
     * @throws {AppError} If fetching fails.
     *
     * @example
     * // Example Result
     * [
     *   {
     *     project_id: 5,
     *     account_id: 101,
     *     Account: {
     *       account_id: 101,
     *       account_name: "Ahmed Ali",
     *       profile_image_id: 12,
     *     }
     *   },
     *   ...
     * ]
     */
    static async getProjectLikes({ project_id, offset = 0, limit = 20 }) {
        try {
            const likes = await models.ProjectLike.findAll({
                where: { project_id: project_id },
                include: [{
                    model: models.Account,
                    attributes: [ 'account_id', 'account_name', 'profile_image_id', ],
                    required: true,
                }],
                offset: offset ?? 0,
                limit: limit ?? 20,
            });

            return likes;

        } catch (error) {
            throw this.logger.log(this.getProjectLikes.name, error);
        }
    }

    /**
     * Get the total number of likes for a project.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @returns {Promise<number>} The total number of likes.
     * @throws {AppError} If counting fails.
     */
    static async getProjectLikesCount({ project_id }) {
        try {
            return await models.ProjectLike.count({ where: { project_id: project_id } });

        } catch (error) {
            throw this.logger.log(this.getProjectLikesCount.name, error);
        }
    }

    /**
     * Check whether an account has already liked a project.
     * @param {Object} params
     * @param {number} params.account_id - The account ID.
     * @param {number} params.project_id - The project ID.
     * @returns {Promise<boolean>} True if the account has liked the project, false otherwise.
     * @throws {AppError} If checking fails.
     */
    static async hasLike({ account_id, project_id }) {
        try {
            const like = await models.ProjectLike.findOne({ 
                where: { account_id, project_id }
            });

            return !!like;

        } catch (error) {
            throw this.logger.log(this.hasLike.name, error);   
        }
    }
}



module.exports = ProjectLikeService;