const { models } = require('@config/database.config');
const ServiceErrorLogger = require('@root/src/utils/serviceErrorLogger.util');


/**
 * @class CategoryService
 * @classdesc Service layer for managing Categories in the database.  
 * Provides methods to create, update, and delete categories using Sequelize ORM.
 */
class CategoryService {

    static #logger = new ServiceErrorLogger({ module: 'Category' });
    
    /**
     * Create a new category linked to a specific college.
     * @static
     * @param {Object} params
     * @param {string} params.category_name - The name of the category.
     * @param {number} params.collage_id - The ID of the college this category belongs to.
     * @throws {ServiceError} If argument types are invalid.
     * @throws {AppError} If a database error occurs or the category name already exists.
     * @returns {Promise<Object>} The newly created category object with fields: category_id, category_name, collage_id, created_at, updated_at
     */
    static async create({ category_name, collage_id }) {

        try {
            const category = await models.Category.create({ category_name, collage_id });
            return category;

        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }



    /**
     * Fetch all categories or categories of a specific college.
     * @static
     * @param {Object} [params]
     * @param {number} [params.collage_id] - College ID to filter categories.
     * @throws {ServiceError} If collage_id type is invalid.
     * @throws {AppError} If a database error occurs.
     * @returns {Promise<Array<Object>>} Array of category objects.
     */
    static async getAll({ collage_id } = {}) {

        try {
            const categories = collage_id !== undefined
                ? await models.Category.findAll({ where: { collage_id } })
                : await models.Category.findAll();
            
            return categories;

        } catch (error) {
            throw this.#logger.log(this.getAll.name, error);
        }
    }



    /**
     * Update the name of a category by its ID.
     * @static
     * @param {Object} params
     * @param {string} params.category_name - The new category name.
     * @param {number} params.category_id - The ID of the category to update.
     * @throws {ServiceError} If argument types are invalid.
     * @throws {AppError} If the category ID does not exist, the name is duplicated, or another error occurs.
     * @returns {Promise<{affectedRows: number}>} Number of rows updated.
     */
    static async updateName({ category_name, category_id }) {
        
        try {
            const [affectedRows] = await models.Category.update(
                { category_name }, 
                { where: { category_id } }
            );

            return { affectedRows };

        } catch (error) {
            throw this.#logger.log(this.updateName.name, error);
        }
    }



    /**
     * Update the college of a category by its ID.
     * @static
     * @param {Object} params
     * @param {number} params.category_id - The ID of the category.
     * @param {number} params.collage_id - The new college ID.
     * @throws {ServiceError} If argument types are invalid.
     * @throws {AppError} If the category ID does not exist or another error occurs.
     * @returns {Promise<{affectedRows: number}>} Number of rows updated.
     */
    static async updateCollage({ category_id, collage_id }) {

        try {
            const [affectedRows] = await models.Category.update(
                { collage_id: collage_id },
                { where: { category_id: category_id } }
            );

            return { affectedRows };

        } catch (error) {
            throw this.#logger.log(this.updateCollage.name, error);
        }
    }



    /**
     * Delete a category by its ID.
     * @static
     * @param {Object} params
     * @param {number} params.category_id - The ID of the category to delete.
     * @throws {ServiceError} If category_id type is invalid.
     * @throws {AppError} If the category ID does not exist or another error occurs.
     * @returns {Promise<number>} Number of rows deleted.
     */
    static async delete({ category_id }) {

        try {
            const deletedRows = await models.Category.destroy({ 
                where: { category_id: category_id } 
            });

            return deletedRows;

        } catch (error) {
            throw this.#logger.log(this.delete.name, error);
        }
    }
}


module.exports = CategoryService;
