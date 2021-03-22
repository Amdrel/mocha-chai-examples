const assert = require("assert");
const request = require("supertest");

const app = require("../../app");

describe("Index", function () {
  describe("GET /", function () {
    it("should return 200 OK with a specific message", async function () {
      const response = await request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", /json/);
      assert.strictEqual(response.body.message, "Hello Express!");
    });
  });
});
