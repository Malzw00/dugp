const { models } = require('@config/database.config');
const ServiceErrorLogger = require('@root/src/utils/serviceErrorLogger.util');

/**
 * @class KeywordService
 * @classdesc Service layer for managing Keywords in the database.  
 * Provides CRUD operations (Create, Read, Update, Delete) on the `Keyword` model using Sequelize ORM.  
 * Includes structured error handling with logging for better maintainability.
 */
class KeywordService {

    static logger = new ServiceErrorLogger({ module: 'Keyword' });

    /**
     * Create a new keyword.
     * 
     * @async
     * @param {Object} params
     * @param {string} params.keyword - The keyword text to create.
     * @returns {Promise<Object>} The created keyword instance.
     * @throws {AppError} If validation fails, keyword already exists, or database creation fails.
     * 
     * @example
     * const keyword = await KeywordService.create({ keyword: "Artificial Intelligence" });
     * console.log(keyword.keyword); // "Artificial Intelligence"
     */
    static async create({ keyword }) {
        try {
            const _keyword = keyword.trim().toLowerCase();
            const created = await models.Keyword.create({ keyword: _keyword });
            return created;
        } catch (error) {
            throw this.logger.log(this.create.name, error);
        }
    }

    /**
     * Retrieve a keyword by its ID, or fetch all keywords if no ID is provided.
     * 
     * @async
     * @param {Object} params
     * @param {number} [params.keyword_id] - The keyword identifier (optional).  
     * If omitted, all keywords will be returned.
     * @returns {Promise<Object|Object[]>} A single keyword instance if `keyword_id` is provided, otherwise an array of all keywords.
     * @throws {AppError} If fetching fails.
     * 
     * @example
     * const allKeywords = await KeywordService.get({});
     * const singleKeyword = await KeywordService.get({ keyword_id: 1 });
     */
    static async get({ keyword_id }) {
        try {
            const keyword = keyword_id === undefined
                ? await models.Keyword.findAll()
                : await models.Keyword.findByPk(keyword_id);

            return keyword;
        } catch (error) {
            throw this.logger.log(this.get.name, error);
        }
    }

    /**
     * Update the name (text) of an existing keyword.
     * 
     * @async
     * @param {Object} params
     * @param {number} params.keyword_id - The keyword identifier to update.
     * @param {string} params.keyword - The new keyword text.
     * @returns {Promise<number>} The number of affected rows (0 if not found).
     * @throws {AppError} If the keyword ID does not exist, the new name already exists, or update fails.
     * 
     * @example
     * const affected = await KeywordService.updateName({ keyword_id: 5, keyword: "Machine Learning" });
     * console.log(affected); // 1 if update successful, 0 if no rows affected
     */
    static async updateName({ keyword_id, keyword }) {
        try {
            const [affectedRows] = await models.Keyword.update(
                { keyword: keyword },
                { where: { keyword_id: keyword_id } }
            );

            return affectedRows;
        } catch (error) {
            throw this.logger.log(this.updateName.name, error);
        }
    }

    /**
     * Delete a keyword by its ID.
     * 
     * @async
     * @param {Object} params
     * @param {number} params.keyword_id - The keyword identifier to delete.
     * @returns {Promise<number>} The number of deleted rows (0 if not found).
     * @throws {AppError} If the keyword ID does not exist or deletion fails due to constraints.
     * 
     * @example
     * const deleted = await KeywordService.delete({ keyword_id: 10 });
     * console.log(deleted); // 1 if successfully deleted
     */
    static async delete({ keyword_id }) {
        try {
            const deletedRows = await models.Keyword.destroy({
                where: { keyword_id: keyword_id }
            });
            return deletedRows;
        } catch (error) {
            throw this.logger.log(this.delete.name, error);
        }
    }
}



module.exports = KeywordService;