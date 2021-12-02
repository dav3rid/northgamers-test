const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seed');
const testData = require('../db/data/test-data');
const app = require('../app');

beforeEach(() => seed(testData).catch(console.log));

afterAll(() => db.end());

describe('GET /api/games', () => {
  test('status:200, responds with an array of games', () => {
    return request(app)
      .get('/api/games')
      .expect(200)
      .then(({ body }) => {
        expect(body.games).toBeInstanceOf(Array);
        expect(body.games.length).toBeGreaterThan(0);
        body.games.forEach((game) => {
          expect(game).toEqual(
            expect.objectContaining({
              game_id: expect.any(Number),
              game_title: expect.any(String),
              release_year: expect.any(Number),
              console_name: expect.any(String),
              image_url: expect.any(String),
            })
          );
        });
      });
  });
  test('status:200, games are sorted by title in ascending order by default', () => {
    return request(app)
      .get('/api/games')
      .expect(200)
      .then(({ body }) => {
        expect(body.games).toBeSortedBy('game_title');
      });
  });
  test('status:200, accepts a sort_by query', () => {
    return request(app)
      .get('/api/games?sort_by=release_year')
      .expect(200)
      .then(({ body }) => {
        expect(body.games).toBeSortedBy('release_year');
      });
  });
  test('status:400, responds with error message if passed invalid sort_by query', () => {
    return request(app)
      .get('/api/games?sort_by=not-a-column')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort query');
      });
  });
  test('status:200, accepts an order query', () => {
    return request(app)
      .get('/api/games?order=desc')
      .expect(200)
      .then(({ body }) => {
        expect(body.games).toBeSortedBy('release_year', {
          descending: true,
        });
      });
  });
  test('status:400, responds with error message if passed invalid order query', () => {
    return request(app)
      .get('/api/games?order=not-asc-or-desc')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid order query');
      });
  });
  test('status:200, games include a total number of reviews property', () => {
    return request(app)
      .get('/api/games')
      .expect(200)
      .then(({ body }) => {
        expect(body.games[0].number_of_reviews).toBe('12');
      });
  });
  test('status:200, games include an average rating from each associated review', () => {
    return request(app)
      .get('/api/games')
      .expect(200)
      .then(({ body }) => {
        expect(body.games[0].average_rating).toBe('3.9');
      });
  });
  test('status:200, games can be filtered by using providing a min_release_year query', () => {
    return request(app)
      .get('/api/games?min_release_year=1985')
      .expect(200)
      .then(({ body }) => {
        expect(body.games).toHaveLength(2);
        body.games.forEach((game) => {
          expect(game.release_year).toBeGreaterThan(1984);
        });
      });
  });
  test('status:400, when passed an invalid a min_release_year query', () => {
    return request(app)
      .get('/api/games?min_release_year=not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Invalid min_release_year query');
      });
  });
  test('status:200, games can be filtered by using providing a max_release_year query', () => {
    return request(app)
      .get('/api/games?max_release_year=1985')
      .expect(200)
      .then(({ body }) => {
        expect(body.games).toHaveLength(2);
        body.games.forEach((game) => {
          expect(+game.release_year).toBeLessThan(1986);
        });
      });
  });
  test('status:400, when passed an invalid max_release_year query', () => {
    return request(app)
      .get('/api/games?max_release_year=not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid max_release_year query');
      });
  });
  test('status:200, handles both min + max release year queries', () => {
    return request(app)
      .get('/api/games?min_release_year=1985&max_release_year=1985')
      .expect(200)
      .then(({ body }) => {
        expect(body.games.length).toBe(1);
        expect(body.games[0].release_year).toBe(1985);
      });
  });
});
