const RoomService = require('../services/room');
const { ErrorHandler } = require('../utils/error');
const urlify = require('../utils/urlify');

const RoomServiceInstance = new RoomService();

exports.getRoom = async (req, res) => {
  const { roomName } = req.params;

  const { room } = await RoomServiceInstance.getRoom(roomName);

  if (!room) {
    throw new ErrorHandler(404, `Room ${roomName} does not exists`);
  }

  res.json({ message: 'Room found', room });
};

exports.createRoom = async (req, res) => {
  const { roomName } = req.body;

  if (!roomName || roomName.length > 100) {
    throw new ErrorHandler(422, 'Invalid room name');
  }

  const { room } = await RoomServiceInstance.getRoom(urlify(roomName));

  if (room) {
    throw new ErrorHandler(400, `Room ${roomName} already in use`);
  }

  const { room: createdRoom } = await RoomServiceInstance.createRoom(roomName);

  res.json({ message: `Room ${createdRoom.name} created`, room: createdRoom });
};
