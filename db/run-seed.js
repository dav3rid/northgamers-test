const data = require('./data/dev-data');
const seed = require('./seed');

const db = require('./connection');

const runSeed = () => {
  return seed(data).then(() => {
    return db.end();
  });
};

runSeed();
