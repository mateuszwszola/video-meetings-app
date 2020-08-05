const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

module.exports = {
  app,
};
