const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;



/**
 * @module TokenUtil
 * @description Provides utility functions for generating and verifying JWT tokens.
 */

/**
 * Generate a JSON Web Token (JWT) for a given payload.
 * 
 * @param {Object} payload - The data to encode in the token (e.g., user ID, role).
 * @param {string|number} [expiresIn='1h'] - Token expiration time (e.g., '1h', '30m', '7d').
 * @returns {string} The signed JWT token.
 * @throws {Error} If the token cannot be generated (e.g., invalid payload or secret key missing).
 * 
 * @example
 * const token = generateToken({ userId: 123, role: 'admin' }, '2h');
 * console.log(token); // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
function generateToken(payload, expiresIn = '1h') {

    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

/**
 * Verify a JSON Web Token (JWT) and decode its payload.
 * 
 * @param {string} token - The JWT token to verify.
 * @returns {Object} The decoded payload if the token is valid.
 * @throws {Object} Throws an object with the following structure if verification fails:
 *   @property {string} code - Error code: 'TOKEN_EXPIRED', 'INVALID_SIGN', or 'UNKNOWN_ERROR'.
 *   @property {Error} error - The original Error object from jsonwebtoken.
 * 
 * @example
 * try {
 *     const payload = verifyToken(token);
 *     console.log(payload.userId); // 123
 * } catch (err) {
 *     if (err.code === 'TOKEN_EXPIRED') console.log('Token has expired');
 *     else if (err.code === 'INVALID_SIGN') console.log('Invalid token signature');
 *     else console.log('Unknown JWT error');
 * }
 */
function verifyToken(token) {

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;

    } catch (error) {
        if (error) {
            if (error.name === "TokenExpiredError")
                throw { code: 'TOKEN_EXPIRED', error }
            
            else if (error.name === 'JsonWebTokenError' && error.message === 'invalid signature')
                throw { code: 'INVALID_SIGN', error }
            
            else
                throw { code: 'UNKNOWN_ERROR', error}
        }
    }
    
}

module.exports = { generateToken, verifyToken };
