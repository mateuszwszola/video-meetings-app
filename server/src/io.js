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

      Object.keys(socket.rooms).forEach(async (room) => {
        if (room === socket.id) return;

        socket.to(room).emit('USER_DISCONNECTED', socket.id);

        if (!rooms.has(room)) return;

        const roomUsers = rooms.get(room);
        /*
          There is no users in that room, delete the record from db
          to allow other users to create a room with that name.
          But make sure no one owns that room.
          In case no one owns the room, choose new owner
        */
        try {
          const { room: dbRoom } = await RoomServiceInstance.getRoom(room);

          const roomExists = !!dbRoom,
            roomHasOwner = !!(dbRoom && dbRoom.owner);

          if (roomUsers.length <= 1) {
            if (roomExists && !roomHasOwner) {
              await RoomServiceInstance.deleteRoom(room);
            }
          } else if (!roomExists || (roomExists && !roomHasOwner)) {
            if (roomUsers[0] === socket.id) {
              io.to(roomUsers[1]).emit('OWNER');
            }
          }
        } catch (err) {
          console.error(err);
        }

        rooms.set(
          room,
          rooms.get(room).filter((userId) => userId !== socket.id)
        );
      });
    });

    socket.on('JOIN_ROOM_REQUEST', ({ roomName, username = '' }) => {
      const roomUsers = rooms.get(roomName);

      if (roomUsers && roomUsers.length > 0) {
        io.to(roomUsers[0]).emit('JOIN_ROOM_REQUEST', {
          id: socket.id,
          username,
        });
      } else {
        socket.emit('JOIN_ROOM_ACCEPT');
      }
    });

    socket.on('JOIN_ROOM_ACCEPT', ({ id }) => {
      io.to(id).emit('JOIN_ROOM_ACCEPT');
    });

    socket.on('JOIN_ROOM_DECLINE', ({ id }) => {
      io.to(id).emit('JOIN_ROOM_DECLINE');
    });

    socket.on('JOIN_ROOM', ({ roomName, username }) => {
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
      const roomUsers = rooms.get(roomName);
      const isOwner = roomUsers && roomUsers[0] === socket.id;
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
