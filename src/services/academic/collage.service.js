const { models } = require('@config/database.config');
const ServiceErrorLogger = require('@root/src/utils/serviceErrorLogger.util');

/**
 * @class CollageService
 * @classdesc Service layer for managing Collages in the database.  
 * Provides methods to create, update, and delete collages using Sequelize ORM.
 */
class CollageService {

    static #logger = new ServiceErrorLogger({ module: 'Collage' });

    /**
     * Create a new collage.
     * @param {Object} params
     * @param {string} params.collage_name - The name of the collage.
     * @returns {Promise<Object>} The created collage instance.
     * @throws {AppError} If validation fails, the name already exists, or creation fails.
     */
    static async create({ collage_name }) {

        try {
            const created = await models.Collage.create({ collage_name: collage_name });
            return created;

        } catch (error) {
           throw this.#logger.log(this.create.name, error);
        }
    }

    /**
     * Update the name of an existing collage.
     * @param {Object} params
     * @param {string} params.collage_name - The new collage name.
     * @param {number} params.collage_id - The collage identifier to update.
     * @returns {Promise<number>} The number of affected rows.
     * @throws {AppError} If the collage ID does not exist, the name already exists, or update fails.
     */
    static async updateName({ collage_name, collage_id }) {

        try {
            const [affectedRows] = await models.Collage.update(
                { collage_name: collage_name },
                { where: { collage_id: collage_id } },
            );

            return affectedRows;

        } catch (error) {
            throw this.#logger.log(this.updateName.name, error);
        }
    }

    /**
     * Retrieve a collage by ID, or fetch all collages if no ID is provided.
     * @param {Object} params
     * @param {number} [params.collage_id] - The collage identifier (optional).
     * @returns {Promise<Object|Object[]>} A single collage instance or an array of collages.
     * @throws {AppError} If fetching fails.
     */
    static async get({ collage_id }) {

        try {
            const collage = collage_id === undefined
                ? await models.Collage.findAll()
                : await models.Collage.findByPk(collage_id);

            return collage;

        } catch (error) {
            throw this.#logger.log(this.get.name, error);
        }
    }
    
    
    
    /**
     * Retrieve a collage by ID, or fetch all collages if no ID is provided.
     * @param {Object} params
     * @param {number} [params.offset]
     * @param {number} [params.limit]
     * @returns {Promise<Object[]>} A single collage instance or an array of collages.
     * @throws {AppError} If fetching fails.
     */
    static async getAll({ offset, limit }) {

        try {
            const collages = await models.Collage.findAll({ offset, limit });
            return collages;
        } catch (error) {
            throw this.#logger.log(this.get.name, error);
        }
    }



    /**
     * Delete a collage by ID.
     * @param {Object} params
     * @param {number} params.collage_id - The collage identifier.
     * @returns {Promise<number>} The number of deleted rows.
     * @throws {AppError} If the collage ID does not exist or foreign key constraints prevent deletion.
     */
    static async delete({ collage_id }) {

        try {
            const deletedRows = await models.Collage.destroy({
                where: { collage_id: collage_id }
            });

            if (deletedRows === 0)
                throw new Error('ID_NOT_EXISTS');

            return deletedRows;
        } catch (error) {
            throw this.#logger.log(this.delete.name, error)
        }
    }
}



module.exports = CollageService;
