const express = require("express");

const router = express.Router();

const movies = [
  {
    name: "The Shining",
    year: 1980,
    rating: 8.4,
    description: "This is a fake movie description.",
    director: "Stanley Kubrick",
    genres: ["drama", "horror"],
  },
  {
    name: "Star Wars: Episode IV - A New Hope",
    year: 1977,
    rating: 8.6,
    description: "This is a fake movie description.",
    director: "George Lucas",
    genres: ["action", "adventure", "fantasy", "sci-fi"],
  },
];

router.get("/", (req, res) => {
  res.json(movies);
});

module.exports = router;
