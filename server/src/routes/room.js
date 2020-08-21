const router = require('express').Router();
const roomController = require('../controllers/room');

router.get('/:roomName', roomController.getRoom);

router.post('/', roomController.createRoom);

module.exports = router;
