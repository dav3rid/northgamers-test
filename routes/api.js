const apiRouter = require('express').Router();
const gamesRouter = require('./games');

apiRouter.use('/games', gamesRouter);

module.exports = apiRouter;
