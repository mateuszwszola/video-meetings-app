const expressJwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

const generateNewToken = (data) =>
  jsonwebtoken.sign(data, config.jwt.secret, {
    expiresIn: '3h',
  });

const jwtCheck = expressJwt({
  ...config.jwt,
});

const generateRandomId = () => uuidv4();

module.exports = {
  jwtCheck,
  generateNewToken,
  generateRandomId,
};
