// middleware/requirePermission.middleware.js
const AccountPermissionService = require("@services/account/accountPermission.service");
const AccountService = require("@services/account/account.service");

/**
 * @middleware requirePermission
 * @description Checks if the authenticated user has the required permission.
 * 
 * @usage
 *  router.post('/admin/action', authenticate, requirePermission('delete_user'), controller);
 */
function requirePermission(permission) {
    return async (req, res, next) => {
        try {
            // Ensure authentication ran before
            if (!req.user) 
            return res.status(401).json({
                success: false,
                message: "Authentication required before permission check",
            });

            const { accountID } = req.user;

            // Fetch account info (role)
            const account = await AccountService.getByID({ account_id: accountID });

            if (!account) 
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });

            // Managers bypass permission checks
            if (account.account_role === "manager") {
                return next();
            }

            // Check permission in database
            const hasPermission = await AccountPermissionService.hasPermission({
                permission: permission,
                account_id: accountID,
            });

            if (!hasPermission) 
            return res.status(403).json({
                success: false,
                message: `Permission '${permission}' is required`,
            });

            return next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error while checking permissions",
            });
        }
    };
}

module.exports = requirePermission;