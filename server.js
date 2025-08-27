require('module-alias/register');
require('dotenv').config();
const ShutdownProcess = require('@root/src/utils/shotdownProc.util');
const expressApp = require('@root/src/app');
// مجرد إستدعاء هذا الملف ينشيء إتصال مع قاعدة البيانات عن طريق Sequelize ORM
const { initDatabase } = require('@root/src/config/database.config');
const { createContainer, updateElement, renderContainer } = require('@root/src/utils/startResultRenderer.util');



const PORT = parseInt(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';



async function startServer() {
    
    // Render Start Result.
    createContainer('start_server');
    
    try {
        await initDatabase({
            syncOptions: { alter: false, force: true, },
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
        });

        // Start Express server
        updateElement('start_server', { key: 'server', value: '\u23F3 Start Server' });
        renderContainer('start_server');

        const server = expressApp.listen(PORT, HOST, () => {
            updateElement('start_server', { key: 'server', value: '\u2713 Start Server' });
            updateElement('start_server', { 
                key: 'server_run', 
                value: `\u2022 Server is Running on: ${HOST}:${PORT}` 
            });
            renderContainer('start_server');
        });

        // Handle shutdown signals
        process.on('SIGTERM', () => ShutdownProcess(server));
        process.on('SIGINT', () => ShutdownProcess(server));

    } catch (error) {
        updateElement('start_server', { 
            key: 'server_run', 
            value: `\u2717 Start Server Failed: ${error}` 
        });
        renderContainer('start_server');
        process.exit(1);
    }
}

startServer();
