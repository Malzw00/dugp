const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const history = require('connect-history-api-fallback');
const GeneralRateLimiter = require('@middlewares/generalRateLimiter.middleware');
const cors = require('cors');
const corsOptions = require('@config/corsOptions.config');
const expressApp = express();
const cookieParser = require('cookie-parser');
const apiRoute = require('@routes/api/index');


// Middlewares:
expressApp.use(GeneralRateLimiter());
expressApp.use(cors(corsOptions));
expressApp.use(
    helmet({
        // حصلت مشكلة عند محاولة فتح الموقع من خلال جهاز آخر على نفس الشبكة المحلية 
        // وهي أن المتصفح يحمل ملف الإتش تي ام إل بنجاح لاكن لا يمكنه الوصول إلى ملفات سي اس اس
        // او ملفات جافا سكريب، لحل هذه المشكلة توجب تعطيل هذه الخاصية
        contentSecurityPolicy: false,
    })
);
expressApp.use(compression());
expressApp.use(cookieParser());
expressApp.use(express.json());
expressApp.use(express.static(path.resolve('build'))); // Serve Static Files
expressApp.use('uploads/', express.static(path.resolve('uploads'))); // Serve Static Files
expressApp.use(history());


expressApp.use('/', apiRoute);


// Error handler middleware 
expressApp.use(require('@root/src/middlewares/errorHandler.middleware'));

module.exports = expressApp;