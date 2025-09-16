require('module-alias/register');
require('dotenv').config();
const ConsoleRenderer = require('@root/ConsoleRenderer');
const expressApp = require('@root/src/app');

const PORT = parseInt(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

async function createServer(onServerStart) {

    try {

        ConsoleRenderer.startServer();
        const server = expressApp.listen(PORT, HOST, (error) => {
            onServerStart?.(error);
            ConsoleRenderer.startServerSuccess(HOST, PORT);
        });

        return server;

    } catch (error) {
        throw new Error(error);
    }
}


module.exports = { createServer };