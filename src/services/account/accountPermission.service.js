const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");

/**
 * Service for managing account permissions and permission-based access control.
 * Provides CRUD operations for account-permission relationships and permission checking functionality.
 */
class AccountPermission {

    static logger = new ServiceErrorLogger({ module: 'AccountPermission' });

    /**
     * Creates a new permission assignment for a specific account.
     * Links an account with a permission to grant access rights.
     * 
     * @param {Object} params - Permission assignment parameters
     * @param {string|number} params.permission - The permission identifier to assign
     * @param {string|number} params.account_id - The account ID to assign the permission to
     * @returns {Promise<Object>} The created AccountPermission record
     * @throws {Error} If database operation fails or validation errors occur
     */
    static async create({ permission, account_id }) {
        try {
            const created = await models.AccountPermission.create({ 
                account_id: account_id, 
                permission_id: permission,
            });

            return created;

        } catch (error) {
            throw this.logger.log(this.create.name, error);
        }
    }

    /**
     * Deletes a specific permission assignment by its ID.
     * Removes the association between an account and a permission.
     * 
     * @param {Object} params - Deletion parameters
     * @param {string|number} params.account_permission_id - The unique identifier of the permission assignment
     * @returns {Promise<number>} Number of deleted rows (should be 1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async deleteByID({ account_permission_id }) {
        try {
            const deletedRows = await models.AccountPermission.destroy({
                where: { account_permission_id: account_permission_id }
            });

            return deletedRows;
            
        } catch (error) {
            throw this.logger.log(this.deleteByID.name, error);
        }
    }

    /**
     * Checks if a specific account has a particular permission.
     * Verifies permission-based access rights for authorization checks.
     * 
     * @param {Object} params - Permission check parameters
     * @param {string|number} params.permission - The permission identifier to check
     * @param {string|number} params.account_id - The account ID to check permissions for
     * @returns {Promise<boolean>} True if the account has the specified permission, false otherwise
     * @throws {Error} If database operation fails
     */
    static async hasPermission({ permission, account_id }) {
        try {
            const records_count = await models.AccountPermission.count({
                where: { permission_id: permission, account_id: account_id }
            });

            return records_count > 0;
            
        } catch (error) {
            throw this.logger.log(this.hasPermission.name, error);
        }
    }

    /**
     * Retrieves all permissions assigned to a specific account.
     * Gets the complete list of permissions granted to an account.
     * 
     * @param {Object} params - Account permissions query parameters
     * @param {string|number} params.account_id - The account ID to retrieve permissions for
     * @returns {Promise<Array>} Array of permission records assigned to the account
     * @throws {Error} If database operation fails
     */
    static async getAccountPermissions({ account_id }) {
        try {
            const permissions = await models.AccountPermission.findAll({
                where: { account_id: account_id }
            });

            return permissions;
            
        } catch (error) {
            throw this.logger.log(this.getAccountPermissions.name, error);
        }
    }

    /**
     * Retrieves all accounts that have been granted a specific permission.
     * Finds all accounts with a particular permission assignment.
     * 
     * @param {Object} params - Permission accounts query parameters
     * @param {string|number} params.permission - The permission identifier to search for
     * @returns {Promise<Array>} Array of account-permission records for the specified permission
     * @throws {Error} If database operation fails
     */
    static async getPermissionAccounts({ permission }) {
        try {
            const accounts = await models.AccountPermission.findAll({
                where: { permission_id: permission }
            });

            return accounts;
            
        } catch (error) {
            throw this.logger.log(this.getPermissionAccounts.name, error);   
        }
    }


    
    /**
     * Retrieves all permissions and their associated scopes for a specific account.
     * Fetches the complete set of permissions granted to an account along with the
     * organizational contexts (colleges) where each permission applies.
     * 
     * @param {Object} params - Query parameters
     * @param {string|number} params.account_id - The ID of the account to retrieve permissions for
     * @returns {Promise<Array>} Array of account permission records with nested scope and college information
     * @throws {Error} If database operation fails or account ID is invalid
     * 
     * Returned Data Contains:
     *  - account_permission_id: number
     *  - account_id:            number
     *  - permission_id:         number
     *  - Permission:            Objecy { permission_id: number, permission_name: string }
     *  - PermissionScopes:      Array<{ 
     *       permission_scope_id:    number, 
     *       account_permission_id:  number, 
     *       collage_id:             number
     *       Collage:                Object { collage_id: number, collage_name: string }
     *    }>
     * 
     * 
     * @example
     * // Example returned data structure:
     * [
     *   {
     *     account_permission_id: 1,
     *     account_id: 123,
     *     permission_id: 'view_projects',
     *     Permission: {
     *       permission_id: 'view_projects',
     *       permission_name: 'View Projects'
     *     },
     *     PermissionScopes: [
     *       {
     *         permission_scope_id: 1,
     *         account_permission_id: 1,
     *         collage_id: 5,
     *         Collage: {
     *           collage_id: 5,
     *           collage_name: 'College of Engineering'
     *         }
     *       },
     *       {
     *         permission_scope_id: 2,
     *         account_permission_id: 1,
     *         collage_id: 8,
     *         Collage: {
     *           collage_id: 8,
     *           collage_name: 'College of Science'
     *         }
     *       }
     *     ]
     *   },
     * ]
     */
    static async getAccountPermissionAndScopes({ account_id }) {
        try {
            const accountPermissionsWithScopes = await models.AccountPermission.findAll({
                where: { account_id: account_id },
                include: [
                    {
                        model: models.PermissionScope,
                        include: [
                            {
                                model: models.Collage,
                                attributes: ['collage_id', 'collage_name']
                            }
                        ]
                    }, 
                    {
                        model: models.Permission,
                        attributes: ['permission_id', 'permission_name']
                    }
                ]
            });
            
            return accountPermissionsWithScopes;

        } catch (error) {
            throw this.logger.log(this.getAccountPermissionAndScopes.name, error);
        }
    }
}

module.exports = AccountPermission;