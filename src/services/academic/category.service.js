const { models } = require('@config/database.config');
const ServiceError = require('@services/ServiceError');
const AppError = require('@root/src/utils/appError.util');
const { Sequelize } = require('sequelize');



/**
 * @class CategoryService
 * @classdesc Service layer for managing Categories in the database.  
 * Supports creating, updating, deleting, and fetching categories using Sequelize.
 */
class CategoryService {
    
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
        if(typeof category_name !== 'string' || typeof collage_id !== 'number')
            throw new ServiceError(CategoryService.name, this.create.name, { 
                type: 'ArgumentTypeError', 
                message: `Error in the types of arguments passed through the "create" function`,
            });

        try {
            const category = await models.Category.create({ category_name, collage_id });
            return category;
        } catch (error) {
            if (error instanceof Sequelize.UniqueConstraintError)
                throw CategoryServiceError({
                    method: this.create.name,
                    publicMessage: 'Failed to create category: name already exists.',
                    severity: 'error',
                    code: 'UNIQUE_NAME'
                }, error);
            else
                throw CategoryServiceError({
                    method: this.create.name,
                    publicMessage: 'Failed to create category.',
                    severity: 'error',
                    code: 'UNKNOWN_ERROR'
                }, error);
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
        if (collage_id !== undefined && typeof collage_id !== 'number') {
            throw new ServiceError(CategoryService.name, this.getAll.name, { 
                type: 'ArgumentTypeError',
                message: 'collage_id must be a number',
            });
        }

        try {
            const categories = collage_id !== undefined
                ? await models.Category.findAll({ where: { collage_id } })
                : await models.Category.findAll();
            return categories;
        } catch (error) {
            throw CategoryServiceError({
                method: this.getAll.name,
                publicMessage: 'Failed to fetch categories',
                severity: 'error',
                code: 'UNKNOWN_ERROR'
            }, error);
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
        if (typeof category_name !== 'string')
            throw new ServiceError(CategoryService.name, this.updateName.name, {
                type: 'ArgumentTypeError',
                message: 'category_name must be a string',
            });
        
        if (typeof category_id !== 'number')
            throw new ServiceError(CategoryService.name, this.updateName.name, { 
                type: 'ArgumentTypeError',
                message: 'category_id must be a number',
            });

        try {
            const [affectedRows] = await models.Category.update(
                { category_name }, 
                { where: { category_id } }
            );

            if(affectedRows === 0)
                throw new Error('ID_NOT_EXISTS');

            return { affectedRows };

        } catch (error) {
            if (error.message === 'ID_NOT_EXISTS') {
                throw CategoryServiceError({
                    method: this.updateName.name,
                    publicMessage: `No category found with ID ${category_id}`,
                    code: 'ID_NOT_EXISTS',
                    severity: 'error'
                });
            }
            else if (error instanceof Sequelize.UniqueConstraintError) {
                throw CategoryServiceError({
                    method: this.updateName.name,
                    publicMessage: 'This name already exists in the same college',
                    code: 'UNIQUE_NAME',
                    severity: 'error',
                });
            }
            else {
                throw CategoryServiceError({
                    method: this.updateCollage.name,
                    publicMessage: `Error updating category name ${category_name}#${category_id}`,
                    code: 'UNKNOWN_ERROR',
                    severity: 'error',
                });
            }
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
        if (typeof category_id !== 'number') {
            throw new ServiceError(CategoryService.name, this.updateCollage.name, { 
                type: 'ArgumentTypeError',
                message: 'category_id must be a number',
            });
        }

        if (typeof collage_id !== 'number') {
            throw new ServiceError(CategoryService.name, this.updateCollage.name, { 
                type: 'ArgumentTypeError',
                message: 'collage_id must be a number',
            });
        }

        try {
            const [affectedRows] = await models.Category.update(
                { collage_id },
                { where: { category_id } }
            );

            if(affectedRows === 0)
                throw new Error('ID_NOT_EXISTS');

            return { affectedRows };

        } catch (error) {
            if (error.message === 'ID_NOT_EXISTS') {
                throw CategoryServiceError({
                    method: this.updateName.name,
                    publicMessage: `No category found with ID ${category_id}`,
                    code: 'ID_NOT_EXISTS',
                    severity: 'error'
                });
            }
            else if (error instanceof Sequelize.UniqueConstraintError) {
                throw CategoryServiceError({
                    method: this.updateName.name,
                    publicMessage: 'This name already exists in the same college',
                    code: 'UNIQUE_NAME',
                    severity: 'error',
                });
            }
            else {
                throw CategoryServiceError({
                    method: this.updateCollage.name,
                    publicMessage: `Error updating category ${category_id}`,
                    code: 'UNKNOWN_ERROR',
                    severity: 'error',
                });
            }
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
        if (typeof category_id !== 'number') {
            throw new ServiceError(CategoryService.name, this.delete.name, { 
                type: 'ArgumentTypeError',
                message: 'category_id must be a number',
            });
        }

        try {
            const deletedRows = await models.Category.destroy({ where: { category_id } });

            if(deletedRows === 0)
                throw new Error('ID_NOT_EXISTS');

            return deletedRows;

        } catch (error) {
            if (error.message === 'ID_NOT_EXISTS') {
                throw CategoryServiceError({
                    method: this.delete.name,
                    publicMessage: 'Category ID does not exist',
                    severity: 'error',
                    code: 'ID_NOT_EXISTS'
                });
            } else {
                throw CategoryServiceError({
                    method: this.delete.name,
                    publicMessage: `Failed to delete category #${category_id}`,
                    code: 'UNKNOWN_ERROR',
                    severity: 'error',
                });
            }
        }
    }
}

/**
 * Generate an AppError for CategoryService.
 * @param {Object} params
 * @param {string} params.method - Function name where the error occurred.
 * @param {string} params.publicMessage - User-facing error message.
 * @param {'info'|'warning'|'error'|'critical'} params.severity - Error severity.
 * @param {ErrorTypes.ErrorCode} params.code - Error code.
 * @param {*} error - Original error from Sequelize or other sources.
 * @returns {AppError} Prepared error object ready to throw.
 */
function CategoryServiceError({ method, publicMessage, severity, code }, error) {
    return AppError({ 
        layer: 'Service', 
        module: 'Category', 
        method, 
        publicMessage, 
        severity, 
        code 
    }, error);
}

module.exports = CategoryService;
