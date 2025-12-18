// src/utils/database.init.js
const { initDatabase } = require('@utils/initDatabase.util');
const DatabaseConfig = require('@config/database.config');
const ConsoleRenderer = require('@root/ConsoleRenderer');

/**
 * Initialize and connect to the database with retry logic.
 * 
 * @param {number} retries - Number of retry attempts
 * @param {number} delayMs - Time between attempts (ms)
 */
async function initializeDatabaseWithRetry(retries = 5, delayMs = 3000) {

    for (let attempt = 1; attempt <= retries; attempt++) {

        try {
            await initDatabase({
                sequelize: DatabaseConfig.sequelize,
                syncOptions: { alter: true, force: false },
                ...ConsoleRenderer.initDB
            });

            // If successful, exit the loop.
            return;

        } catch (error) {

            if (attempt < retries) {
                await new Promise(res => setTimeout(res, delayMs));
            } else {
                throw new Error("Could not connect to the database after retries: " + error.message);
            }
        }
    }
}

module.exports = { initializeDatabaseWithRetry };
