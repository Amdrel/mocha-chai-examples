const process = require("process");

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

exports.connectToDB = async (filename) => {
  return sqlite.open({ filename: ":memory:", driver: sqlite3.Database });
};

exports.initDB = async (db) => {
  await db.run(`
    CREATE TABLE movies (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT,
      year INTEGER,
      rating DECIMAL(10, 2),
      description TEXT,
      director TEXT,
      genres TEXT
    )
  `);
  await db.run(`
    INSERT INTO movies
      (name, year, rating, description, director, genres)
    VALUES
      ('The Shining', 1980, 8.4, 'This is a fake movie description.', 'Stanley Kubrick', '["drama","horror"]'),
      ('Star Wars: Episode IV - A New Hope', 1977, 8.6, 'This is a fake movie description.', 'George Lucas', '["action","adventure","fantasy","sci-fi"]')
  `);
};

exports.resetDB = async (db) => {
  return db.run(`DROP TABLE IF EXISTS movies`);
};

exports.getMovie = async (db, movieId) => {
  const movie = await db.get(
    `SELECT * FROM movies WHERE id = ? LIMIT 1`,
    movieId
  );
  if (movie) {
    movie.genres = JSON.parse(movie.genres);
  }
  return movie;
};

exports.getMovies = async (db) => {
  const movies = [];

  await db.each(`SELECT * FROM movies`, (err, row) => {
    if (err) {
      throw err;
    }
    row.genres = JSON.parse(row.genres);
    movies.push(row);
  });

  return movies;
};

exports.addMovie = async (db, movie) => {
  return db.run(
    `
      INSERT INTO movies
        (name, year, rating, description, director, genres)
      VALUES
        (?, ?, ?, ?, ?, ?)
    `,
    movie.name,
    movie.year,
    movie.rating,
    movie.description,
    movie.director,
    JSON.stringify(movie.genres)
  );
};

exports.updateMovie = async (db, movie) => {
  return db.run(
    `
      UPDATE movies
      SET name = ?,
        year = ?,
        rating = ?,
        description = ?,
        director = ?,
        genres = ?
      WHERE id = ?
    `,
    movie.name,
    movie.year,
    movie.rating,
    movie.description,
    movie.director,
    JSON.stringify(movie.genres),
    movie.id
  );
};

exports.deleteMovie = async (db, movieId) => {
  return db.run(`DELETE FROM movies WHERE id = ?`, movieId);
};

exports.closeDB = async (db) => {
  return db.close();
};

exports.database = exports.connectToDB(":memory:");

process.on("exit", async () => {
  const database = await db.database;
  db.closeDB(database);
});
