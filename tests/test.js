require('module-alias/register')
const bcr = require('bcrypt');

bcr.hash('0000', 10).then(res => console.log(res))