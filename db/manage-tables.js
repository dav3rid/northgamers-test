const db = require('./connection');

const createTables = () => {
  return db
    .query(
      `CREATE TABLE games (
        game_id SERIAL PRIMARY KEY,
        game_title VARCHAR NOT NULL,
        release_year INT,
        image_url VARCHAR, 
        console_name VARCHAR NOT NULL
      );`
    )
    .then(() => {
      return db.query(
        `CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          game_id INT NOT NULL REFERENCES games(game_id),
          username VARCHAR NOT NULL,
          comment VARCHAR NOT NULL,
          rating INT CHECK (rating > 0 AND rating <=5)
        );`
      );
    });
};

const dropTables = () => {
  return db.query(`DROP TABLE IF EXISTS reviews;`).then(() => {
    return db.query(`DROP TABLE IF EXISTS games;`);
  });
};

module.exports = { createTables, dropTables };
