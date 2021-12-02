const gamesRouter = require('express').Router();
const { getGames } = require('../controllers/games');

gamesRouter.route('/').get(getGames);

module.exports = gamesRouter;
