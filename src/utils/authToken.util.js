const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid')

const AT_SK = process.env.ACCESS_TOKEN_SECRET;
const RT_SK = process.env.REFRESH_TOKEN_SECRET;
const RPT_SK = process.env.RESET_TOKEN_SECRET;
const AccessTokenExpIn  = 15 * 60; // 15 minute
const RefreshTokenExpIn = 30 * 24 * 60 * 60; // 30 day
const ResetTokenExpIn  = 15 * 60; // 15 minute



/**
 * @module TokenUtil
 * @description Provides utility functions for generating and verifying JWT tokens.
 */

/**
 * Generate a JSON Web Token (JWT) for a given payload.
 * 
 * @param {Object} payload - The data to encode in the token (e.g., user ID, role).
 * @param {number} [expiresIn] - Token expiration time (e.g., '1h', '30m', '7d').
 * @returns {{token:string, expiresAt:Date}} The signed JWT token.
 * @throws {Error} If the token cannot be generated (e.g., invalid payload or secret key missing).
 */
function generateAccessToken(payload, expiresIn = AccessTokenExpIn) {

    return { 
        token: jwt.sign(payload, AT_SK, { expiresIn }),
        expiresAt: new Date() + expiresIn * 1000, // in milies
    };
}


/**
 * Generate a JSON Web Token (JWT) for a given payload.
 * 
 * @param {Object} payload - The data to encode in the token (e.g., user ID, role).
 * @param {string|number} [expiresIn='15m'] - Token expiration time (e.g., '1h', '30m', '7d').
 * @returns {{token:string, expiresAt:Date}} The signed JWT token.
 * @throws {Error} If the token cannot be generated (e.g., invalid payload or secret key missing).
 */
function generateRefreshToken(payload, expiresIn = RefreshTokenExpIn) {

    return { 
        token: jwt.sign({ ...payload, tokenId: uuidv4() }, RT_SK, { expiresIn }),
        expiresAt: new Date() + expiresIn * 1000, // in milies
    };
}



/**
 * Generate a JSON Web Token (JWT) for a given payload.
 * 
 * @param {Object} payload - The data to encode in the token (e.g., user ID, role).
 * @param {number} [expiresIn] - Token expiration time (e.g., '1h', '30m', '7d').
 * @returns {{token:string, expiresAt:Date}} The signed JWT token.
 * @throws {Error} If the token cannot be generated (e.g., invalid payload or secret key missing).
 */
function generateResetToken(payload, expiresIn = ResetTokenExpIn) {

    return { 
        token: jwt.sign(payload, RPT_SK, { expiresIn }),
        expiresAt: new Date() + expiresIn * 1000, // in milies
    };
}



/**
 * Verify a JSON Web Token (JWT) and decode its payload.
 * 
 * @param {string} token - The JWT token to verify.
 * @returns {{ accountID: number, accountRole: string}} The decoded payload if the token is valid.
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
function verifyAccessToken(token) {

    try {
        return jwt.verify(token, AT_SK);

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



/**
 * Verify a JSON Web Token (JWT) and decode its payload.
 * 
 * @param {string} token - The JWT token to verify.
 * @returns {{ accountID: number }} The decoded payload if the token is valid.
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
function verifyResetPasswordToken(token) {

    try {
        return jwt.verify(token, RPT_SK);

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



/**
 * Verify a JSON Web Token (JWT) and decode its payload.
 * 
 * @param {string} token - The JWT token to verify.
 * @returns {{ accountID: number }} The decoded payload if the token is valid.
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
function verifyRefreshToken(token) {

    try {
        return jwt.verify(token, RT_SK);

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



/**
 * Creates the payload object for an **Access Token (AT)**.
 *
 * @param {Object} params - Parameters for the access token payload.
 * @param {number} params.accountID - The unique identifier of the account.
 * @param {string} params.accountRole - The role assigned to the account (e.g., "admin", "user").
 * @returns {{accountID: number|string, accountRole: string}} The access token payload containing account ID and role.
 */
function buildATPayload({ accountID, accountRole }) {
    return { accountID: parseInt(accountID), accountRole };
}

/**
 * Creates the payload object for a **Refresh Token (RT)**.
 *
 * @param {Object} params - Parameters for the refresh token payload.
 * @param {number} params.accountID - The unique identifier of the account.
 * @returns {{accountID: number}} The refresh token payload containing only the account ID.
 */
function buildRTPayload({ accountID }) {
    return { accountID: parseInt(accountID) };
}

/**
 * Creates the payload object for a **Reset Password Token (RPT)**.
 *
 * @param {Object} params - Parameters for the refresh token payload.
 * @param {number} params.accountID - The unique identifier of the account.
 * @returns {{accountID: number}} The refresh token payload containing only the account ID.
 */
function buildRPTPayload({ accountID }) {
    return { accountID: parseInt(accountID) };
}




module.exports = { 
    AccessTokenExpIn,
    RefreshTokenExpIn,
    generateRefreshToken,
    generateAccessToken, 
    generateResetToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyResetPasswordToken,
    buildATPayload,
    buildRTPayload,
    buildRPTPayload
};
