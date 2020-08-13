const socketIo = require('socket.io');
const debug = require('debug')('debug');

let io = null;

exports.io = function () {
  return io;
};

exports.initialize = function (server) {
  io = socketIo(server);

  const rooms = new Map();
  const users = new Map();

  io.on('connection', (socket) => {
    debug(`A user connected with ${socket.id}`);

    socket.on('disconnecting', () => {
      if (users.has(socket.id)) {
        users.set(socket.id, []);
      }

      Object.keys(socket.rooms).forEach((room) => {
        socket.to(room).emit('USER_DISCONNECTED', socket.id);
        if (rooms.has(room)) {
          rooms.set(
            room,
            rooms.get(room).filter((user) => user !== socket.id)
          );
        }
      });
    });

    socket.on('disconnect', () => {
      debug(`A user disconnected with ${socket.id}`);
    });

    socket.on('JOIN_ROOM', (data) => {
      debug(`JOIN_ROOM triggered for ${socket.id}`);

      const { room } = data;

      socket.join(room);

      users.set(socket.id, [...Object.keys(socket.rooms)]);

      if (rooms.has(room)) {
        rooms.set(room, [...rooms.get(room), socket.id]);
      } else {
        rooms.set(room, [socket.id]);
      }

      const recipient = rooms.get(room).find((id) => id !== socket.id);

      if (recipient) {
        socket.emit('RECIPIENT', recipient);
        socket.to(room).emit('USER_JOINED', socket.id);
      }
    });

    socket.on('OFFER', (payload) => {
      io.to(payload.target).emit('OFFER', payload);
    });

    socket.on('ANSWER', (payload) => {
      io.to(payload.target).emit('ANSWER', payload);
    });

    socket.on('NEW_ICE_CANDIDATE', (payload) => {
      io.to(payload.target).emit('NEW_ICE_CANDIDATE', payload.candidate);
    });
  });
};
