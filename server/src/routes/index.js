const router = require('express').Router();
const roomRouter = require('./room');
const userRouter = require('./user');

router.use('/user', userRouter);

router.use('/room', roomRouter);

module.exports = router;
