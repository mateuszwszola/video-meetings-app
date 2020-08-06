const socketIo = require('socket.io');
const debug = require('debug')('debug');

let io = null;

const users = new Map();
const ids = new Map();

exports.io = function () {
  return io;
};

exports.initialize = function (server) {
  io = socketIo(server);

  io.on('connection', (socket) => {
    debug(`A user connected with ${socket.id}`);

    socket.on('UPDATE_USER', (data) => {
      debug(`UPDATE_USER triggered for ${data.name}`);

      users.set(data.name, {
        socket_id: socket.id,
        ...data,
      });
      ids.set(socket.id, data);

      socket.join(data.group);
    });

    socket.on('disconnect', () => {
      debug(`A user disconnected with ${socket.id}`);
    });
  });
};
