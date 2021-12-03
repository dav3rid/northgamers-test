const { selectGames } = require('../models/games');

exports.getGames = (req, res, next) => {
  const { sort_by, order, min_release_year, max_release_year } = req.query;
  selectGames({ sort_by, order, min_release_year, max_release_year })
    .then((games) => {
      res.send({ games });
    })
    .catch(next);
};
