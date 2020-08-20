require('dotenv').config({
  path: 'variables.env',
});
const http = require('http');
const { app } = require('./src/app');
const server = http.createServer(app);
const { initialize } = require('./src/io');
const connectDB = require('./src/config/db');

connectDB();

initialize(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});
