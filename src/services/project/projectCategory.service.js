const { models } = require("@root/src/config/database.config");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

/**
 * @class ProjectCategoryService
 * @classdesc Service layer for managing associations between Projects and Categories in the database.  
 * Provides methods to add, remove, and query relationships between projects and categories using Sequelize ORM.
 * 
 * 📌 **General Notes:**
 * - The service is divided into two nested groups:
 *   - `Category`: Manage projects inside a specific category.
 *   - `Project`: Manage categories associated with a specific project.
 * - Each association is stored in the `ProjectCategory` join table.
 * - Duplicate associations are prevented using `findOrCreate` or `ignoreDuplicates`.
 */
class ProjectCategoryService {

    static #logger = new ServiceErrorLogger({ module: 'ProjectCategoryService' });

    /**
     * Category-related operations
     * (Manage projects inside a specific category).
     */
    static Category = class {

        /**
         * Add a project to a category.  
         * If the association already exists, it will not create a duplicate.
         * @static
         * @param {Object} params
         * @param {number} params.category_id - The category ID.
         * @param {number} params.project_id - The project ID.
         * @returns {Promise<{instance: Object, created: boolean}>}  
         *   Returns the created/loaded ProjectCategory instance and a boolean indicating creation.
         * @throws {AppError} If association fails.
         */
        static async addProject({ category_id, project_id }) {
            try {
                const [instance, created] = await models.ProjectCategory.findOrCreate({
                    where: { project_id, category_id }
                });
                return { instance, created };
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.addProject.name, error);
            }
        }

        /**
         * Remove a project from a category.
         * @static
         * @param {Object} params
         * @param {number} params.category_id - The category ID.
         * @param {number} params.project_id - The project ID.
         * @returns {Promise<number>} Number of rows deleted.
         * @throws {AppError} If deletion fails.
         */
        static async removeProject({ category_id, project_id }) {
            try {
                const deletedRows = await models.ProjectCategory.destroy({
                    where: { category_id, project_id }
                });
                return deletedRows;
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.removeProject.name, error)
            }
        }

        /**
         * Get projects associated with a specific category (paginated).
         * @static
         * @param {Object} params
         * @param {number} params.category_id - The category ID.
         * @param {number} [params.offset=0] - Number of records to skip.
         * @param {number} [params.limit=10] - Maximum number of records to return.
         * @returns {Promise<Array<Object>>} Array of project objects with:
         *   - project_id {number}  
         *   - project_title {string}  
         *   - cover_image_id {number|null}  
         *   - Images {Array<{ image_path: string }>}  
         * @throws {AppError} If fetching fails.
         */
        static async getProjects({ category_id, offset = 0, limit = 10 }) {
            try {
                const projects = await models.Project.findAll({
                    attributes: ['project_id', 'project_description', 'project_title'],
                    include: [
                        {
                            model: models.Category,
                            where: { category_id },
                            attributes: [],
                            through: { attributes: [] }
                        },
                    ],
                    offset,
                    limit,
                    order: [['project_id', 'ASC']]
                });

                return projects;
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.getProjects.name, error);
            }
        }

        /**
         * Check if a project belongs to a specific category.
         * @static
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {number} params.category_id - The category ID.
         * @returns {Promise<boolean>} True if association exists, otherwise false.
         * @throws {AppError} If the check fails.
         */
        static async includes({ project_id, category_id }) {
            try {
                const exists = await models.ProjectCategory.findOne({
                    where: { project_id, category_id }
                });
                return !!exists;
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.include.name, error);
            }
        }
    }

    /**
     * Project-related operations
     * (Manage categories associated with a specific project).
     */
    static Project = class {

        /**
         * Get categories associated with a project.
         * @static
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @returns {Promise<Array<{category_id: number, category_name: string}>>}  
         *   Array of category objects.
         * @throws {AppError} If fetching fails.
         */
        static async getCategories({ project_id }) {
            try {
                const categories = await models.ProjectCategory.findAll({
                    include: [{
                        model: models.Category,
                        attributes: ['category_id', 'category_name']
                    }],
                    where: { project_id },
                });
                return categories;
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.getCategories.name, error);
            }
        }

        /**
         * Add a project to multiple categories.  
         * Duplicate associations are ignored.
         * @static
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {Array<number>} params.category_ids - Array of category IDs.
         * @returns {Promise<number|null>} Number of categories added, or null if no IDs provided.
         * @throws {AppError} If creation fails.
         */
        static async addToCategories({ project_id, category_ids = [] }) {
            if (!category_ids.length) return null;
            try {
                const categoryProjects = category_ids.map(category_id => {
                    return { project_id, category_id };
                });
                const created = await models.ProjectCategory.bulkCreate(
                    categoryProjects,
                    { ignoreDuplicates: true }
                );
                return created?.length;
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.addToCategories.name, error);
            }
        }

        /**
         * Remove a project from multiple categories.
         * @static
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {Array<number>} params.category_ids - Array of category IDs.
         * @returns {Promise<number>} Number of rows deleted.
         * @throws {AppError} If deletion fails.
         */
        static async removeFromCategories({ project_id, category_ids = [] }) {
            if (!category_ids.length) return 0;
            try {
                const deletedRows = await models.ProjectCategory.destroy({
                    where: { project_id, category_id: category_ids }
                });
                return deletedRows;
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.removeFromCategories.name, error);
            }
        }

        /**
         * Check if a project belongs to any of the provided categories.
         * @static
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {Array<number>} params.category_ids - Array of category IDs.
         * @returns {Promise<boolean>} True if the project belongs to at least one category.
         * @throws {AppError} If the check fails.
         */
        static async includes({ project_id, category_ids = [] }) {
            if (!category_ids.length) return false;
            try {
                const count = await models.ProjectCategory.count({
                    where: { project_id, category_id: category_ids }
                });
                return count > 0;
            } catch (error) {
                throw ProjectCategoryService.#logger.log(this.includes.name, error);
            }
        }
    }
}

module.exports = ProjectCategoryService;