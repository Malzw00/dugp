const bcrypt = require('bcrypt');

/**
 * Hash a plain text using bcrypt.
 * 
 * @async
 * @function
 * @param {string} plainText - The plain text to hash.
 * @param {number} [saltRounds] - The hash salt rounds number.
 * @returns {Promise<string>} A promise that resolves to the hashed text.
 * @throws {Error} Throws if hashing fails.
 * 
 * @example
 * const hashed = await hash('myPassword123');
 * console.log(hashed); // $2b$10$...
 */
async function hash(plainText, saltRounds=10) {
    
    const hashedText = await bcrypt.hash(plainText, saltRounds);
    return hashedText;
}

/**
 * Compare a plain text with a hashed text.
 * 
 * @async
 * @function
 * @param {string} plainText - The plain text to check.
 * @param {string} hashedText - The hashed text to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the texts match, false otherwise.
 * @throws {Error} Throws if comparison fails.
 * 
 * @example
 * const isMatch = await compare('myPassword123', '@lkdnsng$09834kjadmnoij...');
 * console.log(isMatch); // true or false
 */
async function compare(plainText, hashedText) {

    const match = await bcrypt.compare(plainText, hashedText);
    return match; // Boolean value
}

module.exports = { hash, compare };
