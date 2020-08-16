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

    users.set(socket.id, []);

    // socket.on('disconnecting', () => {
    //   const rooms = Object.keys(socket.rooms);
    //   rooms.forEach((room) => {
    //     if (room !== socket.id) {
    //       socket.to(room).emit('USER_DISCONNECTED', socket.id);
    //     }
    //   });
    // });

    socket.on('disconnect', () => {
      debug(`A user disconnected with ${socket.id}`);

      users.get(socket.id).forEach((room) => {
        socket.to(room).emit('USER_DISCONNECTED', socket.id);
        if (rooms.has(room)) {
          rooms.set(
            room,
            rooms.get(room).filter((userId) => userId !== socket.id)
          );
        }
      });

      users.delete(socket.id);

      console.log({ users, rooms });
    });

    socket.on('JOIN_ROOM', ({ room }) => {
      debug(`JOIN_ROOM ${room} triggered for ${socket.id}`);

      socket.join(room);

      users.set(socket.id, [...users.get(socket.id), room]);

      if (rooms.has(room)) {
        rooms.set(room, [...rooms.get(room), socket.id]);
      } else {
        rooms.set(room, [socket.id]);
        socket.emit('OWNER');
      }

      const recipients = rooms
        .get(room)
        .filter((userId) => userId !== socket.id);

      if (recipients.length > 0) {
        socket.emit('RECIPIENT', recipients);
        socket.to(room).emit('USER_JOINED', socket.id);
      }

      console.log({ users, rooms, recipients });
    });

    socket.on('OFFER', (payload) => {
      io.to(payload.target).emit('OFFER', payload);
    });

    socket.on('ANSWER', (payload) => {
      io.to(payload.target).emit('ANSWER', payload);
    });

    socket.on('NEW_ICE_CANDIDATE', (payload) => {
      io.to(payload.target).emit('NEW_ICE_CANDIDATE', payload);
    });
  });
};
