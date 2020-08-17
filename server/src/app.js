const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const index = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(index);

module.exports = {
  app,
};
