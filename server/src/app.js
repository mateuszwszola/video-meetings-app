const express = require('express');
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('express-jwt');
const apiRoutes = require('./routes');
const { handleNotFound, handleError } = require('./utils/error');
const config = require('./config');
const app = express();

const jwtCheck = jwt({
  ...config.jwt,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.use(jwtCheck);

app.get('/authorized', (req, res) => {
  console.log('user', req.user);
  res.send('Secured resource');
});

app.use(handleNotFound);
app.use(handleError);

module.exports = {
  app,
};
