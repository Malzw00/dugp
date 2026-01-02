const { models } = require("@root/src/config/database.config");
const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");
const { Op } = require("sequelize");

/**
 * @class AccountService
 * @classdesc Service layer for managing Accounts in the database.  
 * Provides methods to search, retrieve, update, and delete accounts using Sequelize ORM.
 */
class AccountService {

    static #logger = new ServiceErrorLogger({ module: 'Account' });

    /**
     * Delete an account by ID.
     * @param {Object} params
     * @param {string} params.fst_name
     * @param {string} params.lst_name
     * @param {string} params.account_email
     * @param {string} params.hashed_password
     * @param {string} params.account_role
     * @returns {Promise<Object>} The number of deleted rows (0 if no account was deleted).
     * @throws {Error} If deletion fails.
     */
    static async create({ fst_name, lst_name, account_email, hashed_password, }) {
        try {
            const created = models.Account.create({
                fst_name,
                lst_name,
                account_email,
                hashed_password,
                account_role: 'user'
            });

            return created;
        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }


    /**
     * Delete an account by ID.
     * @param {Object} params
     * @param {number} params.account_id - The unique identifier of the account to delete.
     * @returns {Promise<number>} The number of deleted rows (0 if no account was deleted).
     * @throws {Error} If deletion fails.
     */
    static async delete({ account_id }) {
        try {
            const deletedRows = await models.Account.destroy({
                where: { account_id: account_id }
            });
            return deletedRows;
        } catch (error) {
            throw this.#logger.log(this.delete.name, error);            
        }
    }

    /**
     * Update account details (name, email, or profile image).
     * @param {Object} params
     * @param {number} params.account_id - The unique identifier of the account to update.
     * @param {string} [params.fst_name] - New account fst name (optional).
     * @param {string} [params.lst_name] - New account lst name (optional).
     * @param {string} [params.account_email] - New account email (optional).
     * @param {number} [params.profile_image_id] - New profile image ID (optional).
     * @param {number} [params.account_role] - The unique identifier of the account to update.
     * @returns {Promise<number>} The number of affected rows (0 if no account was updated).
     * @throws {Error} If update fails.
     */
    static async update({ fst_name, lst_name, account_email, profile_image_id, account_id, account_role }) {
        try {
            const values = {};
            if(fst_name) values.fst_name = fst_name;
            if(lst_name) values.lst_name = lst_name;
            if(account_email) values.account_email = account_email;
            if(profile_image_id) values.profile_image_id = profile_image_id;
            if(account_role === 'admin' || account_role === 'user') values.account_role = account_role;

            const [affectedRows] = await models.Account.update(values, { where: { account_id: account_id } });

            return affectedRows;
        } catch (error) {
            throw this.#logger.log(this.update.name, error);
        }
    }

    /**
     * Retrieve an account by its ID.
     * @param {Object} params
     * @param {number} params.account_id - The unique identifier of the account.
     * @returns {Promise<Object|null>} The account instance if found, otherwise null.
     * @throws {Error} If retrieval fails.
     */
    static async getByID({ account_id }) {
        try {
            const account = await models.Account.findByPk(account_id);
            return account;
        } catch (error) {
            throw this.#logger.log(this.getByID.name, error);
        }
    }
    
    /**
     * Retrieve an admin accounts.
     * @param {Object} params
     * @param {number} params.offset
     * @param {number} params.limit
     * @returns {Promise<Object|null>} The account instance if found, otherwise null.
     * @throws {Error} If retrieval fails.
     */
    static async getAdmins({ offset, limit }) {
        try {
            const admins = await models.Account.findAll({
                where: { account_role: 'admin' },
                attributes: ['account_id', 'fst_name', 'lst_name', 'account_email', 'updated_at']
            });
            
            return admins;
        } catch (error) {
            throw this.#logger.log(this.getAdmins.name, error);
        }
    }

    /**
     * Retrieve an account by its email.
     * @param {Object} params
     * @param {string} params.account_email - The account email.
     * @returns {Promise<Object|null>} The account instance if found, otherwise null.
     * @throws {Error} If retrieval fails.
     */
    static async getByEmail ({ account_email }) {
        try {
            const account = await models.Account.findOne({ 
                where: { account_email: account_email },
                // attributes: ['account_id', 'fst_name', 'lst_name', 'account_email', 'updated_at']
            });
            return account;
        } catch (error) {
            throw this.#logger.log(this.getByEmail.name, error);
        }
    }

    /**
     * Search accounts by name (partial match).
     * @param {Object} params
     * @param {string} params.keyword - The keyword to search for in account names.
     * @param {string} params.offset
     * @param {string} params.limit
     * @returns {Promise<Object[]>} An array of accounts that match the keyword.
     * @throws {Error} If search fails.
     */
    static async searchByName ({ keyword, limit = 0, offset = 20, role }) {
        try {
            const where = {
                [Op.or]: {
                    fst_name: {
                    [Op.like]: `%${keyword}%`
                    },
                    lst_name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
            };

            if(role) where.account_role = role;

            const accounts = await models.Account.findAll({
                where,
                attributes: ['account_id', 'fst_name', 'lst_name', 'account_email', 'updated_at'],
                raw: true,
            });
            return accounts;
        } catch (error) {
            throw this.#logger.log(this.searchByName.name, error);
        }
    }


    static async isEmailExists ({ email }) {
        try {
            const checkForEmail = models.Account.count({ where: { account_email: email } });
            return checkForEmail > 0;
        } catch (error) {
            throw this.#logger.log(this.isEmailExists.name, error);
        }
    }
}

module.exports = AccountService;