const { notFoundError } = require("./errors");

describe("Given a notFoundError function", () => {
  describe("When it's invoked with a next function", () => {
    test("Then it should call the next function with a 404 error", () => {
      const next = jest.fn();
      const expectedError = {
        statusCode: 404,
        message: "Endpoint not found",
      };

      notFoundError(null, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
