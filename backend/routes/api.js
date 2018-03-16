var express = require('express');
var apiRouter = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const trackRouter = require('./track');

apiRouter
    .use('/auth', authRouter)
    .use('/user', userRouter)
    .use('/track', trackRouter)

module.exports = apiRouter;