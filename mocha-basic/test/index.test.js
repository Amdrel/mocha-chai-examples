const assert = require("assert");

const { meaningOfLife } = require("../index");

describe("Index", function () {
  describe("#meaningOfLife", function () {
    it("should return 42", function () {
      const result = meaningOfLife();
      assert.strictEqual(result, 42);
    });
  });
});
