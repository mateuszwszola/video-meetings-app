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

    socket.on('JOIN_ROOM_REQUEST', ({ roomName }) => {
      const roomUsers = rooms.get(roomName);

      if (roomUsers && roomUsers.length > 0) {
        // Treat the first user of the room as its owner
        io.to(roomUsers[0]).emit('JOIN_ROOM_REQUEST', {
          id: socket.id,
          username: socket.username,
        });
      } else {
        // Just join the room, you are the boss
        socket.emit('JOIN_ROOM_ACCEPT');
      }

      /*
        ROOM OWNER WILL SEND ONE OF THESE
          socket.emit('JOIN_ROOM_ACCEPT');
          socket.emit('JOIN_ROOM_REFUSE');
      */
    });

    socket.on('JOIN_ROOM_ACCEPT', ({ id }) => {
      // inform the user that the owner accepted the call
      io.to(id).emit('JOIN_ROOM_ACCEPT');
    });

    socket.on('JOIN_ROOM_REFUSE', ({ id }) => {
      io.to(id).emit('JOIN_ROOM_REFUSE');
    });

    socket.on('JOIN_ROOM', ({ roomName, username = '' }) => {
      debug(`JOIN_ROOM ${roomName} triggered for ${socket.id}`);

      if (username) {
        socket.username = username;
      }

      socket.join(roomName);

      if (rooms.has(roomName)) {
        rooms.set(roomName, [...rooms.get(roomName), socket.id]);
      } else {
        rooms.set(roomName, [socket.id]);
      }

      const roomUsers = rooms.get(roomName);

      if (roomUsers.length === 1) {
        socket.emit('OWNER');
      }

      const recipients = roomUsers.filter((userId) => userId !== socket.id);

      if (recipients.length > 0) {
        socket.emit('RECIPIENT', recipients);
        socket.to(roomName).emit('USER_JOINED', socket.id);
      }
    });

    socket.on('HANG_UP', ({ roomName }) => {
      const isOwner = rooms.get(roomName)[0] === socket.id;
      if (isOwner) {
        socket.to(roomName).emit('HANG_UP');
      }
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
