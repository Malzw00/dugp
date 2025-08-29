const bcrypt = require('bcrypt');

/**
 * Hash a plain text password using bcrypt.
 * 
 * @async
 * @function
 * @param {string} plainPassword - The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 * @throws {Error} Throws if hashing fails.
 * 
 * @example
 * const hashed = await hashPassword('myPassword123');
 * console.log(hashed); // $2b$10$...
 */
async function hashPassword(plainPassword) {
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

/**
 * Compare a plain text password with a hashed password.
 * 
 * @async
 * @function
 * @param {string} plainPassword - The plain text password to check.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 * @throws {Error} Throws if comparison fails.
 * 
 * @example
 * const isMatch = await comparePassword('myPassword123', hashedPassword);
 * console.log(isMatch); // true or false
 */
async function comparePassword(plainPassword, hashedPassword) {

    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match; // Boolean value
}

module.exports = { hashPassword, comparePassword };
