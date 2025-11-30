// main.js
require('module-alias/register');
require('dotenv').config();

const { createServer, shutdownServer } = require('@root/src/server');
const { createContainer } = require('@utils/startResultRenderer.util');
const { initDatabase } = require('@root/src/utils/initDatabase.util');
const ConsoleRenderer = require('@root/ConsoleRenderer');
const DBConfig = require('@config/database.config');

let server = null;

async function main() {
    createContainer('start_server');

    try {
        // 1. Initialize Database
        await initDatabase({
            models: DBConfig.models,
            sequelize: DBConfig.sequelize,
            syncOptions: { alter: false, force: false },
            ...ConsoleRenderer.initDB // render init db results in console
        });

        // 2. Start Server
        server = await createServer();

        // 3. Register Graceful Shutdown Signals
        registerProcessSignals();

    } catch (error) {
        console.error('Fatal error in main:', error);
        process.exit(1);
    }
}

/**
 * Graceful shutdown for SIGINT / SIGTERM
 */
function registerProcessSignals() {
    const sequelize = DBConfig.sequelize;

    const gracefulExit = async (signal) => {
        console.log(signal);
        try {
            if (server) {
                await shutdownServer(server);
            }

            if (sequelize) {
                await sequelize.close();
            }

        } catch (error) {
            console.error('Graceful shutdown error:', error);
        } finally {
            process.exit(0);
        }
    };

    process.on('SIGINT', () => gracefulExit('SIGINT'));
    process.on('SIGTERM', () => gracefulExit('SIGTERM'));
}

// Run main only if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = { main };