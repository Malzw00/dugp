const { initializeSeedData } = require('@seeders/index');

/**
 * Initialize the database:
 * - Tests database connection.
 * - Synchronizes models (create/update tables).
 * - Runs seeders to populate initial data.
 *
 * This function accepts optional lifecycle callbacks that are triggered
 * before and after each step, allowing you to hook into the initialization process.
 *
 * @async
 * @function initDatabase
 * 
 * @param {Object} options - Initialization options.
 * @param {import('sequelize').Sequelize} options.sequelize - Sequelize instance to connect and sync.
 * @param {Function} [options.onTestConnection] - Called before testing the database connection.
 * @param {Function} [options.onTestConnectionSuccess] - Called after successful database connection.
 * @param {Function} [options.onSync] - Called before syncing database models.
 * @param {Function} [options.onSyncSuccess] - Called after models are successfully synced.
 * @param {Function} [options.onInitSeedData] - Called before initializing seed data.
 * @param {Function} [options.onInitSeedDataSuccess] - Called after seed data is initialized.
 * @param {Function} [options.onDatabaseReady] - Called after all steps are completed successfully.
 * @param {Object} [options.syncOptions={ alter: false, force: false }] - Options passed to `sequelize.sync`.
 * @param {boolean} [options.syncOptions.alter=false] - If true, alters existing tables to match models.
 * @param {boolean} [options.syncOptions.force=false] - If true, drops and recreates tables.
 * 
 * @throws {Error} If any step of the initialization process fails.
 * 
 * @example
 * const { initDatabase } = require('./database.init');
 * const { sequelize } = require('./database.config');
 * 
 * initDatabase({
 *   sequelize,
 *   onTestConnection: () => console.log('Testing DB connection...'),
 *   onTestConnectionSuccess: () => console.log('DB connected!'),
 *   onSync: () => console.log('Syncing models...'),
 *   onSyncSuccess: () => console.log('Models synced!'),
 *   onInitSeedData: () => console.log('Initializing seed data...'),
 *   onInitSeedDataSuccess: () => console.log('Seed data ready!'),
 *   onDatabaseReady: () => console.log('Database is ready to use!'),
 *   syncOptions: { alter: true },
 * });
 */
async function initDatabase({ 
    models,
    sequelize,
    onTestConnection, 
    onSync,
    onInitSeedData, 
    onTestConnectionSuccess, 
    onSyncSuccess, 
    onInitSeedDataSuccess,
    onDatabaseReady,
    syncOptions = { alter: false, force: false, logging: false },
}) {
    try {
        // Test database connection
        onTestConnection?.();
        await sequelize.authenticate();
        onTestConnectionSuccess?.();

        // Sync models
        onSync?.();
        await sequelize.sync(syncOptions);
        onSyncSuccess?.();

        // Initialize seed data
        onInitSeedData?.();
        await initializeSeedData(models);
        onInitSeedDataSuccess?.();

        // Database ready
        onDatabaseReady?.();
    } catch (error) {
        throw new Error("initialize database: " + error);
    }
}

module.exports = { initDatabase };
