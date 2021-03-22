const chai = require("chai");
const request = require("supertest");

const expect = chai.expect;
const app = require("../../app");
const db = require("../../db");

describe("Movies", function () {
  // Create the schema before each test in the describe block.
  beforeEach(async function () {
    const database = await db.database;
    await db.initDB(database);
  });

  // Drop the schema before each test in the describe block.
  afterEach(async function () {
    const database = await db.database;
    await db.resetDB(database);
  });

  describe("GET /movies", function () {
    it("should return 200 OK with several movies", async function () {
      const response = await request(app)
        .get("/movies")
        .expect(200)
        .expect("Content-Type", /json/);

      const movies = response.body;
      expect(movies).to.be.an("array");
      expect(movies).length.to.be.greaterThan(0);
    });

    it("should have valid movies", async function () {
      const response = await request(app)
        .get("/movies")
        .expect(200)
        .expect("Content-Type", /json/);

      const movies = response.body;
      expect(movies).to.be.an("array");

      movies.forEach((movie) => {
        expect(movie.name).to.be.a("string");
        expect(movie.year).to.be.a("number");
        expect(movie.rating).to.be.a("number");
        expect(movie.description).to.be.a("string");
        expect(movie.director).to.be.a("string");
        expect(movie.genres).to.be.an("array");
      });
    });
  });

  describe("GET /movies/:id", function () {
    it("should query an individual movie", async function () {
      const movieId = 1;

      const response = await request(app)
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const movie = response.body;
      expect(movie).to.be.an("object");
      expect(movie.name).to.be.a("string");
      expect(movie.year).to.be.a("number");
      expect(movie.rating).to.be.a("number");
      expect(movie.description).to.be.a("string");
      expect(movie.director).to.be.a("string");
      expect(movie.genres).to.be.an("array");
      expect(movie.id).to.equal(movieId);
    });
  });

  describe("POST /movies", function () {
    it("should create a new movie", async function () {
      const testMovie = {
        name: "Test Movie",
        year: 2021,
        rating: 10,
        description: "This is a fake movie description.",
        director: "Director",
        genres: ["genre"],
      };
      const postResponse = await request(app)
        .post("/movies/")
        .send(testMovie)
        .expect(201)
        .expect("Content-Type", /json/);

      const movieId = postResponse.body.id;
      expect(movieId).to.be.a("number");

      const getResponse = await request(app)
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const movie = getResponse.body;
      expect(movie).to.be.an("object");
      expect(movie.name).to.equal(testMovie.name);
      expect(movie.year).to.equal(testMovie.year);
      expect(movie.rating).to.equal(testMovie.rating);
      expect(movie.description).to.equal(testMovie.description);
      expect(movie.director).to.equal(testMovie.director);
      expect(movie.genres).to.deep.equal(testMovie.genres);
      expect(movie.id).to.equal(movieId);
    });
  });

  describe("PATCH /movies/:id", function () {
    it("should update an existing movie", async function () {
      const movieId = 1;

      const testMovie = {
        id: movieId,
        name: "New Test Movie",
        year: 2022,
        rating: 1,
        description: "This is a new fake movie description.",
        director: "New Director",
        genres: ["new-genre"],
      };
      const patchResponse = await request(app)
        .patch(`/movies/${movieId}`)
        .send(testMovie)
        .expect(200)
        .expect("Content-Type", /json/);

      const result = patchResponse.body;
      expect(result.id).to.equal(movieId);

      const getResponse = await request(app)
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const movie = getResponse.body;
      expect(movie).to.be.an("object");
      expect(movie.name).to.equal(testMovie.name);
      expect(movie.year).to.equal(testMovie.year);
      expect(movie.rating).to.equal(testMovie.rating);
      expect(movie.description).to.equal(testMovie.description);
      expect(movie.director).to.equal(testMovie.director);
      expect(movie.genres).to.deep.equal(testMovie.genres);
      expect(movie.id).to.equal(movieId);
    });
  });

  describe("DELETE /movies/:id", function () {
    it("should delete an existing movie", async function () {
      const movieId = 1;

      const getResponse = await request(app)
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const movie = getResponse.body;
      expect(movie).to.be.an("object");

      const deleteResponse = await request(app)
        .delete(`/movies/${movieId}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const result = deleteResponse.body;
      expect(result.id).to.equal(movieId);

      await request(app).get(`/movies/${movieId}`).expect(404);
    });
  });
});
