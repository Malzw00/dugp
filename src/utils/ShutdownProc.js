async function ShutdownProcess(server) {

    let error;
    console.log('shutting down...');

    closeServer(server).then(
        _ => {
            console.log('Server closed successfully.');

            // here you can close database or anything else
            // await closeDatabaseConnection();
            // await someCleanupFunction();

        },
        err => {
            error = err;
            console.error('Error during server shutdown:', err);
        }

    ).finally(() => process.exit(0));
}

function closeServer(server) {

    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}


module.exports = ShutdownProcess;