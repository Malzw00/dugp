require('module-alias/register');
require('dotenv').config();
const ShutdownProcess = require('@root/src/utils/ShutdownProc');
const expressApp = require('@root/src/app');
// مجرد إستدعاء هذا الملف ينشيء إتصال مع قاعدة البيانات عن طريق Sequelize ORM
const { testConnection, syncDatabase } = require('@config/database');



const PORT = parseInt(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
    try {
        // Test database connection
        console.log('Test Database Connection ...')
        const connected = await testConnection();
        if (!connected) throw new Error('Database connection failed');
        
        // Sync models (create/update tables)
        console.log('Sync Database ...')
        await syncDatabase();
        
        // Start Express server
        console.log('Start Server ...')
        const server = expressApp.listen(PORT, HOST, () => {
            console.log(`Server is running on http://${HOST}:${PORT}`);
        });

        // Handle shutdown signals
        process.on('SIGTERM', () => ShutdownProcess(server));
        process.on('SIGINT', () => ShutdownProcess(server));

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();
