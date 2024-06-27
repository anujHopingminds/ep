// imports modules & dependencies
const express = require('express');
const favicon = require('serve-favicon');
const crossOrigin = require('cors');
const cookieParser = require('cookie-parser');
const appRoot = require('app-root-path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const env = require('dotenv');
const morgan = require('morgan');
const db = require("../models");
// imports application middleware and routes
const morganLogger = require('../middleware/morgan.logger');
const defaultController = require('../controllers/default.controller');
const { notFoundRoute, errorHandler } = require('../middleware/error.handler');
const { limiter } = require('../middleware/access.limiter');
const corsOptions = require('../configs/cors.config');
const authRoute = require('../routes/auth.routes');
const inventoryRoute=require('../routes/inventory.routes')
const prescriptionRoute=require('../routes/prescription.routes');
const dashboardRoute = require('../routes/dashboard.routes');
// load environment variables from .env file
env.config();

// initialize express app
const app = express();

// limiting middleware to all requests
app.use(limiter);

// application database connection establishment
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// HTTP request logger middleware
if (process.env.APP_NODE_ENV !== 'production') {
  app.use(morganLogger());
  app.use(morgan('tiny'))
}

// secure HTTP headers setting middleware
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// allow cross-origin resource sharing
app.use(crossOrigin(corsOptions));

// parse cookies from request
app.use(cookieParser());

// parse body of request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// sets favicon in API routes
if (process.env.APP_NODE_ENV !== 'production') {
  app.use(favicon(`${appRoot}/public/favicon.ico`));
}

// sets static folder
app.use(express.static('public'));

// parse requests of content-type ~ application/json
app.use(express.json());

// parse requests of content-type ~ application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// response default (welcome) route
app.get('/', defaultController);

// sets application API's routes
app.use('/api/v1', authRoute); // apps routes
app.use('/api/v1', inventoryRoute); // inventory routes
app.use('/api/v1', prescriptionRoute); // prescription routes
app.use('/api/v1', dashboardRoute); // dashboardRoute routes

// 404 ~ not found error handler
app.use(notFoundRoute);

// 500 ~ internal server error handler
app.use(errorHandler);

// default export ~ app
module.exports = app;
