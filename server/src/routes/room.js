const router = require('express').Router();
const roomController = require('../controllers/room');
const jwtCheck = require('../utils/jwt-check');

router.get('/:roomName', roomController.getRoom);

router.post('/', roomController.createRoom);

router.post('/:roomName', jwtCheck, roomController.createAndSaveRoom);

module.exports = router;
