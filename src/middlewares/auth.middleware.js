// middleware/auth.middleware.js
const { verifyAccessToken } = require("@utils/authToken.util");

/**
 * @middleware authenticate
 * @description Middleware to verify JWT access token and attach decoded user data + refreshToken (from cookie) to the request.
 * 
 * @usage
 *  app.use('/protected-route', authenticate, yourController)
 */
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];

        // Check Bearer token format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token is missing or malformed",
            });
        }

        // Extract Access Token
        const token = authHeader.split(" ")[1];

        // Verify Token
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }

        // Attach decoded token data
        req.user = decoded;

        // Extract refresh token from cookies (if present)
        const refreshToken = req.cookies?.refresh_token || null;

        if (refreshToken) {
            req.user.refreshToken = refreshToken;
        }

        return next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            accessTokenExpired:
                error.name === "TokenExpiredError" ||
                error.code === "TOKEN_EXPIRED",
            message: "Unauthorized: invalid or expired token",
        });
    }
}

module.exports = authenticate;