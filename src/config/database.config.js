const { Sequelize } = require('sequelize');
const initModels = require('@models/index');

/**
 * Sequelize instance configuration.
 * 
 * This configuration defines how the application connects to the database.
 * It uses environment variables if available, otherwise defaults are applied.
 * Sequelize will automatically use `mysql2` as the database driver if installed.
 * 
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
    process.env.DB_NAME || 'dugp_db',   // Database name 
    process.env.DB_USER || 'root',      // Database username 
    process.env.DB_PASS || '0000',      // Database password 
    { 
        host: process.env.DB_HOST || '127.0.0.1',   // Database host 
        
        // Database type (MySQL) 
        dialect: 'mysql',
        pool: { 
            max: 10,        // Maximum number of connections allowed in the pool 
            min: 1,         // Minimum number of connections maintained in the pool 
            acquire: 30000, // Maximum time (in ms) to try getting a connection before throwing an error 
            idle: 10000,    // Maximum time (in ms) a connection can remain idle before being released 
        }, 
        logging: false,     // Disable SQL logging in the console 
    }
);

/**
 * Initialize and map all Sequelize models with the current Sequelize instance.
 * 
 * The `initModels` function imports and registers all database models.
 * It ensures models are connected to the same Sequelize instance.
 * 
 * An object containing all models keyed by their names.
 */
const models = initModels(sequelize);

module.exports = { sequelize, models };