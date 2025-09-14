const { models } = require("@root/src/config/database.config");
const LogServiceError = require("@root/src/utils/serviceErrorLogger.util");

/**
 * Service for managing permission scopes that define the specific context or boundaries
 * where a permission applies. Allows fine-grained control over permission applicability
 * within different organizational units (e.g., colleges).
 */
class PermissionScope {

    static #logger = new LogServiceError({ module: 'PermissionScope' });

    /**
     * Creates a new permission scope that restricts a permission to a specific college context.
     * Establishes the boundary where a permission assignment is applicable.
     * 
     * @param {Object} params - Scope creation parameters
     * @param {string|number} params.account_permission_id - The ID of the account-permission assignment to scope
     * @param {string|number} params.collage_id - The ID of the college where the permission applies
     * @returns {Promise<Object>} The created PermissionScope record
     * @throws {Error} If database operation fails or validation errors occur
     */
    static async create ({ account_permission_id, collage_id }) {
        try {
            const created = await models.PermissionScope.create({
                account_permission_id,
                collage_id,
            });

            return created;

        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }

    /**
     * Deletes a specific permission scope by its ID.
     * Removes scope restrictions from a permission assignment, potentially making it applicable globally.
     * 
     * @param {Object} params - Scope deletion parameters
     * @param {string|number} params.permission_scope_id - The unique identifier of the permission scope to delete
     * @returns {Promise<number>} Number of deleted rows (1 if successful, 0 if not found)
     * @throws {Error} If database operation fails
     */
    static async deleteByID ({ permission_scope_id }) {
        try {
            const deletedRows = await models.PermissionScope.destroy({ where: { permission_scope_id } });
            return deletedRows;

        } catch (error) {
            throw this.#logger.log(this.deleteByID.name, error);
        }
    }

    /**
     * Retrieves all scopes associated with a specific account-permission assignment.
     * Gets the complete list of organizational contexts where a permission applies.
     * 
     * @param {Object} params - Scope query parameters
     * @param {string|number} params.account_permission_id - The account-permission assignment ID to retrieve scopes for
     * @returns {Promise<Array>} Array of scope records defining where the permission is applicable
     * @throws {Error} If database operation fails
     */
    static async getScopes ({ account_permission_id }) {
        try {
            const scopes = await models.PermissionScope.findAll({ where: { account_permission_id } });
            return scopes;
            
        } catch (error) {
            throw this.#logger.log(this.getScopes.name, error);
        }
    }

    /**
     * Checks if a specific account-permission assignment has scope access to a particular college.
     * Verifies whether a permission is applicable within the specified college context.
     * 
     * @param {Object} params - Scope check parameters
     * @param {string|number} params.account_permission_id - The account-permission assignment ID to check
     * @param {string|number} params.collage_id - The college ID to verify scope access for
     * @returns {Promise<boolean>} True if the permission has scope access to the college, false otherwise
     * @throws {Error} If database operation fails
     */
    static async hasScope ({ account_permission_id, collage_id }) {
        try {
            const count = await models.PermissionScope.findOne({
                where: { account_permission_id, collage_id, }
            });

            return count > 1;

        } catch (error) {
            throw this.#logger.log(this.hasScope.name, error);
        }
    }
}

module.exports = PermissionScope;