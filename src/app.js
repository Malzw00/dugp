const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const history = require('connect-history-api-fallback');
const GeneralRateLimiter = require('@root/src/middlewares/GeneralRateLimiter');
const expressApp = express();



// Middlewares:
expressApp.use(
    helmet({
        // حصلت مشكلة عند محاولة فتح الموقع من خلال جهاز آخر على نفس الشبكة المحلية 
        // وهي أن المتصفح يحمل ملف الإتش تي ام إل بنجاح لاكن لا يمكنه الوصول إلى ملفات سي اس اس
        // او ملفات جافا سكريب، لحل هذه المشكلة توجب تعطيل هذه الخاصية
        contentSecurityPolicy: false,
    })
);
expressApp.use(GeneralRateLimiter());
expressApp.use(compression());
expressApp.use(express.json());
expressApp.use(express.static(path.resolve('build'))); // Serve Static Files
expressApp.use(history());





// Error handler middleware 
expressApp.use(require('@middlewares/ErrorHandler'));

module.exports = expressApp;