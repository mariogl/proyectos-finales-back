require("dotenv").config();

const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundError middleware", () => {
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

describe("Given a generalError middleware", () => {
  describe("When it's invoked with a response object and a custom error", () => {
    const error = {
      statusCode: 400,
      message: "Bad request",
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    test("Then it should call method status with custom status code", () => {
      generalError(error, null, res, () => {});

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
    });

    test("Then it should call method json with the custom error message", () => {
      const expectedResponse = {
        error: true,
        message: error.message,
      };

      generalError(error, null, res, () => {});

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it's invoked with a response object and a NOT custom error", () => {
    const error = new Error();
    const expectedStatus = 500;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    test("Then it should call method status with status code 500", () => {
      generalError(error, null, res, () => {});

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call method json with message 'General server error'", () => {
      const expectedResponse = {
        error: true,
        message: "General server error",
      };

      generalError(error, null, res, () => {});

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
