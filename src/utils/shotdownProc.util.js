async function ShutdownProcess(server) {

    let error;
    console.log('\u23F3 Shutting down');

    closeServer(server).then(
        _ => {
            console.log('\u2713 Server closed successfully.');

            // here you can close database or anything else
            // await closeDatabaseConnection();
            // await someCleanupFunction();

        },
        err => {
            error = err;
            console.error('\u2716 Error during server shutdown:', err);
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