require('module-alias/register');
require('dotenv').config();

const { createServer } = require('@root/src/server');
const { registerSignalHandlers } = require('@root/src/signalHandlers');
const { createContainer, } = require('@utils/startResultRenderer.util');
const { initializeDatabaseWithRetry } = require('./src/database.init');
const ConsoleRenderer = require('@root/ConsoleRenderer');
const { initDatabase } = require('./src/utils/initDatabase.util');
const DBConfig = require('@config/database.config');


async function main() {
    createContainer('start_server');

    try {
        
        // 1. Database
        await initDatabase({
            models: DBConfig.models,
            sequelize: DBConfig.sequelize,
            syncOptions: { alter: false, force: true },
            ...ConsoleRenderer.initDB
        });        
        
        // 2. Server
        const server = await createServer();

        // 3. Signal Handlers
        registerSignalHandlers(server);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();