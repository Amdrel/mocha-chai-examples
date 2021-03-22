const express = require("express");

const indexRouter = require("./routes/index");
const movieRouter = require("./routes/movies");

const app = express();

app.set("json spaces", 2);
app.use(express.json());

app.use("/", indexRouter);
app.use("/movies", movieRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

module.exports = app;
