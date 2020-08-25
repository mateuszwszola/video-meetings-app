const jwt = require('express-jwt');
const config = require('../config');

const jwtCheck = jwt({
  ...config.jwt,
});

module.exports = jwtCheck;
