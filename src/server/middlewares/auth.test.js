const jwt = require("jsonwebtoken");
const auth = require("./auth");

jest.mock("jsonwebtoken");

describe("Given an auth middleware", () => {
  describe("When it's invoked with a request with a right token in its header and a next function", () => {
    test("Then it should invoke next function with no arguments", () => {
      jwt.verify = jest.fn().mockReturnValue({ verify: "true" });
      const req = {
        header: jest
          .fn()
          .mockReturnValue(
            "Bearer righttokenrighttokenrighttokenrighttokenrighttokenrighttoken"
          ),
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toBeCalledWith();
    });
  });

  describe("When it's invoked with a request with a wrong token in its header and a next function", () => {
    test("Then it should invoke next function with a 401 error with 'Token invalid' message", () => {
      jwt.verify = jest.fn().mockReturnValue(false);
      const req = {
        header: jest
          .fn()
          .mockReturnValue("Bearer wrongtokenwrongtokenwrongtokenwrongtoken"),
      };
      const next = jest.fn();
      const expectedError = {
        statusCode: 401,
        message: "Token invalid",
      };

      auth(req, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
