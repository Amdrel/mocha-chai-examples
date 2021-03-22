const chai = require("chai");
const request = require("supertest");

const expect = chai.expect;
const app = require("../../app");

describe("Movies", function () {
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

      movies.forEach(movie => {
        expect(movie.name).to.be.a("string");
        expect(movie.year).to.be.a("number");
        expect(movie.rating).to.be.a("number");
        expect(movie.description).to.be.a("string");
        expect(movie.director).to.be.a("string");
        expect(movie.genres).to.be.an("array");
      });
    });
  });
});
