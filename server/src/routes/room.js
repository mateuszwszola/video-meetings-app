const router = require('express').Router();
const Room = require('../models/Room');

router.post('/room/:roomName', async (req, res, next) => {
  const { roomName } = req.params;

  const doc = await Room.findOne({ name: roomName });

  if (doc) {
    return res.status(400).json({ message: `Room ${roomName} already in use` });
  }

  // TODO: create the room for the user
});

module.exports = router;
