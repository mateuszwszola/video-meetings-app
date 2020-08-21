const socketIo = require('socket.io');
const debug = require('debug')('io');
const RoomService = require('./services/room');

const RoomServiceInstance = new RoomService();

let io = null;

exports.io = function () {
  return io;
};

const rooms = new Map();

exports.initialize = function (server) {
  io = socketIo(server);

  io.on('connection', (socket) => {
    debug(`A user connected with ${socket.id}`);

    socket.on('disconnecting', () => {
      debug(`A user disconnected with ${socket.id}`);

      const socketRooms = Object.keys(socket.rooms);

      socketRooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit('USER_DISCONNECTED', socket.id);

          if (rooms.has(room)) {
            rooms.set(
              room,
              rooms.get(room).filter((userId) => userId !== socket.id)
            );

            /*
              There is no users in that room, delete the record from db
              to allow other users to create a room with that name.
              But make sure no one owns that room
            */
            if (rooms.get(room).length === 0) {
              RoomServiceInstance.getRoom(room)
                .then((res) => {
                  if (res.room && !res.room.owner) {
                    return RoomServiceInstance.deleteRoom(room);
                  }
                })
                .then((res) => {
                  if (res && res.room) {
                    console.log(`Room deleted: ${res.room.name}`);
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          }
        }
      });
    });

    socket.on('JOIN_ROOM', ({ room, username = '' }) => {
      debug(`JOIN_ROOM ${room} triggered for ${socket.id}`);

      if (username) {
        socket.username = username;
      }

      socket.join(room);

      if (rooms.has(room)) {
        rooms.set(room, [...rooms.get(room), socket.id]);
      } else {
        rooms.set(room, [socket.id]);
      }

      const roomUsers = rooms.get(room);

      if (roomUsers.length === 1) {
        socket.emit('OWNER');
      }

      const recipients = roomUsers.filter((userId) => userId !== socket.id);

      if (recipients.length > 0) {
        socket.emit('RECIPIENT', recipients);
        socket.to(room).emit('USER_JOINED', socket.id);
      }
    });

    socket.on('HANG_UP', ({ room }) => {
      const isOwner = rooms.get(room)[0] === socket.id;
      if (!isOwner) return;

      socket.to(room).emit('HANG_UP');
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
