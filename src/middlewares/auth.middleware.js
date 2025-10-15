// middleware/authenticate.middleware.js
const { verifyAccessToken } = require("@utils/authToken.util");

/**
 * @middleware authenticate
 * @description Middleware to verify JWT access tokens and attach decoded user data to the request.
 * 
 * @usage
 *  app.use('/protected-route', authenticate, yourController)
 */
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];

        // Check for Bearer Token format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token is missing or malformed",
            });
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        // Verify Token
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }

        // Attach decoded user info to request object
        req.user = decoded;

        return next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            accessTokenExpired: error.name === 'TokenExpiredError' || error.code === 'TOKEN_EXPIRED',
            message: "Unauthorized: invalid or expired token",
        });
    }
}

module.exports = authenticate;