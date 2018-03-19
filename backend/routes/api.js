const apiRouter = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const trackRouter = require('./track');
const playlistRouter = require('./playlist');
const authMiddleware = require('../authMiddleware');

apiRouter
  .use('/auth', authRouter)
  .use('/user', authMiddleware, userRouter)
  .use('/track', authMiddleware, trackRouter)
  .use('/playlist', authMiddleware, playlistRouter);

module.exports = apiRouter;
