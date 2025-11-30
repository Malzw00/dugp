// server.js
require('module-alias/register');
require('dotenv').config();

const ConsoleRenderer = require('@root/ConsoleRenderer');
const expressApp = require('@root/src/app');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Starts the Express server
 * @returns {Promise<import('http').Server>}
 */
function createServer() {
    return new Promise((resolve, reject) => {
        ConsoleRenderer.startServer();

        const server = expressApp.listen(PORT, HOST, () => {
            ConsoleRenderer.startServerSuccess(HOST, PORT);
            resolve(server);
        });

        server.on("error", (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Make sure no other instance is running.`);
            } else {
                console.error('Server error:', err);
            }
            reject(err);
        });
    });
}

/**
 * Gracefully shutdown the server
 * @param {import('http').Server} server
 * @returns {Promise<void>}
 */
async function shutdownServer(server) {
    return new Promise((resolve, reject) => {
        if (!server) return resolve();

        server.close((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = { createServer, shutdownServer };
