const express = require("express");

const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const database = await db.database;
  const movies = await db.getMovies(database);
  return res.status(200).json(movies);
});

router.get("/:id", async (req, res) => {
  const database = await db.database;
  const movie = await db.getMovie(database, req.params.id);
  if (movie) {
    return res.status(200).json(movie);
  } else {
    return res.status(404).send();
  }
});

router.post("/", async (req, res) => {
  const database = await db.database;
  const results = await db.addMovie(database, req.body);
  return res.status(201).json({ id: results.lastID });
});

router.patch("/:id", async (req, res) => {
  const movie = Object.assign({}, req.body);
  movie.id = parseInt(req.params.id);

  const database = await db.database;
  await db.updateMovie(database, movie);
  return res.status(200).json({ id: movie.id });
});

router.delete("/:id", async (req, res) => {
  const movieId = parseInt(req.params.id);
  const database = await db.database;
  await db.deleteMovie(database, movieId);
  return res.status(200).json({ id: movieId });
});

module.exports = router;
