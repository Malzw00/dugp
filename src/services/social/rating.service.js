const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");
const { models } = require("@config/database.config");
const { sequelize } = require("@config/database.config");
const { fn, col } = require("sequelize");


/**
 * @class RatingService
 * @classdesc Service layer for managing project ratings in the database.  
 * Provides methods to create, update, query, and calculate Bayesian ratings for projects using Sequelize ORM.
 * 
 * 📌 **General Notes:**
 * - Each rating is associated with a project and an account.  
 * - Ratings are numeric values (`rate`) provided by accounts for projects.  
 * - The `getProjectRating` method calculates Bayesian ratings considering the overall average rating across all projects.  
 * - Multiple methods exist for updating ratings either by account+project or by rating ID.  
 */
class RatingService {

    static #logger = new ServiceErrorLogger({ module: 'RatingService' });

    /**
     * Create a new rating for a project by an account.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.account_id - The account ID providing the rating.
     * @param {number} params.rate - The rating value.
     * @returns {Promise<Object>} The created Rating instance.
     * @throws {AppError} If creation fails.
     */
    static async create({ project_id, account_id, rate }) {
        try {
            const created = await models.Rating.create({ 
                project_id, account_id, rate 
            });
            return created;       
        } catch (error) {
            throw this.#logger.log(this.create.name, error);   
        }
    }

    /**
     * Update a rating for a project by account.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.account_id - The account ID.
     * @param {number} params.rate - The new rating value.
     * @returns {Promise<number>} Number of updated rows (0 or 1).
     * @throws {AppError} If update fails.
     */
    static async update({ project_id, account_id, rate }) {
        try {
            const [updatedRows] = await models.Rating.update(
                { rate },
                { where: { project_id, account_id }, returning: true }
            );
            return updatedRows;       
        } catch (error) {
            throw this.#logger.log(this.update.name, error);   
        }
    }

    /**
     * Update a rating by its ID.
     * @param {Object} params
     * @param {number} params.rating_id - The rating ID.
     * @param {number} params.rate - The new rating value.
     * @returns {Promise<number>} Number of updated rows (0 or 1).
     * @throws {AppError} If update fails.
     */
    static async updateByID({ rating_id, rate }) {
        try {
            const [updatedRows] = await models.Rating.update(
                { rate },
                { where: { rating_id }, returning: true }
            );
            return updatedRows;       
        } catch (error) {
            throw this.#logger.log(this.update.name, error);   
        }
    }

    /**
     * Get all ratings for a specific project.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.offset
     * @param {number} params.limit
     * @returns {Promise<Object[]>} An array of Rating instances.
     * @throws {AppError} If fetching fails.
     */
    static async getProjectRatings({ project_id, offset, limit }) {
        try {
            const ratings = await models.Rating.findAll({
                where: { project_id: project_id },
                offset, limit
            });
            return ratings;
        } catch (error) {
            throw this.#logger.log(this.getProjectRatings.name, error);   
        }
    }

    /**
     * Get a specific rating of a project by an account.
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.account_id - The account ID.
     * @returns {Promise<Object|null>} The Rating instance or null if not found.
     * @throws {AppError} If fetching fails.
     */
    static async getAccountProjectRating({ project_id, account_id }) {
        try {
            const rating = await models.Rating.findOne({
                where: { project_id, account_id }
            });
            return rating;       
        } catch (error) {
            throw this.#logger.log(this.getAccountProjectRating.name, error);   
        }
    }

    /**
     * Calculates the average rating (AVG) for a given project.
     *
     * @async
     * @function getProjectRating
     * @param {number|string} project_id - The ID of the project to calculate the rating for.
     * @returns {Promise<number|null>} 
     *    - The average rating (a decimal value between 1 and 5).
     *    - Or `null` if the project has no ratings.
     *
     * @example
     * // Example usage:
     * const avgRating = await RatingService.getProjectRating(123);
     * console.log(avgRating); // e.g. 4.25 or null if no ratings exist
     *
     * @throws {Error} Throws an error if the database query fails or 
     *                 an unexpected issue occurs during execution.
     */
    static async getProjectRating(project_id) {
        try {
            const projectRating = await models.Rating.findOne({
                attributes: [
                    [fn('AVG', col('rate')), 'rating']
                ],
                where: { project_id },
                raw: true // return a plain object instead of a Sequelize instance
            });

            return projectRating ? projectRating.rating : null;

        } catch (error) {
            throw this.#logger.log(this.getProjectRating.name, error);
        }
    }


    // /**
    //  * Calculate Bayesian rating for a project.
    //  * @param {number} project_id - The project ID.
    //  * @param {number} [m=10] - Minimum votes required to be listed in the chart.
    //  * @returns {Promise<Object|null>} Project data with Bayesian rating, or null if project not found or no ratings available.
    //  */
    // static async getProjectRating(project_id, m = 10) {

    //     // calculate C (average rating across all projects)
    //     const result = await models.Rating.findOne({
    //         attributes: [
    //             [sequelize.fn('AVG', sequelize.col('rate')), 'C']
    //         ],
    //         raw: true
    //     });

    //     const C = parseFloat(result.C) || 0;

    //     // Select project with its ratings
    //     const projectData = await models.Project.findOne({
    //         where: { project_id: project_id },
    //         include: [
    //             {
    //                 model: models.Rating,
    //                 attributes: []
    //             }
    //         ],
    //         attributes: [
    //             'project_id',
    //             'project_title',
    //             'project_description',
    //             'project_year',
    //             'project_semester',
    //             'project_grade',
    //             // number of ratings for the project (v)
    //             [sequelize.fn('COUNT', sequelize.col('Ratings.rate_id')), 'v'],
    //             // average rating for the project (R)
    //             [sequelize.fn('AVG', sequelize.col('Ratings.rate')), 'R'],
    //         ],
    //         group: ['Project.project_id'],
    //         raw: true
    //     });

    //     if (!projectData) return null;

    //     // Calculate Bayesian Rating
    //     const v = parseInt(projectData.v, 10);
    //     const R = parseFloat(projectData.R) || 0;

    //     const bayesian_rating = ((v / (v + m)) * R) + ((m / (v + m)) * C);

    //     // Return project data with Bayesian rating
    //     return {
    //         ...projectData,
    //         rating: parseFloat(bayesian_rating.toFixed(2))
    //     };
    // }
}

module.exports = RatingService;