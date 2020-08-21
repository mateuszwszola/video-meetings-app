const express = require('express');
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const apiRoutes = require('./routes');
const { handleNotFound, handleError } = require('./utils/error');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/api', apiRoutes);
app.use(handleNotFound);
app.use(handleError);

module.exports = {
  app,
};
