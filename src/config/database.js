const { Sequelize } = require('sequelize');
const initModels = require('@models/index');


// Initialize Sequelize database connection
// Sequelize will automatically use 'mysql2' (if installed)
// to establish the connection with the database 
const sequelize = new Sequelize(
    process.env.DB_NAME || 'dugp_db', // Database name
    process.env.DB_USER || 'root',    // Database username
    process.env.DB_PASS || '0000',    // Database password
    {
        host: process.env.DB_HOST || '127.0.0.1', // Database host
        dialect: 'mysql', // Database type (MySQL)
        pool: {
            max: 10,        // Maximum number of connections allowed in the pool
            min: 1,         // Minimum number of connections maintained in the pool
            acquire: 30000, // Maximum time (in ms) to try getting a connection before throwing an error
            idle: 10000,    // Maximum time (in ms) a connection can remain idle before being released
        },
        logging: false, // Disable SQL logging in the console
    }
);

// init database models
const models = initModels(sequelize);

// Test Connection
async function testConnection() {
    
    try {
        await sequelize.authenticate();
        return true;
    
    } catch (error) {
        return false;
    }
}

// Sync models: create tables automatically
async function syncDatabase() {
    try {
        await sequelize.sync({ force: false, alter: true });
        return true;
    } catch (error) {
        return false;
    }
}


module.exports = {
    sequelize, 
    models,
    testConnection,
    syncDatabase,
};
