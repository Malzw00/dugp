const ShutdownProcess = require('@root/src/utils/shotdownProc.util');

function registerSignalHandlers(server) {

    const shutdown = async () => {
        await ShutdownProcess(server);
    };

    ['SIGTERM', 'SIGINT'].forEach(signal =>
        process.on(signal, () => shutdown(signal))
    );
}

module.exports = { registerSignalHandlers };