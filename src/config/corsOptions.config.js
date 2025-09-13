const fs = require('fs');
const path = require('path');

const allowedOriginsJson = fs.readFileSync(path.join(__dirname, 'allowedOrigins.config.json'));

const allowedOrigins = JSON.parse(allowedOriginsJson);



const developmentOriginFunc = (origin, callback) => {
    if(allowedOrigins.development.indexOf(origin) || !origin)
        callback(null, true);
    else 
        callback(new Error('NOT_ALLOWED_ORIGIN'));
}

const productionOriginFunc = (origin, callback) => {
    if(allowedOrigins.development.indexOf(origin))
        callback(null, true);
    else 
        callback(new Error('NOT_ALLOWED_ORIGIN'));
}



/** @type {import('cors').CorsOptions} */
const corsOptions = {

    origin: process.env.NODE_ENV === 'development'? developmentOriginFunc: productionOriginFunc,
    credentials: true,
    optionsSuccessStatus: 200
}



module.exports = corsOptions;