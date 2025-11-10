const AccountService = require("@services/account/account.service");
const AccountPermissionService = require("@services/account/accountPermission.service");

const adminController = {

    /**
     * @async
     * @function getAdmins
     * @description Retrieves a paginated list of administrator accounts from the system.
     * @route GET /api/admins
     * @access Protected (Admin only)
     * 
     * @param {import("express").Request} req - Express request object containing pagination parameters in `query`.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON response containing the list of admin accounts.
     * 
     * @example
     * // Example Request:
     * GET /api/admins?limit=10&offset=0
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": [
     *     { "account_id": 1, "account_name": "Admin One", "account_role": "admin" },
     *     { "account_id": 2, "account_name": "Admin Two", "account_role": "admin" }
     *   ]
     * }
     */
    async getAdmins(req, res) {
        try {
            const { offset, limit } = req.query;
            const offsetNum = parseInt(offset);
            const limitNum = parseInt(limit);

            const admins = await AccountService.getAdmins({
                offset: offsetNum,
                limit:  limitNum,
            });

            res.status(200).json({
                success: true,
                result: admins,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve admin accounts.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function updateRole
     * @description Updates the role of a specific account (e.g., user → admin or vice versa).
     * @route PUT /api/admins/:accountId/role
     * @access Protected (Admin only)
     * 
     * @param {import("express").Request} req - Express request containing `accountId` in params and new `role` in body.
     * @param {import("express").Response} res - Express response object for sending JSON response.
     * 
     * @returns {Promise<void>} Sends a JSON response indicating success or failure of the update operation.
     * 
     * @example
     * // Example Request:
     * PUT /api/admins/12/role
     * {
     *   "role": "admin"
     * }
     * 
     * // Example Response:
     * {
     *   "success": true
     * }
     */
    async updateRole(req, res) {
        try {
            const { accountId } = req.params;
            const { role } = req.body;

            const accountIdNum = parseInt(accountId);
            if (isNaN(accountIdNum) || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid accountId or role.",
                });
            }

            await AccountService.update({
                account_id: accountIdNum,
                account_role: role,
            });

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update account role.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function getAccountPermissions
     * @description Retrieves all permissions assigned to a specific account.
     * @route GET /api/admins/:accountId/permissions
     * @access Protected (Admin only)
     * 
     * @param {import("express").Request} req - Express request object containing `accountId` in params.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a JSON array of permissions for the specified account.
     * 
     * @example
     * // Example Request:
     * GET /api/admins/5/permissions
     * 
     * // Example Response:
     * {
     *   "success": true,
     *   "result": [
     *     { "permission_id": 1, "name": "DELETE_PROJECTS" },
     *     { "permission_id": 2, "name": "MANAGE_USERS" }
     *   ]
     * }
     */
    async getAccountPermissions(req, res) {
        try {
            const { accountId } = req.params;
            const accountIdNum = parseInt(accountId);

            if (isNaN(accountIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid accountId parameter.",
                });
            }

            const permissions = await AccountPermissionService.getAccountPermissions({
                account_id: accountIdNum,
            });

            res.status(200).json({
                success: true,
                result: permissions,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve account permissions.",
                error: error.message,
            });
        }
    },


    /**
     * @function grantPermission
     * @description Grant a specific permission to a given account.
     * @route POST /admins/accounts/:accountId/permissions
     * @access Manager or admin with appropriate permission (AHP)
     * 
     * @param {import("express").Request} req - Express request object containing `accountId` and `permissionId` in params.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * @param {Object} req.params - Route parameters
     * @param {string|number} req.params.accountId - The target account ID to which the permission will be granted.
     * @param {Object} req.body - Request body
     * @param {string|number} req.body.permissionId - The permission ID to be granted.
     * 
     * @returns {Object} 200 - JSON response with success status.
     * @throws 500 - Internal server error.
     */
    async grantPermission(req, res) {
        try {
            const { accountId } = req.params;
            const { permissionId } = req.body;
            
            const accountIdNum = parseInt(accountId);
            const permissionIdNum = parseInt(permissionId);
            
            await AccountPermissionService.create({
                account_id: accountIdNum,
                permission_id: permissionIdNum,
            });
            
            res.status(200).json({
                success: true,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to grant permission.",
                error: error.message,
            });
        }
    },


    /**
     * @async
     * @function removePermission
     * @description Revokes a specific permission from a user account.
     * @route DELETE /api/admins/:accountId/permissions/:permissionId
     * @access Protected (Admin only)
     * 
     * @param {import("express").Request} req - Express request object containing `accountId` and `permissionId` in params.
     * @param {import("express").Response} res - Express response object used to send JSON responses.
     * 
     * @returns {Promise<void>} Sends a success JSON response after removing the permission.
     * 
     * @example
     * // Example Request:
     * DELETE /api/admins/3/permissions/10
     * 
     * // Example Response:
     * {
     *   "success": true
     * }
     */
    async removePermission(req, res) {
        try {
            const { accountId, permissionId } = req.params;
            const accountIdNum = parseInt(accountId);
            const permissionIdNum = parseInt(permissionId);

            if (isNaN(accountIdNum) || isNaN(permissionIdNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid accountId or permissionId.",
                });
            }

            await AccountPermissionService.delete({
                account_id: accountIdNum,
                permission_id: permissionIdNum,
            });

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove permission.",
                error: error.message,
            });
        }
    },
};

module.exports = adminController;
