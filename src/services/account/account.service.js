const { models } = require("@root/src/config/database.config");
const LogServiceError = require("@utils/logServiceError.util");
const { Op } = require("sequelize");

/**
 * @class AccountService
 * @classdesc Service layer for managing Accounts in the database.  
 * Provides methods to search, retrieve, update, and delete accounts using Sequelize ORM.
 */
class AccountService {

    static logger = new LogServiceError({ module: 'Account' });

    /**
     * Delete an account by ID.
     * @param {Object} params
     * @param {number} params.account_id - The unique identifier of the account to delete.
     * @returns {Promise<number>} The number of deleted rows (0 if no account was deleted).
     * @throws {AppError} If deletion fails.
     */
    static async delete({ account_id }) {
        try {
            const deletedRows = await models.Account.destroy({
                where: { account_id: account_id }
            });
            return deletedRows;
        } catch (error) {
            throw this.logger.log(this.delete.name, error);            
        }
    }

    /**
     * Update account details (name, email, or profile image).
     * @param {Object} params
     * @param {string} [params.account_name] - New account name (optional).
     * @param {string} [params.account_email] - New account email (optional).
     * @param {number} [params.profile_image_id] - New profile image ID (optional).
     * @param {number} params.account_id - The unique identifier of the account to update.
     * @returns {Promise<number>} The number of affected rows (0 if no account was updated).
     * @throws {AppError} If update fails.
     */
    static async update({ account_name, account_email, profile_image_id, account_id }) {
        try {
            const values = {};
            if(account_name) values.account_name = account_name;
            if(account_email) values.account_email = account_email;
            if(profile_image_id) values.profile_image_id = profile_image_id;

            const [affectedRows] = await models.Account.update(values, { where: { account_id: account_id } });

            return affectedRows;
        } catch (error) {
            throw this.logger.log(this.update.name, error);
        }
    }

    /**
     * Retrieve an account by its ID.
     * @param {Object} params
     * @param {number} params.account_id - The unique identifier of the account.
     * @returns {Promise<Object|null>} The account instance if found, otherwise null.
     * @throws {AppError} If retrieval fails.
     */
    static async getByID({ account_id }) {
        try {
            const account = await models.Account.findByPk(account_id);
            return account;
        } catch (error) {
            throw this.logger.log(this.getByID.name, error);
        }
    }

    /**
     * Retrieve an account by its email.
     * @param {Object} params
     * @param {string} params.account_email - The account email.
     * @returns {Promise<Object|null>} The account instance if found, otherwise null.
     * @throws {AppError} If retrieval fails.
     */
    static async getByEmail ({ account_email }) {
        try {
            const account = await models.Account.findOne({ where: { account_email: account_email } });
            return account;
        } catch (error) {
            throw this.logger.log(this.getByEmail.name, error);
        }
    }

    /**
     * Search accounts by name (partial match).
     * @param {Object} params
     * @param {string} params.keyword - The keyword to search for in account names.
     * @returns {Promise<Object[]>} An array of accounts that match the keyword.
     * @throws {AppError} If search fails.
     */
    static async searchByName ({ keyword }) {
        try {
            const accounts = await models.Account.findAll({
                where: {
                    account_name: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            });
            return accounts;
        } catch (error) {
            throw this.logger.log(this.searchByName.name, error);
        }
    }
}

module.exports = AccountService;