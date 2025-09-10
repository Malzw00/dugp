const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

/**
 * @class ProjectKeywordService
 * @classdesc Service layer for managing associations between Projects and Keywords in the database.  
 * Provides methods to add, remove, and query relationships between projects and keywords using Sequelize ORM.
 * 
 * 📌 **General Notes:**
 * - The service is divided into nested group:
 *   - `Project`: Manage keywords associated with a specific project.
 * - Each association is stored in the `ProjectKeyword` join table.
 * - Duplicate associations are prevented using `findOrCreate` or `ignoreDuplicates`.
 */
class ProjectKeywordService {

    static logger = new ServiceErrorLogger({ module: 'ProjectKeywordService' });

    /**
     * Project-related operations
     * (Manage keywords associated with a specific project).
     */
    static Project = class {

        /**
         * Add a single keyword to a project.  
         * If the keyword does not exist, it will be created.
         * 
         * @param {Object} params
         * @param {string} params.keyword - The keyword text.
         * @param {number} params.project_id - The project ID.
         * @returns {Promise<Object>} The created or found Keyword instance.
         * @throws {AppError} If the project is not found or operation fails.
         */
        static async addKeyword({ keyword, project_id }) {
            try {
                const _keyword = keyword.trim().toLowerCase();

                const [instance, _] = await models.Keyword.findOrCreate({ 
                    where: { keyword: _keyword },
                    defaults: { keyword: _keyword }
                });

                const project = await models.Project.findByPk(project_id);
                if (!project) throw new Error("PROJECT_NOT_FOUND");

                await project.addKeyword(instance);
                
                return instance;
            } catch (error) {
                throw ProjectKeywordService.logger.log(this.addKeyword.name, error);
            }
        }

        /**
         * Add multiple keywords to a project.  
         * Removes duplicates from the provided list and creates new keywords if not existing.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {Array<string>} [params.keywords=[]] - List of keywords.
         * @returns {Promise<Array<Object>|null>} List of Keyword instances, or null if no keywords provided.
         * @throws {AppError} If the project is not found or operation fails.
         */
        static async addKeywords({ project_id, keywords = [] }) {
            if (!keywords.length) return null;
            try {
                const uniqueKeywords = [...new Set(keywords.map(keyword => keyword.trim().toLowerCase()))];

                const keywordInstances = [];
                for (const kw of uniqueKeywords) {
                    const [keyword] = await models.Keyword.findOrCreate({
                        where: { keyword: kw },
                        defaults: { keyword: kw }
                    });
                    keywordInstances.push(keyword);
                }

                const project = await models.Project.findByPk(project_id);
                if (!project) throw new Error("Project not found");
                
                await project.addKeywords(keywordInstances, { through: { ignoreDuplicates: true } });

                return keywordInstances;
            } catch (error) {
                throw ProjectKeywordService.logger.log(this.addKeywords.name, error);
            }
        }

        /**
         * Remove a keyword association from a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {number} params.keyword_id - The keyword ID.
         * @returns {Promise<number>} Number of rows deleted.
         * @throws {AppError} If deletion fails.
         */
        static async removeKeyword({ project_id, keyword_id }) {
            try {
                const deletedRows = await models.ProjectKeyword.destroy({
                    where: { project_id, keyword_id }
                });
                return deletedRows;
            } catch (error) {
                throw ProjectKeywordService.logger.log(this.removeKeyword.name, error);
            }
        }
       
       
        /**
         * Remove multiple keyword associations from a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {Array<number>} params.keyword_ids - Array of keyword IDs to remove.
         * @returns {Promise<number>} Number of rows deleted.
         * @throws {AppError} If deletion fails.
         * 
         * @example
         * // Example usage:
         * await ProjectKeywordService.Project.removeKeywords({
         *   project_id: 1,
         *   keyword_ids: [2, 3, 5]
         * });
         * // → Returns 3 if three associations were deleted.
         */
        static async removeKeywords({ project_id, keyword_ids }) {
            if(!keyword_ids.length) return 0;
            try {
                const deletedRows = await models.ProjectKeyword.destroy({
                    where: { project_id, keyword_id: keyword_ids }
                });
                return deletedRows;
            } catch (error) {
                throw ProjectKeywordService.logger.log(this.removeKeyword.name, error);
            }
        }


        /**
         * Check if a specific keyword is associated with a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {string} params.keyword - The keyword text.
         * @returns {Promise<boolean>} True if the keyword is associated, otherwise false.
         * @throws {AppError} If the check fails.
         */
        static async includes ({ project_id, keyword }) {
            try {
                const exists = await models.ProjectKeyword.findOne({
                    include: [{ 
                        model: models.Keyword, 
                        attributes: [ 'keyword_id', 'keyword' ] 
                    }],
                    where: { project_id, keyword }
                });
                return !!exists;
            } catch (error) {
                throw ProjectKeywordService.logger.log(this.includes.name, error);
            }
        }

        /**
         * Get all keywords associated with a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @returns {Promise<Array<{keyword_id: number, keyword: string}>>}  
         *   Array of keyword objects.
         * @throws {AppError} If fetching fails.
         */
        static async getKeywords({ project_id }) {
            try {
                const keywords = await models.ProjectKeyword.findAll({
                    include: [{ 
                        model: models.Keyword, 
                        attributes: [ 'keyword_id', 'keyword' ],
                    }],
                    where: { project_id }
                });
                return keywords;
            } catch (error) {
                throw ProjectKeywordService.logger.log(this.getKeywords.name, error);
            }
        }
    }
}

module.exports = ProjectKeywordService;
