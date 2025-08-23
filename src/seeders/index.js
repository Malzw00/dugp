// seeders/index.js
const { seedManagerAccount } = require('@seeders/manager.seeder');
const { seedPermissions } = require('./permission.seeder');


/** @param {import('../types/models').Models} models */

async function initializeSeedData(models) {

    await seedManagerAccount(models);
    await seedPermissions(models);
}

module.exports = { initializeSeedData };
