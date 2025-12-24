const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

class ReferenceService {

    static #logger = new ServiceErrorLogger({ module: 'ReferenceService' });

    /**
     * Create a new reference entry.
     *
     * @param {Object} params
     * @param {string} params.title - Reference title.
     * @param {string|null} [params.author=null] - Author of the reference.
     * @param {string|null} [params.link=null] - Reference link (can be local: or network: path).
     * @returns {Promise<Object>} Created Reference instance.
     * @throws {AppError} Throws if creation fails.
     */
    static async create({ title, author=null, link=null }) {
        try {
            const created = await models.Reference.create({
                reference_title: title,
                reference_author: author,
                reference_link: link,
            });

            return created;
        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }

    /**
     * Fetch a reference by its primary key.
     *
     * @param {Object} params
     * @param {number} params.reference_id - ID of the reference.
     * @returns {Promise<Object|null>} Reference instance if found, otherwise null.
     * @throws {AppError} Throws if fetching fails.
     */
    static async getReferenceByID({ reference_id }) {
        try {
            const reference = await models.Reference.findByPk(reference_id);
            return reference;
        } catch (error) {
            throw this.#logger.log(this.getReferenceByID.name, error);
        }
    }

    /**
     * Retrieve a paginated list of references.
     *
     * @param {Object} params
     * @param {number} [params.offset] - Number of rows to skip.
     * @param {number} [params.limit] - Maximum number of rows to return.
     * @returns {Promise<Object[]>} List of reference instances.
     * @throws {AppError} Throws if fetching fails.
     */
    static async getReferences({ offset, limit }) {
        try {
            const references = await models.Reference.findAll({
                offset,
                limit,
                order: [['created_at', 'ASC']]
            });
            return references;
        } catch (error) {
            throw this.#logger.log(this.getReferences.name, error);
        }
    }

    /**
     * Update an existing reference entry.
     *
     * @param {Object} params
     * @param {number} params.reference_id - ID of the reference to update.
     * @param {string} [params.title] - Updated title.
     * @param {string} [params.link] - Updated link.
     * @param {string} [params.author] - Updated author.
     * @returns {Promise<number>} Number of affected rows (1 if updated, 0 otherwise).
     * @throws {AppError} Throws if update fails.
     */
    static async update({ reference_id, title, link, author }) {
        try {
            const values = {};
            if(title)   values.reference_title  = title;
            if(link)    values.reference_link   = link;
            if(author)  values.reference_author = author;

            const [affectedRows] = await models.Reference.update(values, { where: { reference_id } });
            return affectedRows;
        } catch (error) {
            throw this.#logger.log(this.update.name, error);
        }
    }

    /**
     * Delete a reference by its ID.
     *
     * @param {Object} params
     * @param {number} params.reference_id - ID of the reference to delete.
     * @returns {Promise<number>} Number of deleted rows (1 if deleted, 0 otherwise).
     * @throws {AppError} Throws if deletion fails.
     */
    static async delete({ reference_id }) {
        try {
            const deletedRows = await models.Reference.destroy({ 
                where: { reference_id } 
            });
            return deletedRows;
        } catch (error) {
            throw this.#logger.log(this.delete.name, error);
        }
    }
}


module.exports = ReferenceService;