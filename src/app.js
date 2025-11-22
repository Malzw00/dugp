// app.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const history = require('connect-history-api-fallback');
const GeneralRateLimiter = require('@middlewares/generalRateLimiter.middleware');
const cors = require('cors');
const corsOptions = require('@config/corsOptions.config');
const cookieParser = require('cookie-parser');
const apiRoute = require('@routes/api/index');

const app = express();

// Security, rate limits, etc.
app.use(GeneralRateLimiter());

app.use(cors(corsOptions));

app.use(helmet({ contentSecurityPolicy: false }));

app.use(compression());

app.use(cookieParser());

app.use(express.json());

// Serve SPA build
app.use(express.static(path.resolve('build')));

// SPA Router
app.use(history());

// Serve uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// API
app.use('/api', apiRoute);

// Global Error Handler (last always)
app.use(require('@middlewares/errorHandler.middleware'));

module.exports = app;