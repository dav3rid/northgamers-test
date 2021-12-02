const db = require('../db/connection');

exports.selectGames = ({
  sort_by = 'game_title',
  order = 'asc',
  min_release_year,
  max_release_year,
}) => {
  if (!['game_title', 'release_year'].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort query' });
  }

  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  if (min_release_year !== undefined && !Number.isInteger(+min_release_year)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid min_release_year query',
    });
  }

  if (max_release_year !== undefined && !Number.isInteger(+max_release_year)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid max_release_year query',
    });
  }

  let queryStr = `
  SELECT
    games.*,
    COUNT(reviews.review_id) AS number_of_reviews,
    ROUND(AVG(reviews.rating), 1) AS average_rating
  FROM games
  LEFT JOIN reviews ON reviews.game_id = games.game_id`;

  const queryValues = [];

  if (Number.isInteger(+min_release_year)) {
    queryValues.push(+min_release_year);
    queryStr += ` WHERE release_year >= $1`;
  }

  if (Number.isInteger(+max_release_year)) {
    if (queryValues.length) {
      queryStr += ' AND';
    } else {
      queryStr += ' WHERE';
    }
    queryValues.push(max_release_year);
    queryStr += ` release_year <= $${queryValues.length}`;
  }

  queryStr += `
  GROUP BY games.game_id
  ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => rows);
};
