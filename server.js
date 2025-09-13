require('module-alias/register');
require('dotenv').config();
const ShutdownProcess = require('@root/src/utils/shotdownProc.util');
const expressApp = require('@root/src/app');
const { initDatabase, sequelize } = require('@root/src/config/database.config');
const { createContainer } = require('@utils/startResultRenderer.util');
const ConsoleRenderer = require('@root/ConsoleRenderer');



const PORT = parseInt(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
    createContainer('start_server');

    try {
        await initDatabase({ 
            syncOptions: { alter: false, force: true, },
            ...ConsoleRenderer.initDB
        });

        ConsoleRenderer.startServer();

        const server = expressApp.listen(PORT, HOST, () => {
            ConsoleRenderer.startServerSuccess(HOST, PORT);
        });

        // Handle shutdown signals
        process.on('SIGTERM', () => ShutdownProcess(server));
        process.on('SIGINT', () => ShutdownProcess(server));

    } catch (error) {
        ConsoleRenderer.startServerError(error)
        process.exit(1);
    }
}

startServer();
