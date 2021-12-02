const format = require('pg-format');
const db = require('./connection');
const { dropTables, createTables } = require('./manage-tables');
const { createGamesRef, formatReviewsData } = require('../utils/seed');

const seed = ({ gameData, reviewData }) => {
  return dropTables()
    .then(() => {
      return createTables();
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO games
          (game_title, release_year, image_url, console_name)
        VALUES %L
        RETURNING *;`,
        gameData.map((game) => [
          game.game_title,
          game.release_year,
          game.image_url,
          game.console_name,
        ])
      );
      return db.query(queryStr);
    })
    .then((gameInsertionResult) => {
      const gameRows = gameInsertionResult.rows;
      const gamesRef = createGamesRef(gameRows);
      const formattedReviews = formatReviewsData(reviewData, gamesRef);
      const queryStr = format(
        `INSERT INTO reviews
          (username, game_id, comment, rating)
        VALUES
        %L
        RETURNING *;`,
        formattedReviews.map((review) => [
          review.username,
          review.game_id,
          review.comment,
          review.rating,
        ])
      );
      return db.query(queryStr);
    });
};

module.exports = seed;
