const { updateElement, renderContainer } = require('@utils/startResultRenderer.util');

const initDB = {
    onTestConnection: () => { 
        updateElement('start_server', { key: 'test_conn', value: '\u23F3 Test Database Connection' });
        renderContainer('start_server');
    },
    onTestConnectionSuccess: () => {
        updateElement('start_server', { key: 'test_conn', value: '\u2713 Test Database Connection' });
        renderContainer('start_server');
    },
    onSync: () => {
        updateElement('start_server', { key: 'sync_db', value: '\u23F3 Sync Database' });
        renderContainer('start_server');
    },
    onSyncSuccess: () => {
        updateElement('start_server', { key: 'sync_db', value: '\u2713 Sync Database' });
        renderContainer('start_server');
    },
    onInitSeedData: () => {
        updateElement('start_server', { key: 'init_seed', value: '\u23F3 Init Seed Data' });
        renderContainer('start_server');
    },
    onInitSeedDataSuccess: () => {
        updateElement('start_server', { key: 'init_seed', value: '\u2713 Init Seed Data' });
        renderContainer('start_server');
    },
    onDatabaseReady: () => {
        updateElement('start_server', { key: 'database_state', value: '\u2713 Database is Ready' });
        renderContainer('start_server');
    }
}

const startServerSuccess = (HOST, PORT) => {
    updateElement('start_server', { key: 'server', value: '\u2713 Start Server' });
    updateElement('start_server', { 
        key: 'server_run', 
        value: `\u2022 Server is Running on: ${HOST}:${PORT}` 
    });
    renderContainer('start_server');
}

const startServerError = (error) => {
    updateElement('start_server', { 
        key: 'server_run', 
        value: `\u2717 Start Server Failed: \n${error}` 
    });
    renderContainer('start_server');
}

const startServer = () => {
    updateElement('start_server', { key: 'server', value: '\u23F3 Start Server' });
    renderContainer('start_server');
}


const ConsoleRenderer = {
    initDB,
    startServer,
    startServerSuccess,
    startServerError
}


module.exports = ConsoleRenderer;