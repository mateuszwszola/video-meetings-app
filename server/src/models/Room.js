const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
});

const Room = mongoose.model('User', roomSchema);

module.exports = Room;
