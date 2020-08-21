const Room = require('../models/Room');

class RoomService {
  async getRoom(name) {
    const room = await Room.findOne({ name }).exec();

    return { room };
  }

  async createRoom(name) {
    const room = await Room.create({ name });

    return { room };
  }

  async deleteRoom(name) {
    const room = await Room.findOneAndDelete({ name }).exec();

    return { room };
  }
}

module.exports = RoomService;
