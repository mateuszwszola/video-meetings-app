require('dotenv').config({
  path: 'variables.env',
});
const http = require('http');
// const debug = require('debug')('debug');
const { app } = require('./src/app');
const server = http.createServer(app);
const { initialize, io } = require('./src/io');
initialize(server);
// const global_socket = io();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});

/*
setInterval(() => {
  global_socket.emit('PULSE', heartbeat());
}, 1000);

function heartbeat() {
  const pulse = Math.ceil(Math.random() * (160 - 60) + 60);
  debug(`Heartbeat ${pulse}`);
  return pulse;
}
*/
