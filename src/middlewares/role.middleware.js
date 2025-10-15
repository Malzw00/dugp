// middleware/requireRole.middleware.js
const AccountService = require("@services/account/account.service");

/**
 * @middleware requireRole
 * @description Restricts access to routes based on the user's role.
 * 
 * @usage
 *  router.post('/admin', authenticate, requireRole('manager'), controller);
 */
function requireRole(role) {
    return async (req, res, next) => {
        try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required before role verification",
            });
        }

        const { accountID } = req.user;
        const account = await AccountService.getByID({ account_id: accountID });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        const userRole = account.account_role;

        if (userRole !== role) {
            return res.status(403).json({
                success: false,
                message: `Access denied: '${role}' role required (current: '${userRole}')`,
            });
        }

        return next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error while checking role",
            });
        }
    };
}

module.exports = requireRole;